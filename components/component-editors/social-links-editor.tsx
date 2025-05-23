"use client"

import { useState } from "react"
import { useCardBuilderStore } from "@/lib/store"
import type { SocialLinksData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SocialLinksEditor() {
  const { selectedEntityId, updateComponentData } = useCardBuilderStore()

  const [newPlatform, setNewPlatform] = useState("twitter")
  const [newUrl, setNewUrl] = useState("")
  const [newUsername, setNewUsername] = useState("")

  const handleUpdateData = (data: Partial<SocialLinksData>) => {
    if (!selectedEntityId) return
    updateComponentData(selectedEntityId, "SocialLinksComponent", data)
  }

  const handleAddLink = () => {
    if (!selectedEntityId || !newPlatform) return

    const newLink = {
      platform: newPlatform,
      url: newUrl,
      username: newUsername,
    }

    handleUpdateData({
      links: [...(data.links || []), newLink],
    })

    // Reset form
    setNewPlatform("twitter")
    setNewUrl("")
    setNewUsername("")
  }

  const handleRemoveLink = (index: number) => {
    if (!selectedEntityId) return
    const newLinks = [...data.links]
    newLinks.splice(index, 1)
    handleUpdateData({ links: newLinks })
  }

  const handleUpdateLink = (index: number, field: string, value: string) => {
    if (!selectedEntityId) return
    const newLinks = [...data.links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    handleUpdateData({ links: newLinks })
  }

  // Get current data
  const data: SocialLinksData = useCardBuilderStore((state) => {
    if (!selectedEntityId) return {} as SocialLinksData
    return (
      (state.entities[selectedEntityId]?.components?.SocialLinksComponent?.data as SocialLinksData) || {
        links: [],
        displayStyle: "icon",
        size: "medium",
        color: "",
      }
    )
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Display Style</Label>
        <RadioGroup
          value={data.displayStyle || "icon"}
          onValueChange={(value) => handleUpdateData({ displayStyle: value as "icon" | "text" | "both" })}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="icon" id="icon" />
            <Label htmlFor="icon">Icon Only</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="text" id="text" />
            <Label htmlFor="text">Text Only</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Icon & Text</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Size</Label>
        <Select
          value={data.size || "medium"}
          onValueChange={(value) => handleUpdateData({ size: value as "small" | "medium" | "large" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color (optional)</Label>
        <Input
          type="color"
          value={data.color || "#000000"}
          onChange={(e) => handleUpdateData({ color: e.target.value })}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Social Links</h3>
        {data.links && data.links.length > 0 ? (
          <div className="space-y-4">
            {data.links.map((link, index) => (
              <div key={index} className="flex flex-col space-y-2 p-3 border rounded-md">
                <div className="flex justify-between">
                  <Label>Platform</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLink(index)}
                    className="h-6 w-6 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={link.platform} onValueChange={(value) => handleUpdateLink(index, "platform", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="dribbble">Dribbble</SelectItem>
                    <SelectItem value="twitch">Twitch</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                  </SelectContent>
                </Select>

                <Label>URL</Label>
                <Input
                  value={link.url || ""}
                  onChange={(e) => handleUpdateLink(index, "url", e.target.value)}
                  placeholder="https://..."
                />

                <Label>Username/Display Text</Label>
                <Input
                  value={link.username || ""}
                  onChange={(e) => handleUpdateLink(index, "username", e.target.value)}
                  placeholder="@username"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground bg-muted/50 rounded-md">
            <p>No social links added yet</p>
          </div>
        )}

        <div className="mt-4 space-y-3 p-3 border rounded-md">
          <Label>Add New Link</Label>
          <Select value={newPlatform} onValueChange={setNewPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="twitter">Twitter/X</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="dribbble">Dribbble</SelectItem>
              <SelectItem value="twitch">Twitch</SelectItem>
              <SelectItem value="website">Website</SelectItem>
            </SelectContent>
          </Select>

          <Label>URL</Label>
          <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." />

          <Label>Username/Display Text</Label>
          <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="@username" />

          <Button onClick={handleAddLink} className="w-full mt-2" disabled={!newPlatform} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Social Link
          </Button>
        </div>
      </div>
    </div>
  )
}
