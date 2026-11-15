import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { billingRecords, subscriptionPlans } from "@/lib/db/schema";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in to review checkout." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { planId?: string } | null;
  if (!body?.planId) return Response.json({ error: "Missing plan." }, { status: 400 });
  const db = await getDb();
  const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, body.planId)).limit(1);
  const plan = plans[0];
  if (!plan) return Response.json({ error: "Unknown plan." }, { status: 404 });
  const receipt = `plan_${plan.slug}_${Date.now()}`;
  const order = await createRazorpayOrder({
    amountInr: plan.priceInr,
    receipt,
    notes: { plan: plan.slug, userId: session.user.id },
  });
  await db.insert(billingRecords).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    planId: plan.id,
    amountInr: plan.priceInr,
    currency: "INR",
    status: order.mode === "stub" ? "stub" : "created",
    provider: "razorpay",
    providerRef: order.orderId,
    description: `${plan.name} (${plan.interval})`,
    createdAt: new Date(),
  });
  return Response.json(order);
}
