"use client"

import type { ImageData } from "@/lib/types"

interface ImageRendererProps {
  data: ImageData
}

export default function ImageRenderer({ data }: ImageRendererProps) {
  return (
    <div className="flex justify-center my-2">
      <img
        src={data.url || "/placeholder.svg"}
        alt={data.alt}
        style={{
          width: data.width,
          height: data.height,
          borderRadius: data.borderRadius,
          boxShadow: data.shadow ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" : "none",
          maxWidth: "100%",
        }}
      />
    </div>
  )
}
