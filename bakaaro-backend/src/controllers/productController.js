import Product from "../models/Product.js"

export const getProducts = async (req, res) => {
  const user = req.user
  try {
    console.log("=== GET PRODUCTS DEBUG ===")
    console.log("Fetching products for user:", user.username, "Branch:", user.branch)

    const products = await Product.find({ branch: user.branch })
    console.log("Products found:", products.length)

    if (products.length > 0) {
      console.log(
        "Sample products:",
        products.slice(0, 2).map((p) => ({ name: p.name, branch: p.branch })),
      )
    }

    res.json(products)
  } catch (error) {
    console.error("❌ Get products error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const createProduct = async (req, res) => {
  const { name, brand, category, price, quantity, barcode, description } = req.body
  const user = req.user

  // Only admin can create products
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Only administrators can add products" })
  }

  try {
    console.log("=== CREATE PRODUCT DEBUG ===")
    console.log("Creating product:", name, "for branch:", user.branch)

    // Check if barcode already exists
    const existingProduct = await Product.findOne({ barcode })
    if (existingProduct) {
      return res.status(400).json({ error: "Product with this barcode already exists" })
    }

    const product = new Product({
      name,
      brand,
      category,
      price,
      quantity,
      barcode,
      description: description || "",
      branch: user.branch,
    })

    const savedProduct = await product.save()
    console.log("✅ Created product:", savedProduct._id)
    res.status(201).json(savedProduct)
  } catch (error) {
    console.error("❌ Create product error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const updateProduct = async (req, res) => {
  const { id } = req.params
  const { name, brand, category, price, quantity, barcode, description } = req.body
  const user = req.user

  // Only admin can update products
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Only administrators can update products" })
  }

  try {
    console.log("=== UPDATE PRODUCT DEBUG ===")
    console.log("Updating product:", id)

    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    if (product.branch !== user.branch) {
      return res.status(403).json({ error: "Forbidden: Product belongs to another branch" })
    }

    // Check if barcode is being changed and if it already exists
    if (barcode !== product.barcode) {
      const existingProduct = await Product.findOne({ barcode, _id: { $ne: id } })
      if (existingProduct) {
        return res.status(400).json({ error: "Product with this barcode already exists" })
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, brand, category, price, quantity, barcode, description },
      { new: true, runValidators: true },
    )

    console.log("✅ Updated product:", updatedProduct._id)
    res.json(updatedProduct)
  } catch (error) {
    console.error("❌ Update product error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params
  const user = req.user

  // Only admin can delete products
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Only administrators can delete products" })
  }

  try {
    console.log("=== DELETE PRODUCT DEBUG ===")
    console.log("Deleting product:", id)

    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    if (product.branch !== user.branch) {
      return res.status(403).json({ error: "Forbidden: Product belongs to another branch" })
    }

    await product.deleteOne()
    console.log("✅ Deleted product:", id)
    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("❌ Delete product error:", error)
    res.status(500).json({ error: "Server error", details: error.message })
  }
}
