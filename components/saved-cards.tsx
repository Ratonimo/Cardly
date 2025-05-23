"use client"

import { useState, useEffect } from "react"
import { useCardBuilderStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Edit, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SavedCard {
  id: number
  name: string
  description?: string
  data: any
  created_at: string
  updated_at: string
}

export default function SavedCards() {
  const [cards, setCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)
  const { importFromJSON } = useCardBuilderStore()

  useEffect(() => {
    // Load cards from localStorage instead of the API
    const loadCards = () => {
      try {
        const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]")
        setCards(savedCards)
      } catch (error) {
        console.error("Error loading cards:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [])

  const handleLoadCard = (card: SavedCard) => {
    try {
      importFromJSON(JSON.stringify(card.data))
      console.log(`"${card.name}" has been loaded into the editor`)
    } catch (error) {
      console.error("There was an error loading your card")
      alert("There was an error loading your card")
    }
  }

  const handleDeleteCard = (id: number) => {
    try {
      const savedCards = JSON.parse(localStorage.getItem("savedCards") || "[]")
      const updatedCards = savedCards.filter((card: SavedCard) => card.id !== id)
      localStorage.setItem("savedCards", JSON.stringify(updatedCards))
      setCards(updatedCards)

      console.log("The card has been deleted successfully")
    } catch (error) {
      console.error("There was an error deleting your card")
      alert("There was an error deleting your card")
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading your saved cards...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">You don't have any saved cards yet.</p>
        <p>Create a card in the Card Builder tab and save it to see it here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{card.name}</CardTitle>
            {card.description && <CardDescription>{card.description}</CardDescription>}
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span>Updated {formatDistanceToNow(new Date(card.updated_at), { addSuffix: true })}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleLoadCard(card)}>
              <Edit className="h-4 w-4 mr-2" />
              Load
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your saved card.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteCard(card.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
