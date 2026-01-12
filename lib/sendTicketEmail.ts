"use server";

import nodemailer from "nodemailer";

type SendTicketEmailParams = {
  to: string;
  name: string;
  ticketPng: string; // base64 PNG string of the branded ticket
  eventTitle: string;
};

export async function sendTicketEmail({
  to,
  name,
  ticketPng,
  eventTitle,
}: SendTicketEmailParams) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject: `Your Ticket for ${eventTitle}`,
    html: `
      <p>Hi ${name},</p>
      <p>Your branded ticket is attached below. Please show it at the entrance.</p>
      <p>Thank you for booking with Taprobane Entertainment.</p>
    `,
    attachments: [
      {
        filename: "ticket.png",
        content: ticketPng.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
}
