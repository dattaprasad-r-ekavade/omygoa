import type { messages as commonEn } from "@/lib/i18n/locales/en/common";

type Copy = typeof commonEn;

export function SearchForm({
  copy,
  action = "/explore",
  defaults,
  towns,
}: {
  copy: Copy;
  action?: string;
  defaults?: { q?: string; region?: string; town?: string };
  towns?: { slug: string; name: string; region: string }[];
}) {
  return (
    <form className="gp-search" action={action}>
      <input name="q" defaultValue={defaults?.q ?? ""} placeholder={copy.search.placeholder} aria-label={copy.search.placeholder} />
      <select name="region" defaultValue={defaults?.region ?? ""} aria-label={copy.search.allGoa}>
        <option value="">{copy.search.allGoa}</option>
        <option value="north">{copy.search.north}</option>
        <option value="south">{copy.search.south}</option>
      </select>
      {towns ? (
        <select name="town" defaultValue={defaults?.town ?? ""} aria-label="Town">
          <option value="">Town</option>
          {towns.map((town) => (
            <option key={town.slug} value={town.slug}>
              {town.name}
            </option>
          ))}
        </select>
      ) : null}
      <button type="submit" className="h-11 rounded-full bg-[var(--gp-indigo)] px-5 text-sm font-semibold text-white">
        {copy.search.submit}
      </button>
    </form>
  );
}
