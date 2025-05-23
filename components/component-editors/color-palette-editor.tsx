"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { ColorPaletteData, EntityId, ComponentType } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { componentRegistry } from "@/lib/component-registry"

interface ColorPaletteEditorProps {
  entityId: EntityId
  data: ColorPaletteData
}

// Predefined color palettes
const predefinedPalettes = {
  default: {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1f2937",
  },
  dark: {
    primary: "#60a5fa",
    secondary: "#34d399",
    accent: "#fbbf24",
    background: "#1f2937",
    text: "#f9fafb",
  },
  pastel: {
    primary: "#a5b4fc",
    secondary: "#a7f3d0",
    accent: "#fde68a",
    background: "#f8fafc",
    text: "#334155",
  },
  vibrant: {
    primary: "#4f46e5",
    secondary: "#059669",
    accent: "#d97706",
    background: "#ffffff",
    text: "#111827",
  },
  monochrome: {
    primary: "#4b5563",
    secondary: "#9ca3af",
    accent: "#e5e7eb",
    background: "#f9fafb",
    text: "#111827",
  },
}

export default function ColorPaletteEditor({ entityId, data }: ColorPaletteEditorProps) {
  const { updateComponentData, entities } = useCardBuilderStore()

  // Ensure data has required properties with defaults
  const safeData = {
    ...data,
    targetComponents: data.targetComponents || [],
    applyToEntity: data.applyToEntity ?? true,
  }

  // Get available target components in the current entity
  const entity = entities[entityId]
  if (!entity) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Entity not found</p>
      </div>
    )
  }

  const availableTargets = componentRegistry.ColorPaletteComponent?.targets || []
  const entityComponentTypes = Object.keys(entity.components || {}) as ComponentType[]
  const validTargets = availableTargets.filter((target) => entityComponentTypes.includes(target))

  const handlePaletteChange = (palette: string) => {
    const newData = {
      ...safeData,
      palette,
      ...predefinedPalettes[palette as keyof typeof predefinedPalettes],
    }
    updateComponentData(entityId, "ColorPaletteComponent", newData)
  }

  const handleColorChange = (key: keyof ColorPaletteData, value: string) => {
    if (key === "palette") return

    const newData = {
      ...safeData,
      palette: "custom", // When manually changing colors, set to custom palette
      [key]: value,
    }
    updateComponentData(entityId, "ColorPaletteComponent", newData)
  }

  const handleTargetChange = (componentType: ComponentType, checked: boolean) => {
    const currentTargets = safeData.targetComponents || []
    const newTargets = checked ? [...currentTargets, componentType] : currentTargets.filter((t) => t !== componentType)

    const newData = {
      ...safeData,
      targetComponents: newTargets,
    }
    updateComponentData(entityId, "ColorPaletteComponent", newData)
  }

  const handleApplyToEntityChange = (checked: boolean) => {
    const newData = {
      ...safeData,
      applyToEntity: checked,
      targetComponents: checked ? validTargets : [],
    }
    updateComponentData(entityId, "ColorPaletteComponent", newData)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="palette">Palette</Label>
        <Select value={safeData.palette || "default"} onValueChange={handlePaletteChange}>
          <SelectTrigger id="palette">
            <SelectValue placeholder="Select a palette" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="pastel">Pastel</SelectItem>
            <SelectItem value="vibrant">Vibrant</SelectItem>
            <SelectItem value="monochrome">Monochrome</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Switch id="applyToEntity" checked={safeData.applyToEntity} onCheckedChange={handleApplyToEntityChange} />
          <Label htmlFor="applyToEntity">Apply to entire entity</Label>
        </div>

        {!safeData.applyToEntity && validTargets.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Target Components:</Label>
            <div className="mt-2 space-y-2">
              {validTargets.map((componentType) => (
                <div key={componentType} className="flex items-center space-x-2">
                  <Checkbox
                    id={componentType}
                    checked={safeData.targetComponents.includes(componentType)}
                    onCheckedChange={(checked) => handleTargetChange(componentType, checked as boolean)}
                  />
                  <Label htmlFor={componentType} className="text-sm">
                    {componentType.replace("Component", "")}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {validTargets.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No compatible components found. Add Text, Button, Link, or Badge components to apply colors.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primary" className="flex items-center gap-2">
            Primary
            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: safeData.primary || "#3b82f6" }} />
          </Label>
          <div className="flex gap-2">
            <Input
              id="primary"
              type="color"
              value={safeData.primary || "#3b82f6"}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input
              value={safeData.primary || "#3b82f6"}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="secondary" className="flex items-center gap-2">
            Secondary
            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: safeData.secondary || "#10b981" }} />
          </Label>
          <div className="flex gap-2">
            <Input
              id="secondary"
              type="color"
              value={safeData.secondary || "#10b981"}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input
              value={safeData.secondary || "#10b981"}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="accent" className="flex items-center gap-2">
            Accent
            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: safeData.accent || "#f59e0b" }} />
          </Label>
          <div className="flex gap-2">
            <Input
              id="accent"
              type="color"
              value={safeData.accent || "#f59e0b"}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input
              value={safeData.accent || "#f59e0b"}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="background" className="flex items-center gap-2">
            Background
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: safeData.background || "#ffffff" }}
            />
          </Label>
          <div className="flex gap-2">
            <Input
              id="background"
              type="color"
              value={safeData.background || "#ffffff"}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input
              value={safeData.background || "#ffffff"}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="text" className="flex items-center gap-2">
            Text
            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: safeData.text || "#1f2937" }} />
          </Label>
          <div className="flex gap-2">
            <Input
              id="text"
              type="color"
              value={safeData.text || "#1f2937"}
              onChange={(e) => handleColorChange("text", e.target.value)}
              className="w-10 h-10 p-1"
            />
            <Input
              value={safeData.text || "#1f2937"}
              onChange={(e) => handleColorChange("text", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-md" style={{ backgroundColor: safeData.background || "#ffffff" }}>
        <h3 className="text-lg font-semibold mb-1" style={{ color: safeData.primary || "#3b82f6" }}>
          Preview
        </h3>
        <p style={{ color: safeData.text || "#1f2937" }}>This is how your text will look with the selected palette.</p>
        <div className="flex gap-2 mt-2">
          <div
            className="px-3 py-1 rounded-md"
            style={{ backgroundColor: safeData.primary || "#3b82f6", color: "white" }}
          >
            Primary
          </div>
          <div
            className="px-3 py-1 rounded-md"
            style={{ backgroundColor: safeData.secondary || "#10b981", color: "white" }}
          >
            Secondary
          </div>
          <div
            className="px-3 py-1 rounded-md"
            style={{ backgroundColor: safeData.accent || "#f59e0b", color: "white" }}
          >
            Accent
          </div>
        </div>

        {safeData.targetComponents.length > 0 && (
          <div className="mt-3 text-sm">
            <p style={{ color: safeData.text || "#1f2937" }}>
              <strong>Affecting:</strong> {safeData.targetComponents.map((t) => t.replace("Component", "")).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
