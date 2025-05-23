import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Get the correct database URL from available environment variables
export function getDatabaseUrl() {
  // Check for different possible environment variable names
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRE_URL ||
    process.env.POSTGRES_URL_NON_POOLING

  if (!dbUrl) {
    throw new Error(
      "No database URL environment variable found. Please set DATABASE_URL, POSTGRES_URL, or POSTGRE_URL.",
    )
  }

  return dbUrl
}

// Initialize database connection
export function getDbConnection() {
  const dbUrl = getDatabaseUrl()

  try {
    const sql = neon(dbUrl)
    return drizzle(sql)
  } catch (error) {
    console.error("Failed to initialize database connection:", error)
    throw error
  }
}

// Test database connection
export async function testDbConnection() {
  try {
    const dbUrl = getDatabaseUrl()
    console.log("Using database URL:", dbUrl.substring(0, 20) + "...")

    const sql = neon(dbUrl)
    const result = await sql`SELECT 1 as test`
    return { success: true, result }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return { success: false, error }
  }
}
