# H Mart - E-Commerce Platform

A modern, serverless e-commerce application built with React, Vite, and Firebase. H Mart provides a seamless shopping experience featuring real-time cart management, smooth animations, precise product categories, and robust role-based access control (Admin vs. User) secured by Firebase Firestore Rules.

## ✨ Features

### Frontend Architecture
*   **Modern Interactive UI:** Built using React & Tailwind CSS.
*   **Silky Smooth Animations:** Powered by `motion/react` (Framer Motion) for page transitions, modals, and dynamic flying elements.
*   **Authentication Flow:** Secure Google Sign-In and Email/Password authentication powered by Firebase Auth.
*   **Dynamic Product Discovery:** Filtering by category, full-text search, and intelligent sorting (Price, Newest, Name).
*   **Shopping Cart:** In-state dynamic shopping cart with an off-canvas sidebar view.
*   **Theme Module:** Complete application support for dark/light modes.
*   **Responsive:** Fully mobile & desktop-friendly interface.

### Serverless Backend (Firebase)
*   **Database:** Cloud Firestore provides a highly scalable NoSQL document database.
*   **Security:** Bullet-proof Attribute-Based Access Control (ABAC) using custom Firestore Security Rules.
*   **Real-time Sync:** Products and user profiles are synced to Firestore.

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide React, Framer Motion
*   **Backend as a Service:** Firebase (Auth, Firestore)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)

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

3.  **Firebase Setup (Important):**
    If you cloned this repository, it currently points to the original author's Firebase project via `firebase-applet-config.json`. To run your own instance:
    - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    - Enable **Firestore Database** and **Firebase Authentication**.
    - In Firebase Authentication, enable **Google Sign-In** and **Email/Password**.
    - Replace the contents of `firebase-applet-config.json` with your project's configuration.
    - Deploy the security rules using `firebase deploy --only firestore:rules` using the included `firestore.rules`.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## 🧪 Test Credentials

To test the role-based dashboard, you will need to enable **Email/Password authentication** in your Firebase console.

1. Sign up for a new account in the app using the "Sign up" form.
2. Go to your Firebase Firestore console.
3. Find your user document in the `users` collection.
4. Change the `role` field from `"user"` to `"admin"`.
5. Refresh the app. You will now see the Admin Dashboard icon!

Alternatively, use your Google Account to sign in seamlessly as a standard user.

## 📝 License
This project is open-source and available under the terms of the MIT License.
