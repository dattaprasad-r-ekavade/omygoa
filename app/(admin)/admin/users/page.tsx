import { DataTable, PageIntro } from "@/components/workspace/table";
import { listUsers } from "@/lib/queries";
import { displayPhone, formatWhen } from "@/lib/utils";

export default async function AdminUsersPage() {
  const rows = await listUsers();
  return (
    <div>
      <PageIntro title="Users" hint="Read-only. Roles are assigned in the database for this foundation." />
      <DataTable
        columns={["Name", "Email", "Phone", "Role", "Joined"]}
        rows={rows.map((row) => [row.name, row.email, displayPhone(row.phoneNumber), row.role, formatWhen(row.createdAt)])}
      />
    </div>
  );
}
