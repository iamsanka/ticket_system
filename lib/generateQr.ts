import QRCode from "qrcode";

/**
 * Generates a QR code image as a base64 PNG string.
 * Encodes only the ticket's unique QR code value.
 */
export async function generateQr(qrCode: string): Promise<Buffer> {
  const payload = JSON.stringify({ qrCode });

  const base64 = await QRCode.toDataURL(payload, {
    type: "image/png",
    width: 400,
    margin: 2,
  });

  // Convert base64 to Buffer for email attachment
  const base64Data = base64.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64Data, "base64");
}
