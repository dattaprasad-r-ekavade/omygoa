import { DataTable, PageIntro } from "@/components/workspace/table";
import { listAllBusinesses } from "@/lib/queries";

export default async function ManagerBusinessesPage() {
  const rows = await listAllBusinesses();
  return (
    <div>
      <PageIntro title="Business registrations" hint="Staff can review the queue. Approve and reject actions stay with the admin editor for now." />
      <DataTable
        columns={["Name", "Town", "Registration", "Listing"]}
        rows={rows.map((row) => [row.name, row.townName, row.registrationStatus, row.listingStatus])}
      />
    </div>
  );
}
