// App.jsx
import { useState, useEffect } from "react"; // Importing React hooks for managing state and side effects
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Importing routing components to enable navigation between different pages without reloading the browser
import axios from "axios"; // Importing axios to make HTTP requests (API calls) to the backend
import { auth } from "./firebase"; // Importing the authenticated instance from firebase configuration

// Components
import Navbar from "./components/Navbar"; // Navbar component for the top navigation bar, used to show branding and cart count
import Footer from "./components/Footer"; // Footer component for the bottom of the page, showing copyright and links

// Pages
import HomePage from "./pages/HomePage"; // HomePage component, the main landing page showing restaurants
import LoginPage from "./pages/LoginPage"; // LoginPage component, handles user authentication
import DashboardPage from "./pages/DashboardPage"; // DashboardPage component, user profile and order history
import RestaurantPage from "./pages/RestaurantPage"; // RestaurantPage component, shows details and menu of a specific restaurant
import CartPage from "./pages/CartPage"; // CartPage component, displays items added to the cart
import CheckoutPage from "./pages/CheckoutPage"; // CheckoutPage component, handles payment and order placement
import TrackingPage from "./pages/TrackingPage"; // TrackingPage component, tracks order status

import AdminPage from "./pages/AdminPage"; // AdminPage component, allows admins to manage menu items

export default function App() {
  // State to keep track of the total number of items in the user's cart
  const [cartCount, setCartCount] = useState(0);
  
  // State to store the currently logged-in user. It initializes by checking localStorage so the user remains logged in after a page refresh
  const [user, setUser] = useState(() => {
    // Attempt to get the saved user data from browser's local storage
    const savedUser = localStorage.getItem("foodie_user");
    // If it exists, parse it from JSON to a JavaScript object, otherwise return null (not logged in)
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to fetch the latest cart count from the backend API
  const updateCartCount = async () => {
    try {
      // Make a GET request to the /api/cart endpoint to retrieve cart items
      const response = await axios.get("/api/cart");
      // Calculate the total quantity by summing up the 'quantity' property of each item in the cart array
      const count = (Array.isArray(response.data) ? response.data : []).reduce((sum, item) => sum + item.quantity, 0);
      // Update the state with the new count so the Navbar can reflect it
      setCartCount(count);
    } catch (error) {
      // Log any errors that occur during the API call
      console.error("Error updating cart count:", error);
    }
  };

  // useEffect hook to run the updateCartCount function once when the App component mounts
  useEffect(() => {
    updateCartCount(); // Fetch the cart count initially when the app loads
  }, []); // Empty dependency array means this effect only runs once on mount

  // Function to handle user login, taking the user data as an argument
  const handleLogin = (userData) => {
    setUser(userData); // Update the user state, triggering a re-render of authenticated routes
    localStorage.setItem("foodie_user", JSON.stringify(userData)); // Save user data to localStorage for persistence
  };

  // Function to handle user logout
  const handleLogout = () => {
    setUser(null); // Clear the user state, making the user unauthorized
    localStorage.removeItem("foodie_user"); // Remove the user data from localStorage
  };

  // Function to add a food item to the cart
  const handleAddToCart = async (foodId) => {
    try {
      // Make a POST request to add the specific food item with a quantity of 1 to the backend cart
      await axios.post("/api/cart", { foodId, quantity: 1 });
      // After successfully adding, update the cart count to reflect the newly added item
      updateCartCount();
    } catch (error) {
      // Log any errors that occur during the API call
      console.error("Error adding to cart:", error);
    }
  };

  return (
    // Wrap the entire application in the Router component to enable routing
    <Router>
      {/* Main container with minimum height of the screen, white background, flexbox for sticky footer */}
      <div className="min-h-screen bg-white font-sans flex flex-col">
        
        {/* Navigation Header component. We pass cartCount, user info, and logout function as props so it can display them and handle logout */}
        <Navbar cartCount={cartCount} user={user} onLogout={handleLogout} />

        {/* Main Content Area that grows to fill available space, pushing the footer down */}
        <main className="flex-grow">
          {/* Routes component acts as a switch, rendering the first matching Route */}
          <Routes>
            {/* Protected Route: If user is logged in, show HomePage, else Navigate (redirect) to /login */}
            <Route path="/" element={user ? <HomePage onAddToCart={handleAddToCart} /> : <Navigate to="/login" replace />} />
            
            {/* Protected Route for restaurant details. URL contains dynamic ':id' parameter */}
            <Route path="/restaurant/:id" element={user ? <RestaurantPage onAddToCart={handleAddToCart} /> : <Navigate to="/login" replace />} />
            
            {/* Protected Route for the cart page */}
            <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" replace />} />
            
            {/* Login Route: If user is already logged in, redirect to home page, else show LoginPage */}
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />} />
            
            {/* Protected Route for dashboard, passing user data as prop */}
            <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />} />
            
            {/* Protected Route for checkout page, updating cart count after successful order */}
            <Route path="/checkout" element={user ? <CheckoutPage onOrderSuccess={updateCartCount} /> : <Navigate to="/login" replace />} />
            
            {/* Protected Route for tracking an order. URL contains dynamic ':orderId' parameter */}
            <Route path="/track/:orderId" element={user ? <TrackingPage /> : <Navigate to="/login" replace />} />
            
            {/* Admin Route: Checks if user exists AND if their role is "Admin". Only then it shows AdminPage, else redirects to login */}
            <Route path="/admin" element={user?.role === "Admin" ? <AdminPage /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>

        {/* Footer Section displayed at the bottom of every page */}
        <Footer />
      </div>
    </Router>
  );
}
