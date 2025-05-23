"use client"

import type { ColorPaletteData } from "@/lib/types"

interface ColorPaletteRendererProps {
  data: ColorPaletteData
}

export default function ColorPaletteRenderer({ data }: ColorPaletteRendererProps) {
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: data.primary }} title="Primary" />
      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: data.secondary }} title="Secondary" />
      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: data.accent }} title="Accent" />
    </div>
  )
}
