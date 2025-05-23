"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { EntityId, ImageFilterData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface ImageFilterEditorProps {
  entityId: EntityId
  data: ImageFilterData
}

const filterOptions = [
  { value: "none", label: "None" },
  { value: "grayscale", label: "Grayscale" },
  { value: "sepia", label: "Sepia" },
  { value: "blur", label: "Blur" },
  { value: "brightness", label: "Brightness" },
  { value: "contrast", label: "Contrast" },
  { value: "hue-rotate", label: "Hue Rotate" },
  { value: "invert", label: "Invert" },
  { value: "saturate", label: "Saturate" },
]

export default function ImageFilterEditor({ entityId, data }: ImageFilterEditorProps) {
  const { updateComponentData, entities } = useCardBuilderStore()

  // Ensure data has required properties with defaults
  const safeData = {
    ...data,
    filter: data.filter || "none",
    intensity: data.intensity ?? 50,
    targetEntityId: data.targetEntityId || null,
    showPreview: data.showPreview ?? false,
  }

  const handleFilterChange = (filter: string) => {
    const newData = {
      ...safeData,
      filter,
    }
    updateComponentData(entityId, "ImageFilterComponent", newData)
  }

  const handleIntensityChange = (value: number[]) => {
    const newData = {
      ...safeData,
      intensity: value[0],
    }
    updateComponentData(entityId, "ImageFilterComponent", newData)
  }

  const handleTargetChange = (targetEntityId: string | null) => {
    const newData = {
      ...safeData,
      targetEntityId,
    }
    updateComponentData(entityId, "ImageFilterComponent", newData)
  }

  const handleShowPreviewChange = (showPreview: boolean) => {
    const newData = {
      ...safeData,
      showPreview,
    }
    updateComponentData(entityId, "ImageFilterComponent", newData)
  }

  // Get list of entities that have an image component
  const entitiesWithImages = Object.entries(entities).filter(([id, entity]) => {
    return id !== entityId && entity.components["ImageComponent"]
  })

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

  // Get sample image URL from target entity if available
  const getSampleImageUrl = (): string | null => {
    if (safeData.targetEntityId && entities[safeData.targetEntityId]?.components["ImageComponent"]) {
      return entities[safeData.targetEntityId].components["ImageComponent"].data.url
    }
    return null
  }

  const targetImageUrl = getSampleImageUrl()

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="filter">Filter Type</Label>
        <Select value={safeData.filter} onValueChange={handleFilterChange}>
          <SelectTrigger id="filter">
            <SelectValue placeholder="Select a filter" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="intensity">Intensity: {safeData.intensity}%</Label>
        <Slider
          id="intensity"
          min={0}
          max={100}
          step={1}
          value={[safeData.intensity]}
          onValueChange={handleIntensityChange}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="targetEntity">Apply to Entity</Label>
        <Select
          value={safeData.targetEntityId || "none"}
          onValueChange={(value) => handleTargetChange(value === "none" ? null : value)}
        >
          <SelectTrigger id="targetEntity">
            <SelectValue placeholder="Select an entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {entitiesWithImages.map(([id, entity]) => (
              <SelectItem key={id} value={id}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="showPreview" checked={safeData.showPreview} onCheckedChange={handleShowPreviewChange} />
        <Label htmlFor="showPreview">Show preview</Label>
      </div>

      {safeData.showPreview && targetImageUrl && (
        <div className="mt-4 p-3 rounded-md border">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="flex justify-center">
            <img
              src={targetImageUrl || "/placeholder.svg"}
              alt="Filter preview"
              style={{
                filter: getFilterStyle(safeData.filter, safeData.intensity),
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>
      )}

      {safeData.showPreview && !targetImageUrl && safeData.filter !== "none" && (
        <div className="mt-4 p-3 rounded-md border">
          <p className="text-sm text-muted-foreground">Select an image entity to see a preview of the filter effect.</p>
        </div>
      )}
    </div>
  )
}
