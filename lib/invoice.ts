const VAT_RATE = 0.135;

type TicketForInvoice = {
  category: string;
  tier: string;
  code: string;
};

export function generateInvoiceHTML(order: any, tickets: TicketForInvoice[]) {
  const total = Number(order.totalAmount ?? 0) / 100;
  const serviceFee = Number(order.serviceFee ?? 0) / 100;
  const paymentMethod = order.paymentMethod ?? "";

  const vatAmount = total * VAT_RATE;
  const netAmount = total - vatAmount;

  const formattedDate = new Date(
    order.createdAt ?? order.event?.date
  ).toLocaleString("en-GB", {
    timeZone: "Europe/Helsinki",
  });

  return `
  <html>
    <body style="margin:0; padding:0; background:#0d0d0d; font-family: 'Segoe UI', sans-serif; color:#f5f5f5;">

      <div style="max-width:850px; margin:40px auto; background:#111; border-radius:14px; overflow:hidden; box-shadow:0 0 40px rgba(0,0,0,0.6);">

        <!-- GOLD HEADER -->
        <div style="
          background: linear-gradient(135deg, #d4af37, #b8860b);
          padding: 28px 32px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <div style="display:flex; align-items:center; gap:16px;">
            <img 
              src="file:///${process.cwd().replace(/\\/g, "/")}/public/logo.png"
              style="height:70px;"
            />
            <div style="font-size:26px; font-weight:700; letter-spacing:1px; color:#000;">
              TAPROBANE CINEMA
            </div>
          </div>

          <div style="text-align:right; color:#000;">
            <div style="font-size:22px; font-weight:700;">INVOICE</div>
            <div style="font-size:13px;">Receipt No: ${order.id}</div>
            <div style="font-size:13px;">Order Time: ${formattedDate}</div>
          </div>
        </div>

        <!-- BODY CONTENT -->
        <div style="padding:32px;">

          <!-- CUSTOMER + SELLER -->
          <div style="display:flex; justify-content:space-between; gap:40px; flex-wrap:wrap; margin-bottom:32px;">
            <div style="flex:1; min-width:260px;">
              <div style="font-size:15px; font-weight:600; color:#d4af37; margin-bottom:6px;">Customer</div>
              <div style="font-size:14px; line-height:1.6;">
                ${order.name ?? ""}<br/>
                ${order.email ?? ""}<br/>
                ${order.contactNo ?? ""}
              </div>
            </div>

            <div style="flex:1; min-width:260px;">
              <div style="font-size:15px; font-weight:600; color:#d4af37; margin-bottom:6px;">Seller</div>
              <div style="font-size:14px; line-height:1.6;">
                Taprobane Entertainment Oy<br/>
                Business ID: 1234567-8<br/>
                info@taprobane.fi<br/>
                www.taprobane.fi
              </div>
            </div>
          </div>

          <!-- EVENT BLOCK -->
          <div style="
            background:#1a1a1a;
            border:1px solid #333;
            padding:20px;
            border-radius:10px;
            margin-bottom:32px;
          ">
            <div style="font-size:15px; font-weight:600; color:#d4af37; margin-bottom:6px;">Event</div>
            <div style="font-size:14px; line-height:1.6;">
              ${order.event?.title ?? ""}<br/>
              ${order.event?.venue ?? ""}<br/>
              ${
                order.event?.date
                  ? new Date(order.event.date).toLocaleString("en-GB", {
                      timeZone: "Europe/Helsinki",
                    })
                  : ""
              }
            </div>
          </div>

          <!-- TICKETS TABLE -->
          <table style="width:100%; border-collapse:collapse; margin-bottom:32px; font-size:14px;">
            <thead>
              <tr style="background:#222;">
                <th style="padding:12px; text-align:left; color:#d4af37;">Product</th>
                <th style="padding:12px; text-align:center; color:#d4af37;">Qty</th>
                <th style="padding:12px; text-align:right; color:#d4af37;">Price excl. VAT</th>
                <th style="padding:12px; text-align:right; color:#d4af37;">VAT</th>
                <th style="padding:12px; text-align:right; color:#d4af37;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${tickets
                .map((t, index) => {
                  const price = total / tickets.length;
                  const itemVat = price * VAT_RATE;
                  const itemNet = price - itemVat;
                  const bg = index % 2 === 0 ? "#161616" : "#1e1e1e";

                  return `
                  <tr style="background:${bg};">
                    <td style="padding:12px; color:#f5f5f5;">
                      Ticket ${t.category} ${t.tier}<br/>
                      <span style="font-size:12px; color:#999;">Code: ${t.code}</span>
                    </td>
                    <td style="padding:12px; text-align:center;">1</td>
                    <td style="padding:12px; text-align:right;">${itemNet.toFixed(2)} €</td>
                    <td style="padding:12px; text-align:right;">${itemVat.toFixed(2)} €</td>
                    <td style="padding:12px; text-align:right;">${price.toFixed(2)} €</td>
                  </tr>`;
                })
                .join("")}
            </tbody>
          </table>

          <!-- PAYMENT SUMMARY -->
          <div style="display:flex; justify-content:flex-end;">
            <table style="width:320px; font-size:14px;">
              <tr>
                <td style="padding:6px 0; color:#ccc;">Total excl. VAT:</td>
                <td style="padding:6px 0; text-align:right; color:#fff;">${netAmount.toFixed(2)} €</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#ccc;">VAT 13.5%:</td>
                <td style="padding:6px 0; text-align:right; color:#fff;">${vatAmount.toFixed(2)} €</td>
              </tr>
              <tr>
                <td style="padding:6px 0; color:#ccc;">Service fee:</td>
                <td style="padding:6px 0; text-align:right; color:#fff;">${serviceFee.toFixed(2)} €</td>
              </tr>
              <tr>
                <td style="padding:10px 0; font-weight:700; color:#d4af37;">Total payable:</td>
                <td style="padding:10px 0; text-align:right; font-weight:700; color:#d4af37;">${total.toFixed(2)} €</td>
              </tr>
            </table>
          </div>

          <!-- FOOTER -->
          <div style="margin-top:40px; text-align:center; font-size:12px; color:#777;">
            This is an automatically generated invoice for your ticket purchase.<br/>
            Taprobane Entertainment Oy · Business ID: 1234567-8 · Messukeskus, Helsinki
          </div>

        </div>
      </div>

    </body>
  </html>
  `;
}
