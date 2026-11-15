import Link from "next/link";
import { DataTable, PageIntro } from "@/components/workspace/table";
import { userEnquiries } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { formatWhen } from "@/lib/utils";

export default async function MyEnquiriesPage() {
  const session = await requireUser("/dashboard/enquiries");
  const rows = await userEnquiries(session.user.id);
  return (
    <div>
      <PageIntro title="My enquiries" />
      <DataTable
        columns={["Business", "Message", "Status", "Sent"]}
        rows={rows.map((row) => [
          row.businessSlug ? <Link href={`/business/${row.businessSlug}`}>{row.businessName}</Link> : row.businessName,
          row.message,
          row.status,
          formatWhen(row.createdAt),
        ])}
      />
    </div>
  );
}
