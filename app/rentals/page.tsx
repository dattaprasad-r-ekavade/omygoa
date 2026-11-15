import { PostList } from "@/components/site/post-list";
import { listRentals } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta({
    title: "Property Buy & Rentals",
    description: "Rooms, flats, shops, scooters and cars available around Goa.",
    path: "/rentals",
  });
}

export default async function RentalsPage() {
  const rows = await listRentals().catch(() => []);
  return (
    <PostList
      title="Property Buy & Rentals"
      intro="Rentals around Goa, from a spare room to a weekend scooter."
      items={rows.map((row) => ({
        href: `/rentals/${row.slug}`,
        title: row.title,
        meta: `${row.town?.name ?? "Goa"} · ${row.kind}${row.priceLabel ? ` · ${row.priceLabel}` : ""}`,
        body: row.description,
        tone: "tone-blue",
      }))}
    />
  );
}
