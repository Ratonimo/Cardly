import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDatabaseUrl } from "./db"

// Get the database URL
const dbUrl = getDatabaseUrl()
console.log("Auth module using database URL:", dbUrl.substring(0, 20) + "...")

// Initialize SQL client
const sql = neon(dbUrl)

export interface User {
  id: number
  email: string
  name: string | null
  created_at: string
}

export interface Card {
  id: number
  user_id: number
  name: string
  description: string | null
  data: any
  created_at: string
  updated_at: string
}

// Get JWT secret
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET environment variable is not set. Using fallback secret.")
}

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, 12)
  } catch (error) {
    console.error("Error hashing password:", error)
    throw new Error("Failed to process password")
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    throw new Error("Failed to verify password")
  }
}

export function generateToken(userId: number): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set")
  }

  try {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
  } catch (error) {
    console.error("Error generating token:", error)
    throw new Error("Failed to generate authentication token")
  }
}

export function verifyToken(token: string): { userId: number } | null {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set")
  }

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number }
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function createUser(email: string, password: string, name?: string | null): Promise<User> {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    const hashedPassword = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email.toLowerCase().trim()}, ${hashedPassword}, ${name})
      RETURNING id, email, name, created_at
    `

    if (!result || result.length === 0) {
      throw new Error("Failed to create user record")
    }

    return result[0] as User
  } catch (error: any) {
    console.error("Database error creating user:", error)

    // Handle specific PostgreSQL errors
    if (error.code === "23505" || (error.message && error.message.includes("duplicate key"))) {
      throw new Error("Email already exists")
    }

    if (error.code === "23502") {
      throw new Error("Missing required fields")
    }

    // Re-throw our custom errors
    if (
      error.message.includes("Email and password are required") ||
      error.message.includes("Password must be at least") ||
      error.message.includes("Email already exists")
    ) {
      throw error
    }

    throw new Error("Failed to create user account")
  }
}

export async function getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  try {
    if (!email) {
      throw new Error("Email is required")
    }

    const result = await sql`
      SELECT id, email, name, password, created_at
      FROM users
      WHERE email = ${email.toLowerCase().trim()}
    `

    return (result[0] as User & { password: string }) || null
  } catch (error) {
    console.error("Database error getting user by email:", error)
    throw new Error("Failed to retrieve user")
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    if (!id || typeof id !== "number") {
      throw new Error("Valid user ID is required")
    }

    const result = await sql`
      SELECT id, email, name, created_at
      FROM users
      WHERE id = ${id}
    `

    return (result[0] as User) || null
  } catch (error) {
    console.error("Database error getting user by ID:", error)
    throw new Error("Failed to retrieve user")
  }
}

export async function saveCard(userId: number, name: string, description: string | null, data: any): Promise<Card> {
  try {
    const result = await sql`
      INSERT INTO cards (user_id, name, description, data)
      VALUES (${userId}, ${name}, ${description}, ${JSON.stringify(data)})
      RETURNING id, user_id, name, description, data, created_at, updated_at
    `

    return result[0] as Card
  } catch (error) {
    console.error("Database error saving card:", error)
    throw new Error("Failed to save card")
  }
}

export async function updateCard(
  cardId: number,
  userId: number,
  name: string,
  description: string | null,
  data: any,
): Promise<Card | null> {
  try {
    const result = await sql`
      UPDATE cards 
      SET name = ${name}, description = ${description}, data = ${JSON.stringify(data)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${cardId} AND user_id = ${userId}
      RETURNING id, user_id, name, description, data, created_at, updated_at
    `

    return (result[0] as Card) || null
  } catch (error) {
    console.error("Database error updating card:", error)
    throw new Error("Failed to update card")
  }
}

export async function getUserCards(userId: number): Promise<Card[]> {
  try {
    const result = await sql`
      SELECT id, user_id, name, description, data, created_at, updated_at
      FROM cards
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `

    return result as Card[]
  } catch (error) {
    console.error("Database error getting user cards:", error)
    throw new Error("Failed to retrieve cards")
  }
}

export async function getCard(cardId: number, userId: number): Promise<Card | null> {
  try {
    const result = await sql`
      SELECT id, user_id, name, description, data, created_at, updated_at
      FROM cards
      WHERE id = ${cardId} AND user_id = ${userId}
    `

    return (result[0] as Card) || null
  } catch (error) {
    console.error("Database error getting card:", error)
    throw new Error("Failed to retrieve card")
  }
}

export async function deleteCard(cardId: number, userId: number): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM cards
      WHERE id = ${cardId} AND user_id = ${userId}
    `

    return result.length > 0
  } catch (error) {
    console.error("Database error deleting card:", error)
    throw new Error("Failed to delete card")
  }
}
