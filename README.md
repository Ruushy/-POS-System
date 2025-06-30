🏪 Bakaaro POS System 

A comprehensive Point of Sale (POS) system designed for electronics retail businesses, featuring inventory management, sales tracking, staff management, and multi-branch support. 

 

📋 Table of Contents 

Features 

Technologies Used 

Prerequisites 

Installation 

Usage 

API Documentation 

Project Structure 

Contributing 

License 

Contact 

✨ Features 

🔐 Authentication & Authorization 

Role-based Access Control: Admin, Staff, and Cashier roles 

Secure Authentication: Password hashing with bcryptjs 

Session Management: Persistent login sessions 

Branch-based Access: Users can only access their branch data 

📦 Inventory Management 

Product CRUD Operations: Add, view, edit, and delete products 

Category Management: Organize products by categories and brands 

Stock Tracking: Real-time inventory levels 

Low Stock Alerts: Automatic notifications for low inventory 

Barcode Support: Unique barcode for each product 

💰 Sales Management 

Point of Sale Interface: User-friendly POS system 

Sales Recording: Track all transactions with detailed information 

Receipt Generation: Digital receipts for customers 

Sales History: Complete transaction history 

Real-time Inventory Updates: Automatic stock deduction after sales 

👥 Staff Management 

User Management: Add, edit, and manage staff accounts 

Role Assignment: Assign appropriate roles to users 

Branch Assignment: Assign staff to specific branches 

Account Status Control: Activate/deactivate user accounts 

🏢 Multi-Branch Support 

Branch Management: Manage multiple store locations 

Branch-specific Data: Isolated data for each branch 

Branch Analytics: Individual branch performance tracking 

🎨 User Interface 

Responsive Design: Works on desktop, tablet, and mobile devices 

Dark/Light Mode: Toggle between themes 

Modern UI: Clean and intuitive interface using Bootstrap 5 

Real-time Updates: Dynamic data updates without page refresh 

📊 Dashboard & Analytics 

Sales Dashboard: Overview of daily sales and performance 

Inventory Overview: Quick view of stock levels 

Staff Overview: Active staff and role distribution 

Quick Actions: Fast access to common tasks 

🛠 Technologies Used 

Frontend 

React.js - JavaScript library for building user interfaces 

React Router - Client-side routing 

Bootstrap 5 - CSS framework for responsive design 

Axios - HTTP client for API requests 

Context API - State management 

Backend 

Node.js - JavaScript runtime environment 

Express.js - Web application framework 

MongoDB - NoSQL database 

Mongoose - MongoDB object modeling 

bcryptjs - Password hashing library 

CORS - Cross-origin resource sharing 

dotenv - Environment variable management 

Development Tools 

Vite - Frontend build tool 

Nodemon - Development server auto-restart 

ESLint - Code linting 

Git - Version control 

📋 Prerequisites 

Before running this project, make sure you have the following installed: 

Node.js (v14 or higher) 

npm or yarn 

MongoDB (local installation or MongoDB Atlas account) 

Git 

🚀 Installation 

1. Clone the Repository 

git clone https://github.com/Ruushy/-POS-System 
cd bakaaro 
  

2. Backend Setup 

# Navigate to backend directory 
cd bakaaro-backend 
 
# Install dependencies 
npm install 
 
# Create environment file 
cp .env.example .env 
 
# Edit .env file with your MongoDB connection string 
# mongo_uri=mongodb://localhost:27017/bakaaro-pos 
# port=400 
  

3. Frontend Setup 

# Navigate to frontend directory (from project root) 
cd frontend 
 
# Install dependencies 
npm install 
  

4. Database Setup 

# From backend directory, run the seed script to populate initial data 
npm run seed 
  

🎯 Usage 

Starting the Application 

Start the Backend Server 

cd backend 
npm start 
# Server will run on http://localhost:400 
  

Start the Frontend Development Server 

cd frontend 
npm run dev 
# Application will run on http://localhost:5173 
  

Default Login Credentials 

After running the seed script, you can use these credentials: 

Admin Account: 

Username: admin1 

Password: admin123 

Staff Account: 

Username: staff1 

Password: staff123 

Key Workflows 

1. Admin Workflow 

Login with admin credentials 

Manage staff accounts in Staff Management 

Add/edit products in Product Management 

Manage branches in Branch Management 

View sales reports and analytics 

2. Staff Workflow 

Login with staff credentials 

Access POS system for sales 

View product inventory 

Process customer transactions 

View sales history 

📚 API Documentation 

Authentication Endpoints 

POST /api/auth/login     - User login 
POST /api/auth/register  - User registration (admin only) 
  

Product Endpoints 

GET    /api/products     - Get all products (branch-specific) 
POST   /api/products     - Create new product (admin only) 
PUT    /api/products/:id - Update product (admin only) 
DELETE /api/products/:id - Delete product (admin only) 
  

Staff Endpoints 

GET    /api/staff        - Get all staff (branch-specific) 
POST   /api/staff        - Create new staff (admin only) 
PUT    /api/staff/:id    - Update staff (admin only) 
DELETE /api/staff/:id    - Delete staff (admin only) 
PATCH  /api/staff/:id/toggle-status - Toggle staff status (admin only) 
  

Branch Endpoints 

GET    /api/branches     - Get all branches 
POST   /api/branches     - Create new branch (admin only) 
PUT    /api/branches/:id - Update branch (admin only) 
DELETE /api/branches/:id - Delete branch (admin only) 
  

Sales Endpoints 

GET  /api/sales          - Get all sales (branch-specific) 
POST /api/sales          - Create new sale 
GET  /api/sales/:id      - Get specific sale 
  

📁 Project Structure 

bakaaro-pos/ 
├── backend/ 
│   ├── src/ 
│   │   ├── controllers/     # Business logic 
│   │   ├── models/          # Database schemas 
│   │   ├── routes/          # API endpoints 
│   │   └── middleware/      # Authentication middleware 
│   ├── scripts/ 
│   │   └── seed-data.js     # Database seeding 
│   ├── app.js               # Main server file 
│   └── package.json 
├── frontend/ 
│   ├── src/ 
│   │   ├── components/      # Reusable components 
│   │   ├── contexts/        # React contexts 
│   │   ├── pages/           # Main application pages 
│   │   ├── App.jsx          # Main app component 
│   │   └── main.jsx         # Entry point 
│   ├── public/ 
│   └── package.json 
└── README.md 
  

🤝 Contributing 

We welcome contributions to the Bakaaro POS system! Here's how you can help: 

Getting Started 

Fork the repository 

Create a feature branch (git checkout -b feature/AmazingFeature) 

Commit your changes (git commit -m 'Add some AmazingFeature') 

Push to the branch (git push origin feature/AmazingFeature) 

Open a Pull Request 

Contribution Guidelines 

Follow the existing code style and conventions 

Write clear, descriptive commit messages 

Add comments for complex logic 

Test your changes thoroughly 

Update documentation as needed 

Areas for Contribution 

🐛 Bug fixes 

✨ New features 

📚 Documentation improvements 

🎨 UI/UX enhancements 

⚡ Performance optimizations 

🧪 Test coverage improvements 

📄 License 

 
 
Copyright (c) 2024 Bakaaro POS 
 
Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use. 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions: 
 
 
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE. 
  

📞 Contact 

Project Maintainer: [Abdi wali ahmed] 

Email: arkani6563@gmail.com 

GitHub: https://github.com/Ruushy 

Project Link: https://github.com/yourusername/bakaaro-pos 

 

🙏 Acknowledgments 

ALhamdolilah 

Inspired by real-world POS system requirements 

Built with modern web development best practices 

Special thanks to the open-source community for the amazing tools and libraries 

 

⭐ If you find this project helpful, please consider giving it a star on GitHub! 

🔄 Recent Updates 

Version 1.0.0 (Latest) 

✅ Complete POS system implementation 

✅ Role-based authentication 

✅ Multi-branch support 

✅ Inventory management 

✅ Sales tracking 

✅ Staff management 

✅ Dark/Light theme support 

✅ Responsive design 

✅ Real-time updates 

 
 
