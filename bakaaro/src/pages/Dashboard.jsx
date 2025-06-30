"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    todaySales: 0,
    totalProducts: 0,
    lowStockItems: 0,
    activeStaff: 0,
    recentTransactions: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError("")

      if (!user || !user.id) {
        setError("Please log in to view dashboard")
        setLoading(false)
        return
      }

      try {
        console.log("Fetching dashboard data for user:", user)

        // Fetch sales and products for all users, staff for admin only
        const requests = [
          axios.get("http://localhost:400/api/sales", {
            headers: {
              "Content-Type": "application/json",
              "X-User-ID": user.id,
            },
          }),
          axios.get("http://localhost:400/api/products", {
            headers: {
              "Content-Type": "application/json",
              "X-User-ID": user.id,
            },
          }),
        ]

        // Only fetch staff data if user is admin
        if (user.role === "admin") {
          requests.push(
            axios.get("http://localhost:400/api/staff", {
              headers: {
                "Content-Type": "application/json",
                "X-User-ID": user.id,
              },
            }),
          )
        }

        const responses = await Promise.all(requests)
        const salesResponse = responses[0]
        const productsResponse = responses[1]
        const staffResponse = responses[2] || { data: [] }

        const sales = salesResponse.data
        const products = productsResponse.data
        const staff = staffResponse.data

        console.log("Dashboard data fetched:", { sales: sales.length, products: products.length, staff: staff.length })

        // Calculate today's sales
        const today = new Date().toDateString()
        const todaySales = sales
          .filter((sale) => new Date(sale.date).toDateString() === today)
          .reduce((sum, sale) => sum + sale.totalPrice, 0)

        // Count low stock items (less than 10)
        const lowStockItems = products.filter((product) => product.quantity < 10).length

        // Count active staff (only for admin)
        const activeStaff = user.role === "admin" ? staff.filter((user) => user.active).length : 0

        // Get recent transactions (last 5)
        const recentTransactions = sales.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

        setStats({
          todaySales,
          totalProducts: products.length,
          lowStockItems,
          activeStaff,
          recentTransactions,
        })
      } catch (error) {
        console.error("Fetch dashboard data error:", error.response?.data || error.message)
        setError(error.response?.data?.error || "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    } else {
      setError("Please log in to view dashboard")
      setLoading(false)
    }
  }, [user])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border spinner-border-bakaaro" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
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

      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold">Welcome back, {user?.name}! 👋</h1>
          <p className="text-muted">Here's what's happening at Bakaaro today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card stats-card text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Today's Sales</h6>
                  <h3 className="mb-0">{formatCurrency(stats.todaySales)}</h3>
                </div>
                <div className="fs-1 opacity-50">💰</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Total Products</h6>
                  <h3 className="mb-0">{stats.totalProducts}</h3>
                </div>
                <div className="fs-1 opacity-50">📦</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Low Stock Items</h6>
                  <h3 className="mb-0">{stats.lowStockItems}</h3>
                </div>
                <div className="fs-1 opacity-50">⚠️</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">{user?.role === "admin" ? "Active Staff" : "Your Role"}</h6>
                  <h3 className="mb-0">{user?.role === "admin" ? stats.activeStaff : user?.role}</h3>
                </div>
                <div className="fs-1 opacity-50">{user?.role === "admin" ? "👥" : "👤"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Quick Actions */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6">
                  <Link to="/pos" className="btn btn-bakaaro w-100">
                    🧾 New Sale
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/products" className="btn btn-outline-primary w-100">
                    📦 View Products
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/sales" className="btn btn-outline-success w-100">
                    📊 View Sales
                  </Link>
                </div>
                <div className="col-6">
                  <Link to="/settings" className="btn btn-outline-info w-100">
                    ⚙️ Settings
                  </Link>
                </div>
                {user?.role === "admin" && (
                  <>
                    <div className="col-6">
                      <Link to="/staff" className="btn btn-outline-warning w-100">
                        👥 Manage Staff
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/branches" className="btn btn-outline-secondary w-100">
                        🏢 Manage Branches
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Transactions</h5>
              <Link to="/sales" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {stats.recentTransactions.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.recentTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <div className="fw-medium">Sale #{transaction._id.slice(-6)}</div>
                        <small className="text-muted">{new Date(transaction.date).toLocaleString()}</small>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-success">{formatCurrency(transaction.totalPrice)}</div>
                        <small className="text-muted">{transaction.items.length} items</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <div className="fs-1 mb-2">📋</div>
                  <p>No recent transactions</p>
                  <Link to="/pos" className="btn btn-sm btn-primary">
                    Make Your First Sale
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <div className="row">
          <div className="col">
            <div className="alert alert-warning" role="alert">
              <h6 className="alert-heading">⚠️ Low Stock Alert</h6>
              <p className="mb-0">
                You have {stats.lowStockItems} items with low stock levels.
                <Link to="/products" className="alert-link ms-1">
                  Check inventory now
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
