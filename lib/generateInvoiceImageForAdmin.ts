import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

registerFont(path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"), {
  family: "Geist",
});

export async function generateInvoiceImageForAdmin(order: any, tickets: any[]) {
  const total = Number(order.totalAmount ?? 0) / 100;
  const VAT_RATE = 0.135;

  const vatAmount = total * VAT_RATE;
  const netAmount = total - vatAmount;

  const pricePerTicket = total / tickets.length;
  const vatPerTicket = pricePerTicket * VAT_RATE;
  const netPerTicket = pricePerTicket - vatPerTicket;

  const width = 1200;
  const height = 1800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, width, height);

  // Gold header
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
  ctx.fillText("Receipt (Manual Order)", 200, 140);

  // Customer
  ctx.fillStyle = "#d4af37";
  ctx.font = "32px Geist";
  ctx.fillText("Customer", 40, 240);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "24px Geist";
  ctx.fillText(order.name, 40, 280);
  ctx.fillText(order.email, 40, 320);
  ctx.fillText(order.contactNo || "", 40, 360);

  // Event
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(40, 420, width - 80, 160);

  ctx.fillStyle = "#d4af37";
  ctx.font = "28px Geist";
  ctx.fillText("Event", 60, 460);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "24px Geist";
  ctx.fillText(order.event.title, 60, 500);
  ctx.fillText(order.event.venue, 60, 540);
  ctx.fillText(
    new Date(order.event.date).toLocaleString("en-GB"),
    60,
    580
  );

  // Table header
  let y = 640;
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

  for (const t of tickets) {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(40, y - 20, width - 80, 70);

    ctx.fillStyle = "#f5f5f5";
    ctx.font = "22px Geist";
    ctx.fillText(`Ticket ${t.category} ${t.tier}`, 60, y + 20);
    ctx.fillText("1", 500, y + 20);
    ctx.fillText(`${netPerTicket.toFixed(2)} €`, 650, y + 20);
    ctx.fillText(`${vatPerTicket.toFixed(2)} €`, 820, y + 20);
    ctx.fillText(`${pricePerTicket.toFixed(2)} €`, 980, y + 20);

    y += 90;
  }

  // Summary
  y += 20;
  ctx.fillStyle = "#d4af37";
  ctx.font = "26px Geist";
  ctx.fillText("Summary", 40, y);

  y += 50;
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "24px Geist";

  ctx.fillText(`Total excl. VAT: ${netAmount.toFixed(2)} €`, 40, y);
  y += 40;

  ctx.fillText(`VAT 13.5%: ${vatAmount.toFixed(2)} €`, 40, y);
  y += 40;

  ctx.fillText(`Service fee: 0.00 €`, 40, y);
  y += 40;

  ctx.fillStyle = "#d4af37";
  ctx.font = "32px Geist";
  ctx.fillText(`Total payable: ${total.toFixed(2)} €`, 40, y);

  return canvas.toBuffer("image/png");
}
