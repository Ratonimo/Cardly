"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { ButtonData, EntityId } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, ExternalLink, ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react"

interface ButtonEditorProps {
  entityId: EntityId
  data: ButtonData
}

export default function ButtonEditor({ entityId, data }: ButtonEditorProps) {
  const { updateComponentData } = useCardBuilderStore()
  const [localData, setLocalData] = useState<ButtonData>(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (key: keyof ButtonData, value: any) => {
    const newData = {
      ...localData,
      [key]: value,
    }
    setLocalData(newData)
    updateComponentData(entityId, "ButtonComponent", newData)
  }

  const iconOptions = [
    { value: "", label: "None" },
    { value: "arrow-right", label: "Arrow Right" },
    { value: "arrow-left", label: "Arrow Left" },
    { value: "external-link", label: "External Link" },
    { value: "chevron-right", label: "Chevron Right" },
    { value: "chevron-left", label: "Chevron Left" },
    { value: "plus", label: "Plus" },
    { value: "minus", label: "Minus" },
  ]

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "arrow-right":
        return <ArrowRight className="h-4 w-4" />
      case "arrow-left":
        return <ArrowLeft className="h-4 w-4" />
      case "external-link":
        return <ExternalLink className="h-4 w-4" />
      case "chevron-right":
        return <ChevronRight className="h-4 w-4" />
      case "chevron-left":
        return <ChevronLeft className="h-4 w-4" />
      case "plus":
        return <Plus className="h-4 w-4" />
      case "minus":
        return <Minus className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={localData.text}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="Enter button text"
        />
      </div>

      <div>
        <Label htmlFor="buttonUrl">URL (optional)</Label>
        <Input
          id="buttonUrl"
          value={localData.url}
          onChange={(e) => handleChange("url", e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buttonVariant">Style</Label>
          <Select
            value={localData.variant}
            onValueChange={(value: "default" | "outline" | "ghost" | "link") => handleChange("variant", value)}
          >
            <SelectTrigger id="buttonVariant">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="buttonSize">Size</Label>
          <Select
            value={localData.size}
            onValueChange={(value: "sm" | "default" | "lg") => handleChange("size", value)}
          >
            <SelectTrigger id="buttonSize">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buttonIcon">Icon</Label>
          <Select value={localData.icon} onValueChange={(value) => handleChange("icon", value)}>
            <SelectTrigger id="buttonIcon">
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.value && renderIcon(option.value)}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="iconPosition">Icon Position</Label>
          <Select
            value={localData.iconPosition}
            onValueChange={(value: "left" | "right") => handleChange("iconPosition", value)}
            disabled={!localData.icon}
          >
            <SelectTrigger id="iconPosition">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="fullWidth"
          checked={localData.fullWidth}
          onCheckedChange={(checked) => handleChange("fullWidth", checked)}
        />
        <Label htmlFor="fullWidth">Full width</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buttonColor">Text Color (optional)</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              id="buttonColor"
              value={localData.color || "#ffffff"}
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

        <div>
          <Label htmlFor="buttonBgColor">Background Color (optional)</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              id="buttonBgColor"
              value={localData.backgroundColor || "#3b82f6"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input
              value={localData.backgroundColor || ""}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              placeholder="Optional custom color"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-md border">
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <div className="flex justify-center">
          <Button
            variant={localData.variant}
            size={localData.size}
            className={localData.fullWidth ? "w-full" : ""}
            style={{
              color: localData.color || undefined,
              backgroundColor: localData.backgroundColor || undefined,
            }}
          >
            {localData.icon && localData.iconPosition === "left" && renderIcon(localData.icon)}
            {localData.text}
            {localData.icon && localData.iconPosition === "right" && renderIcon(localData.icon)}
          </Button>
        </div>
      </div>
    </div>
  )
}
