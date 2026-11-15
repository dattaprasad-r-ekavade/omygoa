import {
  Briefcase,
  CalendarDays,
  Car,
  Church,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  Hotel,
  House,
  MapPinned,
  Moon,
  PawPrint,
  Shirt,
  Stethoscope,
  Utensils,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BusinessCardView } from "@/components/site/business-card";
import { SearchForm } from "@/components/site/search-form";
import { getCommon, getHomeCopy, getLocale } from "@/lib/i18n/locale";
import { listBusinesses, listEvents, listTowns } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatWhen } from "@/lib/utils";

export function generateMetadata() {
  return pageMeta({
    title: "OmyGoa — Goa, All Here.",
    description: "Welcome to Goa's mega search portal. Find businesses, events, jobs, pets, rentals and preloved things across Goa.",
    path: "/",
  });
}

const quick = [
  ["events", "/events", CalendarDays],
  ["jobs", "/jobs", Briefcase],
  ["pets", "/pet-adoption", PawPrint],
  ["preloved", "/preloved", HeartHandshake],
  ["rentals", "/rentals", House],
  ["food", "/explore?category=food-dining", Utensils],
  ["stays", "/explore?category=hotels-stays", Hotel],
  ["wellness", "/explore?category=wellness-spa", Dumbbell],
  ["retail", "/explore?category=retail", Shirt],
  ["auto", "/explore?category=automotive", Car],
  ["health", "/explore?category=healthcare", Stethoscope],
  ["education", "/explore?category=education", GraduationCap],
  ["home", "/explore?category=home-services", Wrench],
  ["pro", "/services", MapPinned],
  ["night", "/explore?category=nightlife", Moon],
  ["tours", "/explore?category=tours", Church],
  ["wedding", "/explore?category=weddings", HeartHandshake],
] as const;

export default async function HomePage() {
  const locale = await getLocale();
  const [copy, common] = await Promise.all([getHomeCopy(locale), getCommon(locale)]);
  const [businesses, events, towns] = await Promise.all([
    listBusinesses().catch(() => []),
    listEvents().catch(() => []),
    listTowns().catch(() => []),
  ]);
  const north = towns.filter((town) => town.region === "north").slice(0, 8);
  const south = towns.filter((town) => town.region === "south").slice(0, 8);
  const lanes = [
    ["preloved", "/preloved", "tone-peach", copy.lanes.preloved, copy.lanes.prelovedHint],
    ["free", "/preloved?free=1", "tone-butter", copy.lanes.free, copy.lanes.freeHint],
    ["jobs", "/jobs", "tone-lilac", copy.lanes.jobs, copy.lanes.jobsHint],
    ["pets", "/pet-adoption", "tone-blue", copy.lanes.pets, copy.lanes.petsHint],
    ["rentals", "/rentals", "tone-mint", copy.lanes.rentals, copy.lanes.rentalsHint],
  ] as const;

  return (
    <div>
      <section className="gp-hero">
        <Image src="/goa/coastal-hero.webp" alt="" fill priority className="hero-photo object-cover" />
        <div className="relative w-full max-w-3xl text-center">
          <h1 className="font-display text-3xl font-semibold text-[var(--gp-indigo)] drop-shadow-sm sm:text-4xl">{copy.heroTitle}</h1>
          <div className="mt-5">
            <SearchForm copy={common} />
          </div>
        </div>
      </section>

      <section className="gp-wrap py-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">{copy.looking}</h2>
          <Link href="/explore" className="text-sm font-semibold text-[var(--gp-indigo)]">
            {copy.allCategories}
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {quick.map(([key, href, Icon]) => (
            <Link key={key} href={href} className="grid justify-items-center gap-2 text-center text-xs font-medium">
              <span className="grid size-14 place-items-center rounded-full border border-[var(--gp-line)] bg-white text-[var(--gp-indigo)] shadow-sm">
                <Icon className="size-5" />
              </span>
              {copy.quick[key]}
            </Link>
          ))}
        </div>
      </section>

      <section className="gp-wrap pb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">{copy.spotlight}</h2>
          <Link href="/list-your-business" className="text-sm font-semibold text-[var(--gp-indigo)]">
            {copy.advertise}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/explore" className="relative h-52 overflow-hidden rounded-3xl">
            <Image src="/goa/promotions/goa-discovery.webp" alt="" fill className="object-cover" />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">Find your next Goa favourite.</span>
          </Link>
          <Link href="/list-your-business" className="relative h-52 overflow-hidden rounded-3xl">
            <Image src="/goa/promotions/goa-local-business.webp" alt="" fill className="object-cover" />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">Local business. More people.</span>
          </Link>
        </div>
      </section>

      <section className="gp-wrap pb-10">
        <h2 className="font-display text-2xl font-semibold">{copy.neighbourhood}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {lanes.map(([key, href, tone, title, hint]) => (
            <Link key={key} href={href} className={`${tone} rounded-3xl p-4`}>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[var(--gp-ink-2)]">{hint}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="gp-wrap pb-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">{copy.businesses}</h2>
            <p className="text-sm text-[var(--gp-ink-2)]">{copy.businessesHint}</p>
          </div>
          <Link href="/explore" className="text-sm font-semibold text-[var(--gp-indigo)]">
            {copy.viewAll}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {businesses.slice(0, 4).map((business) => (
            <BusinessCardView key={business.id} business={business} labels={common.actions} />
          ))}
        </div>
      </section>

      <section className="gp-wrap pb-12">
        <div className="gp-events p-6 sm:p-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">{copy.events}</h2>
              <p className="text-sm text-[var(--gp-ink-2)]">{copy.eventsHint}</p>
            </div>
            <Link href="/events" className="text-sm font-semibold text-[var(--gp-indigo)]">
              {copy.viewAll}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {events.slice(0, 3).map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="goan-card overflow-hidden bg-white">
                <div className="h-36 bg-[var(--gp-butter)]">
                  {event.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={event.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-[var(--gp-indigo)]">{formatWhenTimeSafe(event.startsAt)}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-[var(--gp-ink-2)]">{event.venue} · {event.townName}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gp-wrap pb-12">
        <h2 className="font-display text-2xl font-semibold">{copy.area}</h2>
        <p className="text-sm text-[var(--gp-ink-2)]">{copy.areaHint}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AreaCard title={copy.north} towns={north} region="north" />
          <AreaCard title={copy.south} towns={south} region="south" />
        </div>
      </section>

      <section className="gp-wrap pb-4">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-[var(--gp-peach)] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex items-center gap-4">
            <Image src="/goa/page-art/adopt-duo-720.webp" alt="" width={96} height={72} className="hidden h-16 w-auto sm:block" />
            <div>
              <h2 className="font-display text-2xl font-semibold">{copy.ctaTitle}</h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--gp-peach-ink)]">{copy.ctaBody}</p>
            </div>
          </div>
          <Link href="/list-your-business" className="rounded-full bg-[var(--gp-indigo)] px-5 py-3 text-sm font-semibold text-white">
            {copy.ctaAction}
          </Link>
        </div>
      </section>
    </div>
  );
}

function formatWhenTimeSafe(value: Date) {
  return formatWhen(value);
}

function AreaCard({ title, towns, region }: { title: string; towns: { slug: string; name: string }[]; region: string }) {
  return (
    <div className={`rounded-[1.6rem] p-5 ${region === "north" ? "tone-mint" : "tone-blue"}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <Link href={`/explore?region=${region}`} className="text-sm font-semibold">
          View all
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {towns.map((town) => (
          <Link key={town.slug} href={`/explore?town=${town.slug}`} className="rounded-full bg-white/80 px-3 py-1 text-sm">
            {town.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
