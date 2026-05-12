"use client";

import { Home, Heart, ShoppingBag, Receipt } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Heart, label: "Wishlist", id: "wishlist" },
  { icon: Receipt, label: "Orders", id: "orders" },
  { icon: ShoppingBag, label: "Bag", id: "bag" },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, cartCount, wishlist, myOrders } = useApp();

  return (
    <nav
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-border pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto px-6">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const badge = 
            item.id === "bag" ? cartCount : 
            item.id === "wishlist" ? wishlist.length : 
            item.id === "orders" ? myOrders.length : 0;

          return (
            <m.button
              key={item.id}
              whileTap={{ scale: 0.85, transition: { type: "spring" as const, stiffness: 400, damping: 20 } }}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 relative min-w-[64px] py-1"
            >
              <div className="relative">
                <div className={cn(
                  "p-2 rounded-2xl transition-all duration-300",
                  isActive ? "bg-primary/10" : ""
                )}>
                  <Icon className={cn(
                    "w-6 h-6 transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>

                {badge > 0 && (
                  <m.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {badge > 9 ? "9+" : badge}
                  </m.span>
                )}
              </div>

              <span className={cn(
                "text-[10px] font-semibold transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>

              {isActive && (
                <m.div
                  layoutId="activeTabDot"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                />
              )}
            </m.button>
          );
        })}
      </div>
    </nav>
  );
}
