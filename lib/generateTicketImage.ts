import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// Register font
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

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#0A1A2F");
  gradient.addColorStop(1, "#1C2E4A");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Load logo
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logo = await loadImage(logoPath);
  ctx.drawImage(logo, 40, 40, 120, 120);

  // Event title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 40px Geist";
  ctx.fillText(event || "EVENT", 40, 200);

  // Info block
  ctx.font = "28px Geist";
  ctx.fillStyle = "#E0E0E0";
  const infoY = 260;
  const lineHeight = 40;

  ctx.fillText(`👤 Name: ${name || "Guest"}`, 40, infoY + lineHeight * 0);
  ctx.fillText(`📅 Date: ${date || "N/A"}`, 40, infoY + lineHeight * 1);
  ctx.fillText(`📍 Venue: ${venue || "N/A"}`, 40, infoY + lineHeight * 2);
  ctx.fillText(`🗂️ Category: ${category}`, 40, infoY + lineHeight * 3);
  ctx.fillText(`🪑 Tier: ${tier}`, 40, infoY + lineHeight * 4);
  ctx.fillText(`🔢 Code: ${ticketCode}`, 40, infoY + lineHeight * 5);

  // QR Code
  const qrImage = await loadImage(`data:image/png;base64,${qrPng}`);
  const qrX = width - 320;
  const qrY = 180;
  const qrSize = 260;

  // QR shadow box
  ctx.fillStyle = "#FFFFFF22";
  ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  // QR caption
  ctx.font = "20px Geist";
  ctx.fillStyle = "#CCCCCC";
  ctx.fillText("Scan at entry", qrX + 40, qrY + qrSize + 30);

  // ⭐ VIP BADGE (only for LOUNGE tier)
  if (tier === "LOUNGE") {
    const badgeX = width - 300;
    const badgeY = 80;
    const badgeWidth = 240;
    const badgeHeight = 60;

    // Badge background
    const vipGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
    vipGradient.addColorStop(0, "#D4AF37"); // gold
    vipGradient.addColorStop(1, "#B8860B"); // darker gold
    ctx.fillStyle = vipGradient;
    ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 12);
    ctx.fill();

    // VIP text
    const vipText = "⭐ VIP ACCESS";
    ctx.font = "bold 28px Geist";
    ctx.fillStyle = "#000000";
    const textWidth = ctx.measureText(vipText).width;
    const textX = badgeX + (badgeWidth - textWidth) / 2;
    const textY = badgeY + 40;
    ctx.fillText(vipText, textX, textY);
  }

  // Footer seal
  ctx.font = "16px Geist";
  ctx.fillStyle = "#888";
  ctx.fillText("Powered by Taprobane Entertainment", 40, height - 30);

  return canvas.toDataURL("image/png");
}
