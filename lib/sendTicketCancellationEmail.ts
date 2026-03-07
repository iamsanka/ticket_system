import nodemailer from "nodemailer";

export async function sendTicketCancellationEmail({
  to,
  order,
  tickets,
}: {
  to: string;
  order: any;
  tickets: any[];
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

  const ticketListHtml = tickets
    .map(
      (t) => `
        <li>
          <strong>${t.ticketCode}</strong> — ${t.category} / ${t.tier}
        </li>
      `
    )
    .join("");

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Your Tickets Have Been Cancelled</h2>

      <p>Hello ${order.name || "Customer"},</p>

      <p>Your tickets for the event <strong>${order.event?.title}</strong> have been cancelled and are no longer valid.</p>

      <p><strong>Cancelled Tickets:</strong></p>
      <ul>
        ${ticketListHtml}
      </ul>

      <p>If this was a mistake or you need assistance, please contact our support team.</p>

      <br/>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Event:</strong> ${order.event?.title}</p>
      <p><strong>Date:</strong> ${new Date(order.event?.date).toDateString()}</p>

      <br/>
      <p>Regards,<br/>Event Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Your Tickets Have Been Cancelled",
    html,
  });
}
