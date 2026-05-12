"use client";

import { Bell, MessageCircle } from "lucide-react";
import { m } from "framer-motion";
import Image from "next/image";

export default function GreetingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between safe-top border-b border-border/40">
      <div className="flex items-center gap-3">
        <m.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border/50"
        >
          {/* Mock Google Profile Image */}
          <Image 
            src="https://lh3.googleusercontent.com/a/default-user=s96-c" 
            alt="Profile" 
            width={40} 
            height={40} 
            className="object-cover"
          />
        </m.div>
        <div>
          <m.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider"
          >
            Signed in as
          </m.p>
          <m.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-bold text-foreground"
          >
            guest.woodlands@gmail.com
          </m.h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <m.button
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
        </m.button>
        <m.button
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <Bell className="w-6 h-6 text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
        </m.button>
      </div>
    </header>
  );
}
