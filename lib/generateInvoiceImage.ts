// lib/generateInvoiceImage.ts

import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

registerFont(path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"), {
  family: "Geist",
});

export async function generateInvoiceImage(order: any, tickets: any[]) {
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
  ctx.fillText("TAPROBANE CINEMA", 200, 90);

  ctx.font = "28px Geist";
  ctx.fillText("INVOICE", 200, 140);

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
  ctx.fillText("Business ID: 1234567-8", 650, 420);
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
  ctx.fillText(
    new Date(order.event.date).toLocaleString("en-GB"),
    60,
    680
  );

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

  // Ticket rows
  y += 80;

  const total = order.totalAmount / 100;
  const vat = total * 0.135;
  const net = total - vat;

  const perTicket = total / tickets.length;
  const perTicketVat = perTicket * 0.135;
  const perTicketNet = perTicket - perTicketVat;

  for (const t of tickets) {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(40, y - 20, width - 80, 70);

    ctx.fillStyle = "#f5f5f5";
    ctx.font = "22px Geist";
    ctx.fillText(`Ticket ${t.category} ${t.tier}`, 60, y + 20);
    ctx.fillText("1", 500, y + 20);
    ctx.fillText(`${perTicketNet.toFixed(2)} €`, 650, y + 20);
    ctx.fillText(`${perTicketVat.toFixed(2)} €`, 820, y + 20);
    ctx.fillText(`${perTicket.toFixed(2)} €`, 980, y + 20);

    ctx.font = "18px Geist";
    ctx.fillStyle = "#999";
    ctx.fillText(`Code: ${t.code}`, 60, y + 50);

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
  ctx.fillText(`Total excl. VAT: ${net.toFixed(2)} €`, 40, y);
  y += 40;
  ctx.fillText(`VAT 13.5%: ${vat.toFixed(2)} €`, 40, y);
  y += 40;
  ctx.fillText(`Service fee: ${(order.serviceFee / 100).toFixed(2)} €`, 40, y);
  y += 40;

  ctx.fillStyle = "#d4af37";
  ctx.font = "32px Geist";
  ctx.fillText(`Total payable: ${total.toFixed(2)} €`, 40, y);

  return canvas.toBuffer("image/png");
}
