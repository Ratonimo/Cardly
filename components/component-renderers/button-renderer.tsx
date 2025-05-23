"use client"

import { Button } from "@/components/ui/button"
import type { ButtonData } from "@/lib/types"
import { ArrowRight, ArrowLeft, ExternalLink, ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react"

interface ButtonRendererProps {
  data: ButtonData
}

export default function ButtonRenderer({ data }: ButtonRendererProps) {
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

  const handleClick = () => {
    if (data.url) {
      window.open(data.url, "_blank")
    }
  }

  return (
    <Button
      variant={data.variant}
      size={data.size}
      className={data.fullWidth ? "w-full" : ""}
      style={{
        color: data.color || undefined,
        backgroundColor: data.backgroundColor || undefined,
      }}
      onClick={handleClick}
    >
      {data.icon && data.iconPosition === "left" && renderIcon(data.icon)}
      {data.text}
      {data.icon && data.iconPosition === "right" && renderIcon(data.icon)}
    </Button>
  )
}
