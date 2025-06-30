"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const NotFound = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="mb-4">
              <div className="display-1 text-primary mb-3">404</div>
              <h2 className="fw-bold mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the
                wrong URL.
              </p>
            </div>

            <div className="mb-4">
              <div className="fs-1 mb-3">🔍</div>
              <p className="text-muted">Don't worry, let's get you back on track!</p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button className="btn btn-outline-secondary" onClick={goBack}>
                ← Go Back
              </button>

              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-bakaaro">
                  🏠 Go to Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn btn-bakaaro">
                  🔐 Go to Login
                </Link>
              )}
            </div>

            {isAuthenticated && (
              <div className="mt-5">
                <h6 className="mb-3">Quick Links</h6>
                <div className="row g-2 justify-content-center">
                  <div className="col-auto">
                    <Link to="/pos" className="btn btn-sm btn-outline-primary">
                      🧾 POS
                    </Link>
                  </div>
                  <div className="col-auto">
                    <Link to="/products" className="btn btn-sm btn-outline-primary">
                      📦 Products
                    </Link>
                  </div>
                  <div className="col-auto">
                    <Link to="/sales" className="btn btn-sm btn-outline-primary">
                      📊 Sales
                    </Link>
                  </div>
                  <div className="col-auto">
                    <Link to="/settings" className="btn btn-sm btn-outline-primary">
                      ⚙️ Settings
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-top">
              <small className="text-muted">
                <strong>Bakaaro Electronics POS System</strong>
                <br />
                If you believe this is an error, please contact support.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
