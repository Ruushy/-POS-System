"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import ErrorBoundary from "../components/ErrorBoundary";

const Sales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    paymentMethod: "Cash", // Default to Cash
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      console.log("User object:", user);

      if (!user || !user.id) {
        setError("Please log in to view sales");
        setLoading(false);
        return;
      }

      try {
        const salesResponse = await axios.get("http://localhost:400/api/sales", {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        });
        console.log("Fetched sales:", salesResponse.data);
        setSales(salesResponse.data);
        setFilteredSales(salesResponse.data);

        const productsResponse = await axios.get("http://localhost:400/api/products", {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        });
        console.log("Fetched products:", productsResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Fetch data error:", error.response?.data || error.message);
        setError(error.response?.data?.error || "Failed to fetch sales or products");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setError("Please log in to view sales");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let filtered = sales;

    if (dateFrom) {
      filtered = filtered.filter((sale) => new Date(sale.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter((sale) => new Date(sale.date) <= new Date(dateTo + "T23:59:59"));
    }

    setFilteredSales(filtered);
  }, [sales, dateFrom, dateTo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user || !user.id) {
      setError("Please log in to perform this action");
      return;
    }

    if (!formData.productId || !formData.quantity || !formData.paymentMethod) {
      setError("Please select a product, enter a quantity, and choose a payment method");
      return;
    }

    const saleData = {
      items: [
        {
          productId: formData.productId,
          quantity: Number.parseInt(formData.quantity),
        },
      ],
      paymentMethod: formData.paymentMethod,
    };

    try {
      const response = await axios.post("http://localhost:400/api/sales", saleData, {
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": user.id,
        },
      });
      console.log("Added sale:", response.data);
      setSales((prev) => [...prev, response.data]);
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Save sale error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to save sale");
    }
  };

  const handleDelete = async (saleId) => {
    if (!user || !user.id) {
      setError("Please log in to perform this action");
      return;
    }

    if (user.role !== "admin") {
      setError("Only admins can delete sales");
      return;
    }

    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await axios.delete(`http://localhost:400/api/sales/${saleId}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        });
        console.log("Deleted sale ID:", saleId);
        setSales((prev) => prev.filter((s) => s._id !== saleId));
      } catch (error) {
        console.error("Delete sale error:", error.response?.data || error.message);
        setError(error.response?.data?.error || "Failed to delete sale");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      productId: "",
      quantity: "",
      paymentMethod: "Cash",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getTotalSales = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  };

  const getTotalItemsSold = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border spinner-border-bakaaro" role="status">
          <span className="visually-hidden">Loading sales...</span>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="fade-in">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row mb-4">
          <div className="col">
            <h1 className="h3 fw-bold">Sales History</h1>
            <p className="text-muted">View and manage all sales transactions</p>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-bakaaro"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              ➕ Record Sale
            </button>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title opacity-75">Total Sales</h6>
                    <h4 className="mb-0">{filteredSales.length}</h4>
                  </div>
                  <div className="fs-1 opacity-50">📊</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title opacity-75">Total Revenue</h6>
                    <h4 className="mb-0">{formatCurrency(getTotalSales())}</h4>
                  </div>
                  <div className="fs-1 opacity-50">💰</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title opacity-75">Avg. Sale</h6>
                    <h4 className="mb-0">
                      {filteredSales.length > 0 ? formatCurrency(getTotalSales() / filteredSales.length) : "$0.00"}
                    </h4>
                  </div>
                  <div className="fs-1 opacity-50">📈</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title opacity-75">Items Sold</h6>
                    <h4 className="mb-0">{getTotalItemsSold()}</h4>
                  </div>
                  <div className="fs-1 opacity-50">📦</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label"> </label>
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Sales Transactions ({filteredSales.length})</h5>
          </div>
          <div className="card-body p-0">
            {filteredSales.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Products</th>
                      <th>Payment Method</th>
                      <th>Total Price</th>
                      <th>Date</th>
                      <th>Branch</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale._id}>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {sale.items && Array.isArray(sale.items) && sale.items.length > 0 ? (
                              sale.items.map((item, index) => (
                                <li key={item._id || index}>
                                  {item.productId && item.productId.name
                                    ? `${item.productId.name} (${item.productId.brand}) × ${item.quantity}`
                                    : `Unknown Product × ${item.quantity}`}
                                </li>
                              ))
                            ) : (
                              <li>No items</li>
                            )}
                          </ul>
                        </td>
                        <td>{sale.paymentMethod || "Unknown"}</td>
                        <td className="fw-medium">{formatCurrency(sale.totalPrice)}</td>
                        <td>{formatDate(sale.date)}</td>
                        <td>{sale.branch}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(sale._id)}
                              disabled={user?.role !== "admin"}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="fs-1 mb-3">🛒</div>
                <h5>No sales found</h5>
                <p className="text-muted">Try adjusting your date filters</p>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Record New Sale</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Product *</label>
                        <select
                          className="form-select"
                          name="productId"
                          value={formData.productId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product._id} value={product._id}>
                              {product.name} ({product.brand}) - {formatCurrency(product.price)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Quantity *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          required
                          min="1"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Payment Method *</label>
                        <select
                          className="form-select"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Cash">Cash</option>
                          <option value="EVC Plus">EVC Plus</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-bakaaro">
                      Record Sale
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Sales;