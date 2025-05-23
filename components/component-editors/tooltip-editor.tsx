"use client"

import type React from "react"

import { useCardBuilderStore } from "@/lib/store"
import type { EntityId, TooltipData } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface TooltipEditorProps {
  entityId: EntityId
  data: TooltipData
}

export default function TooltipEditor({ entityId, data }: TooltipEditorProps) {
  const { updateComponentData } = useCardBuilderStore()
  const [showTooltip, setShowTooltip] = useState(false)

  const handleChange = (key: keyof TooltipData, value: string) => {
    const newData = {
      ...data,
      [key]: value,
    }
    updateComponentData(entityId, "TooltipComponent", newData)
  }

  // Get tooltip style based on the selected style
  const getTooltipStyle = (): React.CSSProperties => {
    switch (data.style) {
      case "light":
        return {
          backgroundColor: "#ffffff",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }
      case "dark":
        return {
          backgroundColor: "#1f2937",
          color: "#ffffff",
        }
      case "colorful":
        return {
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.4)",
        }
      default:
        return {
          backgroundColor: "#ffffff",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
        }
    }
  }

  // Get tooltip position style
  const getPositionStyle = (): React.CSSProperties => {
    switch (data.position) {
      case "top":
        return {
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
        }
      case "right":
        return {
          left: "calc(100% + 10px)",
          top: "50%",
          transform: "translateY(-50%)",
        }
      case "bottom":
        return {
          top: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
        }
      case "left":
        return {
          right: "calc(100% + 10px)",
          top: "50%",
          transform: "translateY(-50%)",
        }
      default:
        return {
          top: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
        }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tooltipText">Tooltip Text</Label>
        <Input
          id="tooltipText"
          value={data.text}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="Enter tooltip text"
        />
      </div>

      <div>
        <Label htmlFor="position">Position</Label>
        <Select
          value={data.position}
          onValueChange={(value: "top" | "right" | "bottom" | "left") => handleChange("position", value)}
        >
          <SelectTrigger id="position">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
            <SelectItem value="left">Left</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="style">Style</Label>
        <Select
          value={data.style}
          onValueChange={(value: "light" | "dark" | "colorful") => handleChange("style", value)}
        >
          <SelectTrigger id="style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="colorful">Colorful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 p-3 rounded-md border">
        <h3 className="text-sm font-medium mb-4">Preview</h3>
        <div className="flex justify-center">
          <div
            className="relative inline-block bg-muted p-3 rounded-md cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            Hover me to see tooltip
            {showTooltip && (
              <div
                className="absolute px-3 py-2 rounded-md text-sm z-10 whitespace-nowrap"
                style={{
                  ...getTooltipStyle(),
                  ...getPositionStyle(),
                }}
              >
                {data.text || "Tooltip text"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
