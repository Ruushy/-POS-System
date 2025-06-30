import bcrypt from "bcryptjs"
import User from "../models/User.js"

export const getStaff = async (req, res) => {
  try {
    console.log("=== GET STAFF DEBUG ===")
    console.log("Request user:", {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      branch: req.user.branch,
    })

    // Get all staff from the same branch
    const staff = await User.find({ branch: req.user.branch }).select("-password")

    console.log("Staff query result:")
    console.log("- Branch searched:", req.user.branch)
    console.log("- Staff found:", staff.length)
    console.log(
      "- Staff details:",
      staff.map((s) => ({ id: s._id, username: s.username, role: s.role, active: s.active })),
    )

    res.json(staff)
  } catch (error) {
    console.error("❌ Get staff error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const createStaff = async (req, res) => {
  try {
    console.log("=== CREATE STAFF DEBUG ===")
    console.log("Request body:", req.body)
    console.log("Request user:", req.user.username)

    const { username, password, name, role, branch, active } = req.body

    // Check if username already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      console.log("❌ Username already exists:", username)
      return res.status(400).json({ error: "Username already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const newStaff = new User({
      username,
      password: hashedPassword,
      name,
      role: role || "staff",
      branch: branch || req.user.branch,
      active: active !== undefined ? active : true,
    })

    const savedStaff = await newStaff.save()
    console.log("✅ Staff created successfully:", savedStaff._id)

    // Return without password
    const staffResponse = savedStaff.toObject()
    delete staffResponse.password

    res.status(201).json(staffResponse)
  } catch (error) {
    console.error("❌ Create staff error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const updateStaff = async (req, res) => {
  try {
    console.log("=== UPDATE STAFF DEBUG ===")
    const { id } = req.params
    const { username, password, name, role, branch, active } = req.body

    console.log("Updating staff ID:", id)
    console.log("Update data:", { username, name, role, branch, active })

    const staff = await User.findById(id)
    if (!staff) {
      console.log("❌ Staff member not found")
      return res.status(404).json({ error: "Staff member not found" })
    }

    // Check if username is being changed and if it already exists
    if (username !== staff.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: id } })
      if (existingUser) {
        console.log("❌ Username already exists:", username)
        return res.status(400).json({ error: "Username already exists" })
      }
    }

    // Prepare update data
    const updateData = {
      username,
      name,
      role: role || "staff",
      branch: branch || req.user.branch,
      active: active !== undefined ? active : true,
    }

    // Only update password if provided
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const updatedStaff = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select(
      "-password",
    )

    console.log("✅ Staff updated successfully:", updatedStaff._id)
    res.json(updatedStaff)
  } catch (error) {
    console.error("❌ Update staff error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const deleteStaff = async (req, res) => {
  try {
    console.log("=== DELETE STAFF DEBUG ===")
    const { id } = req.params

    const staff = await User.findById(id)
    if (!staff) {
      console.log("❌ Staff member not found")
      return res.status(404).json({ error: "Staff member not found" })
    }

    await staff.deleteOne()
    console.log("✅ Staff deleted successfully:", id)
    res.json({ message: "Staff member deleted successfully" })
  } catch (error) {
    console.error("❌ Delete staff error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const toggleStaffStatus = async (req, res) => {
  try {
    console.log("=== TOGGLE STAFF STATUS DEBUG ===")
    const { id } = req.params

    const staff = await User.findById(id)
    if (!staff) {
      console.log("❌ Staff member not found")
      return res.status(404).json({ error: "Staff member not found" })
    }

    staff.active = !staff.active
    await staff.save()

    const staffResponse = staff.toObject()
    delete staffResponse.password

    console.log("✅ Staff status toggled:", id, "New status:", staff.active)
    res.json(staffResponse)
  } catch (error) {
    console.error("❌ Toggle staff status error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}
