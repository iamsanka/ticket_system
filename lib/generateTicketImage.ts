import { createCanvas, loadImage } from "canvas";

type TicketImageParams = {
  qrPng: string;
  event: string;
  name: string;
  people: number;
  date: string;
  venue: string;
};

export async function generateBrandedTicket({
  qrPng,
  event,
  name,
  people,
  date,
  venue,
}: TicketImageParams): Promise<string> {
  const width = 1000;
  const height = 600;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0A1A2F"; // Taprobane dark blue
  ctx.fillRect(0, 0, width, height);

  // Load logo
  const logo = await loadImage("public/logo.png");

  // Draw logo (centered at top)
  const logoWidth = 180;
  const logoHeight = 180;
  const logoX = (width - logoWidth) / 2;
  const logoY = 20;

  ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

  // Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 48px Sans-serif";
  ctx.fillText(event, 40, 260);

  // Details
  ctx.font = "28px Sans-serif";
  ctx.fillText(`Name: ${name}`, 40, 330);
  ctx.fillText(`People: ${people}`, 40, 380);
  ctx.fillText(`Date: ${date}`, 40, 430);
  ctx.fillText(`Venue: ${venue}`, 40, 480);

  // Load QR code
  const qrImage = await loadImage(qrPng);
  ctx.drawImage(qrImage, width - 350, 200, 300, 300);

  return canvas.toDataURL("image/png");
}
