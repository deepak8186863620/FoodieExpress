// HomePage.jsx
import { useState, useEffect, useCallback } from "react"; // Hook imports for local state management, lifecycles, and memoizing functions
import { Link } from "react-router-dom"; // React Router component for declarative client-side navigation
import axios from "axios"; // HTTP client used to fetch items and restaurants from the backend
import { Search, Plus, Check, Clock, Star, ChevronRight, Flame, Sparkles } from "lucide-react"; // Icons for enhancing the UI
import { motion, AnimatePresence } from "motion/react"; // Framer motion for layout animations and enter/exit transitions
import FeedbackSession from "../components/FeedbackSession"; // Component handling quick feedback prompts

// Mapping object connecting cuisine strings to emoji icons
const CUISINE_ICONS = {
  All: "🍽️", Indian: "🍛", American: "🍔", Italian: "🍕",
  Healthy: "🥗", Japanese: "🍣", "Fast Food": "🍟", Pizza: "🍕",
  Sushi: "🍱", Salads: "🥙", Desserts: "🍰",
};

// AddToCartButton component handling the animation state and api trigger when users add food
function AddToCartButton({ foodId, onAddToCart }) {
  // State tracking the button's action phase: 'idle' = normal, 'loading' = saving, 'success' = done
  const [state, setState] = useState("idle");

  // Handler for adding items to the cart
  const handleClick = async (e) => {
    e.preventDefault(); // Prevents default browser behaviors on click
    e.stopPropagation(); // Stops the event from bubbling up to parent containers (like link clicks)
    if (state !== "idle") return; // Prevents double clicking while already processing
    
    setState("loading"); // visual feedback that the action started
    await onAddToCart(foodId); // triggers the actual prop function
    setState("success"); // visual feedback that it succeeded
    
    // Automatically revert the button to the 'idle' state after 2 seconds
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    // Button element with dynamic styling based on the current explicit 'state'
    <button
      onClick={handleClick}
      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
        state === "success"
          ? "bg-green-500 text-white shadow-green-200 shadow-lg scale-95"
          : state === "loading"
          ? "bg-orange-300 text-white cursor-wait"
          : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 shadow-lg"
      }`}
    >
      {/* AnimatePresence allows elements to animate out when they are unmounted */}
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          // Success State UI
          <motion.span key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Check size={16} strokeWidth={3} /> Added!
          </motion.span>
        ) : state === "loading" ? (
          // Loading State UI
          <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding...
          </motion.span>
        ) : (
          // Default Idle State UI
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <Plus size={16} strokeWidth={3} /> Add to Cart
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// FoodCard component displays individual food data points as a visual card
function FoodCard({ food, onAddToCart }) {
  return (
    // motion.div for animation on mount and interactions (like hover pushing the card slightly up)
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-300 border border-gray-100/80 group flex flex-col"
    >
      <div className="relative h-52 w-full overflow-hidden shrink-0">
        <img
          src={food.image}
          alt={food.name}
          // The image scales heavily on group-hover, giving a premium zoom feel without overflowing bounding box
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Dark overlay mapping from bottom to give textual elements clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Cuisine Tag pill */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold shadow-md text-gray-700 flex items-center gap-1">
          <span>{CUISINE_ICONS[food.category] || "🍽️"}</span> {food.category}
        </div>
        {/* Price Tag pill */}
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-black shadow-md">
          ₹{food.price}
        </div>
      </div>
      
      {/* Container for title, ratings, and bottom Add to Cart interaction */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h4 className="text-lg font-black text-gray-900 group-hover:text-orange-500 transition-colors leading-snug line-clamp-1">
            {food.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            {/* Visual static rating stars mapping */}
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={11} className={s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
            ))}
            <span className="text-xs text-gray-400 ml-1">(4.0)</span>
          </div>
        </div>
        {/* Encapsulated button implementation */}
        <AddToCartButton foodId={food.id} onAddToCart={onAddToCart} />
      </div>
    </motion.div>
  );
}

// RestaurantCard component displays a high-level representation of a single restaurant entity
function RestaurantCard({ restaurant }) {
  return (
    // Link wraps the card to navigate users directly into that specific restaurant's page based on its ID
    <Link to={`/restaurant/${restaurant.id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-300 border border-gray-100 group cursor-pointer"
      >
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Overlay to ensure white rating metrics text remains perfectly readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* Rating pill showing numeric value */}
            <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
              <Star size={11} fill="white" stroke="white" /> {restaurant.rating}
            </span>
            {/* Time mapping pill showing delivery speed estimation */}
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Clock size={11} className="text-orange-500" /> {restaurant.deliveryTime}
            </span>
          </div>
        </div>
        
        {/* Footer info showing name, category, and average cost estimations */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-black text-gray-900 text-base group-hover:text-orange-500 transition-colors">{restaurant.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{restaurant.cuisine}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">₹{restaurant.costForTwo}</p>
              <p className="text-[10px] text-gray-300">for two</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// HomePage Component: Assembles search features, filters, and loops through mapping data to display Restaurants and popular items
function HomePage({ onAddToCart }) {
  // Local state handling fetched items
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Local state tracking input entries and filter selection
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  // Constant array driving the UI pill map
  const cuisines = ["All", "Indian", "American", "Italian", "Healthy", "Japanese", "Fast Food", "Desserts"];

  // Debounced API fetcher ensuring we do not spam server requests on every keystroke
  useEffect(() => {
    // Defines a timed handler using setTimeout
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        // Run restaurant and food fetching concurrently
        const [resResponse, foodsResponse] = await Promise.all([
          // Passes search and cuisine queries down as native HTTP payload equivalents
          axios.get("/api/restaurants", { params: { search: searchQuery, cuisine: selectedCuisine } }),
          axios.get("/api/foods")
        ]);
        setRestaurants(resResponse.data);
        
        // Temporarily hold food data to apply exact client side filtering requirements
        let fetchedFoods = foodsResponse.data;
        if (searchQuery) {
          // Keep item if word appears in food's name or its category natively
          fetchedFoods = fetchedFoods.filter(f =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (selectedCuisine !== "All") {
          // Exact match filter based on selected category state string
          fetchedFoods = fetchedFoods.filter(f => f.category === selectedCuisine);
        }
        setFoods(fetchedFoods);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce buffer wait
    // Cleanup ensures old request intervals cancel if state quickly changes again
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCuisine]); // Re-runs this effect logic specifically when either of these values changes

  return (
    // Main Container encapsulating components cleanly
    <div className="space-y-12 pb-12 max-w-7xl mx-auto px-4 pt-4">

      {/* Hero Header Area: Showing massive image display and immediate CTA for search */}
      <div className="relative h-[380px] md:h-[420px] rounded-[2.5rem] overflow-hidden flex items-center justify-center text-center">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=100"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Hero"
          referrerPolicy="no-referrer"
        />
        {/* Complex overlay allowing bright visual text inside container */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative z-10 w-full max-w-2xl space-y-6 px-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <span className="text-orange-400 text-sm font-bold uppercase tracking-widest">Free Delivery Today</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
            Great Food,<br />
            <span className="text-orange-400">Delivered Fast</span>
          </motion.h1>
          
          {/* Main Global Search Input linking to 'searchQuery' state */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input
              type="text"
              placeholder="Search restaurants, dishes or cuisine..."
              className="w-full pl-14 pr-5 py-5 rounded-2xl bg-white shadow-2xl outline-none text-base text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-orange-500/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      {/* Dynamic horizontal scrolling Cuisine selection section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-orange-500" />
          <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">What are you craving?</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {/* Loops over hardcoded cuisines map to output exact selection buttons mapped back to state click handlers */}
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold whitespace-nowrap transition-all text-sm border-2 ${
                selectedCuisine === cuisine
                  ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200/60"
                  : "bg-white border-gray-100 text-gray-600 hover:border-orange-200 hover:bg-orange-50"
              }`}
            >
              <span>{CUISINE_ICONS[cuisine] || "🍽️"}</span>
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Conditionally rendering restaurants list layout dynamically driven from array */}
      {restaurants.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900">Top Restaurants</h3>
            <span className="text-sm text-orange-500 font-bold flex items-center gap-1">{restaurants.length} available</span>
          </div>
          {/* Automatically reflowing responsive grid spanning columns depending on logical screen size limits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </div>
      )}

      {/* Rendering grid of items fetched based concurrently based on filters */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={22} className="text-orange-500" />
            <h3 className="text-2xl font-black text-gray-900">Popular Dishes</h3>
          </div>
          <span className="text-sm text-gray-400 font-medium">{foods.length} dishes</span>
        </div>

        {/* Triple condition ternary block logic: Handle Loading -> Handling Empty Set -> Returning Layout Component */}
        {loading ? (
          // Visual pulse rendering skeleton when data loads taking ~300ms min standard
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : foods.length === 0 ? (
          // Exact logic if zero mappings are returned for a specific combination string 
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-500 font-semibold">No dishes found for "{searchQuery}"</p>
            <button onClick={() => { setSearchQuery(""); setSelectedCuisine("All"); }} className="mt-4 text-orange-500 font-bold text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} onAddToCart={onAddToCart} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Quick feedback module allowing tracking metric collections anonymously  */}
      <FeedbackSession />
    </div>
  );
}

export default HomePage;
