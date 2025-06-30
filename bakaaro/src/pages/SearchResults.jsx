"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { mockProducts, mockSales, mockUsers } from "../data/mockData"

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState({
    products: [],
    sales: [],
    staff: [],
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults({ products: [], sales: [], staff: [] })
        setLoading(false)
        return
      }

      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const searchTerm = query.toLowerCase()

      // Search products
      const productResults = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.barcode.includes(searchTerm),
      )

      // Search sales
      const salesResults = mockSales.filter(
        (sale) =>
          sale.id.toString().includes(searchTerm) ||
          sale.cashier.toLowerCase().includes(searchTerm) ||
          sale.items.some((item) => item.name.toLowerCase().includes(searchTerm)),
      )

      // Search staff
      const staffResults = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm) ||
          user.branch.toLowerCase().includes(searchTerm),
      )

      setResults({
        products: productResults,
        sales: salesResults,
        staff: staffResults,
      })

      setLoading(false)
    }

    performSearch()
  }, [query])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { class: "danger", text: "Out of Stock" }
    if (quantity < 10) return { class: "warning", text: "Low Stock" }
    return { class: "success", text: "In Stock" }
  }

  const getTotalResults = () => {
    return results.products.length + results.sales.length + results.staff.length
  }

  const getFilteredResults = () => {
    switch (activeTab) {
      case "products":
        return { products: results.products, sales: [], staff: [] }
      case "sales":
        return { products: [], sales: results.sales, staff: [] }
      case "staff":
        return { products: [], sales: [], staff: results.staff }
      default:
        return results
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border spinner-border-bakaaro" role="status">
          <span className="visually-hidden">Searching...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold">Search Results</h1>
          <p className="text-muted">
            {query ? (
              <>
                Showing results for "<strong>{query}</strong>" ({getTotalResults()} results found)
              </>
            ) : (
              "Enter a search term to find products, sales, or staff"
            )}
          </p>
        </div>
      </div>

      {query && (
        <>
          {/* Filter Tabs */}
          <div className="card mb-4">
            <div className="card-body">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Results ({getTotalResults()})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "products" ? "active" : ""}`}
                    onClick={() => setActiveTab("products")}
                  >
                    Products ({results.products.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "sales" ? "active" : ""}`}
                    onClick={() => setActiveTab("sales")}
                  >
                    Sales ({results.sales.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "staff" ? "active" : ""}`}
                    onClick={() => setActiveTab("staff")}
                  >
                    Staff ({results.staff.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Results */}
          {getTotalResults() > 0 ? (
            <div className="row">
              {/* Products Results */}
              {getFilteredResults().products.length > 0 && (
                <div className="col-12 mb-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Products ({results.products.length})</h5>
                      <Link to="/products" className="btn btn-sm btn-outline-primary">
                        View All Products
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Brand</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredResults().products.map((product) => {
                              const stockStatus = getStockStatus(product.quantity)
                              return (
                                <tr key={product.id}>
                                  <td>
                                    <div>
                                      <div className="fw-medium">{product.name}</div>
                                      <small className="text-muted">#{product.barcode}</small>
                                    </div>
                                  </td>
                                  <td>{product.brand}</td>
                                  <td>
                                    <span className="badge bg-secondary">{product.category}</span>
                                  </td>
                                  <td className="fw-medium">{formatCurrency(product.price)}</td>
                                  <td>{product.quantity}</td>
                                  <td>
                                    <span className={`badge bg-${stockStatus.class}`}>{stockStatus.text}</span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sales Results */}
              {getFilteredResults().sales.length > 0 && (
                <div className="col-12 mb-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Sales ({results.sales.length})</h5>
                      <Link to="/sales" className="btn btn-sm btn-outline-primary">
                        View All Sales
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr>
                              <th>Sale ID</th>
                              <th>Date & Time</th>
                              <th>Cashier</th>
                              <th>Items</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredResults().sales.map((sale) => (
                              <tr key={sale.id}>
                                <td>
                                  <span className="fw-medium">#{sale.id}</span>
                                </td>
                                <td>{formatDate(sale.date)}</td>
                                <td>{sale.cashier}</td>
                                <td>
                                  <span className="badge bg-secondary">
                                    {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                  </span>
                                </td>
                                <td className="fw-bold text-success">{formatCurrency(sale.total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Staff Results */}
              {getFilteredResults().staff.length > 0 && (
                <div className="col-12 mb-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Staff ({results.staff.length})</h5>
                      <Link to="/staff" className="btn btn-sm btn-outline-primary">
                        View All Staff
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Username</th>
                              <th>Role</th>
                              <th>Branch</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredResults().staff.map((staffMember) => (
                              <tr key={staffMember.id}>
                                <td>
                                  <div className="fw-medium">{staffMember.name}</div>
                                </td>
                                <td>{staffMember.username}</td>
                                <td>
                                  <span
                                    className={`badge ${staffMember.role === "admin" ? "bg-primary" : "bg-secondary"}`}
                                  >
                                    {staffMember.role === "admin" ? "👑 Admin" : "👤 Staff"}
                                  </span>
                                </td>
                                <td>{staffMember.branch}</td>
                                <td>
                                  <span className={`badge ${staffMember.active ? "bg-success" : "bg-danger"}`}>
                                    {staffMember.active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">🔍</div>
              <h5>No results found</h5>
              <p className="text-muted">
                No products, sales, or staff members match your search for "<strong>{query}</strong>"
              </p>
              <div className="mt-4">
                <h6>Search Tips:</h6>
                <ul className="list-unstyled text-muted">
                  <li>• Try different keywords</li>
                  <li>• Check your spelling</li>
                  <li>• Use broader search terms</li>
                  <li>• Search by product barcode or sale ID</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-5">
          <div className="fs-1 mb-3">🔍</div>
          <h5>Start your search</h5>
          <p className="text-muted">Use the search bar above to find products, sales, or staff members</p>
          <div className="mt-4">
            <h6>You can search for:</h6>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="row text-start">
                  <div className="col-md-4">
                    <h6 className="text-primary">Products</h6>
                    <ul className="list-unstyled text-muted small">
                      <li>• Product names</li>
                      <li>• Brand names</li>
                      <li>• Categories</li>
                      <li>• Barcodes</li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-success">Sales</h6>
                    <ul className="list-unstyled text-muted small">
                      <li>• Sale IDs</li>
                      <li>• Cashier names</li>
                      <li>• Product names in sales</li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-info">Staff</h6>
                    <ul className="list-unstyled text-muted small">
                      <li>• Staff names</li>
                      <li>• Usernames</li>
                      <li>• Roles</li>
                      <li>• Branch names</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResults
