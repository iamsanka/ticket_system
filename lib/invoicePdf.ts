import { PDFDocument, StandardFonts } from "pdf-lib";

export async function invoiceHtmlToPdfBuffer(html: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 10;

  const text = html.replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let y = height - 40;

  for (const line of lines) {
    if (y < 40) {
      const newPage = pdfDoc.addPage([595.28, 841.89]);
      y = newPage.getSize().height - 40;
    }
    page.drawText(line, {
      x: 40,
      y,
      size: fontSize,
      font,
    });
    y -= fontSize + 4;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
