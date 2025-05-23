"use client"

import type React from "react"
import { useCardBuilderStore } from "@/lib/store"
import type { ComponentType, Entity } from "@/lib/types"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Smartphone, Code, Edit, Eye, Move, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import FullScreenPreview from "./full-screen-preview"

// Import component renderers
import ColorPaletteRenderer from "./component-renderers/color-palette-renderer"
import FontStyleRenderer from "./component-renderers/font-style-renderer"
import ImageRenderer from "./component-renderers/image-renderer"
import CustomFontRenderer from "./component-renderers/custom-font-renderer"
import ImageFilterRenderer from "./component-renderers/image-filter-renderer"
import TooltipRenderer from "./component-renderers/tooltip-renderer"
import TextRenderer from "./component-renderers/text-renderer"
import ButtonRenderer from "./component-renderers/button-renderer"
import DividerRenderer from "./component-renderers/divider-renderer"
import MapEmbedRenderer from "./component-renderers/map-embed-renderer"
import SocialLinksRenderer from "./component-renderers/social-links-renderer"

interface DraggableEntityProps {
  entity: Entity
  viewMode: "desktop" | "mobile"
  isEditMode: boolean
  onEntityClick: (entityId: string) => void
  selectedEntityId: string | null
}

function DraggableEntity({ entity, viewMode, isEditMode, onEntityClick, selectedEntityId }: DraggableEntityProps) {
  const { entities, reorderEntity } = useCardBuilderStore()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Get all effect components that apply to the entity or specific components
  const getAppliedEffects = (entity: Entity, targetComponentType?: ComponentType) => {
    const effects: any = {}

    // Check all entities for effect components that target this entity
    Object.values(entities).forEach((otherEntity) => {
      Object.entries(otherEntity.components).forEach(([componentType, componentData]) => {
        const compType = componentType as ComponentType
        const data = componentData.data

        // Check if this is an effect component
        if (compType === "ColorPaletteComponent") {
          if (data.applyToEntity && otherEntity.id === entity.id) {
            effects.colorPalette = data
          } else if (
            !data.applyToEntity &&
            targetComponentType &&
            data.targetComponents &&
            data.targetComponents.includes(targetComponentType)
          ) {
            effects.colorPalette = data
          }
        }

        if (compType === "FontStyleComponent") {
          if (data.applyToEntity && otherEntity.id === entity.id) {
            effects.fontStyle = data
          } else if (
            !data.applyToEntity &&
            targetComponentType &&
            data.targetComponents &&
            data.targetComponents.includes(targetComponentType)
          ) {
            effects.fontStyle = data
          }
        }

        if (compType === "ImageFilterComponent") {
          if (
            targetComponentType === "ImageComponent" &&
            data.targetComponents &&
            data.targetComponents.includes(targetComponentType)
          ) {
            effects.imageFilter = data
          }
        }

        if (compType === "BorderComponent") {
          if (data.applyToEntity && otherEntity.id === entity.id) {
            effects.border = data
          } else if (
            !data.applyToEntity &&
            targetComponentType &&
            data.targetComponents &&
            data.targetComponents.includes(targetComponentType)
          ) {
            effects.border = data
          }
        }

        if (compType === "ShadowComponent") {
          if (data.applyToEntity && otherEntity.id === entity.id) {
            effects.shadow = data
          } else if (
            !data.applyToEntity &&
            targetComponentType &&
            data.targetComponents &&
            data.targetComponents.includes(targetComponentType)
          ) {
            effects.shadow = data
          }
        }
      })
    })

    return effects
  }

  // Apply effects to component styles
  const applyEffectsToStyle = (baseStyle: React.CSSProperties, effects: any, componentType: ComponentType) => {
    const style = { ...baseStyle }

    // Apply color palette effects
    if (effects.colorPalette) {
      const colorData = effects.colorPalette
      if (componentType === "TextComponent") {
        style.color = colorData.text
      } else if (componentType === "ButtonComponent") {
        style.color = colorData.background
        style.backgroundColor = colorData.primary
      } else if (componentType === "LinkComponent") {
        style.color = colorData.primary
      }
    }

    // Apply font style effects
    if (effects.fontStyle) {
      const fontData = effects.fontStyle
      style.fontFamily = fontData.fontFamily
      style.fontWeight = fontData.fontWeight
    }

    // Apply image filter effects
    if (effects.imageFilter && componentType === "ImageComponent") {
      const filterData = effects.imageFilter
      style.filter = getFilterStyle(filterData.filter, filterData.intensity)
    }

    // Apply border effects
    if (effects.border) {
      const borderData = effects.border
      const sides = borderData.sides
      if (sides.includes("top")) style.borderTop = `${borderData.width} ${borderData.style} ${borderData.color}`
      if (sides.includes("right")) style.borderRight = `${borderData.width} ${borderData.style} ${borderData.color}`
      if (sides.includes("bottom")) style.borderBottom = `${borderData.width} ${borderData.style} ${borderData.color}`
      if (sides.includes("left")) style.borderLeft = `${borderData.width} ${borderData.style} ${borderData.color}`
      style.borderRadius = borderData.radius
    }

    // Apply shadow effects
    if (effects.shadow) {
      const shadowData = effects.shadow
      if (shadowData.type === "drop") {
        style.boxShadow = `${shadowData.x} ${shadowData.y} ${shadowData.blur} ${shadowData.spread} ${shadowData.color}`
      }
    }

    return style
  }

  // Generate CSS filter string
  const getFilterStyle = (filter: string, intensity: number): string => {
    switch (filter) {
      case "grayscale":
        return `grayscale(${intensity / 100})`
      case "sepia":
        return `sepia(${intensity / 100})`
      case "blur":
        return `blur(${(intensity / 10).toFixed(1)}px)`
      case "brightness":
        return `brightness(${(intensity / 50).toFixed(2)})`
      case "contrast":
        return `contrast(${(intensity / 50).toFixed(2)})`
      case "hue-rotate":
        return `hue-rotate(${intensity * 3.6}deg)`
      case "invert":
        return `invert(${intensity / 100})`
      case "saturate":
        return `saturate(${(intensity / 50).toFixed(2)})`
      default:
        return "none"
    }
  }

  const componentTypes = Object.keys(entity.components) as ComponentType[]
  const entityEffects = getAppliedEffects(entity)

  // Apply entity-level styles
  const getEntityStyles = () => {
    const styles: React.CSSProperties = {}

    // Apply entity-level effects
    if (entityEffects.colorPalette && entityEffects.colorPalette.applyToEntity) {
      const colorData = entityEffects.colorPalette
      styles.backgroundColor = colorData.background
      styles.color = colorData.text
    }

    return styles
  }

  // Render children if any
  const renderChildren = () => {
    if (!entity.children || entity.children.length === 0) return null

    return entity.children
      .map((childId) => entities[childId])
      .filter(Boolean)
      .sort((a, b) => a.order - b.order)
      .map((childEntity) => (
        <DraggableEntity
          key={childEntity.id}
          entity={childEntity}
          viewMode={viewMode}
          isEditMode={isEditMode}
          onEntityClick={onEntityClick}
          selectedEntityId={selectedEntityId}
        />
      ))
  }

  const isSelected = selectedEntityId === entity.id

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...getEntityStyles() }}
      className={cn(
        "relative group w-full",
        isEditMode && "cursor-pointer",
        isSelected && isEditMode && "ring-2 ring-primary ring-offset-2",
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (isEditMode) {
          onEntityClick(entity.id)
        }
      }}
    >
      {/* Drag handle - only visible in edit mode */}
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground p-1 rounded cursor-grab active:cursor-grabbing z-10"
          title="Drag to reorder"
        >
          <Move className="h-3 w-3" />
        </div>
      )}

      <div className="space-y-2 w-full">
        {componentTypes.map((type) => {
          const componentData = entity.components[type].data
          const componentEffects = getAppliedEffects(entity, type)

          // Render component-specific previews
          switch (type) {
            case "TextComponent":
              return (
                <div key={type} style={applyEffectsToStyle({}, componentEffects, type)}>
                  <TextRenderer data={componentData} entityId={entity.id} />
                </div>
              )
            case "ButtonComponent":
              return (
                <div key={type} style={applyEffectsToStyle({}, componentEffects, type)}>
                  <ButtonRenderer data={componentData} />
                </div>
              )
            case "DividerComponent":
              return <DividerRenderer key={type} data={componentData} />
            case "MapEmbedComponent":
              return <MapEmbedRenderer key={type} data={componentData} />
            case "ImageComponent":
              return (
                <div key={type} style={applyEffectsToStyle({}, componentEffects, type)}>
                  <ImageRenderer data={componentData} />
                </div>
              )
            case "SocialLinksComponent":
              return (
                <div key={type} style={applyEffectsToStyle({}, componentEffects, type)}>
                  <SocialLinksRenderer data={componentData} />
                </div>
              )
            case "ColorPaletteComponent":
              return isEditMode ? <ColorPaletteRenderer key={type} data={componentData} /> : null
            case "FontStyleComponent":
              return isEditMode ? <FontStyleRenderer key={type} data={componentData} /> : null
            case "CustomFontComponent":
              return isEditMode ? <CustomFontRenderer key={type} data={componentData} /> : null
            case "ImageFilterComponent":
              return isEditMode ? <ImageFilterRenderer key={type} data={componentData} /> : null
            case "TooltipComponent":
              return isEditMode ? <TooltipRenderer key={type} data={componentData} /> : null
            default:
              return isEditMode ? (
                <div key={type} className="p-2 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    {type.replace("Component", "")} (preview not implemented)
                  </p>
                </div>
              ) : null
          }
        })}
        {renderChildren()}
      </div>
    </div>
  )
}

export default function CardPreview() {
  const { entities, rootEntities, editMode, toggleEditMode, selectEntity, selectedEntityId, reorderEntity } =
    useCardBuilderStore()
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "json">("desktop")
  const [showFullPreview, setShowFullPreview] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const activeEntity = entities[active.id as string]
      const overEntity = entities[over?.id as string]

      if (activeEntity && overEntity) {
        // Only reorder if they have the same parent
        if (activeEntity.parentId === overEntity.parentId) {
          reorderEntity(active.id as string, overEntity.order)
        }
      }
    }
  }

  const renderJsonView = () => {
    const previewData = {
      entities: Object.values(entities).map((entity) => ({
        id: entity.id,
        name: entity.name,
        parentId: entity.parentId,
        order: entity.order,
        components: Object.keys(entity.components).map((type) => ({
          type,
          data: entity.components[type as ComponentType].data,
        })),
        children: entity.children,
      })),
      rootEntities,
    }

    return <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">{JSON.stringify(previewData, null, 2)}</pre>
  }

  // Get root entities and sort by order
  const rootEntityObjects = rootEntities
    .map((id) => entities[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)

  const rootEntityIds = rootEntityObjects.map((entity) => entity.id)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
            className="flex items-center gap-1"
          >
            {editMode ? (
              <>
                <Eye className="h-4 w-4" />
                <span>View Mode</span>
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                <span>Edit Mode</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullPreview(true)}
            className="flex items-center gap-1"
          >
            <Maximize2 className="h-4 w-4" />
            <span>Full Preview</span>
          </Button>
        </div>

        {editMode && (
          <p className="text-xs text-muted-foreground">
            Click entities to select • Hover and drag the move icon to reorder
          </p>
        )}
      </div>

      <Tabs defaultValue="desktop" onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="desktop" className="flex items-center gap-1">
            <Monitor className="h-4 w-4" />
            <span>Desktop</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-1">
            <Smartphone className="h-4 w-4" />
            <span>Mobile</span>
          </TabsTrigger>
          <TabsTrigger value="json" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span>JSON</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desktop">
          <div className="bg-white rounded-md p-4 min-h-[400px] border">
            {rootEntityObjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No entities to display</p>
                <p className="text-sm">Add entities and components to see the preview</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={rootEntityIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4 w-full">
                    {rootEntityObjects.map((entity) => (
                      <DraggableEntity
                        key={entity.id}
                        entity={entity}
                        viewMode="desktop"
                        isEditMode={editMode}
                        onEntityClick={selectEntity}
                        selectedEntityId={selectedEntityId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </TabsContent>

        <TabsContent value="mobile">
          <div className="mx-auto max-w-[375px] bg-white rounded-md p-4 min-h-[600px] border">
            {rootEntityObjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No entities to display</p>
                <p className="text-sm">Add entities and components to see the preview</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={rootEntityIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4 w-full">
                    {rootEntityObjects.map((entity) => (
                      <DraggableEntity
                        key={entity.id}
                        entity={entity}
                        viewMode="mobile"
                        isEditMode={editMode}
                        onEntityClick={selectEntity}
                        selectedEntityId={selectedEntityId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </TabsContent>

        <TabsContent value="json">{renderJsonView()}</TabsContent>
      </Tabs>

      {/* Full Screen Preview Modal */}
      {showFullPreview && (
        <FullScreenPreview
          entities={entities}
          rootEntities={rootEntityObjects}
          onClose={() => setShowFullPreview(false)}
          viewMode={viewMode}
        />
      )}
    </div>
  )
}
