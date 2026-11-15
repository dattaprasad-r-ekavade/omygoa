import { CheckoutButton } from "@/components/plans/checkout-button";
import { DataTable, PageIntro } from "@/components/workspace/table";
import { listPlans, ownerBilling } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import { formatInr, formatWhen } from "@/lib/utils";

export default async function OwnerBillingPage() {
  const { session } = await requireRole(["owner"], "/owner/billing");
  const [records, plans] = await Promise.all([ownerBilling(session.user.id), listPlans()]);
  return (
    <div>
      <PageIntro title="Billing and receipts" hint="Checkout creates a Razorpay order when keys exist, otherwise a stub receipt." />
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {plans
          .filter((plan) => plan.priceInr > 0)
          .map((plan) => (
            <article key={plan.id} className="rounded-3xl bg-white p-4">
              <h2 className="font-semibold">{plan.name}</h2>
              <p className="font-display text-2xl">{formatInr(plan.priceInr)}</p>
              <p className="text-xs text-[var(--gp-ink-2)]">per {plan.interval}</p>
              <div className="mt-3">
                <CheckoutButton planId={plan.id} label="Review checkout" />
              </div>
            </article>
          ))}
      </div>
      <DataTable
        columns={["Description", "Amount", "Status", "Reference", "Date"]}
        rows={records.map((row) => [row.description, formatInr(row.amountInr), row.status, row.providerRef, formatWhen(row.createdAt)])}
      />
    </div>
  );
}
