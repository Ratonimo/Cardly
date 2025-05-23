import type { NextRequest } from "next/server"
import { createUser, getUserByEmail, generateToken } from "@/lib/auth"
import { testDbConnection } from "@/lib/db"

// Simple function to ensure we always return JSON
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Log available environment variables (without values for security)
    const envVars = Object.keys(process.env)
      .filter((key) => key.includes("DATABASE") || key.includes("POSTGRES") || key.includes("POSTGRE"))
      .join(", ")
    console.log("Available database environment variables:", envVars)

    // Test database connection first
    const dbTest = await testDbConnection()
    if (!dbTest.success) {
      console.error("Database connection failed:", dbTest.error)
      return jsonResponse(
        {
          error: "Database connection failed. Please try again later.",
          details: process.env.NODE_ENV === "development" ? String(dbTest.error) : undefined,
        },
        500,
      )
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set")
      return jsonResponse({ error: "Authentication configuration error" }, 500)
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return jsonResponse({ error: "Invalid request body" }, 400)
    }

    const { email, password, name } = body

    // Validate input
    if (!email || !password) {
      return jsonResponse({ error: "Email and password are required" }, 400)
    }

    // Check if user already exists
    try {
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        return jsonResponse({ error: "An account with this email already exists" }, 409)
      }
    } catch (dbError) {
      console.error("Database error checking existing user:", dbError)
      return jsonResponse(
        {
          error: "Database error. Please try again later.",
          details: process.env.NODE_ENV === "development" ? String(dbError) : undefined,
        },
        500,
      )
    }

    // Create new user
    try {
      const user = await createUser(email, password, name || null)
      const token = generateToken(user.id)

      return jsonResponse(
        {
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        201,
      )
    } catch (createError: any) {
      console.error("User creation error:", createError)
      return jsonResponse(
        {
          error: "Failed to create account. Please try again.",
          details: process.env.NODE_ENV === "development" ? String(createError) : undefined,
        },
        500,
      )
    }
  } catch (error: any) {
    console.error("Registration route error:", error)
    return jsonResponse(
      {
        error: "An unexpected error occurred. Please try again.",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      500,
    )
  }
}
