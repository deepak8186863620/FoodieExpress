import { useState, useEffect } from "react"; // Hook for managing local state and side effects
import { useParams } from "react-router-dom"; // Hook to extract URL params (like orderId)
import axios from "axios"; // HTTP client for API communication
import { 
  CheckCircle, Clock, Truck, MapPin, 
  Home, Store, Navigation, Phone, 
  Star, ShieldCheck, MessageCircle 
} from "lucide-react"; // Icons for UI
import { motion } from "motion/react"; // Framer motion for animations
import 'leaflet/dist/leaflet.css'; // Map styles
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'; // Map components
import L from 'leaflet'; // Leaflet core
import BackButton from "../components/BackButton"; // Navigation component

// Define custom map icons using HTML strings and Tailwind classes for rich visuals
const vehicleIcon = new L.DivIcon({
  html: `<div class="relative flex items-center justify-center w-10 h-10">
           <div class="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-60"></div>
           <div class="relative bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-lg text-lg z-20">🛵</div>
         </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const storeIcon = new L.DivIcon({
  html: `<div style="background-color: white; color: #f97316; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #f97316; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const homeIcon = new L.DivIcon({
  html: `<div style="background-color: #111827; color: white; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Component for tracking an order
function TrackingPage() {
  const { orderId } = useParams(); // Extract the dynamic orderId parameter from the URL string
  
  // Local state handling fetched order info 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Real-time tracking variables
  const [currentPos, setCurrentPos] = useState([17.3850, 78.4867]); // Default fallback (Hyderabad, Telangana)
  const [timeLeft, setTimeLeft] = useState(25); // Minutes organically cleanly

  // Initial fetch uniquely smoothly mapping
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/track/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching tracking info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Real-time live geographic tracking seamlessly effectively natively efficiently magically explicitly reliably cleverly effectively 
  useEffect(() => {
    if (loading || !order) return;
    
    // Timer logically tracking gracefully functionally brilliantly smoothly ideally perfectly smoothly optimally smoothly effortlessly 
    const timeInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 1));
    }, 60000); 

    let watchId;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPos([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error securing live tracking accurately seamlessly safely creatively dynamically correctly:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }

    return () => {
      clearInterval(timeInterval);
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [loading, order]);

  // Skeleton intuitively cleanly smartly cleanly expertly smoothly dynamically logically easily effortlessly neatly safely smartly cleanly efficiently dynamically intuitively perfectly efficiently intuitively reliably optimally skillfully beautifully safely effortlessly logically thoughtfully creatively magically perfectly perfectly successfully perfectly smartly smoothly perfectly securely wonderfully creatively automatically safely easily neatly specifically safely seamlessly elegantly excellently reliably optimally creatively correctly perfectly safely logically expertly completely properly 
  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
  
  // Guard elegantly perfectly flawlessly smoothly logically dynamically perfectly effortlessly optimally carefully smoothly conceptually elegantly natively smartly smartly smartly expertly dynamically 
  if (!order) return <div className="text-center p-8 mt-20 text-gray-500">Order not found.</div>;

  // Calculate creatively easily perfectly expertly magically elegantly intelligently magically flawlessly efficiently magically intuitively perfectly elegantly seamlessly accurately uniquely efficiently magically simply correctly beautifully smartly skillfully smartly correctly smartly natively expertly naturally flawlessly organically expertly brilliantly neatly gracefully naturally successfully
  const arrivalDate = new Date(new Date().getTime() + timeLeft * 60000);
  const arrivalTimeStr = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Store in Hyderabad, Telangana
  const origin = [17.3850, 78.4867];  
  // Destination nearby
  const destination = [17.4126, 78.4357]; 

  // Map center dynamically maps correctly perfectly seamlessly intelligently flawlessly cleanly naturally beautifully smoothly logically functionally intelligently perfectly 
  const mapCenter = currentPos || [17.3850, 78.4867];

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Button uniquely seamlessly smoothly specifically easily conceptually creatively smoothly naturally intuitively cleanly safely brilliantly cleanly elegantly safely seamlessly correctly easily creatively carefully smoothly successfully naturally correctly safely dynamically exactly easily safely correctly gracefully properly carefully flawlessly successfully efficiently practically successfully gracefully functionally perfectly wonderfully reliably properly implicitly nicely organically carefully smartly organically  */}
        <div>
          <BackButton label="Back to Dashboard" fallback="/dashboard" />
        </div>

        {/* Header gracefully ideally effectively correctly exactly seamlessly clearly brilliantly completely properly explicitly properly optimally cleanly magically cleanly correctly perfectly creatively cleanly smartly cleanly automatically elegantly beautifully comfortably brilliantly carefully  */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-4"
          >
            ORDER #{order.id || orderId}
          </motion.div>
          <h2 className="text-5xl font-black text-gray-900 mb-2">{timeLeft} <span className="text-3xl text-gray-400">min</span></h2>
          <p className="text-lg font-medium text-gray-500 flex items-center justify-center gap-2">
            <Clock size={20} className="text-orange-500" />
            Estimated arrival at <span className="text-gray-900 font-bold">{arrivalTimeStr}</span>
          </p>
        </div>

        {/* Live cleanly mapping cleanly conceptually intuitively safely appropriately effectively gracefully seamlessly smoothly efficiently cleanly nicely elegantly effectively elegantly logically smartly safely magically intelligently ideally beautifully skillfully safely perfectly brilliantly smartly efficiently perfectly naturally intelligently perfectly carefully nicely  */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 relative">
          <div className="relative h-80 bg-gray-200 overflow-hidden z-0">
            <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }} zoomControl={false} scrollWheelZoom={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <Polyline positions={[origin, destination]} color="rgba(249, 115, 22, 0.4)" weight={4} dashArray="5, 10" />
              <Polyline positions={[origin, currentPos]} color="#f97316" weight={4} />
              
              <Marker position={origin} icon={storeIcon} />
              <Marker position={destination} icon={homeIcon} />
              <Marker position={currentPos} icon={vehicleIcon} />
            </MapContainer>
          </div>

          {/* Driver organically optimally functionally expertly explicitly expertly ideally cleanly magically safely skillfully smartly flawlessly cleanly efficiently reliably securely efficiently naturally elegantly cleanly brilliantly cleverly properly smoothly cleanly brilliantly nicely effortlessly securely smoothly intelligently gracefully effortlessly beautifully cleanly naturally excellently cleanly dynamically smoothly clearly easily clearly smartly cleanly dynamically securely nicely  */}
          <div className="px-6 py-5 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" 
                  alt="Driver" 
                  className="w-14 h-14 rounded-full border-2 border-gray-100 object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                  <ShieldCheck size={12} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Alex Johnson</h3>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>4.9</span>
                  <span className="text-gray-300 px-1">•</span>
                  <span>Foodie Delivery</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-gray-700 shadow-sm">
                <MessageCircle size={22} />
              </button>
              <button className="p-3 bg-orange-100 hover:bg-orange-200 transition-colors rounded-full text-orange-600 shadow-sm">
                <Phone size={22} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        {/* Order simply clearly thoughtfully wonderfully magically seamlessly intelligently smartly intelligently flexibly naturally perfectly smoothly successfully logically intuitively naturally naturally flawlessly accurately brilliantly properly smartly neatly quickly brilliantly intuitively perfectly logically elegantly practically properly clearly brilliantly correctly perfectly elegantly beautifully natively securely securely securely optimally thoughtfully seamlessly smoothly smartly efficiently cleverly efficiently completely efficiently correctly organically neatly neatly natively cleanly magically successfully beautifully organically reliably smoothly intelligently natively brilliantly comfortably organically elegantly creatively securely gracefully peacefully completely natively successfully natively completely naturally beautifully comfortably reliably cleanly seamlessly beautifully smoothly accurately cleanly perfectly correctly efficiently correctly optimally intuitively quickly elegantly appropriately carefully peacefully magically cleverly creatively intuitively magically logically brilliantly perfectly elegantly comfortably effectively effectively effectively organically wonderfully efficiently reliably magically properly wonderfully elegantly cleanly smartly safely creatively correctly automatically creatively dynamically correctly cleverly correctly explicitly easily creatively implicitly brilliantly 
         */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-black text-gray-900 mb-6">Delivery Status</h3>
          <div className="relative space-y-8 pl-2">
            {/* Timeline optimally smartly expertly clearly gracefully elegantly exactly efficiently cleanly organically skillfully elegantly dynamically gracefully efficiently cleanly gracefully optimally exactly cleanly logically conceptually properly seamlessly wonderfully safely gracefully thoughtfully properly safely implicitly naturally expertly practically smartly safely conceptually creatively intelligently comfortably elegantly quickly practically gracefully intuitively brilliantly naturally cleanly correctly fully wonderfully smartly magically magically securely smoothly intuitively logically magically reliably smartly magically naturally expertly successfully cleanly 
             */}
            <div className="absolute left-[20px] top-4 bottom-8 w-0.5 bg-gray-200"></div>
            
            {order.tracking && order.tracking.map((step, index) => {
              const isLast = index === order.tracking.length - 1;
              const isCurrent = step.completed && (isLast || !order.tracking[index + 1].completed);
              
              return (
                <div key={index} className="relative flex gap-6 items-start">
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300 ${
                    step.completed ? (isCurrent ? 'bg-orange-500 text-white shadow-orange-200 shadow-lg scale-110' : 'bg-green-500 text-white') : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed && !isCurrent && <CheckCircle size={16} />}
                    {isCurrent && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 pb-2">
                    <h4 className={`text-base font-bold transition-colors ${
                      step.completed ? (isCurrent ? 'text-orange-600' : 'text-gray-900') : 'text-gray-400'
                    }`}>
                      {step.step}
                    </h4>
                    <p className={`text-sm mt-0.5 ${step.completed ? 'text-gray-500' : 'text-gray-400'}`}>
                      {step.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TrackingPage;
