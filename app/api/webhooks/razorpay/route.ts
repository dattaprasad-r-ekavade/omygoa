import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { billingRecords } from "@/lib/db/schema";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Razorpay webhook is not configured." }, { status: 501 });
  }
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!verifyRazorpaySignature(body, signature, secret)) {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }
  const payload = JSON.parse(body) as {
    event?: string;
    payload?: { payment?: { entity?: { order_id?: string; id?: string } }; order?: { entity?: { id?: string } } };
  };
  const orderId = payload.payload?.payment?.entity?.order_id ?? payload.payload?.order?.entity?.id;
  if (orderId && (payload.event === "payment.captured" || payload.event === "order.paid")) {
    const db = await getDb();
    await db.update(billingRecords).set({ status: "paid" }).where(eq(billingRecords.providerRef, orderId));
  }
  return Response.json({ received: true });
}
