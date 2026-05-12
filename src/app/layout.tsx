import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import GreetingHeader from "@/components/GreetingHeader";
import BottomNav from "@/components/BottomNav";
import { AppProvider } from "@/contexts/AppContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Woodlands Premium Pickup",
  description: "Premium takeaway and self pickup ordering platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background antialiased`}>
        <AppProvider>
          <MotionProvider>
            <GreetingHeader />
            <main className="pt-24 pb-32 min-h-screen">
              {children}
            </main>
            <BottomNav />
          </MotionProvider>
        </AppProvider>
      </body>
    </html>
  );
}
