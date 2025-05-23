import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    // List all environment variables (excluding sensitive values)
    const envVars = Object.keys(process.env).reduce(
      (acc, key) => {
        if (key.includes("SECRET") || key.includes("KEY") || key.includes("PASSWORD") || key.includes("TOKEN")) {
          acc[key] = "[REDACTED]"
        } else if (key.includes("URL")) {
          acc[key] = process.env[key]?.substring(0, 20) + "..."
        } else {
          acc[key] = process.env[key]
        }
        return acc
      },
      {} as Record<string, string | undefined>,
    )

    // Test database connection
    let dbResult = "Not tested"
    let dbError = null
    try {
      // Try all possible database URLs
      const dbUrl =
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        process.env.POSTGRE_URL ||
        process.env.POSTGRES_URL_NON_POOLING

      if (dbUrl) {
        const sql = neon(dbUrl)
        const result = await sql`SELECT 1 as test`
        dbResult = "Connected successfully"
      } else {
        dbResult = "No database URL found"
      }
    } catch (error) {
      dbResult = "Connection failed"
      dbError = error instanceof Error ? error.message : String(error)
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      environmentVariables: envVars,
      database: {
        status: dbResult,
        error: dbError,
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    })
  }
}
