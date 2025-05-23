"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { DividerData, EntityId } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"

interface DividerEditorProps {
  entityId: EntityId
  data: DividerData
}

export default function DividerEditor({ entityId, data }: DividerEditorProps) {
  const { updateComponentData } = useCardBuilderStore()
  const [localData, setLocalData] = useState<DividerData>(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (key: keyof DividerData, value: any) => {
    const newData = {
      ...localData,
      [key]: value,
    }
    setLocalData(newData)
    updateComponentData(entityId, "DividerComponent", newData)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="dividerStyle">Style</Label>
        <Select
          value={localData.style}
          onValueChange={(value: "solid" | "dashed" | "dotted") => handleChange("style", value)}
        >
          <SelectTrigger id="dividerStyle">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="dashed">Dashed</SelectItem>
            <SelectItem value="dotted">Dotted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dividerWidth">Width</Label>
        <Input
          id="dividerWidth"
          value={localData.width}
          onChange={(e) => handleChange("width", e.target.value)}
          placeholder="100%, 200px, etc."
        />
      </div>

      <div>
        <Label htmlFor="dividerThickness">Thickness: {localData.thickness}px</Label>
        <Slider
          id="dividerThickness"
          min={1}
          max={10}
          step={1}
          value={[localData.thickness]}
          onValueChange={(value) => handleChange("thickness", value[0])}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="dividerMargin">Margin</Label>
        <Input
          id="dividerMargin"
          value={localData.margin}
          onChange={(e) => handleChange("margin", e.target.value)}
          placeholder="1rem 0, 10px 0, etc."
        />
      </div>

      <div>
        <Label htmlFor="dividerColor">Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            id="dividerColor"
            value={localData.color || "#e5e7eb"}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-10 h-10 p-1"
          />
          <Input
            value={localData.color || ""}
            onChange={(e) => handleChange("color", e.target.value)}
            placeholder="Optional custom color"
            className="flex-1"
          />
        </div>
      </div>

      <div className="mt-4 p-3 rounded-md border">
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <div
          style={{
            borderTop: `${localData.thickness}px ${localData.style} ${localData.color || "#e5e7eb"}`,
            width: localData.width,
            margin: localData.margin,
          }}
        />
      </div>
    </div>
  )
}
