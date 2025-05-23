"use client"

import { useCardBuilderStore } from "@/lib/store"
import { presets } from "@/lib/presets"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PresetSelector() {
  const { applyPreset } = useCardBuilderStore()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Quick Start Templates</h2>
      <p className="text-sm text-muted-foreground">Choose a preset to quickly get started with a pre-configured card</p>

      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-1 gap-4">
          {presets.map((preset) => (
            <Card key={preset.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{preset.name}</CardTitle>
                <CardDescription className="text-xs">{preset.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <img
                    src={preset.thumbnail || "/placeholder.svg"}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button size="sm" variant="outline" className="w-full" onClick={() => applyPreset(preset.id)}>
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
