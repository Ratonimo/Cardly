"use client"

import { useState } from "react"
import { useCardBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

export default function SaveCardDialog() {
  const { exportToJSON } = useCardBuilderStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  // const { toast } = useToast()

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please provide a name for your card")
      return
    }

    setSaving(true)

    try {
      // Instead of saving to the database, we'll just simulate a save
      // and store in localStorage
      const cardData = exportToJSON()
      const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]")

      const newCard = {
        id: Date.now(),
        name,
        description,
        data: JSON.parse(cardData),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      savedCards.push(newCard)
      localStorage.setItem("savedCards", JSON.stringify(savedCards))

      console.log(`"${name}" has been saved successfully`)

      setOpen(false)
      setName("")
      setDescription("")
    } catch (error) {
      console.error("Error saving card:", error)
      alert("There was an error saving your card")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Card</DialogTitle>
          <DialogDescription>
            Save your card design to access it later. Provide a name and optional description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="My Awesome Card"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Optional description of your card"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
