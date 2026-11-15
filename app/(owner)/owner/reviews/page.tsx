import { DataTable, PageIntro } from "@/components/workspace/table";
import { ownerReviews } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import { formatWhen } from "@/lib/utils";

export default async function OwnerReviewsPage() {
  const { session } = await requireRole(["owner"], "/owner/reviews");
  const rows = await ownerReviews(session.user.id);
  return (
    <div>
      <PageIntro title="Customer reviews" hint="Replies are not in this pass. Pending reviews stay off the public page." />
      {rows.length === 0 ? <p>Create a listing first.</p> : null}
      <DataTable
        columns={["Business", "Author", "Rating", "Review", "Status", "Date"]}
        rows={rows.map((row) => [row.businessName, row.authorName, row.rating, row.body, row.status, formatWhen(row.createdAt)])}
      />
    </div>
  );
}
