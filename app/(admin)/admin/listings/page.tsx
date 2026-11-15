import Link from "next/link";
import { DataTable, PageIntro } from "@/components/workspace/table";
import { listAllBusinesses } from "@/lib/queries";

export default async function AdminListingsPage() {
  const rows = await listAllBusinesses();
  return (
    <div>
      <PageIntro title="Business listings" hint="Read-only view of the public cards. Edit them from Businesses." />
      <DataTable
        columns={["Listing", "Category", "Town", "Status", "Featured"]}
        rows={rows.map((row) => [
          <Link key={row.id} href={`/business/${row.slug}`} className="font-semibold text-[var(--gp-indigo)]">
            {row.name}
          </Link>,
          row.categoryName,
          row.townName,
          row.listingStatus,
          row.featured ? "Yes" : "No",
        ])}
      />
    </div>
  );
}
