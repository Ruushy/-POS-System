"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const Staff = () => {
  const { user } = useAuth()
  const [staff, setStaff] = useState([])
  const [branches, setBranches] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [branchFilter, setBranchFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    role: "staff",
    branch: "",
    password: "",
    confirmPassword: "",
    active: true,
  })

  const [errors, setErrors] = useState({})

  const fetchData = async () => {
    console.log("=== FRONTEND FETCH DATA DEBUG ===")
    console.log("Current user:", user)

    setLoading(true)
    setError("")

    if (!user || !user.id) {
      console.log("❌ No user or user ID")
      setError("Please log in to view staff")
      setLoading(false)
      return
    }

    try {
      console.log("Making API requests with user ID:", user.id)

      const staffUrl = "http://localhost:400/api/staff"
      const branchesUrl = "http://localhost:400/api/branches"

      const headers = {
        "Content-Type": "application/json",
        "X-User-ID": user.id,
      }

      console.log("Request headers:", headers)
      console.log("Staff URL:", staffUrl)
      console.log("Branches URL:", branchesUrl)

      const [staffResponse, branchesResponse] = await Promise.all([
        axios.get(staffUrl, { headers }),
        axios.get(branchesUrl, { headers }),
      ])

      console.log("✅ Staff API Response:", {
        status: staffResponse.status,
        dataLength: staffResponse.data.length,
        data: staffResponse.data,
      })

      console.log("✅ Branches API Response:", {
        status: branchesResponse.status,
        dataLength: branchesResponse.data.length,
        data: branchesResponse.data,
      })

      setStaff(staffResponse.data)
      setFilteredStaff(staffResponse.data)
      setBranches(branchesResponse.data)
    } catch (error) {
      console.error("❌ Fetch data error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      })
      setError(error.response?.data?.error || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("=== STAFF COMPONENT MOUNT ===")
    console.log("User state:", user)

    if (user) {
      fetchData()
    } else {
      console.log("❌ No user, setting error")
      setError("Please log in to view staff")
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    let filtered = staff

    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.username.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (roleFilter) {
      filtered = filtered.filter((member) => member.role === roleFilter)
    }

    if (branchFilter) {
      filtered = filtered.filter((member) => member.branch === branchFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((member) => (statusFilter === "active" ? member.active : !member.active))
    }

    setFilteredStaff(filtered)
  }, [staff, searchTerm, roleFilter, branchFilter, statusFilter])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!editingStaff && staff.some((s) => s.username === formData.username)) {
      newErrors.username = "Username already exists"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.branch) {
      newErrors.branch = "Branch is required"
    }

    if (!editingStaff || formData.password) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    const staffData = {
      ...formData,
    }

    delete staffData.confirmPassword

    try {
      console.log("=== SUBMITTING STAFF FORM ===")
      console.log("Staff data:", staffData)
      console.log("Editing staff:", editingStaff)

      if (editingStaff) {
        const response = await axios.put(`http://localhost:400/api/staff/${editingStaff._id}`, staffData, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        console.log("✅ Staff updated:", response.data)
        setStaff((prev) => prev.map((s) => (s._id === editingStaff._id ? response.data : s)))
      } else {
        const response = await axios.post("http://localhost:400/api/staff", staffData, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        console.log("✅ Staff created:", response.data)
        setStaff((prev) => [...prev, response.data])
      }

      resetForm()
      setShowModal(false)

      // Refresh the data to ensure we have the latest
      await fetchData()
    } catch (error) {
      console.error("❌ Save staff error:", error.response?.data || error.message)
      setError(error.response?.data?.error || "Failed to save staff member")
    }
  }

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember)
    setFormData({
      username: staffMember.username,
      name: staffMember.name,
      role: staffMember.role,
      branch: staffMember.branch,
      password: "",
      confirmPassword: "",
      active: staffMember.active,
    })
    setShowModal(true)
  }

  const handleDelete = async (staffId) => {
    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`http://localhost:400/api/staff/${staffId}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        setStaff((prev) => prev.filter((s) => s._id !== staffId))
        await fetchData() // Refresh data
      } catch (error) {
        console.error("Delete staff error:", error.response?.data || error.message)
        setError(error.response?.data?.error || "Failed to delete staff member")
      }
    }
  }

  const toggleStatus = async (staffId) => {
    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    try {
      const response = await axios.patch(
        `http://localhost:400/api/staff/${staffId}/toggle-status`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        },
      )

      setStaff((prev) => prev.map((s) => (s._id === staffId ? response.data : s)))
      await fetchData() // Refresh data
    } catch (error) {
      console.error("Toggle staff status error:", error.response?.data || error.message)
      setError(error.response?.data?.error || "Failed to toggle staff status")
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      role: "staff",
      branch: "",
      password: "",
      confirmPassword: "",
      active: true,
    })
    setEditingStaff(null)
    setErrors({})
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Debug render
  console.log("=== STAFF COMPONENT RENDER ===")
  console.log("Loading:", loading)
  console.log("Error:", error)
  console.log("Staff count:", staff.length)
  console.log("Filtered staff count:", filteredStaff.length)
  console.log("User:", user)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border spinner-border-bakaaro" role="status">
          <span className="visually-hidden">Loading staff...</span>
        </div>
        <div className="ms-3">
          <p>Loading staff data...</p>
          <small className="text-muted">User: {user?.username || "Not logged in"}</small>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Debug Info */}
      {/* <div className="alert alert-info mb-3">
        <strong>Debug Info:</strong>
        <br />
        User: {user?.username} ({user?.role}) - Branch: {user?.branch}
        <br />
        Staff Count: {staff.length} | Filtered: {filteredStaff.length}
        <br />
        Loading: {loading.toString()} | Error: {error || "None"}
      </div> */}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchData}>
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold">Staff Management</h1>
          <p className="text-muted">Manage staff accounts and permissions</p>
        </div>
        <div className="col-auto">
          {user?.role === "admin" && (
            <button
              className="btn btn-bakaaro"
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
            >
              ➕ Add Staff Member
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Total Staff</h6>
                  <h4 className="mb-0">{staff.length}</h4>
                </div>
                <div className="fs-1 opacity-50">👥</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Active Staff</h6>
                  <h4 className="mb-0">{staff.filter((s) => s.active).length}</h4>
                </div>
                <div className="fs-1 opacity-50">✅</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Administrators</h6>
                  <h4 className="mb-0">{staff.filter((s) => s.role === "admin").length}</h4>
                </div>
                <div className="fs-1 opacity-50">👑</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Inactive Staff</h6>
                  <h4 className="mb-0">{staff.filter((s) => !s.active).length}</h4>
                </div>
                <div className="fs-1 opacity-50">⚠️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("")
                  setRoleFilter("")
                  setBranchFilter("")
                  setStatusFilter("")
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Staff Members ({filteredStaff.length})</h5>
        </div>
        <div className="card-body p-0">
          {filteredStaff.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Date Created</th>
                    {user?.role === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staffMember) => (
                    <tr key={staffMember._id}>
                      <td>
                        <div className="fw-medium">{staffMember.name}</div>
                      </td>
                      <td>{staffMember.username}</td>
                      <td>
                        <span className={`badge ${staffMember.role === "admin" ? "bg-primary" : "bg-secondary"}`}>
                          {staffMember.role === "admin" ? "👑 Admin" : "👤 Staff"}
                        </span>
                      </td>
                      <td>{staffMember.branch}</td>
                      <td>
                        <span className={`badge ${staffMember.active ? "bg-success" : "bg-danger"}`}>
                          {staffMember.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{formatDate(staffMember.createdAt)}</td>
                      {user?.role === "admin" && (
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(staffMember)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className={`btn btn-outline-${staffMember.active ? "warning" : "success"}`}
                              onClick={() => toggleStatus(staffMember._id)}
                              title={staffMember.active ? "Deactivate" : "Activate"}
                            >
                              {staffMember.active ? "⏸️" : "▶️"}
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(staffMember._id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">👥</div>
              <h5>No staff members found</h5>
              <p className="text-muted">
                {staff.length === 0 ? "No staff members in your branch" : "Try adjusting your search or filters"}
              </p>
              {user?.role === "admin" && staff.length === 0 && (
                <button
                  className="btn btn-bakaaro"
                  onClick={() => {
                    resetForm()
                    setShowModal(true)
                  }}
                >
                  Add Your First Staff Member
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showModal && user?.role === "admin" && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Username *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role *</label>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Branch *</label>
                      <select
                        className={`form-select ${errors.branch ? "is-invalid" : ""}`}
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Branch</option>
                        {branches
                          .filter((b) => b.active)
                          .map((branch) => (
                            <option key={branch._id} value={branch.name}>
                              {branch.name}
                            </option>
                          ))}
                      </select>
                      {errors.branch && <div className="invalid-feedback">{errors.branch}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Password {editingStaff ? "(leave blank to keep current)" : "*"}
                      </label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingStaff}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Confirm Password {editingStaff ? "" : "*"}</label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={!editingStaff || formData.password}
                      />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
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
                          Active Account
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
                    {editingStaff ? "Update Staff Member" : "Add Staff Member"}
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

export default Staff
