import nodemailer from "nodemailer";
import { generateInvoiceImage } from "./generateInvoiceImage";
import { invoiceImageToPdf } from "./invoiceImageToPdf";

export async function sendTicketEmail({
  to,
  tickets,
  order,
  upgraded = false, // ⭐ NEW FLAG
}: {
  to: string;
  tickets: { category: string; tier: string; code: string; image: string }[];
  order: any;
  upgraded?: boolean;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const ticketAttachments = tickets.map((t) => {
    const base64Data = t.image.split(",")[1] || "";
    return {
      filename: `${t.code || "ticket"}.png`,
      content: Buffer.from(base64Data, "base64"),
    };
  });

  const invoiceImageBuffer = await generateInvoiceImage(order, tickets);
  const invoicePdfBuffer = await invoiceImageToPdf(invoiceImageBuffer);

  const formattedDate = new Date(order.event.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto;">

      <h2 style="color: #0055A5; margin-bottom: 10px;">🎟️ Your Tickets Are Ready</h2>

      <p style="font-size: 16px;">Hi ${order.name || "Guest"},</p>

      ${
        upgraded
          ? `
        <p style="font-size: 16px; color: #b30000;">
          ⚠️ Your previous tickets have been cancelled and are no longer valid.
        </p>
      `
          : ""
      }

      <p style="font-size: 16px;">
        Thank you for booking with <strong>Taprobane Entertainment</strong>.
      </p>

      <p style="font-size: 16px;">
        You are confirmed for:
      </p>

      <div style="background: #F3F7FB; padding: 15px 20px; border-left: 4px solid #0055A5; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 18px; font-weight: bold;">${order.event.title}</p>
        <p style="margin: 5px 0 0 0; font-size: 15px;">
          📅 <strong>${formattedDate}</strong><br>
          📍 <strong>${order.event.venue}</strong>
        </p>
      </div>

      <p style="font-size: 16px;">Your tickets are attached below as image files.</p>
      <p style="font-size: 16px;">A PDF invoice is also attached for your records.</p>

      <h3 style="margin-top: 25px; color: #0055A5;">Ticket Details</h3>

      <ul style="padding-left: 20px; font-size: 15px;">
        ${tickets
          .map(
            (t) =>
              `<li><strong>${t.code}</strong> — ${t.category} / ${t.tier}</li>`
          )
          .join("")}
      </ul>

      <p style="margin-top: 30px; font-size: 15px;">
        If you have any questions or need assistance, simply reply to this email.
      </p>

      <p style="margin-top: 40px; font-size: 13px; color: #777;">
        Powered by <strong>Taprobane Entertainment Oy</strong>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Your Tickets & Invoice for ${order.event.title}`,
    html: emailHtml,
    attachments: [
      ...ticketAttachments,
      {
        filename: `invoice-${order.id}.pdf`,
        content: invoicePdfBuffer,
      },
    ],
  });
}
