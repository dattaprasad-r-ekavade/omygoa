import Link from "next/link";
import { DataTable, PageIntro } from "@/components/workspace/table";
import { listPosts } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { formatWhen } from "@/lib/utils";

export default async function MyPostsPage() {
  const session = await requireUser("/dashboard/posts");
  const rows = (await listPosts()).filter((row) => row.userId === session.user.id);
  return (
    <div>
      <PageIntro title="My posts" hint="Jobs, rentals, preloved items and pets on your account. Editing forms come next." />
      <DataTable
        columns={["Title", "Section", "Status", "Posted"]}
        rows={rows.map((row) => [
          <Link key={row.id} href={row.href} className="font-semibold text-[var(--gp-indigo)]">
            {row.title}
          </Link>,
          row.section,
          row.status,
          formatWhen(row.createdAt),
        ])}
      />
    </div>
  );
}
