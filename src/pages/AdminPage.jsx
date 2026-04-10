// AdminPage.jsx
import { useState, useEffect } from "react"; // Importing React hooks for state management and side effects
import axios from "axios"; // Importing axios to communicate with backend APIs
import { Plus, Trash2, Utensils, IndianRupee, Image as ImageIcon, Tag } from "lucide-react"; // Importing icons for UI enhancement
import { motion } from "motion/react"; // Importing motion for smooth animations when adding items
import BackButton from "../components/BackButton"; // Importing a reusable BackButton component to navigate back to the previous page

function AdminPage() {
  // State to hold the list of all food items fetched from the backend
  const [foods, setFoods] = useState([]);
  
  // State to hold the list of all restaurants fetched from the backend (used for the dropdown when adding food)
  const [restaurants, setRestaurants] = useState([]);
  
  // State to track if data is still being loaded, showing a loading message if true
  const [loading, setLoading] = useState(true);
  
  // State to toggle the visibility of the "Add New Food" form
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State: an object holding the current values of the new food item form inputs
  const [newFood, setNewFood] = useState({
    restaurantId: "", // ID of the selected restaurant
    name: "",         // Name of the food item
    price: "",        // Price of the item
    image: "",        // Image URL for the item
    category: ""      // Category of the item (e.g., Main Course)
  });

  // Function to fetch both foods and restaurants data concurrently
  const fetchData = async () => {
    try {
      // Promise.all ensures both API requests run in parallel to save time
      const [foodsRes, restaurantsRes] = await Promise.all([
        axios.get("/api/foods"), // Fetch all food items
        axios.get("/api/restaurants") // Fetch all restaurants
      ]);
      // Update state with the fetched data
      setFoods(foodsRes.data);
      setRestaurants(restaurantsRes.data);
    } catch (err) {
      // Log any data fetching errors
      console.error("Error fetching admin data:", err);
    } finally {
      // Once data is fetched or an error occurs, set loading to false to display the content
      setLoading(false);
    }
  };

  // useEffect runs the fetchData function automatically when the AdminPage component first loads
  useEffect(() => {
    fetchData(); // Trigger data fetch on mount
  }, []); // Empty dependency array ensures this effect runs exactly once

  // Function to handle the submission of the "Add Food" form
  const handleAddFood = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior which reloads the page
    try {
      // Make a POST request to add the new food item data to the backend database
      await axios.post("/api/foods", newFood);
      
      // Reset the form fields to empty values after successful submission
      setNewFood({ restaurantId: "", name: "", price: "", image: "", category: "" });
      
      // Hide the add form
      setShowAddForm(false);
      
      // Re-fetch all data to display the newly added item in the table without a page reload
      fetchData();
    } catch (err) {
      // Log any errors that occurred while saving
      console.error("Error adding food:", err);
    }
  };

  // Function to handle deleting a food item by its ID
  const handleDeleteFood = async (id) => {
    // Show a browser confirmation dialog to prevent accidental deletion. Exit function if user clicks Cancel
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      // Send a DELETE request to the backend with the food ID
      await axios.delete(`/api/foods/${id}`);
      
      // Fetch the updated list of foods after deletion to reflect the changes in the UI
      fetchData();
    } catch (err) {
      // Log any errors occurring during deletion
      console.error("Error deleting food:", err);
    }
  };

  // Conditional Rendering: If data is still loading, show a simple loading message and stop rendering the rest
  if (loading) return <div className="flex justify-center items-center h-64">Loading Admin Panel...</div>;

  return (
    // Main container with max-width, center alignment, padding, and vertical spacing
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      
      {/* Header Section: Contains Back button, Page Title, and Add New Item toggle button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <BackButton label="Go Back" fallback="/" /> {/* Component to go back */}
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Menu Management</h2>
        </div>
        
        {/* Button to toggle the Add Form visibility. Label changes depending on state. */}
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all"
        >
          <Plus size={20} /> {showAddForm ? "Cancel" : "Add New Item"}
        </button>
      </div>

      {/* Conditionally render the Add Form using framer-motion for a smooth fade-in and slide-down effect */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} // Start slightly above and transparent
          animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* The form triggers handleAddFood on submit */}
          <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Restaurant Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Utensils size={16} /> Restaurant</label>
              <select 
                required // Makes this field mandatory
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                value={newFood.restaurantId} // Connects input value to state
                onChange={(e) => setNewFood({...newFood, restaurantId: e.target.value})} // Updates state when changed, keeping other properties intact
              >
                <option value="">Select Restaurant</option>
                {/* Dynamically generate options based on the fetched restaurants list */}
                {restaurants.map(res => (
                  <option key={res.id} value={res.id}>{res.name}</option>
                ))}
              </select>
            </div>
            
            {/* Food Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Tag size={16} /> Food Name</label>
              <input 
                required
                type="text"
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Paneer Tikka"
                value={newFood.name}
                onChange={(e) => setNewFood({...newFood, name: e.target.value})}
              />
            </div>
            
            {/* Price Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><IndianRupee size={16} /> Price (₹)</label>
              <input 
                required
                type="number" // Accepts only numbers
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. 250"
                value={newFood.price}
                onChange={(e) => setNewFood({...newFood, price: e.target.value})}
              />
            </div>
            
            {/* Category Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Tag size={16} /> Category</label>
              <input 
                required
                type="text"
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g. Main Course"
                value={newFood.category}
                onChange={(e) => setNewFood({...newFood, category: e.target.value})}
              />
            </div>
            
            {/* Image URL Input taking full width (col-span-2) on medium screens */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><ImageIcon size={16} /> Image URL</label>
              <input 
                required
                type="url" // Enforces valid URL format
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://images.unsplash.com/..."
                value={newFood.image}
                onChange={(e) => setNewFood({...newFood, image: e.target.value})}
              />
            </div>
            
            {/* Submit Button to save the item */}
            <button 
              type="submit"
              className="md:col-span-2 bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-orange-500 transition-all shadow-xl"
            >
              SAVE FOOD ITEM
            </button>
          </form>
        </motion.div>
      )}

      {/* Data Table Container to display the list of food items */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          {/* Table Headers */}
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">Item</th>
              <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">Restaurant</th>
              <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest">Price</th>
              <th className="p-6 text-sm font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body rows generated by dynamically mapping over the 'foods' state array */}
          <tbody className="divide-y divide-gray-50">
            {foods.map((food) => {
              // Find the related restaurant name for each food item by matching IDs
              const restaurant = restaurants.find(r => r.id === food.restaurantId);
              
              return (
                // Table Row for each food item. A unique 'key' is required by React when mapping over lists
                <tr key={food.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Displays the food image with fallback behavior if it fails to load via referrerPolicy */}
                      <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <span className="font-bold text-gray-800">{food.name}</span>
                    </div>
                  </td>
                  {/* Shows restaurant name or 'Unknown' if we can't find it */}
                  <td className="p-6 text-gray-500 font-medium">{restaurant?.name || "Unknown"}</td>
                  {/* Displays food category */}
                  <td className="p-6 text-gray-500">{food.category}</td>
                  {/* Displays formatted food price */}
                  <td className="p-6 font-black text-orange-600">₹{food.price}</td>
                  {/* Actions column with delete button */}
                  <td className="p-6 text-right">
                    <button 
                      // Trigger delete operation when clicked
                      onClick={() => handleDeleteFood(food.id)}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} /> {/* Display TrashIcon */}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Export the component as default for use in routes
export default AdminPage;
