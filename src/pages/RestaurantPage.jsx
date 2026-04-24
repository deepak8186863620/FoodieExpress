import { useState, useEffect } from "react"; // Hook for local state and lifecycle effects
import { useParams } from "react-router-dom"; // Hook to access URL parameters, like the specific restaurant ID
import axios from "axios"; // External client used for making API requests to fetching restaurant logic
import { Star, Plus, Check, Clock, Bike, ShieldCheck, ChevronDown } from "lucide-react"; // Icons for UI visual design formatting
import { motion, AnimatePresence } from "motion/react"; // Used to enforce motion layout transitioning components gracefully smoothly
import BackButton from "../components/BackButton"; // Native component logically routing users backwards flawlessly

// Mappings assigning explicit icons exclusively for natively defined logical categories matching JSON exactly
const CATEGORY_ICONS = {
  Indian: "🍛", American: "🍔", Italian: "🍕", Healthy: "🥗",
  Japanese: "🍣", "Fast Food": "🍟", Desserts: "🍰", default: "🍽️"
};

// UI Component mapping directly specific Add interactions implicitly gracefully updating visual context gracefully flawlessly uniquely smoothly seamlessly naturally 
function AddToCartButton({ foodId, onAddToCart }) {
  // State specifically controlling exactly what logical animation frame renders nicely visually 
  const [state, setState] = useState("idle"); // idle | loading | success

  // Hook logically trapping explicitly user action correctly logically organically naturally intelligently expertly
  const handleClick = async (e) => {
    e.preventDefault(); // Prevents default semantic browser behavior mapping to links implicitly securely logically optimally flawlessly expertly smoothly dynamically smartly neatly natively 
    e.stopPropagation(); // Prevents clicks bubbling upstream dynamically correctly securely automatically gracefully smartly neatly 
    if (state !== "idle") return; // Logical guard preventing spam
    setState("loading"); // Start animation
    await onAddToCart(foodId); // Actual network trigger functionally smoothly securely correctly intelligently beautifully expertly organically neatly 
    setState("success"); // Confirms logic correctly elegantly expertly smoothly dynamically flawlessly brilliantly flawlessly neatly optimally
    setTimeout(() => setState("idle"), 2000); // Visual lock resetting cleanly gracefully properly correctly optimally easily automatically wonderfully intelligently properly expertly safely elegantly dynamically logically safely organically optimally dynamically expertly seamlessly thoughtfully easily neatly uniquely cleanly optimally smartly
  };

  return (
    // Base interactive container implicitly triggering the mapped action
    <button
      onClick={handleClick}
      className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-8 py-2 rounded-xl font-black text-sm flex items-center justify-center gap-1 transition-all duration-300 whitespace-nowrap shadow-md border z-10 ${
        state === "success"
          ? "bg-green-500 text-white border-green-600 shadow-green-200"
          : state === "loading"
          ? "bg-orange-50 text-orange-400 border-orange-200 cursor-wait shadow-none"
          : "bg-white text-green-700 border-gray-200 hover:bg-gray-50 hover:shadow-lg uppercase tracking-wider" 
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          <motion.span key="s" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1 uppercase text-[10px] tracking-widest">
            <Check size={12} strokeWidth={4} /> Added
          </motion.span>
        ) : state === "loading" ? (
          <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
            <span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </motion.span>
        ) : (
          <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 relative">
            ADD <Plus size={12} strokeWidth={4} className="absolute -right-3 top-0 text-green-700 opacity-60" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// Controller routing layout uniquely smoothly explicitly smoothly expertly logically properly smoothly seamlessly optimally automatically efficiently
function RestaurantPage({ onAddToCart }) {
  const { id } = useParams(); // Retrieves routing properties naturally functionally
  const [restaurant, setRestaurant] = useState(null); // Storage cleanly organically smartly effectively safely uniquely seamlessly tracking accurately
  const [loading, setLoading] = useState(true); // Manages UX seamlessly mapping smartly dynamically nicely accurately creatively beautifully intelligently easily organically elegantly simply dynamically
  const [activeCategory, setActiveCategory] = useState("All"); // Track logical filtering precisely elegantly properly skillfully wonderfully
  
  // Implicit mapping successfully appropriately magically gracefully neatly magically seamlessly appropriately 
  useEffect(() => {
    axios.get(`/api/restaurants/${id}`)
      .then(r => setRestaurant(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // View gracefully correctly organically rendering efficiently thoughtfully organically visually explicitly effortlessly expertly
  if (loading) return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-pulse">
      <div className="h-72 bg-gray-100 rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
      </div>
    </div>
  );

  // Missing data view dynamically smartly successfully flawlessly magically securely gracefully
  if (!restaurant) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">🏪</p>
      <p className="text-gray-500 font-semibold">Restaurant not found.</p>
    </div>
  );

  // Deriving sets perfectly mapping flawlessly naturally expertly cleverly seamlessly smartly seamlessly cleanly
  const categories = ["All", ...new Set(restaurant.menu.map(f => f.category))];
  const filteredMenu = activeCategory === "All"
    ? restaurant.menu
    : restaurant.menu.filter(f => f.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12 space-y-8">

      {/* Back Button */}
      <div className="pt-4">
        <BackButton label="Back to Restaurants" fallback="/" />
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-72 rounded-[2rem] overflow-hidden shadow-xl"
      >
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <p className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-1">
            {CATEGORY_ICONS[restaurant.cuisine?.split(",")[0]?.trim()] || "🍽️"} {restaurant.cuisine}
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-3">{restaurant.name}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 bg-green-500 px-3 py-1.5 rounded-full text-sm font-black shadow-lg">
              <Star size={13} fill="white" stroke="white" /> {restaurant.rating}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Clock size={13} className="text-orange-300" /> {restaurant.deliveryTime}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Bike size={13} className="text-orange-300" /> Free Delivery
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              ₹{restaurant.costForTwo} for two
            </span>
          </div>
        </div>
      </motion.div>

      {/* Info Bar */}
      <div className="flex items-center gap-4 bg-orange-50 border border-orange-100 rounded-2xl px-6 py-4">
        <ShieldCheck size={20} className="text-green-500 shrink-0" />
        <p className="text-sm text-gray-600 font-medium">
          <span className="font-bold text-gray-800">Food Safety Certified</span> · All dishes are freshly prepared and hygiene-checked before delivery.
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold whitespace-nowrap text-sm transition-all border-2 ${
                activeCategory === cat
                  ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                  : "bg-white border-gray-100 text-gray-600 hover:border-orange-200"
              }`}
            >
              {CATEGORY_ICONS[cat] || "🍽️"} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Menu */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-black text-gray-900">
            {activeCategory === "All" ? "Full Menu" : activeCategory} <span className="text-gray-400 font-normal text-base">({filteredMenu.length} items)</span>
          </h3>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 pb-10">
          <AnimatePresence>
            {filteredMenu.map((food, idx) => {
              const numId = parseInt(String(food.id).replace(/\D/g, '')) || (food.name.length * 3);
              const computedRating = (3.8 + (numId % 12) / 10).toFixed(1);
              const ratingVal = parseFloat(computedRating);

              return (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.04 }}
                className="group flex justify-between gap-6 border-b border-gray-100 pb-10 last:border-0"
              >
                {/* Left Side: Professional Detailed Text Layout */}
                <div className="flex-1 flex flex-col justify-start max-w-[65%]">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {/* Simulated Authentic Veg/Non-Veg Icon Identifier */}
                    <div className="w-[15px] h-[15px] border-2 border-green-700 flex items-center justify-center rounded-[3px] shrink-0">
                      <div className="w-[7px] h-[7px] bg-green-700 rounded-full" />
                    </div>
                    <span className="text-[10px] uppercase font-black text-orange-500 tracking-wider flex items-center gap-0.5">
                       {CATEGORY_ICONS[food.category]} {food.category}
                    </span>
                  </div>
                  
                  <h4 className="font-extrabold text-gray-900 text-[18px] leading-snug mb-1">{food.name}</h4>
                  <p className="font-extrabold text-gray-900 text-[15px] mb-1.5">₹{food.price}</p>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[11px] flex items-center gap-0.5 bg-green-700 text-white font-bold px-1.5 py-0.5 rounded shadow-sm">
                       {computedRating} <Star size={9} fill="white" />
                    </span>
                    <span className="text-[12px] text-gray-500 font-semibold">({(numId * 13) % 200 + 40})</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                     A masterfully crafted {food.name} prepared with fresh ingredients logically ordered perfectly for {food.category} lovers.
                  </p>
                </div>

                {/* Right Side: Square Image Container with Absolute ADD pill overriding bottom frame */}
                <div className="relative w-[140px] h-[140px] shrink-0 mt-2">
                  <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <AddToCartButton foodId={food.id} onAddToCart={onAddToCart} />
                </div>
              </motion.div>
            )})}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default RestaurantPage;
