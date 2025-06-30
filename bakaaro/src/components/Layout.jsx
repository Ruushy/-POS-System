"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"

const Layout = ({ children }) => {
  const { user, logout, hasRole } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊", roles: ["admin", "staff"] },
    { path: "/pos", label: "Point of Sale", icon: "🧾", roles: ["admin", "staff"] },
    { path: "/products", label: "Products", icon: "📦", roles: ["admin", "staff"] },
    { path: "/sales", label: "Sales History", icon: "📜", roles: ["admin", "staff"] },
    { path: "/staff", label: "Staff Management", icon: "👥", roles: ["admin"] },
    { path: "/branches", label: "Branches", icon: "📍", roles: ["admin"] },
    { path: "/settings", label: "Settings", icon: "🛠️", roles: ["admin", "staff"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role))

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div className={`col-md-3 col-lg-2 sidebar ${sidebarOpen ? "show" : ""}`}>
          <div className="p-3">
            {/* Brand */}
            <div className="text-center mb-4">
              <h3 className="text-white fw-bold">Bakaaro</h3>
              <small className="text-white-50">Electronics POS</small>
            </div>

            {/* User Info */}
            <div className="text-center mb-4 p-3 bg-white bg-opacity-10 rounded">
              <div className="text-white">
                <strong>{user?.name}</strong>
              </div>
              <small className="text-white-50">{user?.role === "admin" ? "Administrator" : "Staff Member"}</small>
              <div className="text-white-50 small">Branch: {user?.branch}</div>
            </div>

            {/* Navigation */}
            <nav className="nav flex-column">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="me-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="mt-auto pt-4">
              <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 main-content">
          {/* Top Navigation */}
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container-fluid">
              {/* Mobile menu toggle */}
              <button className="btn btn-outline-secondary d-md-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
              </button>

              {/* Search */}
              <form className="d-flex mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search products, sales, staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="submit">
                  🔍
                </button>
              </form>

              {/* Theme toggle */}
              <button
                className="btn btn-outline-secondary"
                onClick={toggleTheme}
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>
          </nav>

          {/* Page Content */}
          <div className="p-4">{children}</div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
