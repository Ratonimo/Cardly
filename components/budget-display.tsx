"use client"

import { useCardBuilderStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Save } from "lucide-react"

export default function BudgetDisplay() {
  const { availablePoints, totalPoints, setTotalPoints } = useCardBuilderStore()
  const [editingBudget, setEditingBudget] = useState(false)
  const [newBudget, setNewBudget] = useState(totalPoints.toString())

  const usedPoints = totalPoints - availablePoints
  const percentUsed = Math.round((usedPoints / totalPoints) * 100)

  const handleSaveBudget = () => {
    const budget = Number.parseInt(newBudget)
    if (isNaN(budget) || budget < usedPoints) {
      alert(`Budget must be a number and at least ${usedPoints} points (currently used)`)
      setNewBudget(totalPoints.toString())
    } else {
      setTotalPoints(budget)
    }
    setEditingBudget(false)
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Point Budget</h2>

        {editingBudget ? (
          <div className="flex items-center gap-2">
            <Input
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-20 h-8"
              type="number"
              min={usedPoints}
              autoFocus
            />
            <Button size="sm" onClick={handleSaveBudget}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setEditingBudget(true)}>
            Edit Budget
          </Button>
        )}
      </div>

      <Progress value={percentUsed} className="h-2 mb-2" />

      <div className="flex justify-between text-sm">
        <span>
          <span className="font-medium">{availablePoints}</span> points available
        </span>
        <span>
          <span className="font-medium">{usedPoints}</span> / {totalPoints} points used
        </span>
      </div>
    </div>
  )
}
