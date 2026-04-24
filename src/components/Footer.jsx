import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Home, ShoppingCart, User, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20" style={{ background: "linear-gradient(135deg, #1c1410, #2d1a0e)" }}>
      {/* Top accent */}
      <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #f97316, #ea580c, #fb923c)" }} />

      <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="space-y-5 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl shadow-lg" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <span className="text-white font-black text-sm">FE</span>
              </div>
              <div>
                <span className="text-white font-black tracking-tighter text-lg">Foodie</span>
                <span className="font-black tracking-tighter text-lg" style={{ color: "#fb923c" }}>Express</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Delivering happiness to your doorstep. The best food from the best restaurants in your city, fresh and fast.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >
                  <Icon size={15} style={{ color: "rgba(255,255,255,0.6)" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3.5">
              {[
                { icon: Home,         label: "Home",       to: "/" },
                { icon: ShoppingCart, label: "Cart",       to: "/cart" },
                { icon: User,         label: "My Profile", to: "/dashboard" },
              ].map((l, i) => (
                <li key={i}>
                  <Link to={l.to}
                    className="flex items-center gap-2 text-sm font-medium transition-colors group"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fb923c"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                  >
                    <l.icon size={13} /> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuisines */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-6">Cuisines</h4>
            <ul className="space-y-3.5">
              {["North Indian", "Italian", "Japanese", "Healthy Food", "Chinese"].map((c, i) => (
                <li key={i}>
                  <span className="text-sm font-medium cursor-pointer transition-colors"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fb923c"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                  >{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-6">Contact Us</h4>
            <ul className="space-y-4">
              {[
                { icon: Mail,    text: "support@foodieexpress.com" },
                { icon: Phone,   text: "+91 98765 43210" },
                { icon: MapPin,  text: "Nagpur, Maharashtra, India" },
              ].map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 shrink-0"
                    style={{ background: "rgba(249,115,22,0.15)" }}>
                    <c.icon size={13} style={{ color: "#fb923c" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 FoodieExpress. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>Made with</span>
            <span className="text-orange-500 text-xs">🧡</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
