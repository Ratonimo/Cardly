"use client"

import type React from "react"

import type { TooltipData } from "@/lib/types"
import { useState } from "react"

interface TooltipRendererProps {
  data: TooltipData
}

export default function TooltipRenderer({ data }: TooltipRendererProps) {
  const [showTooltip, setShowTooltip] = useState(false)

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
    <div className="relative inline-block">
      <div
        className="bg-muted p-2 rounded-md cursor-pointer text-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Hover me
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
  )
}
