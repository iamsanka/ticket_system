// lib/invoiceImageToPdf.ts

import { PDFDocument } from "pdf-lib";

export async function invoiceImageToPdf(imageBuffer: Buffer) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage();

  const png = await pdf.embedPng(imageBuffer);
  const { width, height } = png.scale(1);

  page.setSize(width, height);
  page.drawImage(png, { x: 0, y: 0, width, height });

  return Buffer.from(await pdf.save());
}
