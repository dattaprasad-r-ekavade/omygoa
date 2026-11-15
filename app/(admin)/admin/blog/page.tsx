import Link from "next/link";
import { DataTable, PageIntro } from "@/components/workspace/table";
import { listAllBlog } from "@/lib/queries";
import { formatWhen } from "@/lib/utils";

export default async function AdminBlogPage() {
  const rows = await listAllBlog();
  return (
    <div>
      <PageIntro title="Blog posts" hint="Read-only. Publishing from the editor is a later pass." />
      <DataTable
        columns={["Title", "Status", "Author", "Published"]}
        rows={rows.map((row) => [
          row.status === "published" ? (
            <Link key={row.id} href={`/blog/${row.slug}`} className="font-semibold text-[var(--gp-indigo)]">
              {row.title}
            </Link>
          ) : (
            row.title
          ),
          row.status,
          row.authorName,
          formatWhen(row.publishedAt),
        ])}
      />
    </div>
  );
}
