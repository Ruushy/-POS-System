import bcrypt from "bcryptjs"
import User from "../models/User.js"

export const register = async (req, res) => {
  const { username, password, name, role, branch } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      name,
      role: role || "staff",
      branch,
      active: true,
    })

    await user.save()
    console.log("User registered:", user.username)

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        branch: user.branch,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body

  try {
    // Find user
    const user = await User.findOne({ username })
    if (!user || !user.active) {
      return res.status(400).json({ error: "Invalid credentials or inactive user" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    console.log("User logged in:", user.username)

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        branch: user.branch,
        loginTime: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}
