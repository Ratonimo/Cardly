"use client"

import { useCardBuilderStore } from "@/lib/store"
import { getComponentsByCategory, getComponentCategories } from "@/lib/component-registry"
import type { ComponentType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Palette,
  MousePointer,
  Briefcase,
  LineChart,
  PlusCircle,
  Info,
  Type,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function ComponentSelector() {
  const { selectedEntityId, selectedComponentType, selectComponentType, addComponent, entities, availablePoints } =
    useCardBuilderStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    basic: true,
    aesthetic: false,
    interaction: false,
    portfolio: false,
    professional: false,
  })

  const categories = getComponentCategories()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basic":
        return <Type className="h-4 w-4" />
      case "aesthetic":
        return <Palette className="h-4 w-4" />
      case "interaction":
        return <MousePointer className="h-4 w-4" />
      case "portfolio":
        return <Briefcase className="h-4 w-4" />
      case "professional":
        return <LineChart className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleAddComponent = (type: ComponentType) => {
    if (!selectedEntityId) {
      alert("Please select an entity first")
      return
    }

    addComponent(selectedEntityId, type)
  }

  // Check if component is already added to the selected entity
  const isComponentAdded = (type: ComponentType): boolean => {
    if (!selectedEntityId || !entities[selectedEntityId]) return false
    return !!entities[selectedEntityId].components[type]
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Filter components based on search query
  const filterComponents = (components: any[]) => {
    if (!searchQuery) return components

    return components.filter(
      (component) =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Group components by subcategory
  const groupComponentsBySubcategory = (components: any[]) => {
    const grouped: Record<string, any[]> = {}

    components.forEach((component) => {
      const subcategory = component.subcategory || "Other"
      if (!grouped[subcategory]) {
        grouped[subcategory] = []
      }
      grouped[subcategory].push(component)
    })

    return grouped
  }

  return (
    <div>
      {!selectedEntityId && (
        <div className="text-center py-4 text-muted-foreground mb-4 bg-muted/50 rounded-md">
          <p>Select an entity to add components</p>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        {categories.map((category) => {
          const components = getComponentsByCategory(category)
          const filteredComponents = filterComponents(components)
          const groupedComponents = groupComponentsBySubcategory(filteredComponents)

          if (filteredComponents.length === 0) return null

          return (
            <Collapsible
              key={category}
              open={expandedCategories[category]}
              onOpenChange={() => toggleCategory(category)}
              className="mb-4"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-muted/50 rounded-md hover:bg-muted">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <span className="font-medium capitalize">{category}</span>
                  <Badge variant="outline" className="ml-1">
                    {filteredComponents.length}
                  </Badge>
                </div>
                {expandedCategories[category] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1 space-y-3 pl-2">
                {Object.entries(groupedComponents).map(([subcategory, components]) => (
                  <div key={subcategory} className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-2 mb-1">
                      {subcategory}
                    </div>

                    {components.map((component) => (
                      <div
                        key={component.type}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-md text-sm",
                          selectedComponentType === component.type
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-accent",
                          isComponentAdded(component.type) && "opacity-50",
                        )}
                      >
                        <div
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                          onClick={() => selectComponentType(component.type)}
                        >
                          <span>{component.name}</span>
                          <Badge variant="outline" className="ml-1 text-xs">
                            {component.cost} pts
                          </Badge>
                          {component.new && <Badge className="bg-green-500 text-white text-xs">New</Badge>}
                        </div>

                        <div className="flex gap-1 items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Info className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-[200px] text-xs">{component.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleAddComponent(component.type)}
                            disabled={
                              !selectedEntityId || isComponentAdded(component.type) || availablePoints < component.cost
                            }
                          >
                            <PlusCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </ScrollArea>
    </div>
  )
}
