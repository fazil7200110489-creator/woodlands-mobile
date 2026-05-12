"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CategoryPillsProps {
  categories: string[] | readonly string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function CategoryPills({ categories, activeCategory, onCategoryChange }: CategoryPillsProps) {
  const allCategories = ["All", ...categories];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: {
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 10 }
    },
  };

  return (
    <m.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex gap-2 overflow-x-auto no-scrollbar py-4 px-6 -mx-6"
    >
      {allCategories.map((category) => (
        <m.button
          key={category}
          variants={item}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap",
            activeCategory === category
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          )}
        >
          {category}
        </m.button>
      ))}
    </m.div>
  );
}
