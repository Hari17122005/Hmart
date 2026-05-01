# H Mart - E-Commerce Platform

A full-stack, modern e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). H Mart provides a seamless shopping experience for users, featuring real-time cart management, beautiful smooth animations, precise product categories, and a secure backend capable of role-based access control (Admin vs. User).

## ✨ Features

### Client-Side (Frontend)
*   **Modern Interactive UI:** Built using React & Tailwind CSS.
*   **Silky Smooth Animations:** Powered by `motion/react` (Framer Motion) for page transitions, modals, and dynamic flying elements when adding to the cart.
*   **Authentication Flow:** Dynamic Login/Register modal managing separate Admin and User journeys.
*   **Dynamic Product Discovery:** Filtering by category, full-text search, and intelligent sorting (Price, Newest, Name).
*   **Shopping Cart:** In-state dynamic shopping cart with off-canvas sidebar view.
*   **Recently Viewed Module:** Automatically tracks recently viewed products utilizing local storage.
*   **Theme Module:** Complete application support for dark/light modes.
*   **Responsive:** Fully mobile & desktop friendly interface.

### Server-Side (Backend)
*   **RESTful API:** Developed with Express.js and TypeScript.
*   **Mongoose ORM:** Structured modeling utilizing MongoDB for robust document storage.
*   **Security & Authentication:** 
    *   Stateless authentication using JWT `jsonwebtoken`.
    *   Passwords securely hashed using `bcryptjs`.
*   **Automatic Account Seeding:** Generates default Admin and User accounts on server initialization if none exist.
*   **Custom Seed Scripts:** Optional endpoint to securely wipe and re-hydrate products.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide React (Icons), Framer Motion (`motion/react`)
*   **Backend:** Node.js, Express.js (runs within Vite middleware in dev; serves static files in prod)
*   **Database:** MongoDB via setup with Mongoose
*   **Auth Module:** JWT & bcryptjs

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local installation or MongoDB Atlas cluster)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/h-mart.git
    cd h-mart
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root of the project with the following (you can copy `.env.example`):
    ```env
    MONGO_URI=mongodb://localhost:27017/hmart
    JWT_SECRET=your_super_secret_jwt_key_here
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will automatically connect to MongoDB and seed the test credentials.

5.  **Build for Production (Optional):**
    ```bash
    npm run build
    npm start
    ```

## 🧪 Test Credentials

Upon successful database connection, the backend auto-seeds the following test credentials for you to explore different RBAC dashboard states:

### 👑 Admin Login
Use this account to experience the Admin privileges and dashboard interfaces:
*   **Email:** `admin@hmart.com`
*   **Password:** `admin123`

### 👤 Regular User Login
Use this account to experience the standard customer flows:
*   **Email:** `user@hmart.com`
*   **Password:** `user123`

## 📝 License
This project is open-source and available under the terms of the MIT License.
