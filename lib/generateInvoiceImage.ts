import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import { generateInvoice } from "./generateInvoice";

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
  const invoice = generateInvoice(order);

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
  ctx.fillText(`Receipt No: ${invoice.receiptNo}`, 40, 220);
  ctx.fillText(
    `Order Time: ${new Date(invoice.orderTime).toLocaleString("en-GB")}`,
    40,
    270
  );

  // Customer
  ctx.font = "32px Geist";
  ctx.fillStyle = "#d4af37";
  ctx.fillText("Customer", 40, 340);

  ctx.font = "24px Geist";
  ctx.fillStyle = "#f5f5f5";
  ctx.fillText(invoice.customer.name, 40, 380);
  ctx.fillText(invoice.customer.email, 40, 420);
  ctx.fillText(invoice.customer.contactNo, 40, 460);

  // Seller
  ctx.font = "32px Geist";
  ctx.fillStyle = "#d4af37";
  ctx.fillText("Seller", 650, 340);

  ctx.font = "24px Geist";
  ctx.fillStyle = "#f5f5f5";
  ctx.fillText(invoice.seller.name, 650, 380);
  ctx.fillText(`Business ID: ${invoice.seller.businessId}`, 650, 420);
  ctx.fillText(invoice.seller.email, 650, 460);
  ctx.fillText(invoice.seller.website, 650, 500);

  // Event block
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(40, 520, width - 80, 160);

  ctx.fillStyle = "#d4af37";
  ctx.font = "28px Geist";
  ctx.fillText("Event", 60, 560);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "24px Geist";
  ctx.fillText(invoice.event.title, 60, 600);
  ctx.fillText(invoice.event.venue, 60, 640);
  ctx.fillText(
    new Date(invoice.event.date).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
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

  y += 80;

  for (const row of invoice.rows) {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(40, y - 20, width - 80, 70);

    ctx.fillStyle = "#f5f5f5";
    ctx.font = "22px Geist";
    ctx.fillText(row.product, 60, y + 20);
    ctx.fillText(`${row.quantity}`, 500, y + 20);
    ctx.fillText(`${row.exclVat.toFixed(2)} €`, 650, y + 20);
    ctx.fillText(`${row.vat.toFixed(2)} €`, 820, y + 20);
    ctx.fillText(`${row.total.toFixed(2)} €`, 980, y + 20);

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

  // Payment method
  ctx.fillText(`Payment method: ${invoice.paymentMethod}`, 40, y);
  y += 40;

  ctx.fillText(
    `Total excl. VAT: ${invoice.summary.totalExclVat.toFixed(2)} €`,
    40,
    y
  );
  y += 40;

  ctx.fillText(
    `VAT 13.5%: ${invoice.summary.totalVat.toFixed(2)} €`,
    40,
    y
  );
  y += 40;

  ctx.fillText(
    `Service fee: ${invoice.summary.serviceFee.toFixed(2)} €`,
    40,
    y
  );
  y += 40;

  ctx.fillStyle = "#d4af37";
  ctx.font = "32px Geist";
  ctx.fillText(
    `Total payable: ${invoice.summary.totalPayable.toFixed(2)} €`,
    40,
    y
  );

  return canvas.toBuffer("image/png");
}
