import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Package, Mail, Calendar, Shield, ChevronRight,
  Clock, TrendingUp, ShoppingBag, Flame, Award,
  CheckCircle2, Truck, CircleDot, Gift, CreditCard,
  Bell, MapPin, Settings, ArrowRight, Star, Zap
} from "lucide-react";

const STATUS = {
  "Delivered":    { color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", icon: CheckCircle2, dot: "bg-green-500" },
  "On the way":   { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  icon: Truck,        dot: "bg-blue-500"  },
  "Order Placed": { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200",icon: CircleDot,    dot: "bg-orange-500"},
};

export default function DashboardPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get(`/api/orders?userId=${user.id}`)
      .then(r => setOrders(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const filtered = orders
    .filter(o => statusFilter === "All" || o.status === statusFilter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalSpent  = orders.reduce((s, o) => s + (o.total || 0), 0);
  const delivered   = orders.filter(o => o.status === "Delivered").length;
  const avgOrder    = orders.length ? Math.round(totalSpent / orders.length) : 0;
  const level       = Math.min(Math.floor(orders.length / 3) + 1, 10);
  const xpProgress  = ((orders.length % 3) / 3) * 100;

  const tabs = [
    { id: "orders",   label: "My Orders",  icon: Package  },
    { id: "rewards",  label: "Rewards",    icon: Gift     },
    { id: "settings", label: "Settings",   icon: Settings },
  ];

  // Helper to format ISO dates beautifully
  const formatOrderDate = (isoString) => {
    if (!isoString) return "Unknown Date";
    try {
      const d = new Date(isoString);
      return isNaN(d.getTime()) ? isoString : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
    } catch { return isoString; }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">

      {/* ── PROFILE HERO ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            
            {/* Left: Avatar & Info */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-6 text-center md:text-left">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-[4px] border-white ring-1 ring-gray-100"
                    style={{ background: "linear-gradient(135deg, #fed7aa, #fb923c)" }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-4xl font-black text-white">
                        {user.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm" title="Online" />
                </div>
                
                {/* Info Text */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                    {user.role === "Admin" && (
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 w-max mx-auto md:mx-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium mb-3">
                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {user.email}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> Joined {user.joinDate || "2024"}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                      <Flame size={14} /> Level {level} Foodie
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-green-50 text-green-700 border border-green-100 shadow-sm">
                      <Award size={14} /> Tops {delivered} Deliveries
                    </span>
                  </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {user.role === "Admin" && (
                <button onClick={() => navigate("/admin")} className="px-6 py-3 rounded-xl text-sm font-black bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-sm">
                  Dashboard Admin
                </button>
              )}
              <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl text-sm font-black text-white hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_4px_15px_rgba(249,115,22,0.3)]" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                <ShoppingBag size={16} /> Order Food
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── SIDEBAR ──────────────────────────────────────────── */}
          <div className="w-full lg:w-64 shrink-0 space-y-5">

            {/* Stats summary */}
            <div className="rounded-2xl p-5 space-y-4 shadow-sm border"
              style={{ background: "rgba(255,255,255,0.85)", borderColor: "rgba(251,146,60,0.12)" }}>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Your Stats</p>
              {[
                { icon: ShoppingBag, label: "Total Orders",  value: orders.length,         color: "text-orange-500", bg: "bg-orange-50" },
                { icon: CreditCard,  label: "Total Spent",   value: `₹${totalSpent.toLocaleString()}`, color: "text-purple-500", bg: "bg-purple-50" },
                { icon: TrendingUp,  label: "Avg. Order",    value: `₹${avgOrder}`,         color: "text-blue-500",   bg: "bg-blue-50"   },
                { icon: CheckCircle2,label: "Delivered",     value: delivered,              color: "text-green-600",  bg: "bg-green-50"  },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                    <s.icon size={16} className={s.color} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 leading-none">{s.label}</p>
                    <p className="text-base font-black text-gray-900 leading-tight">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* XP / Level card */}
            <div className="rounded-2xl p-5 shadow-sm border overflow-hidden relative"
              style={{ background: "rgba(255,255,255,0.85)", borderColor: "rgba(251,146,60,0.12)" }}>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-orange-50 opacity-60" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Zap size={15} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Foodie XP</p>
                    <p className="text-sm font-black text-gray-900">Level {level}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-semibold">
                  {3 - (orders.length % 3)} orders to Level {level + 1}
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl overflow-hidden shadow-sm border divide-y"
              style={{ background: "rgba(255,255,255,0.85)", borderColor: "rgba(251,146,60,0.12)", divideColor: "rgba(0,0,0,0.04)" }}>
              {[
                { icon: MapPin,    label: "Saved Addresses" },
                { icon: Bell,      label: "Notifications"   },
                { icon: CreditCard,label: "Payments"        },
                { icon: Shield,    label: "Privacy"         },
              ].map((l, i) => (
                <button key={i}
                  className="w-full flex items-center gap-3 px-4 py-3.5 group hover:bg-orange-50/60 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                    <l.icon size={14} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <span className="flex-1 text-sm font-bold text-gray-600 group-hover:text-gray-900 text-left transition-colors">{l.label}</span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* ── MAIN CONTENT ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Tab bar */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 pb-3 text-sm font-extrabold transition-all relative ${isActive ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <tab.icon size={16} />{tab.label}
                    {isActive && (
                      <motion.div layoutId="activetab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500 rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">

              {/* ── ORDERS TAB ── */}
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                  {/* Filter pills */}
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    {["All", "Delivered", "On the way", "Order Placed"].map(f => {
                      const active = statusFilter === f;
                      return (
                        <button key={f} onClick={() => setStatusFilter(f)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${active ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                          {f}
                        </button>
                      );
                    })}
                    <span className="ml-auto text-xs font-bold text-gray-400">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-28 rounded-2xl animate-pulse bg-white border border-gray-100 shadow-sm" />
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-white border border-gray-100 text-center shadow-sm">
                      <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
                        <Package size={36} className="text-orange-400" />
                      </div>
                      <p className="text-xl font-black text-gray-900 mb-2">No orders found</p>
                      <p className="text-sm text-gray-400 font-medium mb-8">Start your food journey today!</p>
                      <button onClick={() => navigate("/")}
                        className="px-8 py-3.5 rounded-xl text-sm font-black text-white hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_4px_15px_rgba(249,115,22,0.3)]"
                        style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
                        <ShoppingBag size={16} /> Browse Menu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map((order, i) => {
                        const cfg = STATUS[order.status] || STATUS["Order Placed"];
                        const StatusIcon = cfg.icon;
                        return (
                          <motion.div key={order.id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="rounded-3xl bg-white border border-gray-100 p-5 flex flex-col sm:flex-row gap-5 sm:items-center transition-all hover:shadow-lg hover:border-orange-100 group"
                          >
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-2xl ${cfg.bg} flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform`}>
                              🍽️
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-extrabold text-gray-900 text-lg tracking-tight line-clamp-1 mb-1">
                                {Array.isArray(order.items)
                                  ? order.items.slice(0, 2).join(", ") + (order.items.length > 2 ? ` +${order.items.length - 2}` : "")
                                  : order.items}
                              </p>
                              <div className="flex items-center gap-2 mt-1 mb-2.5">
                                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded outline outline-1 outline-gray-200 text-gray-400 uppercase">#{String(order.id).slice(-8)}</span>
                                <span className="text-[12px] text-gray-400 font-medium flex items-center gap-1">
                                  <Calendar size={12} /> {formatOrderDate(order.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                  <StatusIcon size={12} /> {order.status}
                                </span>
                              </div>
                            </div>

                            {/* Price + CTA */}
                            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-4 shrink-0">
                              <p className="text-2xl font-black text-gray-900 tracking-tight">₹{order.total}</p>
                              <button onClick={() => navigate(`/track/${order.id}`)}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-extrabold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white transition-colors border border-orange-100"
                              >
                                Track Order <ArrowRight size={14} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── REWARDS TAB ── */}
              {activeTab === "rewards" && (
                <motion.div key="rewards" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* FoodieCoins hero */}
                    <div className="col-span-full rounded-2xl p-6 relative overflow-hidden border"
                      style={{ background: "linear-gradient(135deg, #fff7ed, #ffedd5)", borderColor: "rgba(251,146,60,0.25)" }}>
                      <div className="absolute right-4 top-4 text-7xl opacity-20 select-none">🪙</div>
                      <p className="text-xs font-black uppercase tracking-widest text-orange-500 mb-2">FoodieCoins Balance</p>
                      <p className="text-5xl font-black text-gray-900 mb-1">{orders.length * 47}</p>
                      <p className="text-sm text-gray-500 font-medium mb-4">≈ ₹{Math.floor(orders.length * 47 * 0.5)} cashback value</p>
                      <button className="px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-md shadow-orange-200"
                        style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>
                        Redeem Coins
                      </button>
                    </div>

                    {[
                      { emoji: "🎁", title: "Welcome Bonus",   desc: "₹100 off your first order",       tag: "Claimed", tagColor: "text-green-700 bg-green-50 border-green-200" },
                      { emoji: "🔥", title: "Order Streak",    desc: `${3 - (orders.length % 3)} more orders for 2× coins`, tag: "Active",  tagColor: "text-orange-700 bg-orange-50 border-orange-200" },
                      { emoji: "⭐", title: "Loyalty Reward",  desc: "Free delivery — order 10 times",  tag: "Locked",  tagColor: "text-gray-400 bg-gray-50 border-gray-200" },
                      { emoji: "👑", title: "VIP Access",      desc: "Reach Level 5 for exclusive deals",tag: "Locked",  tagColor: "text-gray-400 bg-gray-50 border-gray-200" },
                    ].map((r, i) => (
                      <div key={i} className="rounded-2xl p-5 flex gap-4 items-start border transition-all hover:shadow-md"
                        style={{ background: "rgba(255,255,255,0.88)", borderColor: "rgba(0,0,0,0.07)" }}>
                        <span className="text-3xl shrink-0">{r.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                            <p className="font-extrabold text-gray-900 text-sm">{r.title}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${r.tagColor}`}>{r.tag}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium">{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── SETTINGS TAB ── */}
              {activeTab === "settings" && (
                <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="space-y-3">
                    {[
                      { icon: User,       label: "Edit Profile",       desc: "Update name, photo & contact details" },
                      { icon: MapPin,     label: "Saved Addresses",    desc: "Manage your delivery locations"        },
                      { icon: Bell,       label: "Notifications",      desc: "Control alerts & push notifications"  },
                      { icon: Shield,     label: "Privacy & Security", desc: "Password, 2FA & account security"     },
                      { icon: CreditCard, label: "Payment Methods",    desc: "Cards, UPI & linked wallets"          },
                    ].map((s, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer group transition-all hover:shadow-sm"
                        style={{ background: "rgba(255,255,255,0.88)", borderColor: "rgba(0,0,0,0.07)" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.25)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"}
                      >
                        <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center shrink-0 transition-colors">
                          <s.icon size={18} className="text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-extrabold text-gray-900 text-sm">{s.label}</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">{s.desc}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 transition-colors group-hover:translate-x-0.5" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
