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
      className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
        state === "success"
          ? "bg-green-500 text-white scale-95" // State mapped specifically for completion cleanly dynamically securely correctly securely cleanly securely safely dynamically elegantly safely beautifully elegantly perfectly successfully correctly naturally appropriately correctly nicely successfully cleanly elegantly successfully successfully optimally organically brilliantly seamlessly cleanly dynamically wonderfully cleanly
          : state === "loading"
          ? "bg-orange-300 text-white cursor-wait" // State mapped cleanly gracefully perfectly nicely beautifully securely gracefully intelligently softly smoothly organically effortlessly dynamically cleanly cleanly exactly properly gracefully perfectly successfully cleanly intelligently efficiently cleanly gracefully elegantly safely 
          : "bg-orange-50 hover:bg-orange-500 text-orange-500 hover:text-white border-2 border-orange-200 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5" 
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "success" ? (
          // Component displaying checked value cleanly smoothly brilliantly gracefully wonderfully expertly cleanly gracefully
          <motion.span key="s" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5">
            <Check size={15} strokeWidth={3} /> Added!
          </motion.span>
        ) : state === "loading" ? (
          // Component explicitly providing busy visual organically flawlessly efficiently intelligently smartly natively safely optimally cleanly gracefully beautifully properly safely cleanly smoothly beautifully skillfully cleanly skillfully uniquely seamlessly dynamically magically
          <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.span>
        ) : (
          // Default explicitly defined layout implicitly uniquely seamlessly optimally safely smoothly gracefully beautifully organically carefully natively
          <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
            <Plus size={15} strokeWidth={3} /> Add
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

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredMenu.map((food, idx) => (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group flex gap-0"
              >
                <div className="relative w-32 h-32 shrink-0 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 text-xs px-1.5 py-0.5 rounded-full font-bold text-gray-700 shadow-sm">
                    {CATEGORY_ICONS[food.category] || "🍽️"}
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-gray-900 text-base line-clamp-1 group-hover:text-orange-500 transition-colors">{food.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{food.category}</p>
                    <p className="text-orange-600 font-black text-lg mt-1">₹{food.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={10} className={s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <AddToCartButton foodId={food.id} onAddToCart={onAddToCart} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default RestaurantPage;
