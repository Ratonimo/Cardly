"use client"

import type React from "react"

import { useCardBuilderStore } from "@/lib/store"
import type { ComponentType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Trash2, Target } from "lucide-react"
import { getComponentCost, componentRegistry } from "@/lib/component-registry"
import { Badge } from "@/components/ui/badge"

// Import component editors
import ColorPaletteEditor from "./component-editors/color-palette-editor"
import FontStyleEditor from "./component-editors/font-style-editor"
import ImageEditor from "./component-editors/image-editor"
import CustomFontEditor from "./component-editors/custom-font-editor"
import ImageFilterEditor from "./component-editors/image-filter-editor"
import TooltipEditor from "./component-editors/tooltip-editor"
import TextEditor from "./component-editors/text-editor"
import ButtonEditor from "./component-editors/button-editor"
import DividerEditor from "./component-editors/divider-editor"
import MapEmbedEditor from "./component-editors/map-embed-editor"

export default function PropertyInspector() {
  const { selectedEntityId, entities, removeComponent } = useCardBuilderStore()

  if (!selectedEntityId || !entities[selectedEntityId]) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Select an entity to view and edit its properties</p>
      </div>
    )
  }

  const entity = entities[selectedEntityId]
  const componentTypes = Object.keys(entity.components) as ComponentType[]

  if (componentTypes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>This entity has no components</p>
        <p className="text-sm">Add components from the component selector</p>
      </div>
    )
  }

  const handleRemoveComponent = (type: ComponentType) => {
    if (confirm(`Are you sure you want to remove the ${type.replace("Component", "")} component?`)) {
      removeComponent(selectedEntityId, type)
    }
  }

  // Group components by class
  const contentComponents = componentTypes.filter((type) => componentRegistry[type]?.componentClass === "content")
  const effectComponents = componentTypes.filter((type) => componentRegistry[type]?.componentClass === "effect")
  const globalComponents = componentTypes.filter((type) => componentRegistry[type]?.componentClass === "global")

  // Render the appropriate editor for each component type
  const renderComponentEditor = (type: ComponentType) => {
    const componentData = entity.components[type].data

    switch (type) {
      case "TextComponent":
        return <TextEditor entityId={selectedEntityId} data={componentData} />
      case "ButtonComponent":
        return <ButtonEditor entityId={selectedEntityId} data={componentData} />
      case "DividerComponent":
        return <DividerEditor entityId={selectedEntityId} data={componentData} />
      case "MapEmbedComponent":
        return <MapEmbedEditor entityId={selectedEntityId} data={componentData} />
      case "ColorPaletteComponent":
        return <ColorPaletteEditor entityId={selectedEntityId} data={componentData} />
      case "FontStyleComponent":
        return <FontStyleEditor entityId={selectedEntityId} data={componentData} />
      case "ImageComponent":
        return <ImageEditor entityId={selectedEntityId} data={componentData} />
      case "CustomFontComponent":
        return <CustomFontEditor entityId={selectedEntityId} data={componentData} />
      case "ImageFilterComponent":
        return <ImageFilterEditor entityId={selectedEntityId} data={componentData} />
      case "TooltipComponent":
        return <TooltipEditor entityId={selectedEntityId} data={componentData} />
      // Add more component editors as needed
      default:
        return (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Editor for {type.replace("Component", "")} is not implemented yet.
            </p>
          </div>
        )
    }
  }

  const renderComponentSection = (title: string, components: ComponentType[], icon?: React.ReactNode) => {
    if (components.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          <span>{title}</span>
          <Badge variant="outline" className="text-xs">
            {components.length}
          </Badge>
        </div>

        {components.map((type) => (
          <div key={type} className="bg-card border rounded-md overflow-hidden">
            <div className="flex items-center justify-between bg-muted p-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{type.replace("Component", "")}</h3>
                <Badge variant="outline">{getComponentCost(type)} pts</Badge>
                {componentRegistry[type]?.componentClass === "effect" && (
                  <Badge variant="secondary" className="text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    Effect
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => handleRemoveComponent(type)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">{renderComponentEditor(type)}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderComponentSection("Content Components", contentComponents)}
      {renderComponentSection("Effect Components", effectComponents, <Target className="h-4 w-4" />)}
      {renderComponentSection("Global Components", globalComponents)}
    </div>
  )
}
