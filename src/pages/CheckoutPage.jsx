import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CreditCard, MapPin, CheckCircle, Navigation, Loader2,
  ShieldCheck, Smartphone, Banknote, ChevronRight, Gift,
  Tag, Package, Truck, Clock, Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import BackButton from "../components/BackButton";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_SbHBUrdmTmianV";

const mapPinIcon = new L.DivIcon({
  html: `<div style="background:linear-gradient(135deg,#f97316,#ea580c);width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(249,115,22,0.5);position:relative;">
           <div style="width:10px;height:10px;background:white;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div>
         </div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position ? <Marker position={position} icon={mapPinIcon} /> : null;
}

function MapCenterController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const PAYMENT_METHODS = [
  {
    id: "razorpay",
    label: "Pay Online",
    desc: "UPI, Cards, Net Banking & Wallets",
    icon: ShieldCheck,
    iconColor: "#3b82f6",
    badge: "Razorpay",
    badgeColor: "text-blue-600 bg-blue-50 border-blue-200",
    emoji: "💳",
  },
  {
    id: "upi",
    label: "UPI / QR Code",
    desc: "PhonePe, GPay, Paytm & more",
    icon: Smartphone,
    iconColor: "#10b981",
    badge: "Instant",
    badgeColor: "text-green-600 bg-green-50 border-green-200",
    emoji: "📱",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: Banknote,
    iconColor: "#f97316",
    badge: null,
    emoji: "💵",
  },
];

// Step indicator component
function StepBadge({ num, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
        style={{
          background: done ? "#10b981" : active ? "linear-gradient(135deg,#f97316,#ea580c)" : "rgba(0,0,0,0.06)",
          color: done || active ? "white" : "#9ca3af",
        }}
      >
        {done ? <CheckCircle size={13} /> : num}
      </div>
      <span className="text-sm font-bold hidden sm:block"
        style={{ color: done ? "#10b981" : active ? "#ea580c" : "#9ca3af" }}>
        {label}
      </span>
    </div>
  );
}

export default function CheckoutPage({ onOrderSuccess, user }) {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [mapPosition, setMapPosition] = useState({ lat: 21.1458, lng: 79.0882 }); // Nagpur default
  const [addressText, setAddressText] = useState("");
  const [rzpLoaded, setRzpLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [activeStep, setActiveStep] = useState(1); // 1=delivery, 2=payment, 3=review
  const navigate = useNavigate();

  useEffect(() => {
    if (user) axios.get(`/api/cart?userId=${user.id}`).then(r => setCartItems(r.data)).catch(console.error);
    loadRazorpay().then(setRzpLoaded);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(pos =>
        setMapPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      );
    }
  }, [user]);

  const subtotal = (Array.isArray(cartItems) ? cartItems : [])
    .reduce((s, i) => s + (i.food?.price || 0) * i.quantity, 0);
  const totalQty = (Array.isArray(cartItems) ? cartItems : [])
    .reduce((s, i) => s + i.quantity, 0);
  const comboDiscount = totalQty >= 3 ? 50 : 0;
  const qualifiesForFreeItem = subtotal >= 400;
  const finalItemsToSubmit = qualifiesForFreeItem
    ? [...cartItems, { foodId: "free-gift-001", quantity: 1, food: { name: "🎁 Free Choco Lava Cake", price: 0 } }]
    : cartItems;
  const deliveryFee = subtotal >= 300 ? 0 : 40;
  const platformFee = 5;
  const gst = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + deliveryFee + platformFee + gst - comboDiscount - discountAmount);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    setPromoError("");
    if (code === "SAVE20") {
      setDiscountAmount(Math.round(subtotal * 0.2));
      setAppliedPromo("SAVE20 — 20% off applied!");
    } else if (code === "FLAT100") {
      setDiscountAmount(100);
      setAppliedPromo("FLAT100 — ₹100 off applied!");
    } else {
      setPromoError("Invalid or expired promo code.");
      setDiscountAmount(0);
      setAppliedPromo("");
    }
  };

  const saveOrder = async (paymentInfo = {}) => {
    const res = await axios.post("/api/checkout", {
      paymentMethod, paymentInfo, total, address: addressText,
      coordinates: mapPosition, items: finalItemsToSubmit, userId: user.id,
    });
    if (res.data.success) { setOrderId(res.data.orderId); setSuccess(true); onOrderSuccess(); }
  };

  const handleRazorpayPayment = async () => {
    if (!rzpLoaded) { alert("Razorpay is loading, please try again."); return; }
    setProcessing(true);
    try {
      const orderRes = await axios.post("/api/razorpay/create-order", { amount: total });
      if (!orderRes.data.success) { alert("Could not initiate payment."); setProcessing(false); return; }
      const rzpOrder = orderRes.data.order;
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        order_id: rzpOrder.id,
        name: "FoodieExpress",
        description: `Payment for ${cartItems.length} item(s)`,
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            const v = await axios.post("/api/razorpay/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: { total, address: addressText, coordinates: mapPosition, items: finalItemsToSubmit, userId: user.id },
            });
            if (v.data.success) { setOrderId(v.data.orderId); setSuccess(true); onOrderSuccess(); }
            else alert("Payment verification failed. Please contact support.");
          } catch { alert("Payment verification error."); } finally { setProcessing(false); }
        },
        modal: { ondismiss: () => setProcessing(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", r => { alert(`Payment failed: ${r.error.description}`); setProcessing(false); });
      rzp.open();
    } catch { alert("An error occurred. Please try again."); setProcessing(false); }
  };

  const handleCOD = async () => {
    setProcessing(true);
    try { await saveOrder({ method: "Cash on Delivery" }); }
    catch (e) { console.error(e); } finally { setProcessing(false); }
  };

  const handleCheckout = () => paymentMethod === "cod" ? handleCOD() : handleRazorpayPayment();

  // ── SUCCESS STATE ────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4" style={{ background: "transparent" }}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-sm w-full text-center rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(251,146,60,0.15)" }}
        >
          {/* Top colored strip */}
          <div className="h-2" style={{ background: "linear-gradient(90deg,#f97316,#ea580c,#fb923c)" }} />
          <div className="p-10">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 250, delay: 0.1 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100"
              style={{ background: "linear-gradient(135deg,#d1fae5,#a7f3d0)" }}
            >
              <CheckCircle size={48} className="text-green-600" strokeWidth={1.5} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 bg-green-50 text-green-700 border border-green-200">
                ✓ You're all set!
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Order's on its way! 🎉</h2>
              <p className="text-gray-500 text-sm mb-1">Order <span className="font-black text-gray-800 font-mono">#{String(orderId).slice(-10).toUpperCase()}</span> confirmed.</p>
              <p className="text-gray-400 text-sm mb-8">Your food is being prepared. Hang tight — it'll be there soon!</p>

              {/* ETA bar */}
              <div className="flex items-center justify-center gap-6 mb-8 py-4 rounded-2xl border"
                style={{ background: "rgba(251,146,60,0.05)", borderColor: "rgba(251,146,60,0.15)" }}>
                {[
                  { icon: "🧑‍🍳", label: "Getting cooked", sub: "Chef is on it" },
                  { icon: "🛵", label: "Out for delivery", sub: "Almost there!" },
                  { icon: "🏠", label: "Arrived!", sub: "Enjoy your meal" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <p className="text-xs font-black text-gray-700">{s.label}</p>
                    <p className="text-[10px] text-gray-400">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button onClick={() => navigate(`/track/${orderId}`)}
                  className="w-full text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>
                  🛵 See where my order is
                </button>
                <button onClick={() => navigate("/")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all">
                  Order something else
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── CHECKOUT PAGE ────────────────────────────────────────
  return (
    <div className="min-h-screen pb-20" style={{ background: "transparent" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <BackButton label="Back to Cart" fallback="/cart" />
          <div className="flex items-center justify-between mt-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Almost there! 🙌</h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">{totalQty} {totalQty !== 1 ? "items" : "item"} in your bag · ₹{subtotal}</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3">
              <StepBadge num={1} label="Delivery" active={activeStep === 1} done={activeStep > 1} />
              <div className="w-6 h-px bg-gray-200 hidden sm:block" />
              <StepBadge num={2} label="Payment" active={activeStep === 2} done={activeStep > 2} />
              <div className="w-6 h-px bg-gray-200 hidden sm:block" />
              <StepBadge num={3} label="Review" active={activeStep === 3} done={false} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* DELIVERY ADDRESS CARD */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="rounded-2xl overflow-hidden shadow-sm border"
              style={{ background: "rgba(255,255,255,0.88)", borderColor: "rgba(251,146,60,0.12)" }}>

              {/* Card header */}
              <div className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "rgba(251,146,60,0.1)", background: "rgba(251,146,60,0.03)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>
                    <MapPin size={15} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-sm">Where should we deliver?</h3>
                    <p className="text-xs text-gray-400">Drop a pin or type your address below</p>
                  </div>
                </div>
                <button
                  onClick={() => navigator.geolocation && navigator.geolocation.getCurrentPosition(
                    pos => setMapPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                  )}
                  className="flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-xl transition-all"
                  style={{ background: "rgba(251,146,60,0.1)", color: "#ea580c" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(251,146,60,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(251,146,60,0.1)"}
                >
                  <Navigation size={12} fill="currentColor" className="rotate-90" /> Use my location
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Map */}
                <div className="relative h-60 rounded-xl overflow-hidden border"
                  style={{ borderColor: "rgba(0,0,0,0.08)", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)" }}>
                  <MapContainer center={mapPosition} zoom={14} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution="&copy; CARTO"
                    />
                    <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                    <MapCenterController position={mapPosition} />
                  </MapContainer>
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900/75 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none z-10 flex items-center gap-1.5">
                    <MapPin size={10} /> Tap anywhere to pin your location
                  </div>
                </div>

                {/* Address input */}
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-3.5 rounded-xl text-sm resize-none outline-none transition-all font-medium"
                    style={{
                      background: "rgba(251,146,60,0.04)",
                      border: "1.5px solid rgba(251,146,60,0.18)",
                    }}
                    placeholder="e.g. Flat 4B, Green Residency, Near City Mall..."
                    value={addressText}
                    onChange={e => setAddressText(e.target.value)}
                    rows={2}
                    onFocus={e => { e.target.style.borderColor = "#f97316"; e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(251,146,60,0.18)"; e.target.style.boxShadow = "none"; }}
                  />
                  {addressText && (
                    <div className="absolute right-3 top-3">
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  )}
                </div>

                {/* Delivery time estimate */}
                <div className="flex items-center gap-4 flex-wrap">
                  {[
                    { icon: Clock, text: "Arrives in 30–45 mins", color: "#f97316" },
                    { icon: Truck, text: subtotal >= 300 ? "🎉 Free delivery unlocked!" : `₹40 delivery · free above ₹300`, color: subtotal >= 300 ? "#10b981" : "#6b7280" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: b.color }}>
                      <b.icon size={13} /> {b.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* PAYMENT METHOD CARD */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl overflow-hidden shadow-sm border"
              style={{ background: "rgba(255,255,255,0.88)", borderColor: "rgba(251,146,60,0.12)" }}>

              <div className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: "rgba(251,146,60,0.1)", background: "rgba(251,146,60,0.03)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>
                  <CreditCard size={15} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">How do you want to pay?</h3>
                  <p className="text-xs text-gray-400">Pick whatever's easiest for you</p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {PAYMENT_METHODS.map(m => {
                  const selected = paymentMethod === m.id;
                  return (
                    <label key={m.id}
                      className="flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: selected ? "#f97316" : "rgba(0,0,0,0.07)",
                        background: selected ? "rgba(249,115,22,0.04)" : "rgba(255,255,255,0.7)",
                        boxShadow: selected ? "0 0 0 1px rgba(249,115,22,0.2)" : "none",
                      }}
                    >
                      <input type="radio" name="payment" className="hidden"
                        checked={selected} onChange={() => setPaymentMethod(m.id)} />

                      {/* Emoji icon */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: selected ? `${m.iconColor}18` : "rgba(0,0,0,0.04)" }}>
                        {m.emoji}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-black text-gray-900 text-sm">{m.label}</p>
                          {m.badge && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">{m.desc}</p>
                      </div>

                      {/* Custom radio */}
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                        style={{ borderColor: selected ? "#f97316" : "#d1d5db" }}>
                        {selected && (
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#f97316" }} />
                        )}
                      </div>
                    </label>
                  );
                })}

                {/* Security note */}
                <div className="flex items-center gap-2 pt-1">
                  <ShieldCheck size={13} className="text-green-500" />
                  <span className="text-xs font-semibold text-gray-400">Your payment is 100% safe — secured by Razorpay</span>
                </div>
              </div>
            </motion.div>

            {/* OFFERS CARD */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl overflow-hidden shadow-sm border"
              style={{ background: "rgba(255,255,255,0.88)", borderColor: "rgba(251,146,60,0.12)" }}>

              <div className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: "rgba(251,146,60,0.1)", background: "rgba(251,146,60,0.03)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>
                  <Tag size={15} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">Offers & Promo Codes</h3>
                  <p className="text-xs text-gray-400">Apply a coupon to save more</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Quick promo chips */}
                <div className="flex gap-3 flex-wrap">
                  {[
                    { code: "SAVE20", label: "SAVE20", sub: "20% off", color: "text-purple-600 bg-purple-50 border-purple-200" },
                    { code: "FLAT100", label: "FLAT100", sub: "₹100 off", color: "text-orange-600 bg-orange-50 border-orange-200" },
                  ].map(p => (
                    <button key={p.code}
                      onClick={() => { setPromoCode(p.code); setPromoError(""); }}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all hover:scale-105 flex flex-col items-center ${p.color}`}>
                      <span>{p.label}</span>
                      <span className="font-semibold opacity-70 text-[10px]">{p.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Promo input */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl border transition-all"
                  style={{ background: "rgba(251,146,60,0.04)", borderColor: "rgba(251,146,60,0.2)" }}>
                  <input
                    type="text"
                    placeholder="Have a code? Type it here..."
                    value={promoCode}
                    onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                    className="flex-1 bg-transparent text-sm font-bold outline-none px-3 uppercase tracking-wider placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
                    onKeyDown={e => e.key === "Enter" && applyPromo()}
                  />
                  <button onClick={applyPromo}
                    className="text-white text-xs font-black px-5 py-2.5 rounded-lg transition-all"
                    style={{ background: "linear-gradient(135deg,#1a1a1a,#374151)" }}>
                    Apply
                  </button>
                </div>

                <AnimatePresence>
                  {appliedPromo && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 border border-green-200">
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-xs font-black text-green-700">{appliedPromo}</span>
                    </motion.div>
                  )}
                  {promoError && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-xs font-bold text-red-500 px-2">{promoError}</motion.div>
                  )}
                </AnimatePresence>

                {/* Active offers */}
                {qualifiesForFreeItem && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                    style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" }}>
                    <Gift size={18} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-green-700">🎁 You've unlocked a free Choco Lava Cake!</p>
                      <p className="text-[11px] text-green-600/70">A little thank-you for ordering over ₹400 🎂</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: ORDER SUMMARY ─────────────── */}
          <div className="space-y-5">

            {/* Items summary */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="rounded-2xl overflow-hidden shadow-sm border sticky top-24"
              style={{ background: "rgba(255,255,255,0.88)", borderColor: "rgba(251,146,60,0.12)" }}>

              <div className="px-5 py-4 border-b"
                style={{ borderColor: "rgba(251,146,60,0.1)", background: "rgba(251,146,60,0.03)" }}>
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-orange-500" />
                  <h3 className="font-black text-gray-900 text-sm">Order Summary</h3>
                  <span className="ml-auto text-xs font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    {totalQty} item{totalQty !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Items list */}
              <div className="divide-y max-h-64 overflow-y-auto" style={{ divideColor: "rgba(0,0,0,0.04)" }}>
                {(Array.isArray(cartItems) ? cartItems : []).map(item => (
                  <div key={item.foodId} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
                      <img
                        src={item.food?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"}
                        alt={item.food?.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{item.food?.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity} · ₹{item.food?.price} each</p>
                    </div>
                    <p className="text-sm font-black text-gray-900 shrink-0">₹{(item.food?.price || 0) * item.quantity}</p>
                  </div>
                ))}

                {qualifiesForFreeItem && (
                  <div className="flex items-center gap-3 px-5 py-3.5" style={{ background: "rgba(16,185,129,0.05)" }}>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl shrink-0">🎂</div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-green-700">Free Choco Lava Cake 🎂</p>
                      <p className="text-[10px] text-green-600/70">On us — enjoy!</p>
                    </div>
                    <span className="text-xs font-black text-white bg-green-500 px-2 py-0.5 rounded-lg">FREE</span>
                  </div>
                )}
              </div>

              {/* Bill breakdown */}
              <div className="p-5 space-y-2.5 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                {[
                  { label: "Item Total", value: `₹${subtotal}`, color: "text-gray-600" },
                  { label: "Delivery Fee", value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`, color: deliveryFee === 0 ? "text-green-600" : "text-gray-600" },
                  { label: "Platform Fee", value: `₹${platformFee}`, color: "text-gray-600" },
                  { label: "GST (5%)", value: `₹${gst}`, color: "text-gray-600" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">{row.label}</span>
                    <span className={`font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}

                {comboDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">Combo deal (3+ items)</span>
                    <span className="font-bold text-green-600">–₹{comboDiscount}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">Promo Discount</span>
                    <span className="font-bold text-green-600">–₹{discountAmount}</span>
                  </div>
                )}

                {/* Total savings */}
                {(comboDiscount + discountAmount + (deliveryFee === 0 ? 40 : 0)) > 0 && (
                  <div className="px-3 py-2 rounded-xl text-center"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px dashed rgba(16,185,129,0.3)" }}>
                    <p className="text-xs font-black text-green-700">
                      🎉 You're saving ₹{comboDiscount + discountAmount + (deliveryFee === 0 ? 40 : 0)} on this order!
                    </p>
                  </div>
                )}

                {/* Grand total */}
                <div className="flex items-center justify-between pt-3 border-t border-dashed"
                  style={{ borderColor: "rgba(251,146,60,0.2)" }}>
                  <span className="font-black text-gray-900 text-base">To Pay</span>
                  <span className="font-black text-2xl" style={{ color: "#ea580c" }}>₹{total}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  onClick={handleCheckout}
                  disabled={processing || cartItems.length === 0}
                  className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={!(processing || cartItems.length === 0) ? {
                    background: "linear-gradient(135deg,#f97316,#ea580c)",
                    boxShadow: "0 8px 25px rgba(249,115,22,0.35)",
                  } : { background: "#d1d5db" }}
                  onMouseEnter={e => { if (!processing && cartItems.length > 0) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {processing ? (
                    <><Loader2 size={19} className="animate-spin" /> Placing your order...</>
                  ) : paymentMethod === "cod" ? (
                    <><Package size={17} /> Confirm Order — Pay on Delivery</>
                  ) : (
                    <><ShieldCheck size={17} /> Pay ₹{total} & Place Order</>
                  )}
                </button>
                <p className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-400 font-medium">
                  <ShieldCheck size={11} className="text-green-500" /> Safe & encrypted payment
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
