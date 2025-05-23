"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { CustomFontData, EntityId } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomFontEditorProps {
  entityId: EntityId
  data: CustomFontData
}

export default function CustomFontEditor({ entityId, data }: CustomFontEditorProps) {
  const { updateComponentData } = useCardBuilderStore()

  const handleChange = (key: keyof CustomFontData, value: string) => {
    const newData = {
      ...data,
      [key]: value,
    }
    updateComponentData(entityId, "CustomFontComponent", newData)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fontUrl">Font URL</Label>
        <Input
          id="fontUrl"
          value={data.fontUrl}
          onChange={(e) => handleChange("fontUrl", e.target.value)}
          placeholder="https://fonts.googleapis.com/css2?family=..."
        />
        <p className="text-xs text-muted-foreground mt-1">Enter a URL to a web font (e.g., Google Fonts CSS URL)</p>
      </div>

      <div>
        <Label htmlFor="fontName">Font Name</Label>
        <Input
          id="fontName"
          value={data.fontName}
          onChange={(e) => handleChange("fontName", e.target.value)}
          placeholder="Font Name"
        />
      </div>

      <div>
        <Label htmlFor="fontWeight">Font Weight</Label>
        <Select value={data.fontWeight} onValueChange={(value) => handleChange("fontWeight", value)}>
          <SelectTrigger id="fontWeight">
            <SelectValue placeholder="Select a font weight" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="300">300</SelectItem>
            <SelectItem value="400">400</SelectItem>
            <SelectItem value="500">500</SelectItem>
            <SelectItem value="600">600</SelectItem>
            <SelectItem value="700">700</SelectItem>
            <SelectItem value="800">800</SelectItem>
            <SelectItem value="900">900</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fontStyle">Font Style</Label>
        <Select value={data.fontStyle} onValueChange={(value) => handleChange("fontStyle", value)}>
          <SelectTrigger id="fontStyle">
            <SelectValue placeholder="Select a font style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="italic">Italic</SelectItem>
            <SelectItem value="oblique">Oblique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 p-3 rounded-md border">
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <style jsx global>{`
          @import url('${data.fontUrl}');
        `}</style>
        <p
          style={{
            fontFamily: data.fontName || "inherit",
            fontWeight: data.fontWeight,
            fontStyle: data.fontStyle,
          }}
        >
          This is a preview of your custom font.
        </p>
      </div>
    </div>
  )
}
