"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const POS = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // New state for payment method

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      console.log("User object:", user);

      if (!user || !user.id) {
        setError("Please log in to access POS");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:400/api/products", {
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user.id,
          },
        });
        console.log("Fetched products:", response.data);
        setProducts(response.data.filter((p) => p.quantity > 0));
        setFilteredProducts(response.data.filter((p) => p.quantity > 0));
      } catch (error) {
        console.error("Fetch products error:", error.response?.data || error.message);
        setError(error.response?.data?.error || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProducts();
    } else {
      setError("Please log in to access POS");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode.includes(searchTerm)
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);
      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setPaymentMethod("Cash"); // Reset payment method
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const processSale = async () => {
    console.log("Cart:", cart, "Payment Method:", paymentMethod);
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    if (!user || !user.id) {
      setError("Please log in to perform this action");
      return;
    }

    const saleData = {
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      paymentMethod,
    };

    try {
      const response = await axios.post("http://localhost:400/api/sales", saleData, {
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": user.id,
        },
      });
      console.log("Processed sale:", response.data);
      setLastSale(response.data);
      setShowReceipt(true);

      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((item) => item._id === p._id);
          return cartItem ? { ...p, quantity: p.quantity - cartItem.quantity } : p;
        })
      );
      setFilteredProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((item) => item._id === p._id);
          return cartItem ? { ...p, quantity: p.quantity - cartItem.quantity } : p;
        }).filter((p) => p.quantity > 0)
      );
      clearCart();
    } catch (error) {
      console.error("Process sale error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Failed to process sale");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border spinner-border-bakaaro" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold">Point of Sale</h1>
          <p className="text-muted">Process sales and manage transactions</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product._id} className="col">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text text-muted">{product.brand}</p>
                          <p className="card-text">
                            <span className="badge bg-secondary">{product.category}</span>
                          </p>
                          <p className="card-text fw-bold">{formatCurrency(product.price)}</p>
                          <p className="card-text">Stock: {product.quantity}</p>
                          <button
                            className="btn btn-bakaaro w-100"
                            onClick={() => addToCart(product)}
                            disabled={product.quantity === 0}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <div className="fs-1 mb-3">📦</div>
                    <h5>No products found</h5>
                    <p className="text-muted">Try adjusting your search</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Cart</h5>
            </div>
            <div className="card-body">
              {cart.length > 0 ? (
                <>
                  <ul className="list-group mb-3">
                    {cart.map((item) => (
                      <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <div>{item.name}</div>
                          <small className="text-muted">{formatCurrency(item.price)} × {item.quantity}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            className="form-control form-control-sm me-2"
                            style={{ width: "60px" }}
                            value={item.quantity}
                            onChange={(e) => updateCartQuantity(item._id, parseInt(e.target.value))}
                            min="1"
                          />
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFromCart(item._id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="EVC Plus">EVC Plus</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <button className="btn btn-bakaaro w-100 mb-2" onClick={processSale}>
                    Complete Sale
                  </button>
                  <button className="btn btn-outline-secondary w-100" onClick={clearCart}>
                    Clear Cart
                  </button>
                </>
              ) : (
                <p className="text-center text-muted">Cart is empty</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReceipt && lastSale && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sale Complete</h5>
                <button type="button" className="btn-close" onClick={() => setShowReceipt(false)}></button>
              </div>
              <div className="modal-body">
                <div className="receipt">
                  <div className="text-center mb-3">
                    <h4>BAKAARO ELECTRONICS</h4>
                    <p className="mb-1">Mogadishu, Somalia</p>
                    <p className="mb-1">Tel: +252 61 234 5678</p>
                    <hr />
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">Receipt #: {lastSale._id}</p>
                    <p className="mb-1">Date: {formatDate(lastSale.date)}</p>
                    <p className="mb-1">Cashier: {user.username}</p>
                    <p className="mb-1">Payment Method: {lastSale.paymentMethod}</p>
                    <hr />
                  </div>
                  <div className="mb-3">
                    {console.log('Last sale items:', lastSale.items)}
                    {lastSale.items.map((item, index) => (
                      <div key={item._id || index} className="d-flex justify-content-between">
                        <div>
                          <div>{item.productId?.name || "Unknown Product"}</div>
                          <small>
                            {formatCurrency(item.price)} × {item.quantity}
                          </small>
                        </div>
                        <div>{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                    <hr />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(lastSale.totalPrice)}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p>Thank you for your business!</p>
                    <p>Visit us again soon</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReceipt(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-bakaaro" onClick={() => window.print()}>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;