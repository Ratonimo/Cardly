"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Entity } from "@/lib/types"

// Import component renderers
import TextRenderer from "./component-renderers/text-renderer"
import ButtonRenderer from "./component-renderers/button-renderer"
import DividerRenderer from "./component-renderers/divider-renderer"
import MapEmbedRenderer from "./component-renderers/map-embed-renderer"
import ImageRenderer from "./component-renderers/image-renderer"
import SocialLinksRenderer from "./component-renderers/social-links-renderer"

interface FullScreenPreviewProps {
  entities: Record<string, Entity>
  rootEntities: Entity[]
  onClose: () => void
  viewMode: "desktop" | "mobile" | "json"
}

export default function FullScreenPreview({ entities, rootEntities, onClose, viewMode }: FullScreenPreviewProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Render an entity and its children
  const renderEntity = (entity: Entity) => {
    if (!entity) return null

    const componentTypes = Object.keys(entity.components) as Array<keyof typeof entity.components>

    return (
      <div key={entity.id} className="w-full">
        <div className="space-y-4 w-full">
          {componentTypes.map((type) => {
            const componentData = entity.components[type].data

            // Only render visible components (not style/effect components)
            switch (type) {
              case "TextComponent":
                return (
                  <div key={type}>
                    <TextRenderer data={componentData} entityId={entity.id} />
                  </div>
                )
              case "ButtonComponent":
                return (
                  <div key={type}>
                    <ButtonRenderer data={componentData} />
                  </div>
                )
              case "DividerComponent":
                return <DividerRenderer key={type} data={componentData} />
              case "MapEmbedComponent":
                return <MapEmbedRenderer key={type} data={componentData} />
              case "ImageComponent":
                return (
                  <div key={type}>
                    <ImageRenderer data={componentData} />
                  </div>
                )
              case "SocialLinksComponent":
                return (
                  <div key={type}>
                    <SocialLinksRenderer data={componentData} />
                  </div>
                )
              // Don't render style/effect components in the full preview
              case "ColorPaletteComponent":
              case "FontStyleComponent":
              case "CustomFontComponent":
              case "ImageFilterComponent":
              case "TooltipComponent":
                return null
              default:
                return null
            }
          })}

          {/* Render children */}
          {entity.children && entity.children.length > 0 && (
            <div className="space-y-4 w-full">
              {entity.children
                .map((childId) => entities[childId])
                .filter(Boolean)
                .sort((a, b) => a.order - b.order)
                .map((childEntity) => renderEntity(childEntity))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`bg-white p-8 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] ${
          viewMode === "mobile" ? "w-[375px]" : "w-[90vw] max-w-[1200px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
          onClick={onClose}
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Card content */}
        <div className="space-y-6 w-full">
          {rootEntities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No content to display</p>
              <p className="text-sm">Add entities and components to see the preview</p>
            </div>
          ) : (
            rootEntities.map((entity) => renderEntity(entity))
          )}
        </div>
      </div>
    </div>
  )
}
