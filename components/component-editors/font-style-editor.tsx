"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { EntityId, FontStyleData, ComponentType } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { componentRegistry } from "@/lib/component-registry"

interface FontStyleEditorProps {
  entityId: EntityId
  data: FontStyleData
}

// Available font families
const fontFamilies = [
  "Inter, sans-serif",
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
  "Verdana, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lato, sans-serif",
  "Montserrat, sans-serif",
  "Poppins, sans-serif",
]

// Font weights
const fontWeights = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"]

export default function FontStyleEditor({ entityId, data }: FontStyleEditorProps) {
  const { updateComponentData, entities } = useCardBuilderStore()

  // Ensure data has required properties with defaults
  const safeData = {
    ...data,
    targetComponents: data.targetComponents || [],
    applyToEntity: data.applyToEntity ?? true,
    fontFamily: data.fontFamily || "Inter, sans-serif",
    headingSize: data.headingSize || "1.5rem",
    bodySize: data.bodySize || "1rem",
    fontWeight: data.fontWeight || "normal",
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

  const availableTargets = componentRegistry.FontStyleComponent?.targets || []
  const entityComponentTypes = Object.keys(entity.components || {}) as ComponentType[]
  const validTargets = availableTargets.filter((target) => entityComponentTypes.includes(target))

  const handleChange = (key: keyof FontStyleData, value: string) => {
    const newData = {
      ...safeData,
      [key]: value,
    }
    updateComponentData(entityId, "FontStyleComponent", newData)
  }

  const handleSizeChange = (key: "headingSize" | "bodySize", value: number[]) => {
    const size = `${value[0]}rem`
    const newData = {
      ...safeData,
      [key]: size,
    }
    updateComponentData(entityId, "FontStyleComponent", newData)
  }

  const handleTargetChange = (componentType: ComponentType, checked: boolean) => {
    const currentTargets = safeData.targetComponents || []
    const newTargets = checked ? [...currentTargets, componentType] : currentTargets.filter((t) => t !== componentType)

    const newData = {
      ...safeData,
      targetComponents: newTargets,
    }
    updateComponentData(entityId, "FontStyleComponent", newData)
  }

  const handleApplyToEntityChange = (checked: boolean) => {
    const newData = {
      ...safeData,
      applyToEntity: checked,
      targetComponents: checked ? validTargets : [],
    }
    updateComponentData(entityId, "FontStyleComponent", newData)
  }

  // Convert rem to number for slider
  const headingSizeValue = Number.parseFloat(safeData.headingSize.replace("rem", "")) || 1.5
  const bodySizeValue = Number.parseFloat(safeData.bodySize.replace("rem", "")) || 1

  return (
    <div className="space-y-4">
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
            No compatible components found. Add Text, Button, or Link components to apply font styles.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select value={safeData.fontFamily} onValueChange={(value) => handleChange("fontFamily", value)}>
          <SelectTrigger id="fontFamily">
            <SelectValue placeholder="Select a font family" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font.split(",")[0]}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="headingSize">Heading Size: {safeData.headingSize}</Label>
        <Slider
          id="headingSize"
          min={0.75}
          max={3}
          step={0.25}
          value={[headingSizeValue]}
          onValueChange={(value) => handleSizeChange("headingSize", value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="bodySize">Body Size: {safeData.bodySize}</Label>
        <Slider
          id="bodySize"
          min={0.75}
          max={2}
          step={0.125}
          value={[bodySizeValue]}
          onValueChange={(value) => handleSizeChange("bodySize", value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="fontWeight">Font Weight</Label>
        <Select value={safeData.fontWeight} onValueChange={(value) => handleChange("fontWeight", value)}>
          <SelectTrigger id="fontWeight">
            <SelectValue placeholder="Select a font weight" />
          </SelectTrigger>
          <SelectContent>
            {fontWeights.map((weight) => (
              <SelectItem key={weight} value={weight}>
                <span style={{ fontWeight: weight }}>{weight}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 p-3 rounded-md border">
        <h3
          className="mb-2"
          style={{
            fontFamily: safeData.fontFamily,
            fontSize: safeData.headingSize,
            fontWeight: safeData.fontWeight,
          }}
        >
          Heading Preview
        </h3>
        <p
          style={{
            fontFamily: safeData.fontFamily,
            fontSize: safeData.bodySize,
            fontWeight: safeData.fontWeight === "bold" ? "normal" : safeData.fontWeight,
          }}
        >
          This is how your text will look with the selected font styles. Good typography improves readability and user
          experience.
        </p>

        {safeData.targetComponents.length > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            <p>
              <strong>Affecting:</strong> {safeData.targetComponents.map((t) => t.replace("Component", "")).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
