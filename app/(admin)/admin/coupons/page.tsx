import { DataTable, PageIntro } from "@/components/workspace/table";
import { listCoupons } from "@/lib/queries";
import { formatWhen } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const rows = await listCoupons();
  return (
    <div>
      <PageIntro title="Coupons" hint="Codes are listed for staff. Redemption at checkout is not wired yet." />
      <DataTable
        columns={["Code", "Description", "Off", "Active", "Expires"]}
        rows={rows.map((row) => [
          row.code,
          row.description,
          row.percentOff ? `${row.percentOff}%` : row.amountOffInr ? `₹${row.amountOffInr}` : "—",
          row.active ? "Yes" : "No",
          formatWhen(row.expiresAt),
        ])}
      />
    </div>
  );
}
