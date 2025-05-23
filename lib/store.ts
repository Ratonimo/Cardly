import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import type { CardBuilderState, ComponentType, Entity, EntityId } from "./types"
import { calculateEntityCost, componentRegistry, getComponentCost } from "./component-registry"
import { getPresetById } from "./presets"
import { toast } from "@/components/ui/use-toast"

const initialState: CardBuilderState = {
  entities: {},
  rootEntities: [],
  selectedEntityId: null,
  selectedComponentType: null,
  availablePoints: 100, // Default budget
  totalPoints: 100,
  editMode: false,
}

export const useCardBuilderStore = create<
  CardBuilderState & {
    // Entity actions
    addEntity: (name: string, parentId?: EntityId) => EntityId
    removeEntity: (id: EntityId) => void
    selectEntity: (id: EntityId | null) => void
    renameEntity: (id: EntityId, name: string) => void
    moveEntity: (id: EntityId, newParentId?: EntityId) => void
    reorderEntity: (id: EntityId, newOrder: number) => void

    // Component actions
    selectComponentType: (type: ComponentType | null) => void
    addComponent: (entityId: EntityId, type: ComponentType) => void
    removeComponent: (entityId: EntityId, type: ComponentType) => void
    updateComponentData: (entityId: EntityId, type: ComponentType, data: any) => void

    // Edit mode
    toggleEditMode: () => void

    // Budget actions
    setTotalPoints: (points: number) => void

    // Export/Import
    exportToJSON: () => string
    importFromJSON: (json: string) => void

    // Preset actions
    applyPreset: (presetId: string) => void

    // Helper functions
    getEntityChildren: (id: EntityId) => Entity[]
    getEntityAncestors: (id: EntityId) => Entity[]
    getEntityDepth: (id: EntityId) => number

    // Reset
    resetStore: () => void
  }
>((set, get) => ({
  ...initialState,

  // Entity actions
  addEntity: (name, parentId) => {
    const id = uuidv4()
    const newEntity: Entity = {
      id,
      name,
      order: parentId
        ? Object.values(get().entities).filter((e) => e.parentId === parentId).length
        : get().rootEntities.length,
      components: {} as Record<ComponentType, any>,
    }

    if (parentId) {
      newEntity.parentId = parentId
    }

    // Check if we have enough points for a new entity
    const baseCost = 2 // Base cost for an entity
    if (get().availablePoints < baseCost) {
      toast({
        title: "Not enough points",
        description: "You don't have enough points to add a new entity.",
        variant: "destructive",
      })
      return id
    }

    set((state) => {
      // Update parent entity if provided
      let updatedEntities = { ...state.entities, [id]: newEntity }
      const updatedRootEntities = [...state.rootEntities]

      if (parentId && state.entities[parentId]) {
        const parentEntity = state.entities[parentId]
        const updatedChildren = parentEntity.children ? [...parentEntity.children, id] : [id]
        updatedEntities = {
          ...updatedEntities,
          [parentId]: {
            ...parentEntity,
            children: updatedChildren,
          },
        }
      } else {
        // Add to root entities if no parent
        updatedRootEntities.push(id)
      }

      return {
        entities: updatedEntities,
        rootEntities: updatedRootEntities,
        selectedEntityId: id,
        availablePoints: state.availablePoints - baseCost,
      }
    })

    toast({
      title: "Entity added",
      description: `"${name}" has been added successfully.`,
    })

    return id
  },

  removeEntity: (id) => {
    // Calculate points to refund
    const entity = get().entities[id]
    if (!entity) return

    const componentTypes = Object.keys(entity.components) as ComponentType[]
    const cost = calculateEntityCost(componentTypes)

    // Get all descendant entities to remove them as well
    const getAllDescendants = (entityId: EntityId): EntityId[] => {
      const entity = get().entities[entityId]
      if (!entity || !entity.children || entity.children.length === 0) {
        return [entityId]
      }

      return [entityId, ...entity.children.flatMap(getAllDescendants)]
    }

    const entitiesToRemove = getAllDescendants(id)
    const totalRefund = entitiesToRemove.reduce((total, entityId) => {
      const entity = get().entities[entityId]
      if (!entity) return total
      const componentTypes = Object.keys(entity.components) as ComponentType[]
      return total + calculateEntityCost(componentTypes)
    }, 0)

    set((state) => {
      // Create new entities object without the removed entities
      const newEntities = { ...state.entities }
      entitiesToRemove.forEach((entityId) => {
        delete newEntities[entityId]
      })

      // Update parent's children list if applicable
      if (entity.parentId && state.entities[entity.parentId]) {
        const parentEntity = state.entities[entity.parentId]
        if (parentEntity.children) {
          newEntities[entity.parentId] = {
            ...parentEntity,
            children: parentEntity.children.filter((childId) => childId !== id),
          }
        }
      }

      // Update root entities if needed
      const newRootEntities = state.rootEntities.filter((entityId) => entityId !== id)

      return {
        entities: newEntities,
        rootEntities: newRootEntities,
        selectedEntityId: state.selectedEntityId === id ? null : state.selectedEntityId,
        availablePoints: state.availablePoints + totalRefund,
      }
    })

    toast({
      title: "Entity removed",
      description: `"${entity.name}" has been removed.`,
    })
  },

  selectEntity: (id) => {
    set({ selectedEntityId: id })
  },

  renameEntity: (id, name) => {
    set((state) => ({
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          name,
        },
      },
    }))

    toast({
      title: "Entity renamed",
      description: `Entity has been renamed to "${name}".`,
    })
  },

  moveEntity: (id, newParentId) => {
    const entity = get().entities[id]
    if (!entity) return

    // Prevent moving to own descendant
    const isDescendant = (potentialAncestorId: EntityId, entityId: EntityId): boolean => {
      const entity = get().entities[entityId]
      if (!entity || !entity.children || entity.children.length === 0) return false
      return (
        entity.children.includes(potentialAncestorId) ||
        entity.children.some((childId) => isDescendant(potentialAncestorId, childId))
      )
    }

    if (newParentId && isDescendant(id, newParentId)) {
      toast({
        title: "Invalid operation",
        description: "Cannot move an entity to its own descendant.",
        variant: "destructive",
      })
      return
    }

    set((state) => {
      // Remove from old parent's children or root entities
      let updatedEntities = { ...state.entities }
      let updatedRootEntities = [...state.rootEntities]

      if (entity.parentId) {
        const oldParent = state.entities[entity.parentId]
        if (oldParent && oldParent.children) {
          updatedEntities = {
            ...updatedEntities,
            [entity.parentId]: {
              ...oldParent,
              children: oldParent.children.filter((childId) => childId !== id),
            },
          }
        }
      } else {
        updatedRootEntities = updatedRootEntities.filter((entityId) => entityId !== id)
      }

      // Add to new parent's children or root entities
      if (newParentId) {
        const newParent = state.entities[newParentId]
        if (newParent) {
          const newChildren = newParent.children ? [...newParent.children, id] : [id]
          updatedEntities = {
            ...updatedEntities,
            [newParentId]: {
              ...newParent,
              children: newChildren,
            },
          }
        }
      } else {
        updatedRootEntities.push(id)
      }

      // Update the entity's parentId
      updatedEntities = {
        ...updatedEntities,
        [id]: {
          ...entity,
          parentId: newParentId,
          order: newParentId
            ? Object.values(updatedEntities).filter((e) => e.parentId === newParentId).length
            : updatedRootEntities.length - 1,
        },
      }

      return {
        entities: updatedEntities,
        rootEntities: updatedRootEntities,
      }
    })

    toast({
      title: "Entity moved",
      description: `"${entity.name}" has been moved successfully.`,
    })
  },

  reorderEntity: (id, newOrder) => {
    const entity = get().entities[id]
    if (!entity) return

    set((state) => {
      // Get siblings (entities with same parent)
      const siblings = entity.parentId
        ? Object.values(state.entities).filter((e) => e.parentId === entity.parentId)
        : state.rootEntities.map((id) => state.entities[id])

      // Ensure new order is within bounds
      const boundedNewOrder = Math.max(0, Math.min(newOrder, siblings.length - 1))

      // Update orders of all affected siblings
      const updatedEntities = { ...state.entities }
      siblings.forEach((sibling) => {
        if (sibling.id === id) {
          // This is the entity being moved
          updatedEntities[id] = {
            ...entity,
            order: boundedNewOrder,
          }
        } else if (
          (entity.order < boundedNewOrder && sibling.order > entity.order && sibling.order <= boundedNewOrder) ||
          (entity.order > boundedNewOrder && sibling.order < entity.order && sibling.order >= boundedNewOrder)
        ) {
          // This sibling needs its order adjusted
          const direction = entity.order < boundedNewOrder ? -1 : 1
          updatedEntities[sibling.id] = {
            ...sibling,
            order: sibling.order + direction,
          }
        }
      })

      return {
        entities: updatedEntities,
      }
    })
  },

  // Component actions
  selectComponentType: (type) => {
    set({ selectedComponentType: type })
  },

  addComponent: (entityId, type) => {
    const entity = get().entities[entityId]
    if (!entity) return

    // Check if component already exists
    if (entity.components[type]) {
      toast({
        title: "Component already exists",
        description: "This component is already added to the entity.",
        variant: "destructive",
      })
      return
    }

    // Check if we have enough points
    const cost = getComponentCost(type)
    if (get().availablePoints < cost) {
      toast({
        title: "Not enough points",
        description: `You need ${cost} points to add this component.`,
        variant: "destructive",
      })
      return
    }

    set((state) => ({
      entities: {
        ...state.entities,
        [entityId]: {
          ...entity,
          components: {
            ...entity.components,
            [type]: {
              type,
              data: componentRegistry[type].defaultData,
            },
          },
        },
      },
      availablePoints: state.availablePoints - cost,
    }))

    toast({
      title: "Component added",
      description: `${componentRegistry[type].name} component has been added.`,
    })
  },

  removeComponent: (entityId, type) => {
    const entity = get().entities[entityId]
    if (!entity || !entity.components[type]) return

    // Calculate points to refund
    const cost = getComponentCost(type)

    set((state) => {
      const { [type]: _, ...remainingComponents } = entity.components
      return {
        entities: {
          ...state.entities,
          [entityId]: {
            ...entity,
            components: remainingComponents,
          },
        },
        availablePoints: state.availablePoints + cost,
      }
    })

    toast({
      title: "Component removed",
      description: `${componentRegistry[type].name} component has been removed.`,
    })
  },

  updateComponentData: (entityId, type, data) => {
    const entity = get().entities[entityId]
    if (!entity || !entity.components[type]) return

    set((state) => ({
      entities: {
        ...state.entities,
        [entityId]: {
          ...entity,
          components: {
            ...entity.components,
            [type]: {
              ...entity.components[type],
              data,
            },
          },
        },
      },
    }))
  },

  // Edit mode
  toggleEditMode: () => {
    set((state) => ({
      editMode: !state.editMode,
    }))

    toast({
      title: get().editMode ? "Edit mode disabled" : "Edit mode enabled",
      description: get().editMode
        ? "You are now in view mode."
        : "You can now edit components directly in the preview.",
    })
  },

  // Budget actions
  setTotalPoints: (points) => {
    set((state) => ({
      totalPoints: points,
      availablePoints: points - (state.totalPoints - state.availablePoints),
    }))

    toast({
      title: "Budget updated",
      description: `Total points have been set to ${points}.`,
    })
  },

  // Preset actions
  applyPreset: (presetId) => {
    const preset = getPresetById(presetId)
    if (!preset) {
      console.error(`Preset with id ${presetId} not found`)
      return
    }

    // Calculate total cost of preset
    let totalCost = 0
    Object.values(preset.entities).forEach((entity) => {
      totalCost += 2 // Base entity cost
      const componentTypes = Object.keys(entity.components) as ComponentType[]
      componentTypes.forEach((type) => {
        totalCost += getComponentCost(type)
      })
    })

    // Check if we have enough points
    if (get().availablePoints < totalCost) {
      toast({
        title: "Not enough points",
        description: `This preset requires ${totalCost} points. You only have ${get().availablePoints} available.`,
        variant: "destructive",
      })
      return
    }

    // Create a mapping from template IDs to new IDs
    const idMapping: Record<string, string> = {}
    Object.keys(preset.entities).forEach((templateId) => {
      idMapping[templateId] = uuidv4()
    })

    // Create new entities from preset with proper parent-child relationships
    const newEntities: Record<EntityId, Entity> = {}
    const newRootEntities: EntityId[] = []

    // First pass: create all entities
    Object.entries(preset.entities).forEach(([templateId, entityTemplate]) => {
      const newId = idMapping[templateId]
      const newEntity: Entity = {
        id: newId,
        name: entityTemplate.name,
        order: entityTemplate.order,
        components: entityTemplate.components,
      }

      // Add to entities
      newEntities[newId] = newEntity
    })

    // Second pass: establish parent-child relationships
    Object.entries(preset.entities).forEach(([templateId, entityTemplate]) => {
      const newId = idMapping[templateId]

      if (entityTemplate.children) {
        // Map template child IDs to new IDs
        const newChildren = entityTemplate.children.map((childTemplateId) => idMapping[childTemplateId])
        newEntities[newId].children = newChildren

        // Set parent IDs for children
        newChildren.forEach((childId) => {
          newEntities[childId].parentId = newId
        })
      }

      // If no parent, add to root entities
      if (!entityTemplate.parentId) {
        newRootEntities.push(newId)
      }
    })

    set((state) => ({
      entities: { ...newEntities },
      rootEntities: [...newRootEntities],
      availablePoints: state.availablePoints - totalCost,
      selectedEntityId: null,
    }))

    toast({
      title: "Preset applied",
      description: `"${preset.name}" preset has been applied successfully.`,
    })
  },

  // Export/Import
  exportToJSON: () => {
    const state = get()
    return JSON.stringify(
      {
        entities: state.entities,
        rootEntities: state.rootEntities,
        totalPoints: state.totalPoints,
      },
      null,
      2,
    )
  },

  importFromJSON: (json) => {
    try {
      const data = JSON.parse(json)

      // Validate the imported data
      if (!data.entities || typeof data.entities !== "object") {
        throw new Error("Invalid entities data")
      }

      // Calculate total cost of all entities and components
      let totalCost = 0
      Object.values(data.entities).forEach((entity: any) => {
        totalCost += 2 // Base entity cost
        if (entity.components) {
          Object.keys(entity.components).forEach((compType) => {
            totalCost += getComponentCost(compType as ComponentType)
          })
        }
      })

      // Set the new state
      set({
        entities: data.entities,
        rootEntities: data.rootEntities || [],
        totalPoints: data.totalPoints || 100,
        availablePoints: (data.totalPoints || 100) - totalCost,
        selectedEntityId: null,
        selectedComponentType: null,
      })

      toast({
        title: "Import successful",
        description: "Card data has been imported successfully.",
      })
    } catch (error) {
      console.error("Error importing JSON:", error)
      toast({
        title: "Import failed",
        description: "Failed to import: Invalid JSON format",
        variant: "destructive",
      })
    }
  },

  // Helper functions
  getEntityChildren: (id) => {
    const entity = get().entities[id]
    if (!entity || !entity.children) return []
    return entity.children.map((childId) => get().entities[childId]).filter(Boolean)
  },

  getEntityAncestors: (id) => {
    const ancestors: Entity[] = []
    let currentEntity = get().entities[id]

    while (currentEntity && currentEntity.parentId) {
      const parent = get().entities[currentEntity.parentId]
      if (parent) {
        ancestors.unshift(parent)
        currentEntity = parent
      } else {
        break
      }
    }

    return ancestors
  },

  getEntityDepth: (id) => {
    return get().getEntityAncestors(id).length
  },

  // Reset
  resetStore: () => {
    set(initialState)
    toast({
      title: "Reset complete",
      description: "All data has been reset to default values.",
    })
  },
}))
