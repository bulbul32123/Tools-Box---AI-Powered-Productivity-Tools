"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/auth"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock user data - in a real app, this would fetch from an API
    // For now, we'll simulate getting user data from the JWT token
    const mockUser: User = {
      userId: "1",
      name: "Demo User",
      email: "demo@example.com",
    }

    setUser(mockUser)
    setLoading(false)
  }, [])

  return { user, loading }
}
