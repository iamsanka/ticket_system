// lib/fees.ts

export const VAT_RATE = 0.135;

export function calculateVat(total: number) {
  const vatAmount = total * VAT_RATE;
  const netAmount = total - vatAmount;

  return {
    vatAmount,
    netAmount,
  };
}

export function calculateServiceFee(total: number, paymentMethod: string) {
  let rate = 0;

  if (paymentMethod === "edenred") rate = 0.05; // 5%
  if (paymentMethod === "epassi") rate = 0.07; // 7%

  const fee = total * rate;

  return {
    serviceFee: fee,
    serviceRate: rate,
  };
}
