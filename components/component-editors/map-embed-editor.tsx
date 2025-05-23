"use client"

import { useCardBuilderStore } from "@/lib/store"
import type { MapEmbedData, EntityId } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface MapEmbedEditorProps {
  entityId: EntityId
  data: MapEmbedData
}

export default function MapEmbedEditor({ entityId, data }: MapEmbedEditorProps) {
  const { updateComponentData } = useCardBuilderStore()
  const [localData, setLocalData] = useState<MapEmbedData>(data)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (key: keyof MapEmbedData, value: any) => {
    const newData = {
      ...localData,
      [key]: value,
    }
    setLocalData(newData)
    updateComponentData(entityId, "MapEmbedComponent", newData)
  }

  const handleZoomChange = (value: number[]) => {
    handleChange("zoom", value[0])
  }

  // Simulate geocoding (in a real app, you'd use a geocoding service)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    // This is a mock implementation - in reality you'd use Google Geocoding API or similar
    const mockLocations: Record<string, { lat: number; lng: number }> = {
      "new york": { lat: 40.7128, lng: -74.006 },
      london: { lat: 51.5074, lng: -0.1278 },
      paris: { lat: 48.8566, lng: 2.3522 },
      tokyo: { lat: 35.6762, lng: 139.6503 },
      sydney: { lat: -33.8688, lng: 151.2093 },
      "san francisco": { lat: 37.7749, lng: -122.4194 },
      "los angeles": { lat: 34.0522, lng: -118.2437 },
      chicago: { lat: 41.8781, lng: -87.6298 },
      miami: { lat: 25.7617, lng: -80.1918 },
      seattle: { lat: 47.6062, lng: -122.3321 },
    }

    const location = mockLocations[searchQuery.toLowerCase()]
    if (location) {
      handleChange("latitude", location.lat)
      handleChange("longitude", location.lng)
      handleChange("markerTitle", searchQuery)
    } else {
      alert(
        "Location not found. Try: New York, London, Paris, Tokyo, Sydney, San Francisco, Los Angeles, Chicago, Miami, or Seattle",
      )
    }
  }

  const presetLocations = [
    { name: "New York", lat: 40.7128, lng: -74.006 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  ]

  const handlePresetLocation = (preset: { name: string; lat: number; lng: number }) => {
    handleChange("latitude", preset.lat)
    handleChange("longitude", preset.lng)
    handleChange("markerTitle", preset.name)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="locationSearch">Search Location</Label>
        <div className="flex gap-2">
          <Input
            id="locationSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter city name..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label>Quick Locations</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {presetLocations.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => handlePresetLocation(preset)}
              className="text-xs"
            >
              <MapPin className="h-3 w-3 mr-1" />
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            value={localData.latitude}
            onChange={(e) => handleChange("latitude", Number.parseFloat(e.target.value) || 0)}
            placeholder="40.7128"
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            value={localData.longitude}
            onChange={(e) => handleChange("longitude", Number.parseFloat(e.target.value) || 0)}
            placeholder="-74.0060"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="zoom">Zoom Level: {localData.zoom}</Label>
        <Slider
          id="zoom"
          min={1}
          max={20}
          step={1}
          value={[localData.zoom]}
          onValueChange={handleZoomChange}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="markerTitle">Marker Title</Label>
        <Input
          id="markerTitle"
          value={localData.markerTitle}
          onChange={(e) => handleChange("markerTitle", e.target.value)}
          placeholder="Location name"
        />
      </div>

      <div>
        <Label htmlFor="markerDescription">Marker Description</Label>
        <Textarea
          id="markerDescription"
          value={localData.markerDescription}
          onChange={(e) => handleChange("markerDescription", e.target.value)}
          placeholder="Additional information about this location"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="mapType">Map Type</Label>
        <Select
          value={localData.mapType}
          onValueChange={(value: "roadmap" | "satellite" | "hybrid" | "terrain") => handleChange("mapType", value)}
        >
          <SelectTrigger id="mapType">
            <SelectValue placeholder="Select map type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="roadmap">Roadmap</SelectItem>
            <SelectItem value="satellite">Satellite</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="terrain">Terrain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mapWidth">Width</Label>
          <Input
            id="mapWidth"
            value={localData.width}
            onChange={(e) => handleChange("width", e.target.value)}
            placeholder="100%, 400px, etc."
          />
        </div>
        <div>
          <Label htmlFor="mapHeight">Height</Label>
          <Input
            id="mapHeight"
            value={localData.height}
            onChange={(e) => handleChange("height", e.target.value)}
            placeholder="300px, 400px, etc."
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch
            id="showMarker"
            checked={localData.showMarker}
            onCheckedChange={(checked) => handleChange("showMarker", checked)}
          />
          <Label htmlFor="showMarker">Show location marker</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showControls"
            checked={localData.showControls}
            onCheckedChange={(checked) => handleChange("showControls", checked)}
          />
          <Label htmlFor="showControls">Show map controls</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="apiKey">Google Maps API Key (optional)</Label>
        <Input
          id="apiKey"
          type="password"
          value={localData.apiKey || ""}
          onChange={(e) => handleChange("apiKey", e.target.value)}
          placeholder="For production use"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Required for production. Get one from Google Cloud Console.
        </p>
      </div>

      <div className="mt-4 p-3 rounded-md border">
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <div
          className="bg-muted rounded-md flex items-center justify-center text-muted-foreground"
          style={{
            width: localData.width,
            height: localData.height,
            minHeight: "200px",
          }}
        >
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">{localData.markerTitle}</p>
            <p className="text-xs">
              {localData.latitude.toFixed(4)}, {localData.longitude.toFixed(4)}
            </p>
            <p className="text-xs mt-1">Zoom: {localData.zoom}</p>
            <p className="text-xs">Type: {localData.mapType}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
