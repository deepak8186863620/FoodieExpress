import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Plus, Minus, Check, Clock, Star, ChevronRight, Flame, MapPin, Sparkles, ShieldCheck, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import FeedbackSession from "../components/FeedbackSession";

// Image mapping for realistic food categories
const CUISINE_IMAGES = {
  All: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80&auto=format&fit=crop",
  Indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80&auto=format&fit=crop",
  American: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80&auto=format&fit=crop",
  Italian: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&q=80&auto=format&fit=crop",
  Healthy: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80&auto=format&fit=crop",
  Japanese: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80&auto=format&fit=crop",
  "Fast Food": "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=300&q=80&auto=format&fit=crop",
  Pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80&auto=format&fit=crop",
  Sushi: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&q=80&auto=format&fit=crop",
  Salads: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80&auto=format&fit=crop",
  Desserts: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80&auto=format&fit=crop",
};

// New category showcasing a 3D plate design interface for better aesthetics
const BEST_FOOD_OPTIONS = [
  // Pair 1
  { name: "Biryani",       image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80&auto=format&fit=crop" },
  { name: "Idli",          image: "/images/idli.png" },
  // Pair 2
  { name: "South Indian",  image: "/images/south_indian.png" },
  { name: "Shawarma",      image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&q=80&auto=format&fit=crop" },
  // Pair 3
  { name: "North Indian",  image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80&auto=format&fit=crop" },
  { name: "Noodles",       image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&q=80&auto=format&fit=crop" },
  // Pair 4
  { name: "Desserts",      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80&auto=format&fit=crop" },
  { name: "Rolls",         image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=300&q=80&auto=format&fit=crop" },
  // Pair 5
  { name: "Ice Cream",     image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&q=80&auto=format&fit=crop" },
  { name: "Salad",         image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80&auto=format&fit=crop" },
  // Pair 6
  { name: "Cake",          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80&auto=format&fit=crop" },
  { name: "Shakes",        image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=300&q=80&auto=format&fit=crop" },
  // Pair 7 
  { name: "Pizza",         image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80&auto=format&fit=crop" },
  { name: "Paratha",       image: "/images/paratha.png" },
  // Pair 8
  { name: "Burger",        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80&auto=format&fit=crop" },
  { name: "Momos",         image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&q=80&auto=format&fit=crop" },
  // Pair 9
  { name: "Thali",         image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&q=80&auto=format&fit=crop" },
  { name: "Dosa",          image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&q=80&auto=format&fit=crop" },
  // Pair 10
  { name: "Chole Bhature", image: "/images/chole_bhature.png" },
  { name: "Samosa",        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80&auto=format&fit=crop" },
];

// FlashTimer component for limited time deals
function FlashTimer({ initialSeconds }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft === 0) return null;

  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-1.5 text-[11px] font-black text-white bg-gradient-to-r from-red-600 to-rose-600 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-lg border border-white/20 tracking-wider"
    >
      <Clock size={12} className="animate-pulse" /> {h}:{m}:{s} <span className="opacity-80">LEFT</span>
    </motion.div>
  );
}

// AddToCartButton component for seamless interaction
function AddToCartButton({ foodId, onAddToCart }) {
  const [state, setState] = useState("idle");
  const [quantity, setQuantity] = useState(0);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "idle") return;
    
    setState("loading");
    await onAddToCart(foodId);
    setQuantity(prev => prev + 1);
    setState("idle");
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 0) {
        setQuantity(prev => prev - 1);
        // Note: Realistically, this would call an API to remove the item from the cart.
        // For visual demonstration, we'll just decrement local state in this component.
    }
  };

  return (
    <div className="relative z-10 w-28 h-9 shadow-sm">
      <AnimatePresence mode="wait" initial={false}>
        {quantity === 0 ? (
          <motion.button
            key="add"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleAdd}
            className={`w-full h-full rounded-lg font-bold text-sm transition-all shadow-md flex items-center justify-center gap-1 ${
              state === "loading"
                ? "bg-orange-300 text-white cursor-wait"
                : "bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white hover:shadow-orange-200"
            }`}
          >
            {state === "loading" ? (
              <span className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>ADD <Plus size={14} strokeWidth={3} /></>
            )}
          </motion.button>
        ) : (
          <motion.div
            key="controls"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full bg-orange-500 rounded-lg flex items-center justify-between px-1 shadow-lg shadow-orange-200"
          >
            <button onClick={handleRemove} className="w-7 h-7 flex items-center justify-center text-white hover:bg-black/10 rounded-md transition-colors"><Minus size={16} strokeWidth={2.5} /></button>
            <span className="text-white font-black text-sm w-4 text-center">{quantity}</span>
            <button onClick={handleAdd} className="w-7 h-7 flex items-center justify-center text-white hover:bg-black/10 rounded-md transition-colors">
                {state === "loading" ? <span className="w-3 h-3 border-2 border-white/80 border-t-transparent rounded-full animate-spin" /> : <Plus size={16} strokeWidth={2.5} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// FoodCard — Swiggy/Zomato-style vertical card with tall image
function FoodCard({ food, onAddToCart }) {
  const numId = parseInt(String(food.id).replace(/\D/g, '')) || (food.name.length * 3);
  const computedRating = (3.8 + (numId % 12) / 10).toFixed(1);
  const isVeg = numId % 2 === 0;
  const isBestseller = numId % 3 === 0;
  const isFlashDeal = numId % 4 === 0;
  const flashSecondsLeft = 3600 + (numId * 123) % 7200;
  const reviewCount = (numId * 13) % 400 + 120;
  
  const mrpModifier = isFlashDeal ? 1.55 : 1.28;
  const mrp = Math.round(food.price * mrpModifier);
  const discount = Math.round(((mrp - food.price) / mrp) * 100);

  return (
    <motion.div
      layout
      className={`group relative rounded-[20px] overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isFlashDeal ? 'ring-[3px] ring-red-500/50' : ''}`}
      style={{background:'rgba(255,255,255,0.88)', border:'1px solid rgba(0,0,0,0.06)', boxShadow: isFlashDeal ? '0 8px 30px rgba(239, 68, 68, 0.2)' : '0 2px 12px rgba(0,0,0,0.06)'}}
      whileHover={{ boxShadow: isFlashDeal ? '0 15px 40px rgba(239, 68, 68, 0.3)' : '0 12px 40px rgba(251,146,60,0.15)' }}
    >
      {/* Image Area */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-100 shrink-0">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
          {isFlashDeal && <FlashTimer initialSeconds={flashSecondsLeft} />}
          <div className="flex items-center gap-2">
            {isBestseller && (
              <span className="bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Flame size={10} /> Bestseller
              </span>
            )}
            <span className="text-[10px] font-black px-2 py-1 rounded-full shadow-md" style={{background: isVeg ? 'rgba(22,163,74,0.9)' : 'rgba(220,38,38,0.9)', color:'white'}}>
              {isVeg ? '🌿 VEG' : '🍖 NON-VEG'}
            </span>
          </div>
        </div>

        {/* Discount badge top-right */}
        {discount > 10 && (
          <div className={`absolute top-3 right-3 text-white text-[11px] font-black px-2 py-1 rounded-lg shadow-md ${isFlashDeal ? 'bg-red-500' : 'bg-green-500'}`}>
            {discount}% OFF
          </div>
        )}

        {/* Rating bottom-left overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-md">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="text-[12px] font-black text-gray-800">{computedRating}</span>
          <span className="text-[10px] text-gray-500 font-semibold">({reviewCount})</span>
        </div>

        {/* ADD Button floating at bottom-right */}
        <div className="absolute bottom-3 right-3">
          <AddToCartButton foodId={food.id} onAddToCart={onAddToCart} />
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 flex flex-col gap-1.5">
        <h4 className="text-[16px] font-extrabold text-gray-900 leading-tight line-clamp-1 tracking-tight">
          {food.name}
        </h4>
        <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider">{food.category}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[17px] font-black text-gray-900">₹{food.price}</span>
          <span className="text-[13px] text-gray-400 line-through font-medium">₹{mrp}</span>
          {discount > 10 && (
            <span className="text-[11px] font-black text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">
              Save ₹{mrp - food.price}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// RestaurantCard component displays a high-level representation of a single restaurant entity
function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block">
      <motion.div
        whileHover={{ scale: 0.98 }}
        className="group relative"
      >
        <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
          
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
            Promoted
          </div>
          
          <div className="absolute bottom-3 left-3 right-3">
             <div className="flex items-center justify-between mb-1">
                 <h4 className="font-extrabold text-white text-xl truncate pr-2 tracking-tight">{restaurant.name}</h4>
                 <div className="flex items-center bg-green-600 px-1.5 py-0.5 rounded text-white font-bold text-xs gap-1 shrink-0 shadow-sm">
                    {restaurant.rating} <Star size={10} className="fill-white" />
                 </div>
             </div>
             <div className="flex items-center justify-between text-white/80 text-sm font-medium">
                 <span className="truncate pr-2">{restaurant.cuisine}</span>
                 <span className="shrink-0">₹{restaurant.costForTwo} for two</span>
             </div>
          </div>
        </div>
        <div className="px-1 py-3 flex items-center gap-4 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-1.5"><Clock size={14} className="text-green-600"/> {restaurant.deliveryTime}</div>
            <div className="flex items-center gap-1.5"><MapPin size={14} className="text-orange-500"/> 2.5 km</div>
            <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-blue-500" /> FSSAI Certified</div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomePage({ onAddToCart }) {
  const scrollRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const cuisines = ["All", "Indian", "American", "Italian", "Healthy", "Japanese", "Fast Food", "Desserts", "Pizza"];

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const [resResponse, foodsResponse] = await Promise.all([
          axios.get("/api/restaurants", { params: { search: searchQuery, cuisine: selectedCuisine } }),
          axios.get("/api/foods")
        ]);
        setRestaurants(resResponse.data);
        
        let fetchedFoods = foodsResponse.data;
        if (searchQuery) {
          fetchedFoods = fetchedFoods.filter(f =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (selectedCuisine !== "All") {
          fetchedFoods = fetchedFoods.filter(f => f.category === selectedCuisine);
        }
        setFoods(fetchedFoods);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCuisine]);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Integrated Search and Hero Section */}
      <div className="pt-10 pb-16 px-4 shadow-[0_12px_40px_rgba(251,146,60,0.06)] rounded-b-[3rem] mb-12" style={{background: '#fff7ed'}}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-between">
              
              {/* Left Column: Heading and Search */}
              <div className="w-full lg:w-5/12 flex flex-col justify-center">
                  <div className="inline-block bg-white text-orange-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-max mb-6 shadow-sm border border-orange-100 flex items-center gap-2">
                    <Flame size={14} className="text-orange-500" /> Fastest Delivery in Nagpur
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6">
                      Discover the best <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-sm">food & drinks</span>
                  </h1>
                  <p className="text-gray-500 text-lg font-medium mb-8 max-w-md leading-relaxed">
                      Get your favorite meals from top-rated restaurants delivered fresh and fast right to your doorstep.
                  </p>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative shadow-xl shadow-orange-100/50 rounded-2xl overflow-hidden group border-2 border-white focus-within:border-orange-200 transition-colors">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                        <Search className="h-6 w-6 text-orange-500 group-focus-within:text-orange-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for 'Biryani', 'Pizza' or 'Burger'..."
                        className="w-full pl-14 pr-32 py-5 bg-white outline-none text-base md:text-lg text-gray-800 placeholder-gray-400 font-semibold relative z-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center z-10">
                        <button className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-[0_4px_15px_rgba(249,115,22,0.3)]">
                            Search
                        </button>
                    </div>
                  </motion.div>
              </div>

              {/* Right Column: Premium Offer Carousel */}
              <div className="w-full lg:w-7/12 flex gap-5 overflow-x-auto no-scrollbar pb-6 pt-4 px-2 -mx-2 snap-x snap-mandatory">
                  
                  {/* Photo Card: Burger + Pizza */}
                  <div className="min-w-[300px] md:min-w-[380px] h-[240px] shrink-0 rounded-[2rem] shadow-xl relative overflow-hidden snap-center group cursor-pointer border-[5px] border-white transition-all duration-300 hover:shadow-orange-200 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gray-900 z-0">
                          <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoC7w66G8SNC5kciHoBMDfPAyUoS3X5lViSQ&s" 
                            alt="Burger Pizza Promo"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                          />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-10 pointer-events-none"></div>
                      
                      <div className="relative z-20 p-6 flex flex-col h-full justify-between">
                          <div className="flex items-center justify-between gap-2">
                            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow flex items-center gap-1.5">
                                <Tag size={13}/> Mega Combo
                            </div>
                            <FlashTimer initialSeconds={7200} />
                          </div>
                          <div>
                            <h2 className="text-3xl font-black text-white drop-shadow-md mb-1 leading-tight w-3/4">Burger + Pizza</h2>
                            <p className="text-xl font-extrabold text-yellow-400 drop-shadow-md mb-4 flex items-center gap-2">₹399 <span className="line-through text-white/50 text-sm font-semibold">₹699</span></p>
                            <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm group-hover:bg-white group-hover:text-gray-900 transition-colors inline-block">
                                Claim Deal
                            </span>
                          </div>
                      </div>
                  </div>
                  
                  {/* Gradient Card: 50% OFF */}
                  <div className="min-w-[300px] md:min-w-[380px] h-[240px] shrink-0 rounded-[2rem] shadow-xl relative overflow-hidden snap-center group cursor-pointer border-[5px] border-white bg-gradient-to-br from-orange-400 to-red-500 transition-all duration-300 hover:shadow-red-200 hover:-translate-y-1">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-bl-[100px] pointer-events-none z-0 hidden md:block"></div>
                      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none z-0"></div>
                      
                      <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                          <div className="flex items-center justify-between gap-2">
                            <div className="bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow flex items-center gap-1.5">
                                <Sparkles size={13}/> Welcome Offer
                            </div>
                            <FlashTimer initialSeconds={14400} />
                          </div>
                          <div>
                            <h2 className="text-4xl font-black text-white drop-shadow-md mb-1.5">50% OFF</h2>
                            <p className="text-white/90 font-bold mb-4 text-sm w-3/4 leading-snug">Enjoy up to ₹100 discount on your very first order with us!</p>
                            <span className="bg-white text-red-600 font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-[0_4px_15px_rgba(255,255,255,0.25)] group-hover:scale-105 transition-transform inline-block">
                                WELCOME50
                            </span>
                          </div>
                      </div>
                  </div>

              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Order our best food options (3D Display Section) */}
        <div className="pt-2 pattern-bg rounded-3xl p-6 mb-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Order our best food options</h3>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (scrollRef.current) scrollRef.current.scrollBy({ left: -600, behavior: "smooth" });
                  }} 
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
                >
                  <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <button 
                  onClick={() => {
                    if (scrollRef.current) scrollRef.current.scrollBy({ left: 600, behavior: "smooth" });
                  }} 
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
                >
                  <ArrowRight size={20} className="text-gray-700" />
                </button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="grid grid-rows-2 grid-flow-col gap-x-12 gap-y-12 overflow-x-auto no-scrollbar scroll-smooth pl-2 py-6 pb-10 -mx-4 px-4 sm:mx-0 sm:px-0 auto-cols-max"
          >
            {BEST_FOOD_OPTIONS.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                    setSearchQuery(item.name.split(' ')[0]);
                    setSelectedCuisine("All");
                    // Simple offset scroll down a bit
                    window.scrollTo({ top: 800, behavior: "smooth" });
                }}
                className="flex flex-col items-center gap-4 group transition-all w-36 outline-none"
              >
                {/* 3D Plate Emulation: Deep shadow, rim light effect, subtle float animation */}
                <div className="w-36 h-36 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-3 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-orange-500 rounded-full">
                    <div className="w-32 h-32 rounded-full shadow-[0_22px_30px_-10px_rgba(0,0,0,0.25)] group-hover:shadow-[0_30px_40px_-10px_rgba(234,88,12,0.4)] border-[6px] border-white/95 overflow-hidden relative transition-all duration-500 bg-white">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out" 
                            loading="lazy"
                        />
                        {/* Inner 3D vignette */}
                        <div className="absolute inset-0 rounded-full shadow-[inset_0_-8px_20px_rgba(0,0,0,0.3)] mix-blend-overlay"></div>
                    </div>
                </div>
                <span className="font-semibold text-[17px] text-gray-600 group-hover:text-gray-900 group-hover:font-extrabold transition-all tracking-tight">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Support the old Inspiration scroll to ensure it remains if users liked it */}
        <div className="hidden border-t border-gray-100 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">What's on your mind?</h3>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`flex flex-col items-center gap-3 shrink-0 group transition-all`}
              >
                <div className={`w-28 h-28 rounded-full overflow-hidden shadow-sm transition-all duration-300 border-4 ${
                  selectedCuisine === cuisine
                    ? "border-orange-500 scale-105 shadow-orange-200 shadow-xl"
                    : "border-transparent group-hover:shadow-lg group-hover:scale-105"
                }`}>
                    <img 
                      src={CUISINE_IMAGES[cuisine] || CUISINE_IMAGES["All"]} 
                      alt={cuisine} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                </div>
                <span className={`font-bold text-sm transition-colors ${selectedCuisine === cuisine ? "text-orange-600" : "text-gray-700 group-hover:text-gray-900"}`}>
                  {cuisine}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Brands / Restaurants */}
        {restaurants.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Top brands for you</h3>
              <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"><ChevronRight className="rotate-180" size={18} /></button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          </div>
        )}

        {/* Burger + Pizza Mid-Page Banner */}
        <div className="w-full rounded-[2rem] overflow-hidden shadow-xl mt-12 mb-8 relative cursor-pointer border-[5px] border-orange-50 group hover:shadow-orange-200/50 hover:shadow-2xl transition-all duration-300">
           <div className="relative w-full h-48 md:h-72 bg-gray-900 overflow-hidden">
               {/* Background Image requested by user */}
               <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoC7w66G8SNC5kciHoBMDfPAyUoS3X5lViSQ&s" 
                  alt="Burger + Pizza Offer"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
               />
               {/* Text Overlay overlaying the image */}
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center p-8 md:p-14">
                   <div className="max-w-xl group-hover:-translate-y-1 transition-transform duration-300">
                       <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-max mb-4 shadow"><Tag size={14}/> Limited Deal</div>
                       <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg flex items-center gap-3">Burger & Pizza</h2>
                       <p className="text-white text-lg md:text-2xl font-semibold mb-6 drop-shadow-md">Combo Offer at just <span className="text-yellow-400 font-black text-2xl md:text-4xl ml-1">₹399</span></p>
                       <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth'}); }} className="bg-orange-500 text-white font-extrabold px-8 py-3.5 rounded-xl border border-white/20 shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:bg-orange-600 hover:scale-105 transition-all text-sm md:text-base flex items-center gap-2">
                           Claim Offer <ArrowRight size={18}/>
                       </button>
                   </div>
               </div>
           </div>
        </div>

        {/* Popular Dishes — Swiggy-style 3-column vertical card grid */}
        <div>
          <div className="flex items-center justify-between mb-8 mt-4 border-t pt-8" style={{borderColor:'rgba(251,146,60,0.15)'}}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={18} className="text-orange-500" />
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Top Picks in Nagpur
                </h3>
              </div>
              <p className="text-gray-400 font-medium text-sm">Hand-picked dishes from the best restaurants around you</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-[20px] overflow-hidden border border-gray-100 flex flex-col animate-pulse" style={{background:'rgba(255,255,255,0.88)'}}>
                  <div className="w-full h-52 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : foods.length === 0 ? (
          <div className="text-center py-20 rounded-3xl shadow-sm border" style={{background:'rgba(255,255,255,0.7)', borderColor:'rgba(251,146,60,0.1)'}}>
              <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No dishes found</h3>
              <p className="text-gray-500 font-medium mb-6 max-w-sm mx-auto">We couldn't find any dishes matching "{searchQuery}" in {selectedCuisine !== "All" ? selectedCuisine : "our menu"}.</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCuisine("All"); }} className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
                  Explore all dishes
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence>
                {foods.map((food) => (
                  <FoodCard key={food.id} food={food} onAddToCart={onAddToCart} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <FeedbackSession />
      </div>
    </div>
  );
}
