import Link from "next/link";
import { adminOverview, listCampaigns } from "@/lib/queries";

export default async function ManagerHome() {
  const [data, campaigns] = await Promise.all([adminOverview(), listCampaigns()]);
  const pendingAds = campaigns.filter((row) => row.status === "pending").length;
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Overview</h1>
      <p className="text-xs font-semibold tracking-wide text-[var(--gp-ink-2)] uppercase">Platform health</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [`${data.pendingBusinesses}`, "Pending listings"],
          [`${data.businesses}`, "Total businesses"],
          ["0", "Pending certificates"],
          [`${pendingAds}`, "Pending ads"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-3xl bg-white p-4">
            <p className="font-display text-3xl font-semibold">{value}</p>
            <p className="text-sm text-[var(--gp-ink-2)]">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3 text-sm">
        <Link href="/manager/businesses" className="rounded-full bg-[var(--gp-indigo)] px-4 py-2 font-semibold text-white">
          Review businesses
        </Link>
        <Link href="/manager/events" className="rounded-full bg-white px-4 py-2 font-semibold">
          Events
        </Link>
      </div>
    </div>
  );
}
