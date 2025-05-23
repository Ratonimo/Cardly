import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Get database URL
    const dbUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRE_URL ||
      process.env.POSTGRES_URL_NON_POOLING

    if (!dbUrl) {
      return NextResponse.json(
        { success: false, error: "Database configuration error", debug: "No database URL found" },
        { status: 500 },
      )
    }

    // Connect to database
    const sql = neon(dbUrl)

    // Get user
    const users = await sql`
      SELECT id, email, name, password, created_at
      FROM users
      WHERE email = ${email.toLowerCase().trim()}
    `

    const user = users[0]

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Direct login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
        debug: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
