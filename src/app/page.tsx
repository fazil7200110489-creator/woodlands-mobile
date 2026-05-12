import OrderingClient from "@/components/OrderingClient";
import { connectDB } from "@/lib/db";
import { MenuItemModel, SettingsModel } from "@/lib/models";
import { ensureSeeded } from "@/lib/seed";

export default async function HomePage() {
  try {
    await connectDB();
    await ensureSeeded();
    
    // Fetch data in parallel for speed
    const [menu, settings] = await Promise.all([
      MenuItemModel.find().sort({ category: 1, name: 1 }).lean(),
      SettingsModel.findOne().lean()
    ]);

    // Serialize MongoDB objects (convert _id to string etc.)
    const serializedMenu = JSON.parse(JSON.stringify(menu));
    const serializedSettings = JSON.parse(JSON.stringify(settings));

    return <OrderingClient initialMenu={serializedMenu} initialSettings={serializedSettings} />;
  } catch (error) {
    console.error("❌ HomePage SSR Error:", error);
    // Fallback to client-side fetching if server-side fails
    return <OrderingClient />;
  }
}
