import { toCurrency } from "@/lib/pickup";

type WAOrder = {
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  pickupTime: string;
  customerName?: string;
  paymentScreenshot?: string;
};

export function buildOrderMessage(order: WAOrder) {
  const itemsList = order.items
    .map((i) => `${i.name} (x${i.qty})`)
    .join(", ");

  const quantities = order.items.reduce((acc, i) => acc + i.qty, 0);

  let message = `Hello, I have completed the payment for my order.\n\n`;
  if (order.customerName) {
    message += `Customer: ${order.customerName}\n`;
  }
  message += `Product: ${itemsList}\n`;
  message += `Quantity: ${quantities}\n`;
  message += `Total Amount: ${toCurrency(order.totalAmount)}\n`;
  message += `Pickup Time: ${order.pickupTime}\n\n`;

  if (order.paymentScreenshot) {
    message += `Payment screenshot: ${order.paymentScreenshot}\n\n`;
  } else {
    message += `Payment screenshot attached below.\n\n`;
  }

  return message.trim();
}

export function buildWhatsAppRedirect(message: string, to = "9840489878") {
  return `https://wa.me/91${to}?text=${encodeURIComponent(message)}`;
}

export async function sendWhatsAppCloudMessage(message: string) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.OWNER_PHONE || "919840489878";
  if (!token || !phoneNumberId) return { skipped: true };

  const res = await fetch(`https://graph.facebook.com/v23.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });
  if (!res.ok) throw new Error("WhatsApp Cloud API failed");
  return res.json();
}
