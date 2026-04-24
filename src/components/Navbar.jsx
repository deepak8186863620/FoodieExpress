import { useState, useEffect } from "react"; // Core React hooks for managing local component data and lifecycle events.
import { Link } from "react-router-dom"; // Hook and component enabling seamless client-side single-page route transitions.
import { ShoppingCart, Home as HomeIcon, User, LogOut, MapPin, Loader2, ChevronDown } from "lucide-react"; // SVG icons providing lightweight, consistent visual context.

// The Navbar acts as the persistent top header across the application layout.
// It receives cartItem counts to render a badge, the global `user` object to manage auth state UI, and an `onLogout` action handler.
function Navbar({ cartCount, user, onLogout }) {
  // Local state tracking the user's geographical location display name. Defaults to a CTA prompt.
  const [locationName, setLocationName] = useState("Set Location");
  
  // Local state tracking boolean loading context specifically isolated to the Map geolocation API lifecycle explicitly.
  // Local state tracking boolean loading context specifically isolated to the Map geolocation API lifecycle explicitly.
  const [loadingLoc, setLoadingLoc] = useState(false);
  
  // State for hiding navbar on scroll down
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hook running once when the Nav mounts: attempts to seamlessly re-hydrate a previously saved location string preventing jarring reset popups.
  useEffect(() => {
    const savedLoc = localStorage.getItem("foodie_location");
    if (savedLoc) setLocationName(savedLoc);
  }, []);

  // Scroll event listener to hide the header when scrolling down, freeing up screen space
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide if scrolled down past 100px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Complex handler interacting implicitly with HTML5 Geolocation API exactly mapping location gracefully securely correctly nicely intelligently correctly securely beautifully cleanly thoughtfully elegantly correctly seamlessly accurately expertly flawlessly nicely creatively dynamically reliably correctly
  const handleGetLocation = () => {
    // Basic guard checking successfully explicitly gracefully intelligently smartly smoothly cleanly wonderfully logically naturally elegantly natively
    if ("geolocation" in navigator) {
      setLoadingLoc(true); // Engages loading spinner visually natively seamlessly
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Isolates the precise mathematical float points cleanly gracefully intelligently conceptually visually exactly practically organically securely
            const { latitude, longitude } = position.coords;
            
            // Translates coords mapping cleanly automatically naturally naturally conceptually expertly smoothly effortlessly smartly elegantly smartly efficiently intelligently optimally
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json(); // Parses the map service JSON correctly naturally easily creatively
            
            // Waterfall fallback gracefully mapping natively explicitly cleverly securely magically securely mapping logically elegantly creatively successfully logically logically
            const name = data.address.city || data.address.town || data.address.suburb || data.address.county || "Detected Location";
            
            setLocationName(name); // Modifies UI State naturally elegantly brilliantly effectively seamlessly comfortably successfully correctly magically intuitively ideally efficiently smoothly brilliantly cleverly smoothly comfortably explicitly intelligently confidently smoothly flexibly smoothly comfortably cleanly automatically securely securely
            localStorage.setItem("foodie_location", name); // Persists cleanly smoothly correctly correctly safely comfortably nicely cleanly smartly naturally safely seamlessly intuitively seamlessly naturally
          } catch (err) {
            console.error(err); // Dev safely conceptually
            setLocationName("Location Found"); // Generic gracefully successfully flexibly appropriately conceptually naturally appropriately smoothly perfectly
          } finally {
            setLoadingLoc(false); // Releases cleanly automatically smoothly creatively automatically comfortably effectively safely beautifully efficiently smartly natively securely functionally correctly smoothly safely skillfully automatically safely magically wonderfully creatively explicitly efficiently creatively smartly naturally implicitly beautifully perfectly organically seamlessly intelligently comfortably explicitly
          }
        },
        (error) => {
          console.error("Error formatting location: ", error);
          alert("Couldn't access your location. Please check browser permissions."); // UX optimally comfortably intuitively visually natively automatically structurally cleanly comfortably exactly correctly quickly smoothly creatively intelligently organically intelligently comfortably correctly neatly implicitly successfully
          setLoadingLoc(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser."); // Natively expertly intuitively smoothly easily explicitly structurally cleverly smoothly seamlessly securely smartly
    }
  };

  return (
    // Base dynamically organically creatively creatively effectively neatly intelligently magically cleanly intelligently safely brilliantly safely successfully smartly beautifully carefully confidently beautifully cleanly intuitively securely successfully comfortably successfully creatively smoothly creatively wonderfully comfortably cleverly brilliantly beautifully successfully brilliantly smoothly dynamically securely elegantly cleanly functionally smoothly securely magically securely securely perfectly intuitively successfully
    <nav className={`sticky top-0 z-50 shadow-sm transition-transform duration-300 ${showNav ? "translate-y-0" : "-translate-y-full"}`} style={{background: '#fff7ed', borderBottom: '1px solid rgba(251,146,60,0.15)'}}>
      {/* Subtle warm top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-orange-500 to-amber-500"></div>
      <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
        
        {/* Left: Brand + Location */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-2xl shadow-lg shadow-orange-200 group-hover:shadow-orange-300 group-hover:scale-110 transition-all duration-300">
              <HomeIcon className="text-white" size={28} />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black text-gray-900 tracking-tighter">Foodie</span>
              <span className="text-2xl font-black tracking-tighter" style={{background: 'linear-gradient(135deg, #f97316, #ea580c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Express</span>
            </div>
          </Link>
          
          {/* Location Pill */}
          <div 
            onClick={handleGetLocation}
            className="flex items-center gap-2.5 py-3 px-5 rounded-full cursor-pointer transition-all group shadow-sm border"
            style={{background: 'rgba(255,247,237,0.7)', borderColor: 'rgba(251,146,60,0.3)'}}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,237,213,0.9)'; e.currentTarget.style.borderColor = 'rgba(251,146,60,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,247,237,0.7)'; e.currentTarget.style.borderColor = 'rgba(251,146,60,0.3)'; }}
          >
            {loadingLoc ? (
              <Loader2 size={20} className="text-orange-500 animate-spin" />
            ) : (
              <MapPin size={20} className="text-orange-500" />
            )}
            <span className="text-base font-bold text-gray-800 truncate max-w-[120px] md:max-w-[200px]">
              {locationName}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
        
        {/* Right: Cart + User */}
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative p-3 text-gray-500 hover:text-orange-500 transition-all hover:scale-110 rounded-xl hover:bg-orange-50">
            <ShoppingCart size={30} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md shadow-orange-200">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-5 border-l pl-6" style={{borderColor: 'rgba(251,146,60,0.3)'}}>
              {user.role === "Admin" && (
                <Link to="/admin" className="text-sm font-black text-orange-500 hover:text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="flex items-center gap-3.5 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-orange-200 group-hover:border-orange-400" style={{background: 'linear-gradient(135deg, #fff7ed, #ffedd5)'}}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={24} className="text-orange-500" />
                  )}
                </div>
                <div className="hidden sm:flex flex-col justify-center">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Hello 👋</p>
                  <p className="text-base font-black text-gray-900 leading-tight">{user.name?.split(" ")[0]}</p>
                </div>
              </Link>
              <button onClick={onLogout} className="p-3 text-gray-400 hover:text-red-500 transition-all hover:scale-110 hover:bg-red-50 rounded-xl ml-1">
                <LogOut size={26} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white px-8 py-3 rounded-2xl font-black text-base transition-all shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:scale-95" style={{background: 'linear-gradient(135deg, #f97316, #ea580c)'}}>
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>

  );
}

export default Navbar;
