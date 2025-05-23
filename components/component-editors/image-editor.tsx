"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { EntityId, ImageData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

interface ImageEditorProps {
  entityId: EntityId
  data: ImageData
}

export default function ImageEditor({ entityId, data }: ImageEditorProps) {
  const { updateComponentData } = useCardBuilderStore()
  const [borderRadius, setBorderRadius] = useState(Number.parseInt(data.borderRadius) || 8)

  const handleChange = (key: keyof ImageData, value: string | boolean) => {
    const newData = {
      ...data,
      [key]: value,
    }
    updateComponentData(entityId, "ImageComponent", newData)
  }

  const handleBorderRadiusChange = (value: number[]) => {
    setBorderRadius(value[0])
    const newData = {
      ...data,
      borderRadius: `${value[0]}px`,
    }
    updateComponentData(entityId, "ImageComponent", newData)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={data.url}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="imageAlt">Alt Text</Label>
        <Input
          id="imageAlt"
          value={data.alt}
          onChange={(e) => handleChange("alt", e.target.value)}
          placeholder="Image description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="imageWidth">Width</Label>
          <Input
            id="imageWidth"
            value={data.width}
            onChange={(e) => handleChange("width", e.target.value)}
            placeholder="100% or 300px"
          />
        </div>
        <div>
          <Label htmlFor="imageHeight">Height</Label>
          <Input
            id="imageHeight"
            value={data.height}
            onChange={(e) => handleChange("height", e.target.value)}
            placeholder="auto or 200px"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="borderRadius">Border Radius: {borderRadius}px</Label>
        <Slider
          id="borderRadius"
          min={0}
          max={50}
          step={1}
          value={[borderRadius]}
          onValueChange={handleBorderRadiusChange}
          className="mt-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="shadow" checked={data.shadow} onCheckedChange={(checked) => handleChange("shadow", checked)} />
        <Label htmlFor="shadow">Add shadow effect</Label>
      </div>

      <div className="mt-4 p-3 rounded-md border">
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <div className="flex justify-center">
          <img
            src={data.url || "/placeholder.svg"}
            alt={data.alt}
            style={{
              width: data.width,
              height: data.height,
              borderRadius: data.borderRadius,
              boxShadow: data.shadow
                ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                : "none",
              maxWidth: "100%",
            }}
          />
        </div>
      </div>
    </div>
  )
}
