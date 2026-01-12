import QRCode from "qrcode";

export async function generateTicketQR(data: {
  orderId: string;
}) {
  // Only encode JSON
  const payload = JSON.stringify({
    orderId: data.orderId,
  });

  const qr = await QRCode.toDataURL(payload, {
    type: "image/png",
    width: 400,
    margin: 2,
  });

  return qr; // base64 PNG
}
