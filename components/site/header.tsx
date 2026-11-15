import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/locale";
import type { messages as commonEn } from "@/lib/i18n/locales/en/common";
import { roleOf } from "@/lib/session";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { SignOutButton } from "./sign-out-button";

type Copy = typeof commonEn;

export function SiteHeader({
  locale,
  copy,
  user,
}: {
  locale: Locale;
  copy: Copy;
  user: { name: string; role?: string | null } | null;
}) {
  const links = [
    { href: "/", label: copy.nav.home },
    { href: "/explore", label: copy.nav.explore },
    { href: "/events", label: copy.nav.events },
    { href: "/jobs", label: copy.nav.jobs },
    { href: "/pet-adoption", label: copy.nav.pets },
    { href: "/preloved", label: copy.nav.preloved },
    { href: "/rentals", label: copy.nav.rentals },
  ];
  const homeHref = user ? (roleOf(user.role) === "admin" ? "/admin" : roleOf(user.role) === "manager" ? "/manager" : roleOf(user.role) === "owner" ? "/owner" : "/dashboard") : "/dashboard";
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--gp-line)] bg-[#f8f7f3]/95 backdrop-blur">
      <div className="gp-wrap relative flex h-[4.6rem] items-center gap-3">
        <Link href="/" className="shrink-0">
          <Image src="/goa/brand-mark.webp" alt="OmyGoa" width={92} height={64} priority className="h-14 w-auto" />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-4 text-[13px] font-medium text-[var(--gp-ink)] lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--gp-indigo)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Link href="/dashboard/saved" aria-label={copy.nav.saved} className="hidden rounded-full p-2 hover:bg-white sm:inline-flex">
            <Heart className="size-4" />
          </Link>
          <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
            <Link href="/list-your-business">{copy.nav.list}</Link>
          </Button>
          {user ? (
            <>
              <Button asChild size="sm">
                <Link href={homeHref}>{user.name.split(" ")[0]}</Link>
              </Button>
              <SignOutButton />
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">{copy.nav.login}</Link>
            </Button>
          )}
          <MobileNav label={copy.nav.menu} links={[...links, { href: "/services", label: copy.nav.services }, { href: "/blog", label: copy.nav.blog }]} />
        </div>
      </div>
    </header>
  );
}
