import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Mock user database - replace with MongoDB in production
const users: Array<{
  id: string
  name: string
  email: string
  password: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    }
    users.push(newUser)

    // Create JWT token
    const token = sign(
      { userId: newUser.id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    // Set cookie
    const response = NextResponse.json({
      message: "Registration successful",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
