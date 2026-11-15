import Link from "next/link";
import { BusinessCardView } from "@/components/site/business-card";
import { SearchForm } from "@/components/site/search-form";
import { getCommon, getExploreCopy, getLocale } from "@/lib/i18n/locale";
import { listBusinesses, listCategories, listTowns, type ListingFilters } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { one } from "@/lib/utils";

export function generateMetadata() {
  return pageMeta({
    title: "Business & Services",
    description: "Search cafes, studios, stays, shops and services across North and South Goa.",
    path: "/explore",
  });
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters: ListingFilters = {
    q: one(sp.q),
    category: one(sp.category),
    town: one(sp.town),
    region: one(sp.region),
    sort: one(sp.sort) ?? "recommended",
    open: one(sp.open),
    type: one(sp.type),
    woman: one(sp.woman),
    local: one(sp.local),
    access: one(sp.access),
    pet: one(sp.pet),
    family: one(sp.family),
    rating: one(sp.rating),
  };
  const locale = await getLocale();
  const [copy, common, businesses, categories, towns] = await Promise.all([
    getExploreCopy(locale),
    getCommon(locale),
    listBusinesses(filters).catch(() => []),
    listCategories().catch(() => []),
    listTowns().catch(() => []),
  ]);
  const featured = businesses.filter((item) => item.featured).slice(0, 4);

  return (
    <div className="gp-wrap py-8">
      <h1 className="font-display text-3xl font-semibold">{copy.title}</h1>
      <p className="mt-1 text-sm text-[var(--gp-ink-2)]">{copy.intro}</p>
      {featured.length ? (
        <div className="mt-6">
          <h2 className="text-sm font-semibold">{copy.featuredRail}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <Link key={item.id} href={`/business/${item.slug}`} className="goan-card overflow-hidden">
                <div className="h-24 bg-[var(--gp-mint)]">
                  {item.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <p className="p-3 text-sm font-semibold">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-6">
        <SearchForm copy={common} defaults={{ q: filters.q, region: filters.region, town: filters.town }} towns={towns} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <form className="h-max space-y-4 rounded-3xl border border-[var(--gp-line)] bg-white p-4 text-sm" action="/explore">
          <input type="hidden" name="q" value={filters.q ?? ""} />
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{copy.filters}</h2>
            <Link href="/explore" className="text-xs text-[var(--gp-indigo)]">
              {copy.clear}
            </Link>
          </div>
          <fieldset>
            <legend className="mb-1 font-medium">{copy.category}</legend>
            <select name="category" defaultValue={filters.category ?? ""} className="w-full rounded-xl border border-[var(--gp-line)] p-2">
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <legend className="mb-1 font-medium">{copy.region}</legend>
            <select name="region" defaultValue={filters.region ?? ""} className="w-full rounded-xl border border-[var(--gp-line)] p-2">
              <option value="">{common.search.allGoa}</option>
              <option value="north">{common.search.north}</option>
              <option value="south">{common.search.south}</option>
            </select>
          </fieldset>
          <fieldset>
            <legend className="mb-1 font-medium">{copy.openStatus}</legend>
            <select name="open" defaultValue={filters.open ?? ""} className="w-full rounded-xl border border-[var(--gp-line)] p-2">
              <option value="">{copy.any}</option>
              <option value="open">{common.actions.open}</option>
              <option value="closed">{common.actions.closed}</option>
            </select>
          </fieldset>
          <fieldset>
            <legend className="mb-1 font-medium">{copy.type}</legend>
            <select name="type" defaultValue={filters.type ?? ""} className="w-full rounded-xl border border-[var(--gp-line)] p-2">
              <option value="">All</option>
              {["products", "services", "retail", "manufacturer", "wholesale", "b2b", "b2c"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="space-y-1">
            <legend className="mb-1 font-medium">{copy.good}</legend>
            <Check name="woman" label={copy.woman} defaultChecked={filters.woman === "1"} />
            <Check name="local" label={copy.local} defaultChecked={filters.local === "1"} />
            <Check name="access" label={copy.access} defaultChecked={filters.access === "1"} />
            <Check name="pet" label={copy.pet} defaultChecked={filters.pet === "1"} />
            <Check name="family" label={copy.family} defaultChecked={filters.family === "1"} />
          </fieldset>
          <label className="block">
            <span className="font-medium">{copy.rating}</span>
            <select name="rating" defaultValue={filters.rating ?? ""} className="mt-1 w-full rounded-xl border border-[var(--gp-line)] p-2">
              <option value="">Any</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </label>
          <button className="w-full rounded-full bg-[var(--gp-indigo)] py-2 font-semibold text-white" type="submit">
            {common.search.submit}
          </button>
        </form>
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <form action="/explore" className="flex items-center gap-2">
              {Object.entries(filters).map(([key, value]) =>
                value && key !== "sort" ? <input key={key} type="hidden" name={key} value={value} /> : null,
              )}
              <label>
                {copy.sort}{" "}
                <select name="sort" defaultValue={filters.sort} className="rounded-full border border-[var(--gp-line)] px-2 py-1">
                  <option value="recommended">{copy.recommended}</option>
                  <option value="top">{copy.top}</option>
                  <option value="verified">{copy.verified}</option>
                  <option value="featured">{copy.featured}</option>
                  <option value="newest">{copy.newest}</option>
                </select>
              </label>
              <button className="rounded-full border px-3 py-1" type="submit">
                OK
              </button>
            </form>
            <p>
              {businesses.length} {copy.found}
            </p>
          </div>
          {businesses.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-sm text-[var(--gp-ink-2)]">{copy.empty}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {businesses.map((business) => (
                <BusinessCardView key={business.id} business={business} labels={common.actions} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} value="1" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}
