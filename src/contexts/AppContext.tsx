"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { MenuItem } from "@/lib/types";

export type Cart = Record<string, { item: MenuItem; qty: number }>;

export interface OrderRecord {
  id: string;
  date: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  pickupTime: string;
}

interface AppContextType {
  cart: Cart;
  cartCount: number;
  total: number;
  wishlist: MenuItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adjust: (item: MenuItem, delta: number) => void;
  toggleWishlist: (item: MenuItem) => void;
  isWishlisted: (id: string) => boolean;
  myOrders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState("home");
  const [myOrders, setMyOrders] = useState<OrderRecord[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const items = JSON.parse(savedWishlist);
      setWishlist(items);
      setWishlistIds(new Set(items.map((i: any) => i._id || i.name)));
    }
    const savedOrders = localStorage.getItem("myOrders");
    if (savedOrders) setMyOrders(JSON.parse(savedOrders));
  }, []);

  // Save Wishlist
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Save Orders
  useEffect(() => {
    localStorage.setItem("myOrders", JSON.stringify(myOrders));
  }, [myOrders]);

  const cartCount = Object.values(cart).reduce((s, x) => s + x.qty, 0);
  const total = Object.values(cart).reduce((s, x) => s + x.qty * x.item.price, 0);

  const adjust = (item: MenuItem, delta: number) => {
    setCart((prev) => {
      const key = item._id || item.name;
      const old = prev[key]?.qty ?? 0;
      const qty = Math.max(0, old + delta);
      const next = { ...prev };
      if (qty === 0) delete next[key];
      else next[key] = { item, qty };
      return next;
    });
  };

  const toggleWishlist = (item: MenuItem) => {
    const id = item._id || item.name;
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setWishlist((prev) => {
      const exists = prev.some((i) => (i._id || i.name) === id);
      if (exists) return prev.filter((i) => (i._id || i.name) !== id);
      return [...prev, item];
    });
  };

  const isWishlisted = (id: string) => wishlistIds.has(id);

  const addOrder = (order: OrderRecord) => {
    setMyOrders(prev => [order, ...prev]);
    setCart({}); // Clear cart after order
  };

  return (
    <AppContext.Provider value={{ 
      cart, cartCount, total, wishlist, activeTab, setActiveTab, adjust, 
      toggleWishlist, isWishlisted, myOrders, addOrder 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
