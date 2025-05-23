"use client"

import type { FontStyleData } from "@/lib/types"
import { useCardBuilderStore } from "@/lib/store"

interface FontStyleRendererProps {
  data: FontStyleData
  entityId: string
}

export default function FontStyleRenderer({ data, entityId }: FontStyleRendererProps) {
  const { editMode } = useCardBuilderStore()

  // Don't render anything in the actual card
  if (!editMode) {
    return null
  }

  // Only show information in edit mode
  return (
    <div className="p-2 border border-dashed border-gray-300 rounded-md bg-gray-50 text-xs text-gray-500">
      <p className="font-medium">Font Style (not visible in final card)</p>
      <p>Font: {data.fontFamily.split(",")[0]}</p>
      <p>
        Heading: {data.headingSize}, Body: {data.bodySize}
      </p>
      {data.targetComponents.length > 0 && (
        <p>Affecting: {data.targetComponents.map((t) => t.replace("Component", "")).join(", ")}</p>
      )}
    </div>
  )
}
