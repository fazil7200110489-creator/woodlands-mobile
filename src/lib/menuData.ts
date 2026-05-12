import { MenuItem } from "@/lib/types";

export const initialMenu: MenuItem[] = [
  { name: "Normal Shawarma", price: 50, category: "Shawarma", image: "https://images.unsplash.com/photo-1561050501-a65b4b4be0f8?w=600&fit=crop", inStock: false },
  { name: "Spl Shawarma", price: 90, category: "Shawarma", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&fit=crop", inStock: true },
  { name: "Full Grill", price: 350, category: "Grill", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&fit=crop", inStock: true },
  { name: "Half Grill", price: 180, category: "Grill", image: "https://images.unsplash.com/photo-1598515213692-cc5f30b34f11?w=600&fit=crop", inStock: true },
  { name: "Kupus", price: 10, category: "Extras", image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=600&fit=crop", inStock: true },
  { name: "Myonise", price: 20, category: "Extras", image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&fit=crop", inStock: true },
  { name: "Chicken Fried Rice", price: 130, category: "Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&fit=crop", inStock: true },
  { name: "Sezwan Chicken Rice", price: 140, category: "Rice", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&fit=crop", inStock: true },
  { name: "Beef Rice", price: 110, category: "Rice", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&fit=crop", inStock: true },
  { name: "Sezwan Beef Rice", price: 120, category: "Rice", image: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=600&fit=crop", inStock: true },
  { name: "Beef Rice 1/2", price: 120, category: "Rice", image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600&fit=crop", inStock: true },
  { name: "Chicken Rice 1/2", price: 140, category: "Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&fit=crop", inStock: true },
  { name: "Chicken Noodles", price: 130, category: "Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&fit=crop", inStock: true },
  { name: "Sezwan Chicken Noodles", price: 140, category: "Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&fit=crop", inStock: true },
  { name: "Chilli Chicken", price: 130, category: "Starters", image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&fit=crop", inStock: true },
  { name: "Pepper Chicken", price: 140, category: "Starters", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&fit=crop", inStock: true },
  { name: "Chilli Beef", price: 100, category: "Starters", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&fit=crop", inStock: true },
  { name: "Pepper Beef", price: 110, category: "Starters", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&fit=crop", inStock: true },
  { name: "Lollypop", price: 110, category: "Starters", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&fit=crop", inStock: true },
  { name: "Chicken 65", price: 110, category: "Starters", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&fit=crop", inStock: true },
  { name: "Lollypop Sayce", price: 0, category: "Starters", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&fit=crop", inStock: true },
];

export const categories = ["Shawarma", "Grill", "Rice", "Noodles", "Starters", "Extras"] as const;
