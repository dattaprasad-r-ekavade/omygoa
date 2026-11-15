import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { adminOverview } from "@/lib/queries";
import { formatWhen } from "@/lib/utils";

export default async function AdminHome() {
  const data = await adminOverview();
  const total = Math.max(1, data.byStatus.active + data.byStatus.pending + data.byStatus.rejected + data.byStatus.suspended);
  const cards = [
    ["Total businesses", data.businesses],
    ["Total users", data.users],
    ["Total reviews", data.reviews],
    ["Enquiries", data.enquiries],
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Admin overview</h1>
      <p className="text-sm text-[var(--gp-ink-2)]">Platform health and the demo queue.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/businesses" className="rounded-3xl bg-white p-4">
          <p className="text-sm text-[var(--gp-ink-2)]">Pending approval</p>
          <p className="font-display text-3xl font-semibold">{data.pendingBusinesses}</p>
        </Link>
        <div className="rounded-3xl bg-white p-4">
          <p className="text-sm text-[var(--gp-ink-2)]">Live listings</p>
          <p className="font-display text-3xl font-semibold">{data.byStatus.active}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl bg-white p-4">
            <p className="font-display text-3xl font-semibold">{value}</p>
            <p className="text-sm text-[var(--gp-ink-2)]">{label}</p>
          </div>
        ))}
      </div>
      <section className="mt-4 rounded-3xl bg-white p-4">
        <h2 className="font-semibold">Listing status</h2>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[var(--gp-line)]">
          <span className="bg-[#16834b]" style={{ width: `${(data.byStatus.active / total) * 100}%` }} />
          <span className="bg-[var(--gp-butter-deep)]" style={{ width: `${(data.byStatus.pending / total) * 100}%` }} />
          <span className="bg-[#c52842]" style={{ width: `${(data.byStatus.rejected / total) * 100}%` }} />
          <span className="bg-[var(--gp-ink-2)]" style={{ width: `${(data.byStatus.suspended / total) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs text-[var(--gp-ink-2)]">
          Active {data.byStatus.active} · Pending {data.byStatus.pending} · Rejected {data.byStatus.rejected} · Suspended {data.byStatus.suspended}
        </p>
      </section>
      <section className="mt-4 rounded-3xl bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-semibold">Recent submissions</h2>
          <Link href="/admin/businesses" className="text-sm text-[var(--gp-indigo)]">
            View all
          </Link>
        </div>
        <ul>
          {data.recent.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 border-t border-[var(--gp-line)] px-4 py-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-[var(--gp-ink-2)]">{row.listingStatus}</p>
              </div>
              <Badge tone={row.listingStatus === "active" ? "mint" : "butter"}>{formatWhen(row.createdAt)}</Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
