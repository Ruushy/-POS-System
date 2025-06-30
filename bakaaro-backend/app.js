import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./src/routes/auth.js"
import productRouter from "./src/routes/products.js"
import salesRouter from "./src/routes/sales.js"
import staffRouter from "./src/routes/staff.js"
import branchRouter from "./src/routes/branches.js"

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

// CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "X-User-ID"],
  }),
)

// Debug middleware
app.use((req, res, next) => {
  console.log(`=== ${req.method} ${req.path} ===`)
  console.log("Headers:", req.headers)
  console.log("Body:", req.body)
  next()
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/sales", salesRouter)
app.use("/api/staff", staffRouter)
app.use("/api/branches", branchRouter)

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working", timestamp: new Date().toISOString() })
})

// Database connection
mongoose
  .connect(process.env.mongo_uri)
  .then(() => {
    console.log("✅ Connected to database")
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err)
  })

const port = process.env.port || 400

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`)
  console.log(`🔗 API URL: http://localhost:${port}`)
})
