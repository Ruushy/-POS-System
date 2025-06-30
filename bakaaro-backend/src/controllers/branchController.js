import Branch from "../models/Branch.js"

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find()
    console.log("Fetched branches:", branches)
    res.json(branches)
  } catch (error) {
    console.error("Get branches error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const createBranch = async (req, res) => {
  const { name, address, phone, manager, active } = req.body

  try {
    // Check if branch name already exists
    const existingBranch = await Branch.findOne({ name })
    if (existingBranch) {
      return res.status(400).json({ error: "Branch with this name already exists" })
    }

    const branch = new Branch({
      name,
      address,
      phone,
      manager,
      active: active !== undefined ? active : true,
    })

    const savedBranch = await branch.save()
    console.log("Created branch:", savedBranch)
    res.status(201).json(savedBranch)
  } catch (error) {
    console.error("Create branch error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const updateBranch = async (req, res) => {
  const { id } = req.params
  const { name, address, phone, manager, active } = req.body

  try {
    const branch = await Branch.findById(id)
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" })
    }

    // Check if name is being changed and if it already exists
    if (name !== branch.name) {
      const existingBranch = await Branch.findOne({ name, _id: { $ne: id } })
      if (existingBranch) {
        return res.status(400).json({ error: "Branch with this name already exists" })
      }
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { name, address, phone, manager, active },
      { new: true, runValidators: true },
    )

    console.log("Updated branch:", updatedBranch)
    res.json(updatedBranch)
  } catch (error) {
    console.error("Update branch error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const deleteBranch = async (req, res) => {
  const { id } = req.params

  try {
    const branch = await Branch.findById(id)
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" })
    }

    await branch.deleteOne()
    res.json({ message: "Branch deleted successfully" })
  } catch (error) {
    console.error("Delete branch error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const toggleBranchStatus = async (req, res) => {
  const { id } = req.params

  try {
    const branch = await Branch.findById(id)
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" })
    }

    branch.active = !branch.active
    await branch.save()

    console.log("Toggled branch status:", branch)
    res.json(branch)
  } catch (error) {
    console.error("Toggle branch status error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}
