import express from "express"
import { protect, admin } from "../middleware/auth.js"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js"

const productRouter = express.Router()

console.log("=== PRODUCT ROUTES LOADED ===")

// All authenticated users can view products
productRouter.get("/", protect, getProducts)

// Only admin can modify products
productRouter.post("/", protect, admin, createProduct)
productRouter.put("/:id", protect, admin, updateProduct)
productRouter.delete("/:id", protect, admin, deleteProduct)

export default productRouter
