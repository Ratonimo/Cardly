import type { NextRequest } from "next/server"
import { getUserByEmail, verifyPassword, generateToken } from "@/lib/auth"
import { testDatabaseConnection } from "@/lib/db"

// Helper function to create JSON responses
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(request: NextRequest) {
  console.log("=== LOGIN API ROUTE CALLED ===")

  try {
    // Test database connection first
    console.log("Testing database connection...")
    const dbTest = await testDatabaseConnection()
    if (!dbTest.success) {
      console.error("Database connection failed:", dbTest.error)
      return jsonResponse(
        {
          success: false,
          error: "Database connection failed",
          debug: dbTest.error,
        },
        500,
      )
    }
    console.log("Database connection successful")

    // Parse request body
    let body
    try {
      const text = await request.text()
      console.log("Raw request body:", text)
      body = JSON.parse(text)
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return jsonResponse(
        {
          success: false,
          error: "Invalid request body",
        },
        400,
      )
    }

    const { email, password } = body
    console.log("Login attempt for email:", email)

    // Validate input
    if (!email || !password) {
      return jsonResponse(
        {
          success: false,
          error: "Email and password are required",
        },
        400,
      )
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return jsonResponse(
        {
          success: false,
          error: "Email and password must be strings",
        },
        400,
      )
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set")
      return jsonResponse(
        {
          success: false,
          error: "Authentication configuration error",
        },
        500,
      )
    }

    // Find user
    console.log("Looking up user by email...")
    let user
    try {
      user = await getUserByEmail(email)
      console.log("User lookup result:", user ? "Found" : "Not found")
    } catch (dbError) {
      console.error("Database error during user lookup:", dbError)
      return jsonResponse(
        {
          success: false,
          error: "Database error during login",
          debug: dbError instanceof Error ? dbError.message : String(dbError),
        },
        500,
      )
    }

    if (!user) {
      console.log("User not found for email:", email)
      return jsonResponse(
        {
          success: false,
          error: "Invalid email or password",
        },
        401,
      )
    }

    // Verify password
    console.log("Verifying password...")
    let isValidPassword
    try {
      isValidPassword = await verifyPassword(password, user.password)
      console.log("Password verification result:", isValidPassword)
    } catch (passwordError) {
      console.error("Error verifying password:", passwordError)
      return jsonResponse(
        {
          success: false,
          error: "Password verification failed",
          debug: passwordError instanceof Error ? passwordError.message : String(passwordError),
        },
        500,
      )
    }

    if (!isValidPassword) {
      console.log("Invalid password for user:", email)
      return jsonResponse(
        {
          success: false,
          error: "Invalid email or password",
        },
        401,
      )
    }

    // Generate token
    console.log("Generating authentication token...")
    let token
    try {
      token = generateToken(user.id)
      console.log("Token generated successfully")
    } catch (tokenError) {
      console.error("Error generating token:", tokenError)
      return jsonResponse(
        {
          success: false,
          error: "Token generation failed",
          debug: tokenError instanceof Error ? tokenError.message : String(tokenError),
        },
        500,
      )
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user

    console.log("Login successful for user:", email)
    return jsonResponse({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error: any) {
    console.error("Unexpected error in login route:", error)
    return jsonResponse(
      {
        success: false,
        error: "An unexpected error occurred during login",
        debug: error instanceof Error ? error.message : String(error),
      },
      500,
    )
  }
}
