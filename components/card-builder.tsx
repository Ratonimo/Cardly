"use client"

import { useState } from "react"
import { useCardBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Download, Upload, RefreshCw, PanelLeft, PanelRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import EntityTree from "./entity-tree"
import ComponentSelector from "./component-selector"
import PropertyInspector from "./property-inspector"
import CardPreview from "./card-preview"
import BudgetDisplay from "./budget-display"
import PresetSelector from "./preset-selector"

export default function CardBuilder() {
  const { exportToJSON, importFromJSON, resetStore } = useCardBuilderStore()
  const [importText, setImportText] = useState("")
  const [showImport, setShowImport] = useState(false)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)

  const handleExport = () => {
    const jsonData = exportToJSON()
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `card-builder-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    try {
      importFromJSON(importText)
      setImportText("")
      setShowImport(false)
    } catch (error) {
      console.error("Import error:", error)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset everything? This cannot be undone.")) {
      resetStore()
    }
  }

  // Calculate column spans based on panel collapse states
  const leftColSpan = leftPanelCollapsed ? 1 : 3
  const rightColSpan = rightPanelCollapsed ? 1 : 3
  const centerColSpan = 12 - leftColSpan - rightColSpan

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left Sidebar: Entities and Components */}
      <div
        className={`col-span-${leftColSpan} transition-all duration-300 ${leftPanelCollapsed ? "overflow-hidden" : ""}`}
      >
        <div className="flex justify-end mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            title={leftPanelCollapsed ? "Expand panel" : "Collapse panel"}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>

        {!leftPanelCollapsed && (
          <div className="space-y-4">
            <Tabs defaultValue="entities">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="entities">Entities</TabsTrigger>
                <TabsTrigger value="presets">Presets</TabsTrigger>
              </TabsList>

              <TabsContent value="entities" className="space-y-4">
                <Collapsible defaultOpen={true}>
                  <div className="bg-card rounded-lg border shadow-sm">
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-3 hover:bg-muted/50">
                      <h2 className="font-semibold">Entities</h2>
                      <span className="text-xs text-muted-foreground">Click to toggle</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-3">
                        <EntityTree />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>

                <Collapsible defaultOpen={true}>
                  <div className="bg-card rounded-lg border shadow-sm">
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-3 hover:bg-muted/50">
                      <h2 className="font-semibold">Components</h2>
                      <span className="text-xs text-muted-foreground">Click to toggle</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-3">
                        <ComponentSelector />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </TabsContent>

              <TabsContent value="presets">
                <div className="bg-card rounded-lg border shadow-sm p-4">
                  <PresetSelector />
                </div>
              </TabsContent>
            </Tabs>

            <Collapsible defaultOpen={true}>
              <div className="bg-card rounded-lg border shadow-sm">
                <CollapsibleTrigger className="flex justify-between items-center w-full p-3 hover:bg-muted/50">
                  <h2 className="font-semibold">Budget</h2>
                  <span className="text-xs text-muted-foreground">Click to toggle</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3">
                    <BudgetDisplay />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        )}
      </div>

      {/* Center: Preview */}
      <div className={`col-span-${centerColSpan}`}>
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Card Preview</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowImport(!showImport)}>
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} className="text-destructive">
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {showImport && (
            <div className="mb-4 space-y-2">
              <Textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON data here"
                rows={5}
              />
              <Button size="sm" onClick={handleImport}>
                Import Data
              </Button>
            </div>
          )}

          <CardPreview />
        </div>
      </div>

      {/* Right Sidebar: Properties */}
      <div
        className={`col-span-${rightColSpan} transition-all duration-300 ${
          rightPanelCollapsed ? "overflow-hidden" : ""
        }`}
      >
        <div className="flex justify-start mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            title={rightPanelCollapsed ? "Expand panel" : "Collapse panel"}
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>

        {!rightPanelCollapsed && (
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h2 className="font-semibold mb-4">Properties</h2>
            <PropertyInspector />
          </div>
        )}
      </div>
    </div>
  )
}
