import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import User from "../src/models/User.js"
import Product from "../src/models/Product.js"
import Branch from "../src/models/Branch.js"

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.mongo_uri)
    console.log("Connected to database")

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    await Branch.deleteMany({})
    console.log("Cleared existing data")

    // Create branches
    const branches = await Branch.insertMany([
      {
        name: "Main Branch",
        address: "Bakaaro Market, Mogadishu",
        phone: "+252 61 234 5678",
        manager: "Ahmed Hassan",
        active: true,
      },
      {
        name: "Branch A",
        address: "Hamarweyne District, Mogadishu",
        phone: "+252 61 234 5679",
        manager: "Mohamed Omar",
        active: true,
      },
    ])

    console.log("Branches created:", branches.length)

    // Create users with correct roles
    const hashedAdminPassword = await bcrypt.hash("admin123", 12)
    const hashedStaffPassword = await bcrypt.hash("staff123", 12)

    const users = await User.insertMany([
      {
        username: "admin1",
        password: hashedAdminPassword,
        name: "Ahmed Hassan",
        role: "admin",
        branch: "Main Branch",
        active: true,
      },
      {
        username: "admin",
        password: hashedAdminPassword,
        name: "Admin User",
        role: "admin",
        branch: "Main Branch",
        active: true,
      },
      {
        username: "staff1",
        password: hashedStaffPassword,
        name: "Fatima Ali",
        role: "staff",
        branch: "Main Branch",
        active: true,
      },
      {
        username: "staff2",
        password: hashedStaffPassword,
        name: "Mohamed Omar",
        role: "staff",
        branch: "Branch A",
        active: true,
      },
      {
        username: "cashier1",
        password: hashedStaffPassword,
        name: "Amina Hassan",
        role: "staff",
        branch: "Main Branch",
        active: true,
      },
    ])

    console.log("Users created:", users.length)

    // Create products for Main Branch
    const mainBranchProducts = await Product.insertMany([
      {
        name: "iPhone 15 Pro",
        brand: "Apple",
        category: "Smartphones",
        price: 999.99,
        quantity: 15,
        barcode: "1234567890123",
        description: "Latest iPhone with A17 Pro chip",
        branch: "Main Branch",
      },
      {
        name: "Samsung Galaxy S24",
        brand: "Samsung",
        category: "Smartphones",
        price: 799.99,
        quantity: 8,
        barcode: "1234567890124",
        description: "Flagship Android smartphone",
        branch: "Main Branch",
      },
      {
        name: "MacBook Air M3",
        brand: "Apple",
        category: "Laptops",
        price: 1299.99,
        quantity: 5,
        barcode: "1234567890125",
        description: "13-inch laptop with M3 chip",
        branch: "Main Branch",
      },
      {
        name: "Dell XPS 13",
        brand: "Dell",
        category: "Laptops",
        price: 1099.99,
        quantity: 12,
        barcode: "1234567890126",
        description: "Premium ultrabook",
        branch: "Main Branch",
      },
      {
        name: 'iPad Pro 12.9"',
        brand: "Apple",
        category: "Tablets",
        price: 1099.99,
        quantity: 7,
        barcode: "1234567890127",
        description: "Professional tablet with M2 chip",
        branch: "Main Branch",
      },
      {
        name: "AirPods Pro",
        brand: "Apple",
        category: "Audio",
        price: 249.99,
        quantity: 25,
        barcode: "1234567890128",
        description: "Wireless earbuds with ANC",
        branch: "Main Branch",
      },
      {
        name: "Sony WH-1000XM5",
        brand: "Sony",
        category: "Audio",
        price: 399.99,
        quantity: 3,
        barcode: "1234567890129",
        description: "Premium noise-canceling headphones",
        branch: "Main Branch",
      },
      {
        name: "Nintendo Switch OLED",
        brand: "Nintendo",
        category: "Gaming",
        price: 349.99,
        quantity: 0,
        barcode: "1234567890130",
        description: "Portable gaming console",
        branch: "Main Branch",
      },
      {
        name: "USB-C Cable",
        brand: "Generic",
        category: "Accessories",
        price: 19.99,
        quantity: 50,
        barcode: "1234567890131",
        description: "2m USB-C charging cable",
        branch: "Main Branch",
      },
      {
        name: "Wireless Charger",
        brand: "Belkin",
        category: "Accessories",
        price: 49.99,
        quantity: 18,
        barcode: "1234567890132",
        description: "15W wireless charging pad",
        branch: "Main Branch",
      },
    ])

    // Create products for Branch A
    const branchAProducts = await Product.insertMany([
      {
        name: "iPhone 14",
        brand: "Apple",
        category: "Smartphones",
        price: 699.99,
        quantity: 10,
        barcode: "1234567890133",
        description: "Previous generation iPhone",
        branch: "Branch A",
      },
      {
        name: "Samsung Galaxy A54",
        brand: "Samsung",
        category: "Smartphones",
        price: 449.99,
        quantity: 20,
        barcode: "1234567890134",
        description: "Mid-range Android smartphone",
        branch: "Branch A",
      },
      {
        name: "HP Pavilion 15",
        brand: "Dell",
        category: "Laptops",
        price: 699.99,
        quantity: 8,
        barcode: "1234567890135",
        description: "Budget-friendly laptop",
        branch: "Branch A",
      },
      {
        name: "iPad Air",
        brand: "Apple",
        category: "Tablets",
        price: 599.99,
        quantity: 12,
        barcode: "1234567890136",
        description: "Lightweight tablet",
        branch: "Branch A",
      },
      {
        name: "AirPods 3rd Gen",
        brand: "Apple",
        category: "Audio",
        price: 179.99,
        quantity: 15,
        barcode: "1234567890137",
        description: "Standard wireless earbuds",
        branch: "Branch A",
      },
      {
        name: "Samsung Galaxy Tab S9",
        brand: "Samsung",
        category: "Tablets",
        price: 799.99,
        quantity: 6,
        barcode: "1234567890138",
        description: "Premium Android tablet",
        branch: "Branch A",
      },
      {
        name: "JBL Flip 6",
        brand: "JBL",
        category: "Audio",
        price: 129.99,
        quantity: 12,
        barcode: "1234567890139",
        description: "Portable Bluetooth speaker",
        branch: "Branch A",
      },
    ])

    console.log("Products created for Main Branch:", mainBranchProducts.length)
    console.log("Products created for Branch A:", branchAProducts.length)
    console.log("Total products created:", mainBranchProducts.length + branchAProducts.length)
    console.log("Seed data created successfully!")

    // Display created users for reference
    console.log("\n=== CREATED USERS ===")
    users.forEach((user) => {
      console.log(`Username: ${user.username} | Role: ${user.role} | Branch: ${user.branch}`)
    })

    process.exit(0)
  } catch (error) {
    console.error("Seed data error:", error)
    process.exit(1)
  }
}

seedData()
