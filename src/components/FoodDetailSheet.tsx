"use client";

import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Star, Clock, Flame } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { toCurrency } from "@/lib/pickup";
import { cn } from "@/lib/utils";

type Props = {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  qty: number;
  onAdjust: (item: MenuItem, delta: number) => void;
};

export default function FoodDetailSheet({ item, isOpen, onClose, qty, onAdjust }: Props) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <m.aside
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring" as const, damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[110] bg-white rounded-t-[40px] overflow-hidden flex flex-col max-h-[95vh]"
          >
            <div className="relative h-[300px] flex items-center justify-center p-8 bg-secondary/30">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg z-10 active:scale-90 transition-transform"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
              
              <m.div 
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring" as const, stiffness: 100, damping: 15, delay: 0.2 }}
                className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl border-8 border-white"
              >
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover"
                />
              </m.div>

              {/* Decorative gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="px-8 pb-12 flex flex-col gap-6 -mt-8 relative z-10">
              <div className="text-center">
                <m.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-foreground mb-2"
                >
                  {item.name}
                </m.h3>
                <m.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground"
                >
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span>4.9</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>15-20 min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>450 kcal</span>
                  </div>
                </m.div>
              </div>

              <m.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-lg">Description</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Our premium {item.name.toLowerCase()} is crafted with the finest ingredients and prepared fresh upon your order. A perfect choice for a satisfying and healthy meal.
                </p>
              </m.div>

              <m.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between mt-4"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Price</span>
                  <span className="text-3xl font-bold text-primary">{toCurrency(item.price)}</span>
                </div>

                <div className="flex items-center bg-secondary rounded-full p-1.5 border border-border">
                  <m.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onAdjust(item, -1)}
                    disabled={qty === 0}
                    className="p-2 rounded-full hover:bg-white transition-colors disabled:opacity-30"
                  >
                    <Minus className="w-5 h-5 text-foreground" />
                  </m.button>
                  <span className="w-10 text-center text-lg font-bold">{qty}</span>
                  <m.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onAdjust(item, 1)}
                    disabled={!item.inStock}
                    className="p-2 rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-5 h-5" />
                  </m.button>
                </div>
              </m.div>

              <m.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (qty === 0) onAdjust(item, 1);
                  onClose();
                }}
                disabled={!item.inStock}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-5 rounded-[25px] font-bold text-lg shadow-xl transition-all",
                  qty > 0 ? "bg-primary text-white" : "bg-[#1C1C1E] text-white"
                )}
              >
                <ShoppingBag className="w-6 h-6" />
                <span>{qty > 0 ? "Update Bag" : "Add to Cart"}</span>
              </m.button>
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
