"use client"

import type { DividerData } from "@/lib/types"

interface DividerRendererProps {
  data: DividerData
}

export default function DividerRenderer({ data }: DividerRendererProps) {
  return (
    <div
      style={{
        borderTop: `${data.thickness}px ${data.style} ${data.color || "#e5e7eb"}`,
        width: data.width,
        margin: data.margin,
      }}
    />
  )
}
