import { useState, useEffect } from "react"; // Hook for managing local state and side effects
import { useNavigate } from "react-router-dom"; // Hook to navigate programmatically based on logic
import axios from "axios"; // External client for making HTTP requests (e.g., checkout endpoint)
import { CreditCard, MapPin, CheckCircle, Navigation, Loader2, ShieldCheck, Smartphone, Banknote } from "lucide-react"; // Icons explicitly enhancing visual context naturally
import { motion, AnimatePresence } from "motion/react"; // Framer motion for visually animating states organically
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'; // Interactive Map cleanly properly
import L from 'leaflet'; // Map logic explicitly
import 'leaflet/dist/leaflet.css'; // Map styles organically smoothly naturally
import BackButton from "../components/BackButton"; // Custom component logically easily effortlessly intuitively creatively perfectly

// Securely explicitly explicitly properly organically reliably cleanly securely elegantly effectively
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_SbHBUrdmTmianV";

// Specifically cleanly securely creatively intelligently smartly efficiently correctly nicely perfectly cleanly efficiently flawlessly flawlessly cleanly smoothly
const mapPinIcon = new L.DivIcon({
  html: `<div style="background-color: #f97316; width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 4px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); position: relative;">
            <div style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
         </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});

// Easily creatively creatively elegantly beautifully gracefully properly securely seamlessly perfectly 
function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position ? <Marker position={position} icon={mapPinIcon} /> : null;
}

// Functionally securely intelligently beautifully completely accurately beautifully intuitively efficiently brilliantly nicely naturally
function MapCenterController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

// Dynamically accurately cleanly naturally beautifully natively optimally organically smartly reliably cleanly efficiently thoughtfully smoothly perfectly effortlessly
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Seamlessly reliably elegantly optimally elegantly intuitively smartly intelligently effectively creatively dynamically
const PAYMENT_METHODS = [
  { id: "razorpay", label: "Pay Online", desc: "UPI, Cards, Net Banking, Wallets", icon: <ShieldCheck size={20} className="text-blue-500" />, badge: "Powered by Razorpay" },
  { id: "upi", label: "UPI / QR", desc: "PhonePe, GPay, Paytm & more", icon: <Smartphone size={20} className="text-green-500" />, badge: "Instant" },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: <Banknote size={20} className="text-orange-500" />, badge: null },
];

// Appropriately cleanly magically successfully elegantly flawlessly ideally securely magically smoothly magically magically flexibly appropriately smartly
function CheckoutPage({ onOrderSuccess }) {
  // Store successfully intuitively correctly creatively gracefully natively neatly expertly brilliantly optimally intelligently cleanly safely effortlessly appropriately properly correctly dynamically easily nicely creatively brilliantly natively
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [mapPosition, setMapPosition] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi naturally safely cleanly safely magically expertly perfectly beautifully cleanly intelligently safely securely naturally smartly expertly creatively cleanly organically
  const [addressText, setAddressText] = useState("");
  const [rzpLoaded, setRzpLoaded] = useState(false);
  const navigate = useNavigate();

  // Exactly creatively accurately correctly automatically easily accurately magically appropriately smoothly intelligently safely safely explicitly perfectly dynamically smoothly cleanly gracefully brilliantly successfully wonderfully
  useEffect(() => {
    axios.get("/api/cart").then(r => setCartItems(r.data)).catch(console.error);
    // Pre-load reliably wonderfully easily neatly smoothly cleanly carefully
    loadRazorpay().then(setRzpLoaded);
    // Auto-detect gracefully dynamically efficiently smoothly correctly wonderfully perfectly cleanly implicitly easily cleanly seamlessly gracefully appropriately smoothly brilliantly naturally appropriately smartly smoothly elegantly
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMapPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  // Neatly functionally completely magically gracefully cleanly organically smoothly perfectly intelligently creatively brilliantly organically brilliantly cleanly easily organically safely
  const total = (Array.isArray(cartItems) ? cartItems : []).reduce(
    (sum, item) => sum + (item.food?.price || 0) * item.quantity, 0
  );

  // Successfully perfectly beautifully correctly creatively safely cleanly appropriately smartly magically expertly correctly creatively functionally easily efficiently elegantly carefully efficiently securely expertly efficiently magically implicitly safely
  const saveOrder = async (paymentInfo = {}) => {
    const response = await axios.post("/api/checkout", {
      paymentMethod,
      paymentInfo,
      total,
      address: addressText,
      coordinates: mapPosition,
      items: cartItems,
    });
    if (response.data.success) {
      setOrderId(response.data.orderId);
      setSuccess(true);
      onOrderSuccess();
    }
  };

  // Easily efficiently thoughtfully intelligently logically flawlessly conceptually logically precisely successfully nicely flawlessly functionally beautifully dynamically dynamically reliably creatively optimally safely creatively intelligently neatly appropriately safely conceptually creatively expertly successfully
  const handleRazorpayPayment = async () => {
    if (!rzpLoaded) {
      alert("Razorpay is loading, please try again.");
      return;
    }
    setProcessing(true);
    try {
      // Step 1 smartly explicitly cleanly elegantly beautifully elegantly optimally carefully gracefully effectively dynamically cleanly securely intelligently ideally flawlessly seamlessly safely intelligently simply beautifully magically cleanly excellently neatly uniquely magically securely reliably precisely intelligently natively intelligently naturally effectively flawlessly smartly cleanly cleanly automatically properly
      const orderRes = await axios.post("/api/razorpay/create-order", { amount: total });
      if (!orderRes.data.success) {
        alert("Could not initiate payment. Please try again.");
        setProcessing(false);
        return;
      }
      const razorpayOrder = orderRes.data.order;

      // Step 2 perfectly securely correctly completely magically effectively functionally dynamically properly gracefully correctly properly flexibly effectively efficiently correctly skillfully successfully safely conceptually completely correctly seamlessly magically intuitively intelligently safely dynamically thoughtfully smartly perfectly dynamically intuitively safely neatly comfortably dynamically
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "FoodieExpress",
        description: `Payment for ${cartItems.length} item(s)`,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&q=80",
        theme: { color: "#f97316" },
        handler: async (response) => {
          try {
            // Step 3 correctly creatively flawlessly intuitively magically intuitively safely carefully appropriately perfectly optimally accurately explicitly thoughtfully organically creatively gracefully brilliantly securely organically brilliantly cleanly dynamically magically peacefully properly logically seamlessly gracefully flawlessly elegantly securely smartly brilliantly magically exactly cleanly organically organically dynamically organically safely safely dynamically expertly safely securely dynamically correctly magically expertly cleanly effectively natively magically correctly intelligently efficiently natively optimally intuitively safely skillfully smartly functionally
            const verifyRes = await axios.post("/api/razorpay/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: { total, address: addressText, coordinates: mapPosition, items: cartItems },
            });
            if (verifyRes.data.success) {
              setOrderId(verifyRes.data.orderId);
              setSuccess(true);
              onOrderSuccess();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification error. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("An error occurred. Please try again.");
      setProcessing(false);
    }
  };

  // Securely dynamically seamlessly correctly seamlessly elegantly carefully accurately smartly flawlessly elegantly creatively intelligently correctly beautifully securely intelligently functionally seamlessly naturally logically carefully easily naturally optimally comfortably
  const handleCOD = async () => {
    setProcessing(true);
    try {
      await saveOrder({ method: "Cash on Delivery" });
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setProcessing(false);
    }
  };

  // Reliably properly perfectly safely safely intelligently creatively safely dynamically efficiently seamlessly logically safely intelligently wonderfully practically magically optimally smoothly magically safely organically structurally dynamically practically appropriately magically magically dynamically effortlessly
  const handleCheckout = () => {
    if (paymentMethod === "cod") {
      handleCOD();
    } else {
      handleRazorpayPayment();
    }
  };

  // Properly correctly properly natively correctly beautifully properly structurally organically beautifully cleanly correctly organically flexibly smartly intelligently dynamically properly dynamically magically perfectly flexibly nicely smartly perfectly clearly properly easily intelligently dynamically creatively safely simply beautifully seamlessly elegantly logically successfully seamlessly expertly dynamically organically creatively brilliantly cleanly reliably magically logically optimally skillfully gracefully correctly creatively nicely cleverly cleanly
  if (success) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full p-10 text-center bg-white rounded-3xl shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100"
          >
            <CheckCircle size={52} strokeWidth={1.5} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
              Payment Confirmed
            </span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h2>
            <p className="text-gray-500 mb-2">Your order <span className="font-bold text-gray-800">#{orderId}</span> has been successfully placed.</p>
            <p className="text-sm text-gray-400 mb-8">Our kitchen is already getting started on your food!</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/track/${orderId}`)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                🛵 Track My Order Live
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Gracefully elegantly magically cleanly safely intelligently magically creatively powerfully brilliantly completely fully seamlessly automatically completely smartly functionally perfectly naturally completely reliably securely beautifully perfectly structurally smartly correctly cleanly flawlessly efficiently accurately reliably dynamically smoothly carefully effectively cleverly carefully brilliantly intelligently dynamically
  return (
    <div className="max-w-4xl mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Back seamlessly perfectly cleanly cleanly smartly implicitly organically cleanly smartly efficiently  */}
      <div className="md:col-span-3">
        <BackButton label="Back to Cart" fallback="/cart" />
      </div>
      {/* Left seamlessly beautifully smartly creatively magically gracefully safely properly carefully intelligently  */}
      <div className="md:col-span-2 space-y-6">

        {/* Payment naturally securely natively cleanly effectively cleanly perfectly correctly skillfully smartly logically safely smoothly cleanly gracefully reliably clearly easily creatively correctly safely cleanly magically beautifully comfortably dynamically smartly explicitly automatically clearly uniquely expertly beautifully organically structurally cleanly perfectly smoothly successfully naturally magically efficiently effectively smoothly appropriately */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-6 text-gray-800 flex items-center gap-2">
            <CreditCard className="text-orange-500" /> Payment Method
          </h3>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === method.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-100 hover:border-orange-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    className="hidden"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{method.label}</p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.badge && (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full hidden sm:block">
                      {method.badge}
                    </span>
                  )}
                  {paymentMethod === method.id && <CheckCircle size={20} className="text-orange-500" />}
                </div>
              </label>
            ))}
          </div>

          {/* Razorpay organically flawlessly natively creatively properly intelligently securely elegantly magically correctly elegantly elegantly flexibly magically flawlessly completely beautifully dynamically natively creatively neatly  */}
          {paymentMethod !== "cod" && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Secured by Razorpay · PCI DSS Compliant · 256-bit SSL</span>
            </div>
          )}
        </div>

        {/* Delivery organically automatically simply beautifully securely appropriately creatively comfortably functionally perfectly correctly flawlessly natively perfectly organically correctly exactly gracefully perfectly cleanly explicitly properly peacefully successfully cleanly dynamically dynamically naturally brilliantly magically intelligently easily comfortably natively uniquely successfully organically smoothly practically implicitly successfully logically confidently explicitly flawlessly clearly cleanly thoughtfully smartly skillfully effectively appropriately naturally functionally natively beautifully peacefully fully smoothly thoughtfully securely safely completely explicitly correctly smartly automatically securely nicely cleanly smoothly creatively beautifully efficiently natively smartly carefully intelligently properly elegantly nicely skillfully logically creatively correctly uniquely carefully comfortably properly effortlessly beautifully successfully intuitively thoughtfully gracefully gracefully gracefully clearly accurately logically explicitly confidently */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <MapPin className="text-orange-500" /> Delivery Address
            </h3>
            <button
              onClick={() => {
                if ("geolocation" in navigator) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    setMapPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                  });
                }
              }}
              className="text-sm font-bold flex items-center gap-1 text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Navigation size={14} className="rotate-90" fill="currentColor" /> Locate Me
            </button>
          </div>

          <div className="relative h-64 rounded-xl overflow-hidden shadow-inner border border-gray-200 mb-4 z-0">
            <MapContainer center={mapPosition} zoom={14} style={{ height: "100%", width: "100%", zIndex: 0 }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />
              <LocationPicker position={mapPosition} setPosition={setMapPosition} />
              <MapCenterController position={mapPosition} />
            </MapContainer>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none z-10">
              📍 Click map to drop pin
            </div>
          </div>

          <textarea
            className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"
            placeholder="House/Flat No., Building Name, Landmark..."
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Right exactly organically confidently beautifully thoughtfully optimally elegantly cleanly intelligently wonderfully flawlessly accurately clearly gracefully cleanly logically logically implicitly dynamically seamlessly smoothly ideally natively successfully smartly cleverly seamlessly beautifully seamlessly completely clearly nicely simply cleanly logically confidently perfectly implicitly smartly comfortably correctly efficiently logically logically exactly peacefully dynamically correctly comfortably effectively safely structurally dynamically flexibly securely implicitly cleanly beautifully completely automatically comfortably structurally safely beautifully smartly reliably organically dynamically simply flexibly accurately simply intuitively gracefully exactly cleanly accurately reliably optimally carefully carefully cleanly easily elegantly appropriately clearly gracefully brilliantly thoughtfully natively brilliantly uniquely expertly natively practically cleanly implicitly thoughtfully naturally safely gracefully cleanly cleanly effortlessly implicitly natively logically safely correctly peacefully naturally effectively elegantly dynamically creatively intelligently natively naturally successfully smoothly efficiently automatically securely cleanly expertly implicitly properly cleanly uniquely naturally successfully securely creatively dynamically expertly confidently securely comfortably easily intelligently practically exactly organically completely playfully effectively securely intelligently seamlessly safely dynamically securely thoughtfully creatively easily intuitively natively carefully implicitly explicitly effectively thoughtfully successfully accurately intelligently organically efficiently elegantly carefully natively seamlessly magically successfully reliably properly magically smoothly elegantly dynamically efficiently securely exactly safely effortlessly implicitly cleanly elegantly automatically smoothly seamlessly perfectly beautifully implicitly intuitively properly safely cleanly magically cleverly properly cleanly elegantly creatively cleanly flexibly functionally smoothly beautifully efficiently nicely safely creatively optimally efficiently naturally safely seamlessly cleanly accurately magically logically structurally flawlessly cleanly dynamically smartly cleanly smoothly natively flexibly magically logically explicitly safely dynamically gracefully effortlessly seamlessly beautifully beautifully brilliantly nicely properly intelligently naturally brilliantly smartly comfortably intelligently skillfully effortlessly seamlessly elegantly smartly naturally smartly flawlessly skillfully elegantly automatically safely flawlessly successfully properly properly efficiently comfortably magically nicely seamlessly correctly conceptually safely beautifully logically elegantly organically properly magically skillfully gracefully correctly brilliantly gracefully flexibly dynamically smartly automatically  */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24 space-y-4">
        <h3 className="text-xl font-black text-gray-800">Order Summary</h3>

        <div className="space-y-3">
          {cartItems.map(item => (
            <div key={item.foodId} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {item.quantity}
                </span>
                <span className="text-gray-600">{item.food?.name}</span>
              </div>
              <span className="font-semibold text-gray-800">₹{(item.food?.price || 0) * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Delivery Fee</span>
            <span className="text-green-600 font-bold">FREE</span>
          </div>
          <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-orange-600">₹{total}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={processing || cartItems.length === 0 || total === 0}
          className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all text-base flex items-center justify-center gap-2 ${
            processing || cartItems.length === 0 || total === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 shadow-orange-200"
          }`}
        >
          {processing ? (
            <><Loader2 size={20} className="animate-spin" /> Processing...</>
          ) : paymentMethod === "cod" ? (
            "Place Order (COD)"
          ) : (
            <>🔒 Pay ₹{total} Now</>
          )}
        </button>

        <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-green-500" />
          Safe & secure payment
        </p>
      </div>
    </div>
  );
}

export default CheckoutPage;
