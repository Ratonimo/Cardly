"use client"

import type { MapEmbedData } from "@/lib/types"
import { MapPin, Navigation } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MapEmbedRendererProps {
  data: MapEmbedData
}

export default function MapEmbedRenderer({ data }: MapEmbedRendererProps) {
  const [showInfo, setShowInfo] = useState(false)

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    const baseUrl = "https://www.google.com/maps/embed/v1/place"
    const params = new URLSearchParams({
      key: data.apiKey || "demo", // In production, you'd need a real API key
      q: `${data.latitude},${data.longitude}`,
      zoom: data.zoom.toString(),
      maptype: data.mapType,
    })

    return `${baseUrl}?${params.toString()}`
  }

  // Generate Google Maps link for opening in new tab
  const getMapLink = () => {
    return `https://www.google.com/maps?q=${data.latitude},${data.longitude}&z=${data.zoom}`
  }

  const handleOpenInMaps = () => {
    window.open(getMapLink(), "_blank")
  }

  return (
    <div className="relative">
      <div
        className="rounded-md overflow-hidden border"
        style={{
          width: data.width,
          height: data.height,
        }}
      >
        {data.apiKey ? (
          // Real Google Maps embed (requires API key)
          <iframe
            src={getMapEmbedUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing ${data.markerTitle}`}
          />
        ) : (
          // Fallback preview when no API key
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative flex items-center justify-center">
            {/* Mock map background pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Mock roads */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-300"></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300"></div>
              <div className="absolute top-2/3 left-1/4 right-1/4 h-0.5 bg-gray-400"></div>
            </div>

            {/* Location marker */}
            {data.showMarker && (
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="bg-white px-2 py-1 rounded shadow-md mt-2 text-xs font-medium">{data.markerTitle}</div>
              </div>
            )}

            {/* Map type indicator */}
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
              {data.mapType}
            </div>

            {/* Zoom level */}
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
              Zoom: {data.zoom}
            </div>

            {/* Controls */}
            {data.showControls && (
              <div className="absolute bottom-2 right-2 flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 bg-white"
                  onClick={handleOpenInMaps}
                  title="Open in Google Maps"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 bg-white"
                  onClick={() => setShowInfo(!showInfo)}
                  title="Toggle info"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Info panel */}
            {showInfo && (
              <div className="absolute bottom-2 left-2 bg-white p-3 rounded shadow-lg max-w-xs">
                <h4 className="font-medium text-sm">{data.markerTitle}</h4>
                {data.markerDescription && <p className="text-xs text-gray-600 mt-1">{data.markerDescription}</p>}
                <p className="text-xs text-gray-500 mt-2">
                  {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
                </p>
              </div>
            )}

            {/* Demo notice */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
              Demo Map - Add API key for real maps
            </div>
          </div>
        )}
      </div>

      {/* External link button */}
      <div className="mt-2 flex justify-center">
        <Button variant="outline" size="sm" onClick={handleOpenInMaps} className="text-xs">
          <Navigation className="h-3 w-3 mr-1" />
          Open in Google Maps
        </Button>
      </div>
    </div>
  )
}
