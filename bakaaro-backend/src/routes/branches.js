import express from "express"
import { protect, admin } from "../middleware/auth.js"
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
} from "../controllers/branchController.js"

const branchRouter = express.Router()

branchRouter.get("/", protect, getBranches)
branchRouter.post("/", protect, admin, createBranch)
branchRouter.put("/:id", protect, admin, updateBranch)
branchRouter.delete("/:id", protect, admin, deleteBranch)
branchRouter.patch("/:id/toggle-status", protect, admin, toggleBranchStatus)

export default branchRouter
