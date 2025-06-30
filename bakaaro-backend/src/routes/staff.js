import express from "express"
import { protect, admin } from "../middleware/auth.js"
import { getStaff, createStaff, updateStaff, deleteStaff, toggleStaffStatus } from "../controllers/staffController.js"

const staffRouter = express.Router()

console.log("=== STAFF ROUTES LOADED ===")

// All authenticated users can view staff in their branch
staffRouter.get("/", protect, getStaff)

// Only admin can modify staff
staffRouter.post("/", protect, admin, createStaff)
staffRouter.put("/:id", protect, admin, updateStaff)
staffRouter.delete("/:id", protect, admin, deleteStaff)
staffRouter.patch("/:id/toggle-status", protect, admin, toggleStaffStatus)

export default staffRouter
