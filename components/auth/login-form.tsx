"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onToggleMode: () => void
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null)

  // Run diagnostic test on component mount
  useState(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => {
        setDiagnosticInfo(data)
      })
      .catch((err) => {
        console.error("Diagnostic test failed:", err)
      })
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDebugInfo("")

    try {
      console.log("Attempting login for:", email)

      // Try the direct login endpoint
      const response = await fetch("/api/auth/direct-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Response status:", response.status)

      // Get the raw response text first
      const responseText = await response.text()
      console.log("Raw response:", responseText.substring(0, 500))

      // Check if response is JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        setError("Server returned invalid response")
        setDebugInfo(
          `Response was not JSON: ${response.headers.get("content-type")}\n\nResponse text: ${responseText.substring(0, 500)}`,
        )
        setLoading(false)
        return false
      }

      console.log("Parsed response data:", data)

      if (!response.ok || !data.success) {
        setError(data.error || "Login failed")
        if (data.debug) {
          setDebugInfo(`Debug info: ${data.debug}`)
        }
        setLoading(false)
        return false
      }

      // Store token and redirect
      localStorage.setItem("auth-token", data.token)
      console.log("Login successful, redirecting...")

      // Force a page reload to update the auth state
      window.location.href = "/"
      return true
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please check your connection and try again.")
      setDebugInfo(`Network error: ${error instanceof Error ? error.message : String(error)}`)
      setLoading(false)
      return false
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to access your saved cards</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert>
              <AlertDescription>
                <details>
                  <summary>Debug Information</summary>
                  <pre className="text-xs mt-2 whitespace-pre-wrap">{debugInfo}</pre>
                </details>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" onClick={onToggleMode} className="text-sm">
              Don't have an account? Sign up
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <strong>Test Account:</strong>
          <br />
          Email: test@example.com
          <br />
          Password: password123
        </div>

        {diagnosticInfo && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-500">System Diagnostic</summary>
            <pre className="text-xs mt-2 p-2 bg-gray-100 rounded whitespace-pre-wrap overflow-auto max-h-40">
              {JSON.stringify(diagnosticInfo, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
