import { PostList } from "@/components/site/post-list";
import { listServices } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatInr } from "@/lib/utils";

export function generateMetadata() {
  return pageMeta({
    title: "Explore Services in Goa",
    description: "Home visits, repairs, celebrations and other services offered by people in Goa.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const rows = await listServices().catch(() => []);
  return (
    <PostList
      title="Explore Services"
      intro="Book a person, not just a place. These are demo service listings."
      items={rows.map((row) => ({
        href: `/explore?q=${encodeURIComponent(row.title)}`,
        title: row.title,
        meta: `${row.town?.name ?? "Goa"} · ${row.category ?? "Service"}${row.priceFrom ? ` · from ${formatInr(row.priceFrom)}` : ""}`,
        body: row.description,
        tone: "tone-butter",
      }))}
    />
  );
}
