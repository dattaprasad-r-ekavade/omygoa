import { notFound } from "next/navigation";
import { PostDetail } from "@/components/site/post-list";
import { getPet } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getPet(slug).catch(() => null);
  return pageMeta({
    title: row ? `${row.name} for adoption` : "Pet adoption",
    description: row?.description.slice(0, 160) || "A pet looking for a home in Goa.",
    path: `/pet-adoption/${slug}`,
  });
}

export default async function PetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getPet(slug).catch(() => null);
  if (!row) notFound();
  return (
    <PostDetail
      backHref="/pet-adoption"
      backLabel="Pet adoption"
      kicker={row.species}
      title={`Hi! My name is ${row.name}`}
      meta={`${row.breed ?? "Mixed"} · ${row.sex ?? ""} · ${row.ageLabel ?? ""} · ${row.town?.name ?? "Goa"}`}
    >
      <h2 className="font-display text-xl font-semibold">A little about me</h2>
      <p className="whitespace-pre-wrap">{row.description}</p>
      <h2 className="font-display text-xl font-semibold">My personality</h2>
      <p>{row.personality}</p>
      <p>Vaccinated: {row.vaccinated}</p>
    </PostDetail>
  );
}
