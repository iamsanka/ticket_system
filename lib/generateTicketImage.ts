// FILE: lib/generateTicketImage.ts

import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// Register a real font (must exist in /public/fonts)
registerFont(
  path.join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"),
  { family: "Geist" }
);

type TicketImageParams = {
  qrPng: string;
  event: string;
  name: string;
  date: string;
  venue: string;
  category: "ADULT" | "CHILD";
  tier: "LOUNGE" | "STANDARD";
  ticketCode: string;
};

export async function generateBrandedTicket({
  qrPng,
  event,
  name,
  date,
  venue,
  category,
  tier,
  ticketCode,
}: TicketImageParams): Promise<string> {
  const width = 1000;
  const height = 600;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0A1A2F";
  ctx.fillRect(0, 0, width, height);

  // Load logo
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logo = await loadImage(logoPath);
  ctx.drawImage(logo, (width - 180) / 2, 20, 180, 180);

  // Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 36px Geist, Arial, sans-serif";
  ctx.fillText(event || "EVENT", 40, 260);

  // Details
  ctx.font = "28px Geist, Arial, sans-serif";
  ctx.fillText(`Name: ${name || "Guest"}`, 40, 320);
  ctx.fillText(`Date: ${date || "N/A"}`, 40, 360);
  ctx.fillText(`Venue: ${venue || "N/A"}`, 40, 400);
  ctx.fillText(`Category: ${category || "N/A"}`, 40, 440);
  ctx.fillText(`Tier: ${tier || "N/A"}`, 40, 480);
  ctx.fillText(`Ticket Code: ${ticketCode || "N/A"}`, 40, 520);

  // QR Code
  const qrImage = await loadImage(`data:image/png;base64,${qrPng}`);
  ctx.drawImage(qrImage, width - 350, 200, 300, 300);

  return canvas.toDataURL("image/png");
}
