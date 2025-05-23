"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { EntityId, TextData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react"

interface TextEditorProps {
  entityId: EntityId
  data: TextData
}

export default function TextEditor({ entityId, data }: TextEditorProps) {
  const { updateComponentData } = useCardBuilderStore()
  const [localData, setLocalData] = useState<TextData>(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (key: keyof TextData, value: any) => {
    const newData = {
      ...localData,
      [key]: value,
    }
    setLocalData(newData)
    updateComponentData(entityId, "TextComponent", newData)
  }

  const handleHeadingChange = (isHeading: boolean) => {
    const newData = {
      ...localData,
      isHeading,
      headingLevel: isHeading ? localData.headingLevel || 2 : undefined,
    }
    setLocalData(newData)
    updateComponentData(entityId, "TextComponent", newData)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Text Content</Label>
        {localData.isHeading ? (
          <Input
            id="content"
            value={localData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Heading text"
          />
        ) : (
          <Textarea
            id="content"
            value={localData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Enter your text here"
            rows={4}
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isHeading"
          checked={localData.isHeading}
          onCheckedChange={(checked) => handleHeadingChange(checked)}
        />
        <Label htmlFor="isHeading">Is heading</Label>
      </div>

      {localData.isHeading && (
        <div>
          <Label htmlFor="headingLevel">Heading Level</Label>
          <Select
            value={String(localData.headingLevel || 2)}
            onValueChange={(value) => handleChange("headingLevel", Number(value))}
          >
            <SelectTrigger id="headingLevel">
              <SelectValue placeholder="Select heading level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">H1 - Main Heading</SelectItem>
              <SelectItem value="2">H2 - Section Heading</SelectItem>
              <SelectItem value="3">H3 - Subsection Heading</SelectItem>
              <SelectItem value="4">H4 - Minor Heading</SelectItem>
              <SelectItem value="5">H5 - Small Heading</SelectItem>
              <SelectItem value="6">H6 - Smallest Heading</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Text Alignment</Label>
        <RadioGroup
          value={localData.textAlign}
          onValueChange={(value: "left" | "center" | "right" | "justify") => handleChange("textAlign", value)}
          className="flex space-x-2 mt-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="left" id="left" />
            <Label htmlFor="left">Left</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="center" id="center" />
            <Label htmlFor="center">Center</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="right" id="right" />
            <Label htmlFor="right">Right</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="justify" id="justify" />
            <Label htmlFor="justify">Justify</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="textColor">Text Color (optional)</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            id="textColor"
            value={localData.color || "#000000"}
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
            textAlign: localData.textAlign,
            color: localData.color || "inherit",
          }}
        >
          {localData.isHeading ? (
            <>
              {localData.headingLevel === 1 && <h1 className="text-2xl font-bold">{localData.content}</h1>}
              {localData.headingLevel === 2 && <h2 className="text-xl font-bold">{localData.content}</h2>}
              {localData.headingLevel === 3 && <h3 className="text-lg font-bold">{localData.content}</h3>}
              {localData.headingLevel === 4 && <h4 className="text-base font-bold">{localData.content}</h4>}
              {localData.headingLevel === 5 && <h5 className="text-sm font-bold">{localData.content}</h5>}
              {localData.headingLevel === 6 && <h6 className="text-xs font-bold">{localData.content}</h6>}
            </>
          ) : (
            <p>{localData.content}</p>
          )}
        </div>
      </div>
    </div>
  )
}
