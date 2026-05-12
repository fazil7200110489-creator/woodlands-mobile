"use client";

import { m, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/menuData";
import { MenuItem } from "@/lib/types";
import { generatePickupSlots, toCurrency } from "@/lib/pickup";
import FoodCard from "@/components/FoodCard";
import CategoryPills from "@/components/CategoryPills";
import CountdownTimer from "@/components/CountdownTimer";
import FoodDetailSheet from "@/components/FoodDetailSheet";
import { ShoppingBag, ChevronRight, Search, Plus, Minus, Heart, X, Phone, MapPin, Receipt, Download, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, OrderRecord } from "@/contexts/AppContext";

export default function OrderingClient() {
  const { cart, adjust, cartCount, total, activeTab, setActiveTab, wishlist, myOrders, addOrder } = useApp();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [settings, setSettings] = useState({ shopOpen: true, acceptingOrders: true, busyMode: false, holidayMode: false });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, settingsRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/settings")
        ]);
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          if (Array.isArray(menuData)) setMenu(menuData);
        } else {
          setMenuError("Unable to load menu.");
        }
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData && !settingsData.error) setSettings(settingsData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMenuError("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    setPickupTime(generatePickupSlots()[0] ?? "");
  }, []);

  const slots = useMemo(() => generatePickupSlots(), []);
  const lines = Object.values(cart);
  const disabled = !settings.shopOpen || !settings.acceptingOrders || settings.holidayMode;

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menu, searchQuery, selectedCategory]);

  const downloadBill = (order: OrderRecord) => {
    const content = `
WOODLANDS GRILL HOUSE - BILL
----------------------------
Order ID: ${order.id}
Date: ${order.date}
Pickup Time: ${order.pickupTime}

ITEMS:
${order.items.map(i => `${i.name} x${i.qty} - ${toCurrency(i.price * i.qty)}`).join("\n")}

----------------------------
TOTAL: ${toCurrency(order.total)}
----------------------------
Thank you for your order!
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bill-${order.id.slice(-6)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const placeOrder = async () => {
    setValidationError(null);
    if (!lines.length) return;
    if (!name.trim() || !phone.trim()) {
      setValidationError("Please enter your name and phone number.");
      return;
    }
    if (!pickupTime || disabled) return;

    const payload = {
      customerName: name,
      customerPhone: phone,
      pickupTime,
      items: lines.map((x) => ({ itemId: x.item._id, name: x.item.name, price: x.item.price, qty: x.qty })),
      totalAmount: total,
    };

    try {
      const res = await fetch("/api/orders", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      const data = await res.json();
      
      // Add to local history
      addOrder({
        id: data.orderId || Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: lines.map(l => ({ name: l.item.name, price: l.item.price, qty: l.qty })),
        total,
        pickupTime
      });

      if (data.redirectUrl) window.location.href = data.redirectUrl;
    } catch (err) {
      console.error("Order error:", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 80, damping: 15 }
    }
  };

  const renderContent = () => {
    if (activeTab === "wishlist") {
      return (
        <div className="flex flex-col gap-6 min-h-[60vh]">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h2 className="text-2xl font-bold">My Wishlist</h2>
          </div>
          {wishlist.length === 0 ? (
            <div className="py-20 text-center bg-secondary rounded-[30px]">
              <p className="text-muted-foreground font-medium">Your wishlist is empty</p>
              <button onClick={() => setActiveTab("home")} className="mt-4 text-primary font-bold hover:underline">Go Shopping</button>
            </div>
          ) : (
            <m.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <m.div key={item._id || item.name} variants={itemVariants}>
                  <FoodCard item={item} qty={cart[item._id || item.name]?.qty ?? 0} onAdjust={adjust} onSelect={(i) => setSelectedItem(i)} />
                </m.div>
              ))}
            </m.section>
          )}
        </div>
      );
    }

    if (activeTab === "orders") {
      return (
        <div className="flex flex-col gap-6 min-h-[60vh]">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Order History</h2>
          </div>
          {myOrders.length === 0 ? (
            <div className="py-20 text-center bg-secondary rounded-[30px]">
              <p className="text-muted-foreground font-medium">No past orders found</p>
              <button onClick={() => setActiveTab("home")} className="mt-4 text-primary font-bold hover:underline">Start Ordering</button>
            </div>
          ) : (
            <m.section variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-4">
              {myOrders.map((order) => (
                <m.div 
                  key={order.id} 
                  variants={itemVariants}
                  className="bg-white p-6 rounded-[30px] border border-border shadow-sm flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{order.date}</span>
                      </div>
                      <h4 className="font-bold text-lg">Order #{order.id.slice(-6).toUpperCase()}</h4>
                    </div>
                    <div className="bg-secondary/50 px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase">
                      Completed
                    </div>
                  </div>

                  <div className="space-y-2 py-3 border-y border-border/50">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{it.name} <span className="font-bold text-foreground">x{it.qty}</span></span>
                        <span className="font-bold">{toCurrency(it.price * it.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Total Amount</p>
                      <p className="text-xl font-bold text-primary">{toCurrency(order.total)}</p>
                    </div>
                    <button 
                      onClick={() => downloadBill(order)}
                      className="flex items-center gap-2 bg-[#1C1C1E] text-white px-5 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
                    >
                      <Download className="w-4 h-4" />
                      <span>Bill</span>
                    </button>
                  </div>
                </m.div>
              ))}
            </m.section>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border-none rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/50"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <m.div variants={itemVariants} initial="hidden" animate="show"><CountdownTimer /></m.div>
        <CategoryPills categories={categories} activeCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <m.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[400px] rounded-[20px] shimmer" />) : 
           menuError ? <div className="col-span-full py-20 text-center"><p className="text-destructive font-bold">{menuError}</p><button onClick={() => window.location.reload()} className="mt-4 text-primary font-bold underline">Retry</button></div> : 
           filteredMenu.length === 0 ? <div className="col-span-full py-20 text-center bg-secondary rounded-[30px]"><p className="text-muted-foreground font-medium">No dishes found matching your search.</p></div> : 
           filteredMenu.map((item) => (
            <m.div key={item._id || item.name} variants={itemVariants}>
              <FoodCard item={item} qty={cart[item._id || item.name]?.qty ?? 0} onAdjust={adjust} onSelect={(i) => setSelectedItem(i)} />
            </m.div>
          ))}
        </m.section>
        <m.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 mb-8 p-8 bg-secondary/50 rounded-[40px] border border-border/50">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><Phone className="w-5 h-5 text-primary" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Call Us</p><a href="tel:9840489878" className="text-lg font-bold text-foreground hover:text-primary transition-colors">9840489878</a></div>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=52/2,+52/2,+Ramanuja+Iyer+St,+NN+Garden,+Washermanpet,+Chennai,+Tamil+Nadu+600021" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 hover:opacity-80 transition-opacity">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><MapPin className="w-5 h-5 text-primary" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Visit Us</p><p className="text-sm font-semibold text-foreground leading-relaxed">52/2, 52/2, Ramanuja Iyer St, NN Garden,<br />Washermanpet, Chennai,<br />Tamil Nadu 600021</p></div>
            </a>
            <div className="pt-6 border-t border-border/50 flex items-center justify-between"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Woodlands Premium</p><div className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /><div className="w-1.5 h-1.5 rounded-full bg-primary/40" /><div className="w-1.5 h-1.5 rounded-full bg-primary/20" /></div></div>
          </div>
        </m.footer>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-8 px-6 pb-20">
      <m.section initial={{ opacity: 0, filter: "blur(8px)", y: -20 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative h-[240px] md:h-[400px] rounded-[30px] overflow-hidden group shadow-2xl">
        <m.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY }} className="absolute inset-0"><Image src="/images/hero.jpg" alt="Hero Food" fill priority className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /></m.div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white"><m.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-3xl md:text-5xl font-bold leading-tight">Woodlands <br /> Grill House</m.h2><m.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-2 mt-4 text-primary font-bold"><span>Order Now</span><ChevronRight className="w-5 h-5" /></m.div></div>
      </m.section>
      {renderContent()}
      <AnimatePresence>{cartCount > 0 && activeTab !== "bag" && (<m.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-24 left-6 right-6 z-40"><button onClick={() => setDrawer(true)} className="w-full bg-[#1C1C1E] text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl active:scale-95 transition-transform"><div className="flex items-center gap-3"><div className="bg-primary p-2 rounded-xl"><ShoppingBag className="w-5 h-5" /></div><div className="text-left"><p className="text-xs text-white/60 font-medium">{cartCount} Items in Bag</p><p className="text-sm font-bold">{toCurrency(total)}</p></div></div><div className="flex items-center gap-1 font-bold text-sm"><span>View Cart</span><ChevronRight className="w-4 h-4" /></div></button></m.div>)}</AnimatePresence>
      <AnimatePresence>{(drawer || activeTab === "bag") && (<><m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setDrawer(false); if (activeTab === "bag") setActiveTab("home"); }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" /><m.aside initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring" as const, damping: 25, stiffness: 200 }} className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-[40px] max-h-[90vh] overflow-hidden flex flex-col"><div className="w-12 h-1.5 bg-border rounded-full mx-auto my-4" /><div className="px-8 pb-8 flex-1 overflow-y-auto no-scrollbar"><div className="flex items-center justify-between mb-8"><h3 className="text-2xl font-bold">My Order</h3><button onClick={() => { setDrawer(false); if (activeTab === "bag") setActiveTab("home"); }} className="text-muted-foreground font-bold text-sm">Close</button></div>{lines.length === 0 ? <div className="py-20 text-center"><p className="text-muted-foreground">Your bag is empty</p></div> : <><div className="space-y-6">{lines.map((l) => (<div key={l.item._id || l.item.name} className="flex gap-4"><div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-secondary"><Image src={l.item.image} alt={l.item.name} fill className="object-cover" /></div><div className="flex-1 flex flex-col justify-center"><h4 className="font-bold text-foreground">{l.item.name}</h4><p className="text-primary font-bold text-sm">{toCurrency(l.item.price)}</p></div><div className="flex items-center gap-3 bg-secondary rounded-full px-3 py-1 self-center"><button onClick={() => adjust(l.item, -1)} className="p-1"><Minus className="w-4 h-4" /></button><span className="font-bold text-sm">{l.qty}</span><button onClick={() => adjust(l.item, 1)} className="p-1"><Plus className="w-4 h-4" /></button></div></div>))}</div><div className="mt-10 space-y-4"><div className="bg-secondary p-5 rounded-2xl space-y-3"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pickup Details</p><select className="w-full bg-white border border-border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>{slots.map((s) => <option key={s} value={s}>{s}</option>)}</select><input className="w-full bg-white border border-border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Your Name *" value={name} onChange={(e) => { setName(e.target.value); setValidationError(null); }} /><input className="w-full bg-white border border-border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Phone Number *" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setValidationError(null); }} />{validationError && <p className="text-destructive text-xs font-bold px-1">{validationError}</p>}</div><div className="flex items-center justify-between px-2"><span className="text-muted-foreground font-medium">Total</span><span className="text-2xl font-bold">{toCurrency(total)}</span></div><button onClick={placeOrder} disabled={!lines.length || disabled} className={cn("w-full text-white py-5 rounded-[20px] font-bold text-lg shadow-xl transition-colors disabled:opacity-40", disabled ? "bg-muted-foreground" : "bg-[#1C1C1E] hover:bg-primary")}>Place Order via WhatsApp</button>{disabled && <p className="text-destructive text-center text-xs font-bold">Currently Closed</p>}</div></>}</div></m.aside></>)}</AnimatePresence>
      <FoodDetailSheet item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} qty={selectedItem ? (cart[selectedItem._id || selectedItem.name]?.qty ?? 0) : 0} onAdjust={adjust} />
    </div>
  );
}
