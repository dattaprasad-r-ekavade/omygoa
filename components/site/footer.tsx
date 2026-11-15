import Image from "next/image";
import Link from "next/link";
import type { messages as commonEn } from "@/lib/i18n/locales/en/common";

type Copy = typeof commonEn;

export function SiteFooter({ copy }: { copy: Copy }) {
  const explore = [
    ["/explore", copy.nav.explore],
    ["/preloved", copy.nav.preloved],
    ["/jobs", copy.nav.jobs],
    ["/pet-adoption", copy.nav.pets],
    ["/rentals", copy.nav.rentals],
    ["/events", copy.nav.events],
    ["/blog", copy.nav.blog],
    ["/events", copy.footer.postEvent],
    ["/privacy", copy.footer.privacy],
  ] as const;
  return (
    <footer className="gp-footer">
      <div className="gp-wrap grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Image src="/goa/brand-mark.webp" alt="" width={72} height={52} className="h-12 w-auto" />
          <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--gp-ink-2)]">{copy.footer.blurb}</p>
          <p className="mt-3 font-display text-lg font-semibold text-[var(--gp-mint-ink)]">{copy.footer.slogan}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{copy.footer.explore}</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--gp-ink-2)]">
            {explore.map(([href, label]) => (
              <li key={label}>
                <Link href={href} className="hover:text-[var(--gp-indigo)]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{copy.footer.touch}</h2>
          <p className="mt-3 text-sm text-[var(--gp-ink-2)]">{copy.footer.place}</p>
          <a className="mt-1 block text-sm text-[var(--gp-indigo)]" href="mailto:hello@omygoa.in">
            {copy.footer.email}
          </a>
          <p className="mt-4 text-sm font-medium">{copy.footer.question}</p>
          <p className="text-sm text-[var(--gp-ink-2)]">{copy.footer.hear}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">{copy.footer.made}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--gp-ink-2)]">{copy.footer.madeBody}</p>
          <Link href="/list-your-business" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            {copy.footer.list} →
          </Link>
        </div>
      </div>
      <div className="gp-wrap flex flex-wrap items-center justify-between gap-2 border-t border-[#d7ecdf] py-4 text-xs text-[var(--gp-ink-2)]">
        <span>© {new Date().getFullYear()} {copy.footer.rights}</span>
        <span>{copy.footer.madeIn}</span>
        <span>{copy.footer.always}</span>
      </div>
    </footer>
  );
}
