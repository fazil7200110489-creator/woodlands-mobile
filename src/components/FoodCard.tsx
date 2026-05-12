"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { Heart, Plus, Minus, ShoppingBag } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { toCurrency } from "@/lib/pickup";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

type Props = {
  item: MenuItem;
  qty: number;
  onAdjust: (item: MenuItem, delta: number) => void;
  onSelect: (item: MenuItem) => void;
};

export default function FoodCard({ item, qty, onAdjust, onSelect }: Props) {
  const { toggleWishlist, isWishlisted } = useApp();
  const id = item._id || item.name;
  const liked = isWishlisted(id);

  return (
    <m.div
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      onClick={() => onSelect(item)}
      className="group relative bg-white rounded-[20px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-border cursor-pointer"
    >
      {/* Out of stock badge only */}
      {!item.inStock && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-destructive/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Sold Out
          </div>
        </div>
      )}

      {/* Heart / Wishlist Icon */}
      <m.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(item);
        }}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all"
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            liked ? "fill-red-500 text-red-500" : "text-foreground/40"
          )}
        />
      </m.button>

      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Floating Price */}
        <div className="absolute bottom-4 right-4 bg-[#1C1C1E] text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg">
          {toCurrency(item.price)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-[#1C1C1E] line-clamp-1 mb-1">{item.name}</h3>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          Fresh {item.category.toLowerCase()} prepared for your pickup. Great taste guaranteed.
        </p>

        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center bg-secondary rounded-full p-1 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <m.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onAdjust(item, -1)}
              disabled={qty === 0}
              className="p-1.5 rounded-full hover:bg-white transition-colors disabled:opacity-30"
            >
              <Minus className="w-4 h-4 text-foreground" />
            </m.button>
            <span className="w-8 text-center text-sm font-bold">{qty}</span>
            <m.button
              whileTap={{ scale: 0.8 }}
              onClick={() => onAdjust(item, 1)}
              disabled={!item.inStock}
              className="p-1.5 rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
            </m.button>
          </div>

          <m.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              if (qty === 0) onAdjust(item, 1);
            }}
            disabled={!item.inStock}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold text-sm transition-all",
              qty > 0
                ? "bg-primary text-white"
                : "bg-[#1C1C1E] text-white hover:bg-primary disabled:opacity-40"
            )}
          >
            {qty > 0 ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>In Bag ({qty})</span>
              </>
            ) : (
              <span>{item.inStock ? "Add to Cart" : "Unavailable"}</span>
            )}
          </m.button>
        </div>
      </div>
    </m.div>
  );
}
