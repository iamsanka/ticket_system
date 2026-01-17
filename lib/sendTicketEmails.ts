import nodemailer from "nodemailer";

export async function sendTicketEmail({
  to,
  tickets,
  order,
}: {
  to: string;
  tickets: { category: string; tier: string; code: string; image: string }[];
  order: any;
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

  const attachments = tickets.map((t) => ({
    filename: `${t.code}.png`,
    content: Buffer.from(t.image.split(",")[1], "base64"),
  }));

  const formattedDate = new Date(order.event.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Your Tickets for ${order.event.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto;">

        <h2 style="color: #0055A5; margin-bottom: 10px;">🎟️ Your Tickets Are Ready</h2>

        <p style="font-size: 16px;">Hi ${order.name || "Guest"},</p>

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

        <p style="font-size: 16px;">Your tickets are attached below. Please present them at the entrance for scanning.</p>

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
          If you have any questions or need assistance, simply reply to this email. We're here to help.
        </p>

        <p style="margin-top: 20px; font-size: 15px;">
          We look forward to welcoming you to the event.
        </p>

        <p style="margin-top: 40px; font-size: 13px; color: #777;">
          Powered by <strong>Taprobane Entertainment</strong>
        </p>
      </div>
    `,
    attachments,
  });
}
