import { DataTable, PageIntro } from "@/components/workspace/table";
import { listAllBusinesses } from "@/lib/queries";

export default async function ManagerListingsPage() {
  const rows = await listAllBusinesses();
  return (
    <div>
      <PageIntro title="Business listings" />
      <DataTable
        columns={["Name", "Category", "Status", "Plan"]}
        rows={rows.map((row) => [row.name, row.categoryName, row.listingStatus, row.plan])}
      />
    </div>
  );
}
