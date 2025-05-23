"use client"

import { useCardBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit, Check, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function EntityList() {
  const { entities, selectEntity, selectedEntityId, removeEntity, renameEntity } = useCardBuilderStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const handleSave = (id: string) => {
    if (editName.trim()) {
      renameEntity(id, editName)
    }
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to remove this entity?")) {
      removeEntity(id)
    }
  }

  if (Object.keys(entities).length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No entities yet</p>
        <p className="text-sm">Add an entity to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Object.keys(entities).map((id) => (
        <div
          key={id}
          className={cn(
            "flex items-center justify-between p-2 rounded-md",
            selectedEntityId === id ? "bg-primary/10 border border-primary/20" : "hover:bg-accent",
          )}
        >
          {editingId === id ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave(id)
                  if (e.key === "Escape") handleCancel()
                }}
              />
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSave(id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="flex-1 cursor-pointer truncate"
                onClick={() => selectEntity(id)}
                title={entities[id].name}
              >
                {entities[id].name}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleEdit(id, entities[id].name)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleRemove(id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
