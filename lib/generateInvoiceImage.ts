import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// Register Geist font
registerFont(path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"), {
  family: "Geist",
});

type Ticket = {
  category: string;
  tier: string;
  code: string;
};

export async function generateInvoiceImage(order: any, tickets: Ticket[]) {
  const width = 1200;
  const height = 1800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, width, height);

  // Gold gradient header
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, "#d4af37");
  grad.addColorStop(1, "#b8860b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, 160);

  // Logo
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logo = await loadImage(logoPath);
  ctx.drawImage(logo, 40, 30, 120, 120);

  // Header text
  ctx.fillStyle = "#000";
  ctx.font = "bold 48px Geist";
  ctx.fillText("Taprobane Entertainment Oy", 200, 90);

  ctx.font = "28px Geist";
  ctx.fillText("Receipt", 200, 140);

  // White text section
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "28px Geist";
  ctx.fillText(`Receipt No: ${order.id}`, 40, 220);
  ctx.fillText(
    `Order Time: ${new Date(order.createdAt).toLocaleString("en-GB")}`,
    40,
    270
  );

  // Customer
  ctx.font = "32px Geist";
  ctx.fillStyle = "#d4af37";
  ctx.fillText("Customer", 40, 340);

  ctx.font = "24px Geist";
  ctx.fillStyle = "#f5f5f5";
  ctx.fillText(order.name ?? "", 40, 380);
  ctx.fillText(order.email ?? "", 40, 420);
  ctx.fillText(order.contactNo ?? "", 40, 460);

  // Seller
  ctx.font = "32px Geist";
  ctx.fillStyle = "#d4af37";
  ctx.fillText("Seller", 650, 340);

  ctx.font = "24px Geist";
  ctx.fillStyle = "#f5f5f5";
  ctx.fillText("Taprobane Entertainment Oy", 650, 380);
  ctx.fillText("Business ID: 3581857-4", 650, 420);
  ctx.fillText("info@taprobane.fi", 650, 460);
  ctx.fillText("www.taprobane.fi", 650, 500);

  // Event block
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(40, 520, width - 80, 160);

  ctx.fillStyle = "#d4af37";
  ctx.font = "28px Geist";
  ctx.fillText("Event", 60, 560);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "24px Geist";
  ctx.fillText(order.event.title, 60, 600);
  ctx.fillText(order.event.venue, 60, 640);
  ctx.fillText("24th April 2026, 19:00", 60, 680);

  // Group tickets by category + tier
  const grouped: Record<string, { label: string; qty: number }> = {};
  for (const t of tickets) {
    const key = `${t.category}-${t.tier}`;
    if (!grouped[key]) {
      grouped[key] = {
        label: `Ticket ${t.category} ${t.tier}`,
        qty: 1,
      };
    } else {
      grouped[key].qty += 1;
    }
  }

  // Tickets table header
  let y = 780;

  ctx.fillStyle = "#222";
  ctx.fillRect(40, y, width - 80, 60);

  ctx.fillStyle = "#d4af37";
  ctx.font = "24px Geist";
  ctx.fillText("Product", 60, y + 40);
  ctx.fillText("Qty", 500, y + 40);
  ctx.fillText("Excl VAT", 650, y + 40);
  ctx.fillText("VAT", 820, y + 40);
  ctx.fillText("Total", 980, y + 40);

  y += 80;

  const total = order.totalAmount / 100;
  const netTotal = total / 1.135;
  const vatTotal = total - netTotal;

  const perTicket = total / tickets.length;
  const perTicketNet = perTicket / 1.135;
  const perTicketVat = perTicket - perTicketNet;

  for (const key in grouped) {
    const { label, qty } = grouped[key];
    const rowTotal = perTicket * qty;
    const rowNet = perTicketNet * qty;
    const rowVat = perTicketVat * qty;

    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(40, y - 20, width - 80, 70);

    ctx.fillStyle = "#f5f5f5";
    ctx.font = "22px Geist";
    ctx.fillText(label, 60, y + 20);
    ctx.fillText(`${qty}`, 500, y + 20);
    ctx.fillText(`${rowNet.toFixed(2)} €`, 650, y + 20);
    ctx.fillText(`${rowVat.toFixed(2)} €`, 820, y + 20);
    ctx.fillText(`${rowTotal.toFixed(2)} €`, 980, y + 20);

    y += 90;
  }

  // Summary
  y += 20;

  ctx.font = "26px Geist";
  ctx.fillStyle = "#d4af37";
  ctx.fillText("Summary", 40, y);
  y += 50;

  ctx.font = "24px Geist";
  ctx.fillStyle = "#f5f5f5";
  ctx.fillText(`Total excl. VAT: ${netTotal.toFixed(2)} €`, 40, y);
  y += 40;
  ctx.fillText(`VAT 13.5%: ${vatTotal.toFixed(2)} €`, 40, y);
  y += 40;
  ctx.fillText(
    `Service fee: ${(order.serviceFee / 100).toFixed(2)} €`,
    40,
    y
  );
  y += 40;

  ctx.fillStyle = "#d4af37";
  ctx.font = "32px Geist";
  ctx.fillText(`Total payable: ${total.toFixed(2)} €`, 40, y);

  return canvas.toBuffer("image/png");
}
