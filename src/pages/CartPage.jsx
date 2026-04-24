// CartPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, ShoppingBag, ArrowRight, Info, ShieldCheck, FileText, ChevronRight, Plus, Minus, ArrowLeft, Percent, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import BackButton from "../components/BackButton";

function CartPage({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optInNoContact, setOptInNoContact] = useState(false);
  const [cookingInstructions, setCookingInstructions] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`/api/cart?userId=${user.id}`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (foodId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(foodId);
        return;
    }
    if (!user) return;
    try {
      // Optimistic UI updates
      setCartItems(prev => prev.map(item => item.foodId === foodId ? { ...item, quantity: newQuantity } : item));
      await axios.put(`/api/cart/${foodId}`, { quantity: newQuantity, userId: user.id });
    } catch (error) {
      console.error("Error updating quantity:", error);
      fetchCart(); // revert if fails
    }
  };

  const removeFromCart = async (foodId) => {
    if (!user) return;
    try {
      setCartItems(prev => prev.filter(item => item.foodId !== foodId));
      await axios.delete(`/api/cart/${foodId}?userId=${user.id}`);
    } catch (error) {
      console.error("Error removing from cart:", error);
      fetchCart(); // revert if fails
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50/50 pt-10 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <div className="animate-pulse bg-white h-40 w-full rounded-3xl shadow-sm border border-gray-100"></div>
                    <div className="animate-pulse bg-white h-40 w-full rounded-3xl shadow-sm border border-gray-100"></div>
                </div>
                <div className="w-full lg:w-[400px] animate-pulse bg-white border border-gray-100 h-96 rounded-3xl shadow-sm"></div>
            </div>
        </div>
    </div>
  );

  const itemTotal = (Array.isArray(cartItems) ? cartItems : []).reduce((sum, item) => sum + (item.food?.price || 0) * item.quantity, 0);
  const deliveryFee = itemTotal > 200 ? 0 : 40;
  const platformFee = 9;
  const gstCharges = Math.round(itemTotal * 0.05);
  const grandTotal = itemTotal + deliveryFee + platformFee + gstCharges;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32 font-sans text-gray-900">
        {/* Navigation / Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-24 flex items-center gap-6">
                 <button onClick={() => navigate(-1)} className="p-3 bg-gray-50 hover:bg-orange-50 rounded-2xl transition-colors text-gray-700 hover:text-orange-600 shadow-sm border border-gray-100">
                    <ArrowLeft size={22} strokeWidth={2.5}/>
                 </button>
                 <div className="flex flex-col">
                   <h1 className="text-2xl font-black tracking-tight leading-none text-gray-900">Secure Checkout</h1>
                   <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest hidden sm:block">Step 1 of 3</p>
                 </div>
                 <div className="hidden md:flex ml-auto items-center text-sm font-bold tracking-widest">
                     <span className="text-orange-600 flex items-center gap-2 border-b-[3px] border-orange-500 py-[33px] bg-orange-50/30 px-4"><ShoppingBag size={16}/> CART</span>
                     <span className="text-gray-400 flex items-center gap-2 px-6"><ShieldCheck size={16}/> PAYMENT</span>
                     <span className="text-gray-400 flex items-center gap-2 px-6"><Info size={16}/> TRACKING</span>
                 </div>
            </div>
        </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {cartItems.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-[3rem] shadow-sm border border-gray-100 min-h-[60vh] mt-10">
            <div className="w-56 h-56 mb-8 drop-shadow-xl hover:scale-105 transition-transform duration-500">
                <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0" alt="Empty Cart" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 text-center tracking-tight">Your cart is empty</h2>
            <p className="text-gray-500 text-center mb-10 max-w-sm font-medium text-lg leading-relaxed">Looks like you haven't made your choice yet. Explore our top restaurants!</p>
            <button 
               onClick={() => navigate("/")}
               className="bg-gray-900 hover:bg-black text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-gray-900/20 transition-all hover:-translate-y-1 active:scale-95 text-lg flex items-center gap-3"
            >
               Browse Restaurants <ArrowRight size={20} strokeWidth={3}/>
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT COLUMN: Order Items */}
            <div className="flex-1 w-full space-y-6">
                
                {/* ITEMS CARD */}
                <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
                     <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 tracking-tight">
                         <div className="bg-gray-100 p-2.5 rounded-full"><ShoppingBag size={22} strokeWidth={2.5} className="text-orange-500" /></div> 
                         Order summary ({cartItems.length} items)
                     </h2>
                     
                     <div className="divide-y divide-gray-100">
                         <AnimatePresence initial={false}>
                            {cartItems.map((item) => {
                                const numId = parseInt(String(item.food?.id).replace(/\D/g, '')) || (item.food?.name.length || 0);
                                const isVeg = numId % 2 !== 0; 
                                
                                return (
                                <motion.div
                                  key={item.foodId}
                                  layout
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                  className="flex gap-4 md:gap-6 py-6 items-start"
                                >
                                  <div className="flex gap-4 p-4 rounded-3xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
                                    {/* Item Image */}
                                    <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100 relative">
                                      <img
                                        src={item.food?.image}
                                        alt={item.food?.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur border shadow-sm p-1 rounded-md">
                                         <div className={`w-3.5 h-3.5 border-2 flex items-center justify-center rounded-[3px] ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                              <div className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                         </div>
                                      </div>
                                    </div>
                                  
                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                      <div>
                                        <div className="flex justify-between items-start gap-4 mb-0.5">
                                          <h3 className="font-extrabold text-gray-900 text-lg md:text-xl tracking-tight leading-tight line-clamp-2">{item.food?.name}</h3>
                                          <p className="text-xl font-black text-gray-900 tracking-tight shrink-0">₹{item.food?.price}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-400 truncate">{item.food?.category || 'Best in class'}</p>
                                      </div>
                                      
                                      <div className="flex items-end justify-between mt-4">
                                        <button onClick={() => removeFromCart(item.foodId)} className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 group-hover:opacity-100">
                                            <Trash2 size={16}/> Remove
                                        </button>
                                        
                                        {/* Inline Quantity Controls */}
                                        <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner border border-gray-200/50">
                                          <button 
                                            onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 rounded-lg transition-all shadow-sm"
                                          >
                                            <Minus size={18} strokeWidth={3}/>
                                          </button>
                                          <span className="w-8 text-center font-black text-gray-900 text-base">{item.quantity}</span>
                                          <button 
                                            onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-orange-600 hover:bg-white hover:text-orange-600 rounded-lg transition-all shadow-sm"
                                          >
                                            <Plus size={18} strokeWidth={3} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            })}
                         </AnimatePresence>
                     </div>
                     
                     <div className="mt-6 pt-6 border-t border-gray-100 flex items-start gap-3">
                         <Quote className="text-gray-300 fill-gray-100 shrink-0 rotate-180" size={24}/>
                         <textarea 
                             className="w-full bg-transparent resize-none outline-none text-sm font-medium text-gray-700 placeholder-gray-400 min-h-[40px]" 
                             placeholder="Any suggestions? We will pass it on..."
                             value={cookingInstructions}
                             onChange={(e) => setCookingInstructions(e.target.value)}
                         ></textarea>
                     </div>
                </div>

                {/* NO CONTACT DELIVERY BANNER */}
                <div onClick={() => setOptInNoContact(!optInNoContact)} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 cursor-pointer overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="flex gap-4 items-start relative z-10 w-full">
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                            <input type="checkbox" checked={optInNoContact} readOnly className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                        <div className="flex-1 pr-6">
                            <h4 className="font-extrabold text-gray-900 text-lg tracking-tight">Opt in for No-contact Delivery</h4>
                            <p className="text-[14px] font-medium text-gray-500 leading-relaxed mt-1">Unwell, or avoiding contact? Please select no-contact delivery. Partner will safely place the order outside your door.</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Bill Details & Actions */}
            <div className="w-full lg:w-[420px] pb-10">
                <div className="sticky top-28 space-y-6">

                    {/* COUPON CARD */}
                    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer group hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl text-blue-600 shadow-sm"><Percent size={20} strokeWidth={2.5}/></div>
                            <div>
                                <h4 className="font-extrabold text-gray-900 tracking-tight">Apply Coupon</h4>
                                <p className="text-xs text-blue-600 font-bold mt-0.5">Avail exciting offers & discounts</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-800 transition-colors" />
                    </div>

                    {/* BILLING CARD */}
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between tracking-tight">
                            Bill Details
                            <FileText size={20} className="text-gray-300"/>
                        </h3>
                        
                        <div className="space-y-4 text-[15px] font-medium text-gray-600">
                            <div className="flex justify-between items-center group">
                                <span className="group-hover:text-gray-900 transition-colors">Item Total</span>
                                <span className="font-bold text-gray-800">₹{itemTotal}</span>
                            </div>
                            
                            <div className="flex justify-between items-center group">
                                <span className="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
                                    Delivery Partner Fee <Info size={14} className="text-gray-400 group-hover:text-orange-500 transition-colors"/>
                                </span>
                                {deliveryFee === 0 ? (
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-xs line-through text-gray-400 font-bold">₹40</span>
                                        <span className="text-green-600 font-bold text-[13px] bg-green-50 px-2 py-0.5 rounded-md">FREE</span>
                                    </span>
                                ) : (
                                    <span className="font-bold text-gray-800">₹{deliveryFee}</span>
                                )}
                            </div>
                            
                            <div className="flex justify-between items-center group border-t border-gray-50 pt-4 mt-2">
                                <span className="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
                                    Platform Fee <Info size={14} className="text-gray-400 group-hover:text-orange-500 transition-colors"/>
                                </span>
                                <span className="font-bold text-gray-800">₹{platformFee}</span>
                            </div>
                            
                            <div className="flex justify-between items-center group">
                                <span className="flex items-center gap-1.5 group-hover:text-gray-900 transition-colors">
                                    GST & Restaurant Charges <Info size={14} className="text-gray-400 group-hover:text-orange-500 transition-colors"/>
                                </span>
                                <span className="font-bold text-gray-800">₹{gstCharges}</span>
                            </div>
                            
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>
                            
                            <div className="flex justify-between items-center">
                                <span className="font-black text-xl text-gray-900 tracking-tight">TO PAY</span>
                                <span className="font-black text-2xl text-gray-900">₹{grandTotal}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-gray-100 flex gap-3 text-gray-500 items-start">
                        <FileText size={16} className="shrink-0 mt-0.5 opacity-60"/>
                        <div>
                            <p className="text-[13px] font-bold text-gray-700 leading-snug mb-1">Review your order and address details to avoid cancellations</p>
                            <p className="text-[11px] leading-relaxed opacity-80 font-medium">
                                <span className="text-red-500 font-bold">Note:</span> If you choose to cancel, you can do it within 60 seconds after placing order. Post which you will be charged 100% cancellation fee.
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-orange-500/25 transition-all transform active:scale-[0.98] flex items-center justify-between px-6 text-lg tracking-tight min-h-[64px]"
                    >
                        <span>Proceed to Checkout</span>
                        <ArrowRight size={22} strokeWidth={2.5} />
                    </button>

                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;

