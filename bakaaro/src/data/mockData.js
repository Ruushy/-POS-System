// Mock Users Data
// In a real application, passwords would be hashed and stored securely
export const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123", // In production: hash this password
    name: "Ahmed Hassan",
    role: "admin",
    branch: "Main Store",
    active: true,
    dateCreated: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    username: "staff1",
    password: "staff123", // In production: hash this password
    name: "Fatima Ali",
    role: "staff",
    branch: "Main Store",
    active: true,
    dateCreated: "2024-01-15T00:00:00Z",
  },
  {
    id: 3,
    username: "staff2",
    password: "staff123", // In production: hash this password
    name: "Mohamed Omar",
    role: "staff",
    branch: "Branch 1",
    active: true,
    dateCreated: "2024-02-01T00:00:00Z",
  },
  {
    id: 4,
    username: "staff3",
    password: "staff123", // In production: hash this password
    name: "Amina Yusuf",
    role: "staff",
    branch: "Main Store",
    active: false,
    dateCreated: "2024-01-20T00:00:00Z",
  },
]

// Mock Product Categories
export const mockCategories = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Accessories",
  "Audio",
  "Gaming",
  "Smart Home",
  "Cameras",
]

// Mock Products Data
export const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    price: 999.99,
    quantity: 15,
    barcode: "1234567890123",
    description: "Latest iPhone with A17 Pro chip",
    dateAdded: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Smartphones",
    price: 799.99,
    quantity: 8,
    barcode: "1234567890124",
    description: "Flagship Android smartphone",
    dateAdded: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "MacBook Air M3",
    brand: "Apple",
    category: "Laptops",
    price: 1299.99,
    quantity: 5,
    barcode: "1234567890125",
    description: "13-inch laptop with M3 chip",
    dateAdded: "2024-01-03T00:00:00Z",
  },
  {
    id: 4,
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    price: 1099.99,
    quantity: 12,
    barcode: "1234567890126",
    description: "Premium ultrabook",
    dateAdded: "2024-01-04T00:00:00Z",
  },
  {
    id: 5,
    name: 'iPad Pro 12.9"',
    brand: "Apple",
    category: "Tablets",
    price: 1099.99,
    quantity: 7,
    barcode: "1234567890127",
    description: "Professional tablet with M2 chip",
    dateAdded: "2024-01-05T00:00:00Z",
  },
  {
    id: 6,
    name: "AirPods Pro",
    brand: "Apple",
    category: "Audio",
    price: 249.99,
    quantity: 25,
    barcode: "1234567890128",
    description: "Wireless earbuds with ANC",
    dateAdded: "2024-01-06T00:00:00Z",
  },
  {
    id: 7,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio",
    price: 399.99,
    quantity: 3,
    barcode: "1234567890129",
    description: "Premium noise-canceling headphones",
    dateAdded: "2024-01-07T00:00:00Z",
  },
  {
    id: 8,
    name: "Nintendo Switch OLED",
    brand: "Nintendo",
    category: "Gaming",
    price: 349.99,
    quantity: 0,
    barcode: "1234567890130",
    description: "Portable gaming console",
    dateAdded: "2024-01-08T00:00:00Z",
  },
  {
    id: 9,
    name: "USB-C Cable",
    brand: "Generic",
    category: "Accessories",
    price: 19.99,
    quantity: 50,
    barcode: "1234567890131",
    description: "2m USB-C charging cable",
    dateAdded: "2024-01-09T00:00:00Z",
  },
  {
    id: 10,
    name: "Wireless Charger",
    brand: "Belkin",
    category: "Accessories",
    price: 49.99,
    quantity: 18,
    barcode: "1234567890132",
    description: "15W wireless charging pad",
    dateAdded: "2024-01-10T00:00:00Z",
  },
]

// Mock Sales Data
export const mockSales = [
  {
    id: 1001,
    date: "2024-01-15T10:30:00Z",
    cashier: "Fatima Ali",
    items: [
      { id: 1, name: "iPhone 15 Pro", price: 999.99, quantity: 1, total: 999.99 },
      { id: 6, name: "AirPods Pro", price: 249.99, quantity: 1, total: 249.99 },
    ],
    subtotal: 1249.98,
    tax: 124.99,
    total: 1374.97,
    paymentMethod: "card",
    amountPaid: 1374.97,
    change: 0,
  },
  {
    id: 1002,
    date: "2024-01-15T14:45:00Z",
    cashier: "Mohamed Omar",
    items: [{ id: 2, name: "Samsung Galaxy S24", price: 799.99, quantity: 1, total: 799.99 }],
    subtotal: 799.99,
    tax: 79.99,
    total: 879.98,
    paymentMethod: "mobile",
    amountPaid: 879.98,
    change: 0,
  },
  {
    id: 1003,
    date: "2024-01-16T09:15:00Z",
    cashier: "Fatima Ali",
    items: [
      { id: 9, name: "USB-C Cable", price: 19.99, quantity: 3, total: 59.97 },
      { id: 10, name: "Wireless Charger", price: 49.99, quantity: 1, total: 49.99 },
    ],
    subtotal: 109.96,
    tax: 10.99,
    total: 120.95,
    paymentMethod: "cash",
    amountPaid: 150.0,
    change: 29.05,
  },
  {
    id: 1004,
    date: new Date().toISOString(), // Today's sale
    cashier: "Ahmed Hassan",
    items: [{ id: 4, name: "Dell XPS 13", price: 1099.99, quantity: 1, total: 1099.99 }],
    subtotal: 1099.99,
    tax: 109.99,
    total: 1209.98,
    paymentMethod: "card",
    amountPaid: 1209.98,
    change: 0,
  },
]

// Mock Branches Data
export const mockBranches = [
  {
    id: 1,
    name: "Main Store",
    address: "Bakaaro Market, Mogadishu",
    phone: "+252 61 234 5678",
    manager: "Ahmed Hassan",
    active: true,
  },
  {
    id: 2,
    name: "Branch 1",
    address: "Hamarweyne District, Mogadishu",
    phone: "+252 61 234 5679",
    manager: "Mohamed Omar",
    active: true,
  },
  {
    id: 3,
    name: "Branch 2",
    address: "Hodan District, Mogadishu",
    phone: "+252 61 234 5680",
    manager: "Amina Yusuf",
    active: false,
  },
]

// Business Settings
export const businessSettings = {
  name: "Bakaaro Electronics",
  address: "Bakaaro Market, Mogadishu, Somalia",
  phone: "+252 61 234 5444",
  email: "info@bakaaro.com",
  currency: "USD",
  taxRate: 0.1, // 10%
  logo: null,
}
