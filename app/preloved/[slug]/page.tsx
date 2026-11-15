import { notFound } from "next/navigation";
import { PostDetail } from "@/components/site/post-list";
import { getPreloved } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getPreloved(slug).catch(() => null);
  return pageMeta({
    title: row?.title ?? "Preloved item",
    description: row?.description.slice(0, 160) || "A preloved listing in Goa.",
    path: `/preloved/${slug}`,
  });
}

export default async function PrelovedDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getPreloved(slug).catch(() => null);
  if (!row) notFound();
  return (
    <PostDetail backHref="/preloved" backLabel="Preloved" kicker={row.category ?? "Item"} title={row.title} meta={`${row.town?.name ?? "Goa"} · ${row.isFree ? "Free giveaway" : row.priceLabel ?? ""}`}>
      <h2 className="font-display text-xl font-semibold">Product / item description</h2>
      <p className="whitespace-pre-wrap">{row.description}</p>
    </PostDetail>
  );
}
