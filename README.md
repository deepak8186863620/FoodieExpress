# FoodieExpress - The Next-Gen Food Discovery & Delivery Platform

FoodieExpress is a high-performance, feature-rich food delivery application inspired by industry giants like Zomato. Built with the MERN stack (using a persistent local JSON database), it's designed to showcase production-grade features for student placement preparation.

## 🚀 Key Features

### 1. **Restaurant Discovery (Zomato-Style)**
- **Global Search**: Search for your favorite restaurants, specific cuisines, or even individual dishes.
- **Cuisine Categories**: Browse through a wide variety of cuisines like North Indian, Italian, Japanese, and more with a smooth, horizontal-scrolling interface.
- **Restaurant Profiles**: Each restaurant has a dedicated page featuring its full menu, ratings, delivery time, and "cost for two".

### 2. **Advanced User Dashboard**
- **Profile Management**: View your personal details, role, and join date.
- **Smart Order History**: A powerful filtering and sorting system for your recent orders. Sort by date (Newest/Oldest) and filter by status (Delivered, On the way, etc.).
- **Real-time Tracking**: Integrated "Track" button for every order to see its live progress.

### 3. **Premium Ordering Experience**
- **Interactive Menu**: Add items to your cart directly from the restaurant's menu with smooth animations.
- **Persistent Cart**: Your shopping cart is saved even if you close the browser or the server restarts.
- **Fake Payment Gateway**: A realistic checkout flow supporting multiple payment methods (Card, UPI, COD) with a success animation.

### 4. **Visual Order Tracking**
- **Live Timeline**: A visual progress bar showing the 4 stages of delivery: Order Placed -> Preparing -> Out for Delivery -> Delivered.
- **Time-stamped Updates**: Each step shows the exact time it was completed.

### 5. **Student-Friendly Persistent Database**
- **Local Persistence**: Uses a `data.json` file managed by a custom `database.js` utility. This provides the feel of a real NoSQL database (like MongoDB) without the setup complexity.
- **Data Integrity**: All changes to restaurants, foods, cart, and orders are immediately saved to disk.

---

## 🛠️ Technical Architecture

### **Frontend (React + Tailwind + Motion)**
- **Modern UI**: Clean, bold typography and high-quality imagery inspired by Zomato's design language.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **State Management**: Uses React hooks (`useState`, `useEffect`, `useParams`) for a reactive and fast user experience.

### **Backend (Node.js + Express)**
- **RESTful APIs**: Cleanly separated endpoints for restaurants, foods, cart operations, and order management.
- **Search & Filter Logic**: Server-side logic for handling complex queries and filtering.
- **ES Modules**: Modern JavaScript syntax throughout the backend.

---

## 📊 Project Architecture

```text
[ User ]
   |
   v
[ React Frontend (Vite) ] <------> [ Express Backend (Node.js) ]
   |                                      |
   +--- Home Page (Search/Cuisines) <-----+--- GET /api/restaurants
   |                                      |
   +--- Restaurant Page (Menu) <----------+--- GET /api/restaurants/:id
   |                                      |
   +--- Login Page (Mock) --------------->+--- POST /api/login
   |                                      |
   +--- Cart Page (Manage) <-------------->+--- GET/POST/DELETE /api/cart
   |                                      |
   +--- Checkout (Payment) -------------->+--- POST /api/checkout
   |                                      |
   +--- Tracking (Status) <---------------+--- GET /api/track/:id
   |                                      |
   +--- Dashboard (Profile/Orders) <------+--- GET /api/orders
                                          |
                                   [ Local JSON Database ]
                                   (data.json + database.js)
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | Local JSON (`data.json`) *(can be upgraded to MongoDB)* |
| **Routing** | React Router DOM |
| **State Management** | React Hooks (`useState`, `useEffect`) |
| **API Handling** | RESTful APIs (GET, POST, DELETE) |
| **Development Tools** | Vite, VS Code, Git & GitHub |

---

## 🏃 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the platform**:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to experience the next-gen food delivery platform.

---

## 🎓 Learning Outcomes
- Building a **multi-entity architecture** (Restaurants -> Foods).
- Implementing **Search and Filtering** logic on the server.
- Creating **Dynamic Routing** with `react-router-dom`.
- Designing **High-Conversion UI/UX** patterns.
- Understanding **Data Persistence** in full-stack applications.
