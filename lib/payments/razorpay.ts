import { createHmac, timingSafeEqual } from "node:crypto";

export type CheckoutResult =
  | {
      mode: "live";
      keyId: string;
      orderId: string;
      amount: number;
      currency: "INR";
    }
  | {
      mode: "stub";
      keyId: null;
      orderId: string;
      amount: number;
      currency: "INR";
      message: string;
    };

export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(input: {
  amountInr: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<CheckoutResult> {
  const amount = Math.round(input.amountInr * 100);
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return {
      mode: "stub",
      keyId: null,
      orderId: `order_stub_${input.receipt}`,
      amount,
      currency: "INR",
      message: "Razorpay keys are not set. This is a stub order and no charge was created.",
    };
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: input.receipt.slice(0, 40),
      notes: input.notes ?? {},
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Razorpay order failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  const payload = (await response.json()) as { id: string; amount: number; currency: "INR" };
  return {
    mode: "live",
    keyId,
    orderId: payload.id,
    amount: payload.amount,
    currency: "INR",
  };
}

export function verifyRazorpaySignature(body: string, signature: string | null, secret: string) {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
