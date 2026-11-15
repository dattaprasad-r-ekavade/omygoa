import { DataTable, PageIntro } from "@/components/workspace/table";
import { ownerLeads } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import { displayPhone, formatWhen } from "@/lib/utils";

export default async function OwnerLeadsPage() {
  const { session } = await requireRole(["owner"], "/owner/leads");
  const rows = await ownerLeads(session.user.id);
  return (
    <div>
      <PageIntro title="Leads inbox" hint="Enquiries sent from your public pages." />
      <DataTable
        columns={["Business", "From", "Contact", "Message", "Status", "When"]}
        rows={rows.map((row) => [row.businessName, row.name, `${row.email} ${displayPhone(row.phone)}`, row.message, row.status, formatWhen(row.createdAt)])}
      />
    </div>
  );
}
