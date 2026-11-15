import type { Metadata } from "next";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-ext-400.css";
import "@fontsource/poppins/latin-ext-500.css";
import "@fontsource/poppins/latin-ext-600.css";
import "@fontsource/poppins/latin-ext-700.css";
import "@fontsource/poppins/devanagari-400.css";
import "@fontsource/poppins/devanagari-500.css";
import "@fontsource/poppins/devanagari-600.css";
import "@fontsource/poppins/devanagari-700.css";
import "@fontsource-variable/inter/wght.css";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { AppToaster } from "@/components/site/toaster";
import { getCommon, getLocale } from "@/lib/i18n/locale";
import { getSession } from "@/lib/session";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "OmyGoa — Goa, All Here.",
    template: "%s | OmyGoa",
  },
  description: "Find local businesses, events, jobs, rentals and neighbours across Goa.",
  applicationName: "OmyGoa",
  icons: { icon: "/goa/brand-mark.webp", apple: "/goa/brand-mark.webp" },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const copy = await getCommon(locale);
  let user: { name: string; role?: string | null } | null = null;
  try {
    const session = await getSession();
    if (session) user = { name: session.user.name, role: session.user.role };
  } catch {
    user = null;
  }
  return (
    <html lang={locale}>
      <body className="min-h-screen">
        <SiteHeader locale={locale} copy={copy} user={user} />
        <main>{children}</main>
        <SiteFooter copy={copy} />
        <AppToaster />
      </body>
    </html>
  );
}
