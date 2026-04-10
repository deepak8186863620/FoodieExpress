// CartPage.jsx
import { useState, useEffect } from "react"; // Importing React hooks for local state and lifecycle effects
import { Link, useNavigate } from "react-router-dom"; // Importing routing components for internal link generation and programmatic navigation
import axios from "axios"; // Importing axios for making HTTP requests to the backend server
import { Trash2 } from "lucide-react"; // Importing trash icon from lucide-react for the delete button
import { motion } from "motion/react"; // Importing framer-motion to create smooth enter/exit animations for items
import BackButton from "../components/BackButton"; // Custom component allowing easy navigation to the previous page

function CartPage() {
  // State to hold the list of items currently in the user's shopping cart
  const [cartItems, setCartItems] = useState([]);
  
  // State to track loading status to visually inform the user while the API call is in progress
  const [loading, setLoading] = useState(true);
  
  // Hook from react-router-dom to programmatically redirect the user to a different route (like checkout)
  const navigate = useNavigate();

  // Function to request the current cart content from the backend API
  const fetchCart = async () => {
    try {
      // Makes an authenticated GET request to the cart endpoint
      const response = await axios.get("/api/cart");
      // Updates the state with the received cart data
      setCartItems(response.data);
    } catch (error) {
      // Logs any issues if fetching fails
      console.error("Error fetching cart:", error);
    } finally {
      // Stops the loading indicator whether the fetch was successful or failed
      setLoading(false);
    }
  };

  // React effect hook that runs specifically when the component renders for the first time
  useEffect(() => {
    fetchCart(); // Fetch the cart immediately upon mount
  }, []); // Empty dependency array means it only triggers once

  // Function to change the quantity of a specific item in the cart
  const updateQuantity = async (foodId, newQuantity) => {
    // Prevents quantity from dropping below 1. To remove an item, the Trash button is used instead
    if (newQuantity < 1) return;
    try {
      // Sends a PUT request to update the quantity of the chosen food item
      await axios.put(`/api/cart/${foodId}`, { quantity: newQuantity });
      // Refetches the cart from the server to ensure UI stays perfectly synchronized with the database
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Function to completely remove a food item from the cart
  const removeFromCart = async (foodId) => {
    try {
      // Makes a DELETE request to completely drop the item from the cart
      await axios.delete(`/api/cart/${foodId}`);
      // Refetches the current state of the cart
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Conditional rendering: While loading is true, shows a simple loading text
  if (loading) return <div className="flex justify-center items-center h-64">Loading your cart...</div>;

  // Computes the total cart price by multiplying each item's price by its quantity and summing them up
  const total = (Array.isArray(cartItems) ? cartItems : []).reduce((sum, item) => sum + (item.food?.price || 0) * item.quantity, 0);

  return (
    // Main wrapper constraining width on large screens and center-aligning content
    <div className="p-4 max-w-4xl mx-auto">
      
      {/* Container for the Back button */}
      <div className="mb-4 pt-2">
        <BackButton label="Go Back" fallback="/" />
      </div>
      
      {/* Page header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Shopping Cart</h2>
      
      {/* Conditional Rendering: Check if the cart array has 0 elements */}
      {cartItems.length === 0 ? (
        // UI shown when the cart is entirely empty
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-orange-500 font-medium hover:underline">Go back to menu</Link>
        </div>
      ) : (
        // UI shown when there are items existing in the cart
        <div className="space-y-4">
          
          {/* Mapping over each item in the cart array to render its row layout */}
          {cartItems.map((item) => (
            <motion.div
              key={item.foodId} // A unique React key mapped to the food ID for optimal rendering
              layout // Framer motion property that automatically animates positioning when items are removed
              initial={{ opacity: 0 }} // Start states for item entrance animation
              animate={{ opacity: 1 }} // End states for item entrance animation
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              
              {/* Product Image */}
              <img
                src={item.food?.image} // Image URL fetched from backend
                alt={item.food?.name} // Alt text for accessibility
                className="w-20 h-20 object-cover rounded-lg"
                referrerPolicy="no-referrer" // Helps prevent generic image loading errors from some external providers
              />
              
              {/* Product Details Section */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.food?.name}</h3>
                <p className="text-orange-600 font-medium">₹{(item.food?.price || 0) * item.quantity}</p>
              </div>
              
              {/* Controls for Incrementing and Decrementing Quantity */}
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <button 
                  onClick={() => updateQuantity(item.foodId, item.quantity - 1)} // Reduce quantity by 1
                  className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-orange-100 rounded-lg transition-colors font-black"
                >
                  -
                </button>
                <span className="w-6 text-center font-black text-gray-800">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.foodId, item.quantity + 1)} // Increase quantity by 1
                  className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-orange-100 rounded-lg transition-colors font-black"
                >
                  +
                </button>
              </div>

              {/* Trash button to entirely delete the item from the cart regardless of quantity */}
              <button
                onClick={() => removeFromCart(item.foodId)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
          
          {/* Summary section showing the final total cost of all cart items */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-orange-600">₹{total}</span>
          </div>
          
          {/* Primary Call to Action Button taking user to the payment/location step */}
          <button 
            onClick={() => navigate("/checkout")} // Switch to CheckoutPage
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

// Export the component as default for use in routes
export default CartPage;
