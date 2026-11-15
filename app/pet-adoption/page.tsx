import { PostList } from "@/components/site/post-list";
import { listPets } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta({
    title: "Pet Adoption",
    description: "Meet dogs and cats in Goa looking for a forever home.",
    path: "/pet-adoption",
  });
}

export default async function PetsPage() {
  const rows = await listPets().catch(() => []);
  return (
    <PostList
      title="A new friend. A forever home."
      intro="Adoption listings from neighbours. Every name and story here is demo content."
      items={rows.map((row) => ({
        href: `/pet-adoption/${row.slug}`,
        title: `Hi! My name is ${row.name}`,
        meta: `${row.species} · ${row.breed ?? "mixed"} · ${row.town?.name ?? "Goa"} · ${row.ageLabel ?? ""}`,
        body: row.description,
        tone: "tone-mint",
      }))}
    />
  );
}
