"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const Branches = () => {
  const { user } = useAuth()
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    manager: "",
    active: true,
  })

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true)
      setError("")

      if (!user || !user.id) {
        setError("Please log in to view branches")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get("http://localhost:400/api/branches", {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        console.log("Fetched branches:", response.data)
        setBranches(response.data)
      } catch (error) {
        console.error("Fetch branches error:", error.response?.data || error.message)
        setError(error.response?.data?.error || "Failed to fetch branches")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBranches()
    } else {
      setError("Please log in to view branches")
      setLoading(false)
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    try {
      if (editingBranch) {
        const response = await axios.put(`http://localhost:400/api/branches/${editingBranch._id}`, formData, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        setBranches((prev) => prev.map((b) => (b._id === editingBranch._id ? response.data : b)))
      } else {
        const response = await axios.post("http://localhost:400/api/branches", formData, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        setBranches((prev) => [...prev, response.data])
      }

      resetForm()
      setShowModal(false)
    } catch (error) {
      console.error("Save branch error:", error.response?.data || error.message)
      setError(error.response?.data?.error || "Failed to save branch")
    }
  }

  const handleEdit = (branch) => {
    setEditingBranch(branch)
    setFormData({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      manager: branch.manager,
      active: branch.active,
    })
    setShowModal(true)
  }

  const handleDelete = async (branchId) => {
    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await axios.delete(`http://localhost:400/api/branches/${branchId}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        setBranches((prev) => prev.filter((b) => b._id !== branchId))
      } catch (error) {
        console.error("Delete branch error:", error.response?.data || error.message)
        setError(error.response?.data?.error || "Failed to delete branch")
      }
    }
  }

  const toggleStatus = async (branchId) => {
    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    try {
      const response = await axios.patch(
        `http://localhost:400/api/branches/${branchId}/toggle-status`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        },
      )

      setBranches((prev) => prev.map((b) => (b._id === branchId ? response.data : b)))
    } catch (error) {
      console.error("Toggle branch status error:", error.response?.data || error.message)
      setError(error.response?.data?.error || "Failed to toggle branch status")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      manager: "",
      active: true,
    })
    setEditingBranch(null)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border spinner-border-bakaaro" role="status">
          <span className="visually-hidden">Loading branches...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold">Branch Management</h1>
          <p className="text-muted">Manage store branches and locations</p>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-bakaaro"
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
          >
            ➕ Add Branch
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Total Branches</h6>
                  <h4 className="mb-0">{branches.length}</h4>
                </div>
                <div className="fs-1 opacity-50">🏢</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Active Branches</h6>
                  <h4 className="mb-0">{branches.filter((b) => b.active).length}</h4>
                </div>
                <div className="fs-1 opacity-50">✅</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Inactive Branches</h6>
                  <h4 className="mb-0">{branches.filter((b) => !b.active).length}</h4>
                </div>
                <div className="fs-1 opacity-50">⚠️</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Locations</h6>
                  <h4 className="mb-0">Mogadishu</h4>
                </div>
                <div className="fs-1 opacity-50">📍</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="row">
        {branches.map((branch) => (
          <div key={branch._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="card-title mb-0">{branch.name}</h6>
                <span className={`badge ${branch.active ? "bg-success" : "bg-danger"}`}>
                  {branch.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <small className="text-muted">Address</small>
                  <div>{branch.address}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Phone</small>
                  <div>{branch.phone}</div>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Manager</small>
                  <div>{branch.manager}</div>
                </div>
              </div>
              <div className="card-footer">
                <div className="btn-group w-100">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(branch)}>
                    ✏️ Edit
                  </button>
                  <button
                    className={`btn btn-outline-${branch.active ? "warning" : "success"} btn-sm`}
                    onClick={() => toggleStatus(branch._id)}
                  >
                    {branch.active ? "⏸️ Deactivate" : "▶️ Activate"}
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(branch._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="text-center py-5">
          <div className="fs-1 mb-3">🏢</div>
          <h5>No branches found</h5>
          <p className="text-muted">Add your first branch to get started</p>
        </div>
      )}

      {/* Add/Edit Branch Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingBranch ? "Edit Branch" : "Add New Branch"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Branch Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address *</label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Manager *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="manager"
                        value={formData.manager}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="active"
                          name="active"
                          checked={formData.active}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="active">
                          Active Branch
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-bakaaro">
                    {editingBranch ? "Update Branch" : "Add Branch"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Branches
