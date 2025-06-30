"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

const Products = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [stockFilter, setStockFilter] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity: "",
    barcode: "",
    description: "",
  })

  const categories = ["Smartphones", "Laptops", "Tablets", "Audio", "Gaming", "Accessories"]
  const brands = ["Apple", "Samsung", "Dell", "Sony", "Nintendo", "Belkin", "Generic"]

  const fetchProducts = async () => {
    setLoading(true)
    setError("")

    if (!user || !user.id) {
      setError("Please log in to view products")
      setLoading(false)
      return
    }

    try {
      console.log("Fetching products for user:", user.username)

      const response = await axios.get("http://localhost:400/api/products", {
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": user.id,
        },
      })

      console.log("Fetched products:", response.data.length)
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      console.error("Fetch products error:", error.response?.data || error.message)
      setError(error.response?.data?.error || "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProducts()
    } else {
      setError("Please log in to view products")
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.includes(searchTerm),
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    if (brandFilter) {
      filtered = filtered.filter((product) => product.brand === brandFilter)
    }

    if (stockFilter) {
      if (stockFilter === "low") {
        filtered = filtered.filter((product) => product.quantity < 10)
      } else if (stockFilter === "out") {
        filtered = filtered.filter((product) => product.quantity === 0)
      } else if (stockFilter === "available") {
        filtered = filtered.filter((product) => product.quantity > 0)
      }
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, categoryFilter, brandFilter, stockFilter])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    if (user.role !== "admin") {
      setError("Only administrators can add/edit products")
      return
    }

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
      }

      if (editingProduct) {
        const response = await axios.put(`http://localhost:400/api/products/${editingProduct._id}`, productData, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? response.data : p)))
      } else {
        const response = await axios.post("http://localhost:400/api/products", productData, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        setProducts((prev) => [...prev, response.data])
      }

      resetForm()
      setShowModal(false)
      await fetchProducts() // Refresh the list
    } catch (error) {
      console.error("Save product error:", error.response?.data || error.message)
      setError(error.response?.data?.error || "Failed to save product")
    }
  }

  const handleEdit = (product) => {
    if (user.role !== "admin") {
      setError("Only administrators can edit products")
      return
    }

    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      barcode: product.barcode,
      description: product.description || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (!user || !user.id) {
      setError("Please log in to perform this action")
      return
    }

    if (user.role !== "admin") {
      setError("Only administrators can delete products")
      return
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:400/api/products/${productId}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        })

        setProducts((prev) => prev.filter((p) => p._id !== productId))
        await fetchProducts() // Refresh the list
      } catch (error) {
        console.error("Delete product error:", error.response?.data || error.message)
        setError(error.response?.data?.error || "Failed to delete product")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity: "",
      barcode: "",
      description: "",
    })
    setEditingProduct(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: "Out of Stock", class: "bg-danger" }
    if (quantity < 10) return { text: "Low Stock", class: "bg-warning" }
    return { text: "In Stock", class: "bg-success" }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border spinner-border-bakaaro" role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchProducts}>
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold">Product Management</h1>
          <p className="text-muted">Manage your inventory and product catalog</p>
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
              ➕ Add Product
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
                  <h6 className="card-title opacity-75">Total Products</h6>
                  <h4 className="mb-0">{products.length}</h4>
                </div>
                <div className="fs-1 opacity-50">📦</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">In Stock</h6>
                  <h4 className="mb-0">{products.filter((p) => p.quantity > 0).length}</h4>
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
                  <h6 className="card-title opacity-75">Low Stock</h6>
                  <h4 className="mb-0">{products.filter((p) => p.quantity < 10 && p.quantity > 0).length}</h4>
                </div>
                <div className="fs-1 opacity-50">⚠️</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title opacity-75">Out of Stock</h6>
                  <h4 className="mb-0">{products.filter((p) => p.quantity === 0).length}</h4>
                </div>
                <div className="fs-1 opacity-50">❌</div>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                <option value="">All Stock</option>
                <option value="available">In Stock</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("")
                  setBrandFilter("")
                  setStockFilter("")
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Products ({filteredProducts.length})</h5>
        </div>
        <div className="card-body p-0">
          {filteredProducts.length > 0 ? (
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
                    <th>Barcode</th>
                    {user?.role === "admin" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.quantity)
                    return (
                      <tr key={product._id}>
                        <td>
                          <div className="fw-medium">{product.name}</div>
                          {product.description && <small className="text-muted">{product.description}</small>}
                        </td>
                        <td>{product.brand}</td>
                        <td>{product.category}</td>
                        <td className="fw-bold">{formatCurrency(product.price)}</td>
                        <td>{product.quantity}</td>
                        <td>
                          <span className={`badge ${stockStatus.class}`}>{stockStatus.text}</span>
                        </td>
                        <td>
                          <code>{product.barcode}</code>
                        </td>
                        {user?.role === "admin" && (
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(product)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(product._id)}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">📦</div>
              <h5>No products found</h5>
              <p className="text-muted">
                {products.length === 0 ? "No products in inventory" : "Try adjusting your search or filters"}
              </p>
              {user?.role === "admin" && products.length === 0 && (
                <button
                  className="btn btn-bakaaro"
                  onClick={() => {
                    resetForm()
                    setShowModal(true)
                  }}
                >
                  Add Your First Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && user?.role === "admin" && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingProduct ? "Edit Product" : "Add New Product"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Brand *</label>
                      <select
                        className="form-select"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Barcode *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Quantity *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Optional product description"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-bakaaro">
                    {editingProduct ? "Update Product" : "Add Product"}
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

export default Products
