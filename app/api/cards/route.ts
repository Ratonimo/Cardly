import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getUserCards, saveCard } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const cards = await getUserCards(decoded.userId)
    return NextResponse.json(cards)
  } catch (error) {
    console.error("Get cards error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { name, description, data } = await request.json()

    if (!name || !data) {
      return NextResponse.json({ error: "Name and data are required" }, { status: 400 })
    }

    const card = await saveCard(decoded.userId, name, description, data)
    return NextResponse.json(card)
  } catch (error) {
    console.error("Save card error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
