"use client"

import type { ImageFilterData } from "@/lib/types"
import { useCardBuilderStore } from "@/lib/store"

interface ImageFilterRendererProps {
  data: ImageFilterData
}

export default function ImageFilterRenderer({ data }: ImageFilterRendererProps) {
  const { entities } = useCardBuilderStore()

  // Generate CSS filter string based on filter type and intensity
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

  // Get target entity name if available
  const getTargetEntityName = (): string | null => {
    if (data.targetEntityId && entities[data.targetEntityId]) {
      return entities[data.targetEntityId].name
    }
    return null
  }

  const targetName = getTargetEntityName()

  if (data.filter === "none") {
    return <div className="text-sm text-muted-foreground">No filter applied</div>
  }

  return (
    <div>
      <div className="text-sm">
        Filter: {data.filter} ({data.intensity}%)
        {targetName && <div className="text-xs text-muted-foreground">Applied to: {targetName}</div>}
        {!targetName && <div className="text-xs text-muted-foreground">No target selected</div>}
      </div>
    </div>
  )
}
