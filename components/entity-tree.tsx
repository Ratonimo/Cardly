"use client"

import { useCardBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit,
  Check,
  X,
  Plus,
  MoveVertical,
  ArrowUp,
  ArrowDown,
  Search,
  FolderTree,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { EntityId } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EntityItemProps {
  id: EntityId
  depth: number
  filter: string
  compactMode: boolean
}

function EntityItem({ id, depth, filter, compactMode }: EntityItemProps) {
  const {
    entities,
    selectedEntityId,
    selectEntity,
    renameEntity,
    removeEntity,
    addEntity,
    getEntityChildren,
    moveEntity,
    reorderEntity,
  } = useCardBuilderStore()
  const entity = entities[id]
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(entity.name)
  const [isExpanded, setIsExpanded] = useState(true)

  const children = getEntityChildren(id)
  const hasChildren = children.length > 0

  // Check if this entity or any of its children match the filter
  const matchesFilter = (entityId: string, filter: string): boolean => {
    if (!filter) return true

    const entity = entities[entityId]
    if (entity.name.toLowerCase().includes(filter.toLowerCase())) return true

    if (entity.children) {
      return entity.children.some((childId) => matchesFilter(childId, filter))
    }

    return false
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // If there's a filter and this entity doesn't match, don't render it
  if (filter && !matchesFilter(id, filter)) return null

  const handleEdit = () => {
    setIsEditing(true)
    setEditName(entity.name)
  }

  const handleSave = () => {
    if (editName.trim()) {
      renameEntity(id, editName)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleAddChild = () => {
    addEntity(`Child of ${entity.name}`, id)
  }

  const handleMoveUp = () => {
    if (entity.order > 0) {
      reorderEntity(id, entity.order - 1)
    }
  }

  const handleMoveDown = () => {
    const siblings = entity.parentId
      ? Object.values(entities).filter((e) => e.parentId === entity.parentId)
      : Object.values(entities).filter((e) => !e.parentId)

    if (entity.order < siblings.length - 1) {
      reorderEntity(id, entity.order + 1)
    }
  }

  // Count components in this entity
  const componentCount = Object.keys(entity.components).length

  // Get the first component type for a visual indicator
  const firstComponentType = Object.keys(entity.components)[0]?.replace("Component", "") || ""

  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center justify-between py-2 px-2 rounded-md text-sm mb-1",
          selectedEntityId === id ? "bg-primary/10 border border-primary/20" : "hover:bg-accent",
        )}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <div style={{ width: `${depth * 12}px` }} />

          {hasChildren ? (
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          ) : (
            <div className="w-5" />
          )}

          <div {...attributes} {...listeners} className="cursor-grab">
            <MoveVertical className="h-3 w-3 text-muted-foreground" />
          </div>

          {isEditing ? (
            <div className="flex-1 flex items-center gap-1 min-w-0">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-6 py-1 text-xs flex-1 min-w-0"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave()
                  if (e.key === "Escape") handleCancel()
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={handleSave}>
                <Check className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={handleCancel}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div
              className="flex-1 cursor-pointer truncate flex items-center gap-1"
              onClick={() => selectEntity(id)}
              title={entity.name}
            >
              <span className="truncate">{entity.name}</span>
              {componentCount > 0 && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                  {componentCount}
                </Badge>
              )}
              {firstComponentType && !compactMode && (
                <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                  {firstComponentType}
                </Badge>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-2 ml-1 flex-shrink-0">
            {compactMode ? (
              // Compact mode - show minimal controls with a dropdown for the rest
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0" title="Actions">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleEdit} className="text-xs">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddChild} className="text-xs">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Child
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMoveUp} className="text-xs">
                    <ArrowUp className="h-3 w-3 mr-2" />
                    Move Up
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMoveDown} className="text-xs">
                    <ArrowDown className="h-3 w-3 mr-2" />
                    Move Down
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => moveEntity(id, undefined)} className="text-xs">
                    Make Root Entity
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove "${entity.name}" and all its children?`)) {
                        removeEntity(id)
                      }
                    }}
                    className="text-xs text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Normal mode - show all controls
              <>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={handleEdit} title="Edit entity">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove "${entity.name}" and all its children?`)) {
                      removeEntity(id)
                    }
                  }}
                  title="Delete entity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  onClick={handleAddChild}
                  title="Add child entity"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0" title="More options">
                      <MoveVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={handleMoveUp} className="text-xs">
                      <ArrowUp className="h-3 w-3 mr-2" />
                      Move Up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleMoveDown} className="text-xs">
                      <ArrowDown className="h-3 w-3 mr-2" />
                      Move Down
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveEntity(id, undefined)} className="text-xs">
                      Make Root Entity
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="ml-2">
          <EntityList entities={children} parentId={id} depth={depth + 1} filter={filter} compactMode={compactMode} />
        </div>
      )}
    </div>
  )
}

interface EntityListProps {
  entities: any[]
  parentId?: EntityId
  depth: number
  filter: string
  compactMode: boolean
}

function EntityList({ entities, parentId, depth, filter, compactMode }: EntityListProps) {
  const { reorderEntity } = useCardBuilderStore()

  const sortedEntities = [...entities].sort((a, b) => a.order - b.order)
  const entityIds = sortedEntities.map((entity) => entity.id)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const activeEntity = sortedEntities.find((e) => e.id === active.id)
      const overEntity = sortedEntities.find((e) => e.id === over.id)

      if (activeEntity && overEntity) {
        reorderEntity(active.id, overEntity.order)
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={entityIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {sortedEntities.map((entity) => (
            <EntityItem key={entity.id} id={entity.id} depth={depth} filter={filter} compactMode={compactMode} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default function EntityTree() {
  const { entities, rootEntities, addEntity } = useCardBuilderStore()
  const rootEntityObjects = rootEntities.map((id) => entities[id]).filter(Boolean)
  const [filter, setFilter] = useState("")
  const [viewMode, setViewMode] = useState<"all" | "flat" | "tree">("tree")
  const [compactMode, setCompactMode] = useState(false)

  const handleAddRootEntity = () => {
    addEntity(`Entity ${Object.keys(entities).length + 1}`)
  }

  // Get all entities for flat view
  const allEntities = Object.values(entities)

  // Filter entities based on search
  const filteredEntities = allEntities.filter((entity) => entity.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <FolderTree className="h-4 w-4" />
          <h2 className="font-semibold text-sm">Entities</h2>
        </div>
        <Button size="sm" variant="outline" onClick={handleAddRootEntity} className="h-7 px-2 text-xs">
          <Plus className="h-3 w-3 mr-1" />
          Add Entity
        </Button>
      </div>

      <div className="flex gap-2 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search entities..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-7 h-7 text-xs"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={compactMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCompactMode(!compactMode)}
            className="h-7 px-2 text-xs"
            title="Toggle compact mode"
          >
            {compactMode ? "Normal" : "Compact"}
          </Button>

          <Select value={viewMode} onValueChange={(value: "all" | "flat" | "tree") => setViewMode(value)}>
            <SelectTrigger className="h-7 w-24 text-xs">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tree" className="text-xs">
                Tree View
              </SelectItem>
              <SelectItem value="flat" className="text-xs">
                Flat View
              </SelectItem>
              <SelectItem value="all" className="text-xs">
                All Entities
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        {viewMode === "tree" &&
          (rootEntityObjects.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-xs">No entities yet</p>
              <p className="text-xs">Add an entity to get started</p>
            </div>
          ) : (
            <EntityList entities={rootEntityObjects} depth={0} filter={filter} compactMode={compactMode} />
          ))}

        {viewMode === "flat" &&
          (filteredEntities.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-xs">No matching entities</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredEntities.map((entity) => (
                <div
                  key={entity.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md text-sm",
                    entity.id === useCardBuilderStore.getState().selectedEntityId
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent",
                  )}
                  onClick={() => useCardBuilderStore.getState().selectEntity(entity.id)}
                >
                  <div className="truncate">{entity.name}</div>
                  <div className="flex gap-1">
                    {entity.parentId && (
                      <Badge variant="outline" className="text-xs">
                        Child
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {Object.keys(entity.components).length} components
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {viewMode === "all" && (
          <div className="space-y-3">
            <div>
              <h3 className="text-xs font-medium mb-1">Root Entities ({rootEntityObjects.length})</h3>
              {rootEntityObjects.length === 0 ? (
                <div className="text-xs text-muted-foreground">No root entities</div>
              ) : (
                <div className="space-y-1">
                  {rootEntityObjects.map((entity) => (
                    <div
                      key={entity.id}
                      className={cn(
                        "flex items-center justify-between p-1 rounded-md text-xs",
                        entity.id === useCardBuilderStore.getState().selectedEntityId
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-accent",
                      )}
                      onClick={() => useCardBuilderStore.getState().selectEntity(entity.id)}
                    >
                      <div className="truncate">{entity.name}</div>
                      <Badge variant="secondary" className="text-xs">
                        {Object.keys(entity.components).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-medium mb-1">
                Child Entities ({allEntities.length - rootEntityObjects.length})
              </h3>
              {allEntities.length - rootEntityObjects.length === 0 ? (
                <div className="text-xs text-muted-foreground">No child entities</div>
              ) : (
                <div className="space-y-1">
                  {allEntities
                    .filter((entity) => entity.parentId)
                    .map((entity) => (
                      <div
                        key={entity.id}
                        className={cn(
                          "flex items-center justify-between p-1 rounded-md text-xs",
                          entity.id === useCardBuilderStore.getState().selectedEntityId
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-accent",
                        )}
                        onClick={() => useCardBuilderStore.getState().selectEntity(entity.id)}
                      >
                        <div className="truncate">{entity.name}</div>
                        <div className="flex items-center gap-1">
                          <div className="text-xs text-muted-foreground">
                            Parent: {entities[entity.parentId!]?.name.substring(0, 10)}...
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {Object.keys(entity.components).length}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
