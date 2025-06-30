"use client"

import { useState } from "react"
import { useTheme } from "../contexts/ThemeContext"
import { businessSettings } from "../data/mockData"

const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState(businessSettings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would save to backend
    localStorage.setItem("bakaaro_settings", JSON.stringify(settings))

    setLoading(false)
    setSaved(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings((prev) => ({
          ...prev,
          logo: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setSettings((prev) => ({
      ...prev,
      logo: null,
    }))
  }

  const resetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings(businessSettings)
    }
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "bakaaro-settings.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importSettings = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result)
          setSettings(importedSettings)
          alert("Settings imported successfully!")
        } catch (error) {
          alert("Error importing settings. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold">Settings</h1>
          <p className="text-muted">Configure your business settings and preferences</p>
        </div>
      </div>

      {/* Success Alert */}
      {saved && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Settings have been saved successfully.
          <button type="button" className="btn-close" onClick={() => setSaved(false)}></button>
        </div>
      )}

      <div className="row">
        {/* Business Information */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Business Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={settings.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={settings.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows="3"
                      value={settings.address}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={settings.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Currency</label>
                    <select
                      className="form-select"
                      name="currency"
                      value={settings.currency}
                      onChange={handleInputChange}
                    >
                      <option value="SOS">SOS - Somali Shilling</option>
                      <option value="USD">USD - US Dollar</option>

                      
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="form-control"
                      name="taxRate"
                      value={settings.taxRate * 100}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          taxRate: Number.parseFloat(e.target.value) / 100,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-4">
                  {/* <button type="submit" className="btn btn-bakaaro me-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetToDefaults}>
                    Reset to Defaults
                  </button> */}
                </div>
              </form>
            </div>
          </div>

          {/* Logo Settings */}
          {/* <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Business Logo</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  {settings.logo ? (
                    <div className="text-center">
                      <img
                        src={settings.logo || "/placeholder.svg"}
                        alt="Business Logo"
                        className="img-fluid mb-3"
                        style={{ maxHeight: "150px" }}
                      />
                      <div>
                        <button className="btn btn-outline-danger btn-sm" onClick={removeLogo}>
                          Remove Logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed rounded">
                      <div className="fs-1 mb-2">🏢</div>
                      <p className="text-muted">No logo uploaded</p>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Upload New Logo</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleLogoUpload} />
                  <small className="form-text text-muted">
                    Recommended size: 200x200px. Supported formats: JPG, PNG, GIF
                  </small>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>

        {/* Appearance & System Settings */}
        <div className="col-lg-4">
          {/* Theme Settings */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Appearance</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Dark Mode</h6>
                  <small className="text-muted">Toggle between light and dark themes</small>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">System Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td>
                      <strong>Version:</strong>
                    </td>
                    <td>1.0.0</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Build:</strong>
                    </td>
                    <td>2025.06.29</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Environment:</strong>
                    </td>
                    <td>Development</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Last Updated:</strong>
                    </td>
                    <td>{new Date().toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Management */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Data Management</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary" onClick={exportSettings}>
                  📤 Export Settings
                </button>
                {/* <label className="btn btn-outline-secondary">
                  📥 Import Settings
                  <input type="file" accept=".json" onChange={importSettings} style={{ display: "none" }} />
                </label> */}
                {/* <button
                  className="btn btn-outline-info"
                  onClick={() => {
                    const data = {
                      products: JSON.parse(localStorage.getItem("bakaaro_products") || "[]"),
                      sales: JSON.parse(localStorage.getItem("bakaaro_sales") || "[]"),
                      settings: JSON.parse(localStorage.getItem("bakaaro_settings") || "{}"),
                    }
                    const dataStr = JSON.stringify(data, null, 2)
                    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
                    const linkElement = document.createElement("a")
                    linkElement.setAttribute("href", dataUri)
                    linkElement.setAttribute("download", "bakaaro-backup.json")
                    linkElement.click()
                  }}
                >
                  💾 Backup All Data
                </button> */}
                {/* <button
                  className="btn btn-outline-warning"
                  onClick={() => {
                    if (window.confirm("This will clear all local data. Are you sure?")) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}
                >
                  🗑️ Clear All Data
                </button> */}
              </div>
            </div>
          </div>

          {/* Support */}
          {/* <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Support</h5>
            </div>
            <div className="card-body">
              <p className="small text-muted mb-3">Need help? Contact our support team or check the documentation.</p>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">📚 Documentation</button>
                <button className="btn btn-outline-success btn-sm">💬 Contact Support</button>
                <button className="btn btn-outline-info btn-sm">🐛 Report Bug</button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Settings
