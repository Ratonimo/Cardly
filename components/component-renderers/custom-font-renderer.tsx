"use client"

import type { CustomFontData } from "@/lib/types"
import { useCardBuilderStore } from "@/lib/store"

interface CustomFontRendererProps {
  data: CustomFontData
  entityId: string
}

export default function CustomFontRenderer({ data, entityId }: CustomFontRendererProps) {
  const { editMode } = useCardBuilderStore()

  // Don't render anything in the actual card
  if (!editMode) {
    return null
  }

  // Only show information in edit mode
  return (
    <div className="p-2 border border-dashed border-gray-300 rounded-md bg-gray-50 text-xs text-gray-500">
      <p className="font-medium">Custom Font (not visible in final card)</p>
      {data.fontName ? (
        <>
          <p>Font: {data.fontName}</p>
          <p>
            Style: {data.fontStyle}, Weight: {data.fontWeight}
          </p>
          {data.targetComponents.length > 0 && (
            <p>Affecting: {data.targetComponents.map((t) => t.replace("Component", "")).join(", ")}</p>
          )}
          <style jsx global>{`
            @import url('${data.fontUrl}');
          `}</style>
        </>
      ) : (
        <p>Custom font not configured</p>
      )}
    </div>
  )
}
