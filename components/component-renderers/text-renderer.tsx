"use client"

import type React from "react"
import { useCardBuilderStore } from "@/lib/store"
import type { TextData, FontStyleData, CustomFontData } from "@/lib/types"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface TextRendererProps {
  data: TextData
  entityId: string
}

export default function TextRenderer({ data, entityId }: TextRendererProps) {
  const { editMode, updateComponentData, entities } = useCardBuilderStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.content)

  useEffect(() => {
    setEditValue(data.content)
  }, [data.content])

  const handleEdit = () => {
    if (!editMode) return
    setIsEditing(true)
  }

  const handleSave = () => {
    updateComponentData(entityId, "TextComponent", {
      ...data,
      content: editValue,
    })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue(data.content)
    }
  }

  // Find font style and custom font components that target this text component
  const entity = entities[entityId]
  const parentId = entity?.parentId
  const parentEntity = parentId ? entities[parentId] : null

  // Get font styles from the parent entity
  let fontFamily = ""
  let fontSize = ""
  let fontWeight = ""
  let fontStyle = ""

  if (parentEntity) {
    // Check for FontStyleComponent in the parent entity
    const fontStyleComponent = Object.entries(parentEntity.components).find(
      ([type, comp]) =>
        type === "FontStyleComponent" &&
        (comp.data.applyToEntity || comp.data.targetComponents.includes("TextComponent")),
    )

    if (fontStyleComponent) {
      const fontStyleData = fontStyleComponent[1].data as FontStyleData
      fontFamily = fontStyleData.fontFamily
      fontSize = data.isHeading ? fontStyleData.headingSize : fontStyleData.bodySize
      fontWeight = fontStyleData.fontWeight
    }

    // Check for CustomFontComponent in the parent entity
    const customFontComponent = Object.entries(parentEntity.components).find(
      ([type, comp]) =>
        type === "CustomFontComponent" &&
        (comp.data.applyToEntity || comp.data.targetComponents.includes("TextComponent")),
    )

    if (customFontComponent) {
      const customFontData = customFontComponent[1].data as CustomFontData
      if (customFontData.fontName) {
        fontFamily = customFontData.fontName
        fontWeight = customFontData.fontWeight
        fontStyle = customFontData.fontStyle
      }
    }
  }

  if (isEditing) {
    return data.isHeading ? (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full"
      />
    ) : (
      <Textarea
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full"
        rows={3}
      />
    )
  }

  const textStyle = {
    textAlign: data.textAlign,
    color: data.color || "inherit",
    cursor: editMode ? "pointer" : "default",
    fontFamily: fontFamily || "inherit",
    fontSize: fontSize || (data.isHeading ? "inherit" : "inherit"),
    fontWeight: fontWeight || "inherit",
    fontStyle: fontStyle || "inherit",
  }

  // Import custom font if needed
  const customFontImport =
    parentEntity &&
    Object.entries(parentEntity.components).find(([type, comp]) => type === "CustomFontComponent" && comp.data.fontUrl)

  const customFontUrl = customFontImport ? (customFontImport[1].data as CustomFontData).fontUrl : null

  if (data.isHeading) {
    const HeadingTag = `h${data.headingLevel || 2}` as keyof JSX.IntrinsicElements
    return (
      <>
        {customFontUrl && (
          <style jsx global>{`
            @import url('${customFontUrl}');
          `}</style>
        )}
        <HeadingTag
          className={`font-bold ${data.headingLevel === 1 ? "text-2xl" : data.headingLevel === 2 ? "text-xl" : data.headingLevel === 3 ? "text-lg" : data.headingLevel === 4 ? "text-base" : data.headingLevel === 5 ? "text-sm" : "text-xs"}`}
          style={textStyle}
          onClick={handleEdit}
        >
          {data.content}
        </HeadingTag>
      </>
    )
  }

  return (
    <>
      {customFontUrl && (
        <style jsx global>{`
          @import url('${customFontUrl}');
        `}</style>
      )}
      <p style={textStyle} onClick={handleEdit}>
        {data.content}
      </p>
    </>
  )
}
