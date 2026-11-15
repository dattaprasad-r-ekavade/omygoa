import { DataTable, PageIntro } from "@/components/workspace/table";
import { listAllReviews } from "@/lib/queries";
import { formatWhen } from "@/lib/utils";

export default async function AdminReviewsPage() {
  const rows = await listAllReviews();
  return (
    <div>
      <PageIntro title="Reviews" hint="Moderation actions are still to be wired. Pending rows are hidden on the public page." />
      <DataTable
        columns={["Business", "Author", "Rating", "Status", "Review", "Date"]}
        rows={rows.map((row) => [row.businessName, row.authorName, row.rating, row.status, row.body, formatWhen(row.createdAt)])}
      />
    </div>
  );
}
