import { PostList } from "@/components/site/post-list";
import { listPreloved } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta({
    title: "Preloved & Free giveaway items",
    description: "Fresh finds and free giveaways from people around Goa.",
    path: "/preloved",
  });
}

export default async function PrelovedPage({ searchParams }: { searchParams: Promise<{ free?: string }> }) {
  const { free } = await searchParams;
  const rows = (await listPreloved().catch(() => [])).filter((row) => (free === "1" ? row.isFree : true));
  return (
    <PostList
      title="Preloved & Free giveaway items"
      intro="Good things looking for a next home, including a few that are free to collect."
      items={rows.map((row) => ({
        href: `/preloved/${row.slug}`,
        title: row.title,
        meta: `${row.town?.name ?? "Goa"} · ${row.isFree ? "Free" : row.priceLabel ?? "Preloved"}`,
        body: row.description,
        tone: row.isFree ? "tone-butter" : "tone-peach",
      }))}
    />
  );
}
