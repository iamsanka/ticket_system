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

  const attachments = tickets.map((t, i) => ({
    filename: `${t.code}.png`,
    content: Buffer.from(t.image.split(",")[1], "base64"),
  }));

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Your tickets for ${order.event.title}`,
    html: `
      <p>Thank you for booking <strong>${order.event.title}</strong>.</p>
      <p>Your tickets are attached below.</p>
    `,
    attachments,
  });
}
