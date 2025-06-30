import User from "../models/User.js"

export const protect = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"]

    console.log("=== AUTH MIDDLEWARE DEBUG ===")
    console.log("User ID from header:", userId)

    if (!userId) {
      console.log("❌ No user ID provided in headers")
      return res.status(401).json({ error: "No user ID provided" })
    }

    const user = await User.findById(userId).select("-password")
    console.log("User found in database:", user ? `${user.username} (${user.role}) - ${user.branch}` : "null")

    if (!user) {
      console.log("❌ User not found in database")
      return res.status(401).json({ error: "User not found" })
    }

    if (!user.active) {
      console.log("❌ User account is inactive")
      return res.status(401).json({ error: "User account is inactive" })
    }

    console.log("✅ User authenticated successfully:", {
      id: user._id,
      username: user.username,
      role: user.role,
      branch: user.branch,
    })

    req.user = user
    next()
  } catch (error) {
    console.error("❌ Auth middleware error:", error)
    res.status(401).json({ error: "Authentication failed", details: error.message })
  }
}

export const admin = (req, res, next) => {
  console.log("=== ADMIN MIDDLEWARE DEBUG ===")
  console.log("User role:", req.user?.role)

  if (req.user && req.user.role === "admin") {
    console.log("✅ Admin access granted")
    next()
  } else {
    console.log("❌ Admin access denied")
    res.status(403).json({ error: "Admin access required" })
  }
}

// Allow both admin and staff roles (including cashier)
export const staffOrAdmin = (req, res, next) => {
  console.log("=== STAFF OR ADMIN MIDDLEWARE DEBUG ===")
  console.log("User role:", req.user?.role)

  if (req.user && (req.user.role === "admin" || req.user.role === "staff" || req.user.role === "cashier")) {
    console.log("✅ Staff/Admin access granted")
    next()
  } else {
    console.log("❌ Staff/Admin access denied")
    res.status(403).json({ error: "Staff or Admin access required" })
  }
}
