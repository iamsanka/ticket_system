import { Order, Ticket } from "@prisma/client";

type InvoiceRow = {
  product: string;
  quantity: number;
  exclVat: number;
  vat: number;
  total: number;
};

type InvoiceSummary = {
  totalExclVat: number;
  totalVat: number;
  serviceFee: number;
  totalPayable: number;
};

type Invoice = {
  receiptNo: string;
  orderTime: Date;
  paymentMethod: string;   // ← NEW
  customer: {
    name: string;
    email: string;
    contactNo: string;
  };
  seller: {
    name: string;
    businessId: string;
    email: string;
    website: string;
  };
  event: {
    title: string;
    venue: string;
    date: Date;
  };
  rows: InvoiceRow[];
  summary: InvoiceSummary;
};

export function generateInvoice(order: Order & { tickets: Ticket[]; event: any }): Invoice {
  const vatRate = 13.5;

  // Group tickets
  const grouped: Record<string, { label: string; qty: number; gross: number }> = {};

  for (const ticket of order.tickets) {
    const key = `${ticket.category}-${ticket.tier}`;
    const label = `Ticket ${ticket.category} ${ticket.tier}`;
    const price = getTicketPrice(order.event, ticket);

    if (!grouped[key]) {
      grouped[key] = { label, qty: 1, gross: price };
    } else {
      grouped[key].qty += 1;
      grouped[key].gross += price;
    }
  }

  const rows: InvoiceRow[] = Object.values(grouped).map((group) => {
    const exclVat = +(group.gross / (100 + vatRate) * 100).toFixed(2);
    const vat = +(group.gross - exclVat).toFixed(2);

    return {
      product: group.label,
      quantity: group.qty,
      exclVat,
      vat,
      total: group.gross,
    };
  });

  const totalExclVat = rows.reduce((sum, r) => sum + r.exclVat, 0);
  const totalVat = rows.reduce((sum, r) => sum + r.vat, 0);
  const totalGross = rows.reduce((sum, r) => sum + r.total, 0);
  const serviceFee = +((order.serviceFee ?? 0) / 100).toFixed(2);

  return {
    receiptNo: order.id,
    orderTime: order.createdAt,
    paymentMethod: order.paymentMethod ?? "",   // ← NEW
    customer: {
      name: order.name ?? "Guest",
      email: order.email,
      contactNo: order.contactNo ?? "",
    },
    seller: {
      name: "Taprobane Entertainment Oy",
      businessId: "3581857-4",
      email: "info@taprobane.fi",
      website: "www.taprobane.fi",
    },
    event: {
      title: order.event.title,
      venue: order.event.venue,
      date: order.event.date,
    },
    rows,
    summary: {
      totalExclVat: +totalExclVat.toFixed(2),
      totalVat: +totalVat.toFixed(2),
      serviceFee,
      totalPayable: +(totalGross + serviceFee).toFixed(2),
    },
  };
}

function getTicketPrice(event: any, ticket: Ticket): number {
  if (ticket.category === "ADULT" && ticket.tier === "LOUNGE") return event.adultLoungePrice / 100;
  if (ticket.category === "ADULT" && ticket.tier === "STANDARD") return event.adultStandardPrice / 100;
  if (ticket.category === "CHILD" && ticket.tier === "LOUNGE") return event.childLoungePrice / 100;
  if (ticket.category === "CHILD" && ticket.tier === "STANDARD") return event.childStandardPrice / 100;
  return 0;
}
