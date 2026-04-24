import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page Components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RestaurantPage from "./pages/RestaurantPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import TrackingPage from "./pages/TrackingPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  // Global state for cart item count, displayed dynamically in the Navbar module
  const [cartCount, setCartCount] = useState(0);
  
  // Initialize user state from localStorage to maintain active sessions across direct page reloads
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("foodie_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fetches current cart representation for the logged-in user to update the navigation bar counter
  const updateCartCount = async () => {
    // If no user is logged in, reset cart counter back to default
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      // Sums the quantity properties of all item objects stored inside the user's specific cart sequence
      const response = await axios.get(`/api/cart?userId=${user.id}`);
      const count = (Array.isArray(response.data) ? response.data : []).reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error("Error updating cart count:", error);
    }
  };

  // Lifecycle effect syncing cart count queries whenever the active 'user' contextual state alters
  useEffect(() => {
    if (user) {
      updateCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  // Handler mapping the user profile payload persistently saving to local browser storage directly 
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("foodie_user", JSON.stringify(userData));
  };

  // Handler resolving global log out by cleanly stripping state and browser storage session caches
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("foodie_user");
  };

  // Global action handler to append food directly onto the database via cart API endpoints securely
  const handleAddToCart = async (foodId) => {
    if (!user) return; // Prevent guest sessions from arbitrarily altering external cart architectures
    try {
      // Posts the valid insertion via backend while resolving real user identity natively
      await axios.post("/api/cart", { foodId, quantity: 1, userId: user.id });
      updateCartCount(); // Fetch latest accurate total specifically to rerender components dynamically
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    // React Router wrapping the entire front-end application logical tree
    <Router>
      <div className="min-h-screen font-sans flex flex-col" style={{background: 'transparent'}}>
        {/* Render interactive dynamic navigation header containing explicit contextual user states */}
        <Navbar cartCount={cartCount} user={user} onLogout={handleLogout} />

        <main className="flex-grow">
          <Routes>
            {/* Protected Routes: Users must actively possess an authorized user context to view components */}
            <Route path="/" element={user ? <HomePage onAddToCart={handleAddToCart} /> : <Navigate to="/login" replace />} />
            <Route path="/restaurant/:id" element={user ? <RestaurantPage onAddToCart={handleAddToCart} /> : <Navigate to="/login" replace />} />
            <Route path="/cart" element={user ? <CartPage user={user} /> : <Navigate to="/login" replace />} />
            
            {/* Redirection preventing previously verified users from rendering arbitrary login frames */}
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} />
            
            <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />} />
            <Route path="/checkout" element={user ? <CheckoutPage user={user} onOrderSuccess={updateCartCount} /> : <Navigate to="/login" replace />} />
            <Route path="/track/:orderId" element={user ? <TrackingPage /> : <Navigate to="/login" replace />} />
            
            {/* Admin layout structurally guarded relying strictly upon hard role validation attributes natively */}
            <Route path="/admin" element={user?.role === "Admin" ? <AdminPage /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
