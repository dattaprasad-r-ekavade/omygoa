import { notFound } from "next/navigation";
import { PostDetail } from "@/components/site/post-list";
import { getRental } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getRental(slug).catch(() => null);
  return pageMeta({
    title: row?.title ?? "Rental",
    description: row?.description.slice(0, 160) || "A rental listing in Goa.",
    path: `/rentals/${slug}`,
  });
}

export default async function RentalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getRental(slug).catch(() => null);
  if (!row) notFound();
  return (
    <PostDetail backHref="/rentals" backLabel="Rentals" kicker={row.kind} title={row.title} meta={`${row.town?.name ?? "Goa"}${row.priceLabel ? ` · ${row.priceLabel}` : ""}`}>
      <p className="whitespace-pre-wrap">{row.description}</p>
      <p>{row.furnished ? "Furnished" : "Unfurnished / not applicable"}</p>
    </PostDetail>
  );
}
