// DashboardPage.jsx
import { useState, useEffect } from "react"; // React hooks for managing local component state and side effects
import { useNavigate, Navigate } from "react-router-dom"; // Navigation hooks and components for redirecting unauthorized users
import axios from "axios"; // Axios for making HTTP API requests to the backend server
import { User, Package, Mail, Calendar, Shield, Filter, ArrowUpDown, ChevronRight } from "lucide-react"; // Various icons from lucide-react for UI enhancement
import BackButton from "../components/BackButton"; // A custom component to navigate to the previous page

// DashboardPage component takes the currently logged-in 'user' as a prop
function DashboardPage({ user }) {
  // State to hold the user's order history fetched from the backend
  const [orders, setOrders] = useState([]);
  
  // State to manage a loading indicator while the orders are being fetched
  const [loading, setLoading] = useState(true);
  
  // State to manage the currently selected filter status (e.g., 'All', 'Delivered')
  const [statusFilter, setStatusFilter] = useState("All");
  
  // State to manage the sorting order of the orders by date (e.g., 'newest', 'oldest')
  const [dateSort, setDateSort] = useState("newest");
  
  // Hook to programmatically navigate to other pages
  const navigate = useNavigate();

  // useEffect triggers once when the DashboardPage component mounts
  useEffect(() => {
    // defined as an async function inside useEffect to handle the async axios call
    const fetchOrders = async () => {
      try {
        // GET request to retrieve all orders for the current user
        const response = await axios.get("/api/orders");
        // Update the state with the received list of orders
        setOrders(response.data);
      } catch (err) {
        // Log an error if the API request fails
        console.error("Error fetching orders:", err);
      } finally {
        // Always stop the loading indicator, regardless of success or failure
        setLoading(false);
      }
    };
    
    // Invoke the fetch function
    fetchOrders();
  }, []); // Empty dependency array ensures this effect runs exactly once

  // Security Check: If there is no user object (user is null or undefined), redirect them forcefully to the login page
  if (!user) return <Navigate to="/login" />;

  // Data processing: Apply filtering and sorting to the orders array before rendering
  const filteredOrders = orders
    // Filtering: Keep orders where the status matches statusFilter, or keep all if filter is "All"
    .filter(order => statusFilter === "All" || order.status === statusFilter)
    // Sorting: Sort the remaining orders based on the dateSort state
    .sort((a, b) => {
      // Convert date strings into Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      // If dateSort is 'newest', sort descending (most recent first). Otherwise, sort ascending.
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    // Main container wrapping the whole dashboard content with max width and centered margins
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      
      {/* Back Button Container */}
      <div className="pt-2">
        <BackButton label="Go Back" fallback="/" />
      </div>
      
      {/* Profile Section: Displays user info like name, email, and role */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
        
        {/* User Avatar Graphic */}
        <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
          <User size={64} />
        </div>
        
        {/* User Details Box */}
        <div className="flex-1 text-center md:text-left space-y-2">
          {/* User's Name displayed in bold */}
          <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
          
          {/* User's Meta Information Row: Email, Join Date, Role */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500">
            <span className="flex items-center gap-1"><Mail size={16} /> {user.email}</span>
            <span className="flex items-center gap-1"><Calendar size={16} /> Joined {user.joinDate}</span>
            <span className="flex items-center gap-1"><Shield size={16} /> {user.role}</span>
          </div>
        </div>
        
        {/* User Action Buttons Column */}
        <div className="flex flex-col gap-2">
          {/* Mock Edit Profile button for UI purposes */}
          <button className="px-6 py-2 border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-50 transition-colors">
            Edit Profile
          </button>
          
          {/* Conditional Rendering: Show "Admin Panel" button ONLY if the user's role is "Admin" */}
          {user.role === "Admin" && (
            <button 
              onClick={() => navigate("/admin")} // Takes user to the Admin CMS panel
              className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Admin Panel
            </button>
          )}
        </div>
      </div>

      {/* Orders Section: Displays a filterable and sortable list of past orders */}
      <div className="space-y-6">
        
        {/* Header and Controls Row: Holds the title, status filter dropdown, and sort dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package size={24} className="text-orange-500" /> My Recent Orders
          </h3>
          
          {/* Container for the Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Filter Dropdown Box */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              <Filter size={16} className="text-gray-400" /> {/* Filter icon */}
              <select 
                value={statusFilter} // Linked to state
                onChange={(e) => setStatusFilter(e.target.value)} // Updates state when user selects a different status
                className="text-sm font-medium text-gray-700 outline-none bg-transparent cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Delivered">Delivered</option>
                <option value="On the way">On the way</option>
                <option value="Order Placed">Order Placed</option>
              </select>
            </div>

            {/* Date Sort Dropdown Box */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
              <ArrowUpDown size={16} className="text-gray-400" /> {/* Sort icon */}
              <select 
                value={dateSort} // Linked to state
                onChange={(e) => setDateSort(e.target.value)} // Updates state when user selects a sorting option
                className="text-sm font-medium text-gray-700 outline-none bg-transparent cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conditional Rendering of Order List based on loading / empty states */}
        {loading ? (
          // If the API call hasn't finished, show loading text
          <p>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          // If the API call finished but the processed array is empty, show empty state message
          <div className="bg-white p-12 rounded-xl text-center border border-dashed border-gray-300">
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        ) : (
          // Render the grid containing the order cards
          <div className="grid gap-4">
            
            {/* Iterates through 'filteredOrders' array to mount an order card for each instance */}
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                
                {/* Visual order details column */}
                <div>
                  <p className="text-sm text-gray-400 font-mono">{order.id}</p> {/* Unique order hash ID */}
                  <p className="font-semibold text-gray-800">{order.items.join(", ")}</p> {/* Order string derived by joining item names together */}
                  <p className="text-sm text-gray-500">{order.date}</p> {/* Formatted Date string */}
                </div>
                
                {/* Secondary column showing price, status pill, and tracking action button */}
                <div className="flex items-center gap-6">
                  
                  {/* Container for total cost and status label */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">₹{order.total}</p> {/* Grand Total price formatting */}
                    
                    {/* Status Pill with dynamic styling based on the status text */}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === "Delivered" ? "bg-green-100 text-green-700" : 
                      order.status === "On the way" ? "bg-blue-100 text-blue-700" :
                      "bg-orange-100 text-orange-700" // Default for Order Placed
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Track Order Button mapping specifically back to the Track Route leveraging URL parameter /track/:id */}
                  <button 
                    onClick={() => navigate(`/track/${order.id}`)}
                    className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors flex items-center gap-2 font-bold shadow-sm"
                  >
                    <span>Track Order</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
