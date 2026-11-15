import Link from "next/link";
import { DataTable, PageIntro } from "@/components/workspace/table";
import { listPosts } from "@/lib/queries";
import { formatWhen, one } from "@/lib/utils";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const section = one((await searchParams).section);
  const rows = (await listPosts()).filter((row) => !section || row.section === section);
  return (
    <div>
      <PageIntro title="Posts" hint="Jobs, rentals, preloved items and pet listings. Read-only in this pass." />
      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        {["", "jobs", "rentals", "preloved", "giveaway", "pets"].map((item) => (
          <Link key={item || "all"} href={item ? `/admin/posts?section=${item}` : "/admin/posts"} className="rounded-full bg-white px-3 py-1">
            {item || "All"}
          </Link>
        ))}
      </div>
      <DataTable
        columns={["Title", "Section", "Town", "Status", "Posted"]}
        rows={rows.map((row) => [
          <Link key={row.id} href={row.href} className="font-semibold text-[var(--gp-indigo)]">
            {row.title}
          </Link>,
          row.section,
          row.town,
          row.status,
          formatWhen(row.createdAt),
        ])}
      />
    </div>
  );
}
