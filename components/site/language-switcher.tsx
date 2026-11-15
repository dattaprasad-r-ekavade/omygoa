"use client";

import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/actions/public";
import type { Locale } from "@/lib/i18n/locale";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  return (
    <label className="inline-flex items-center gap-1 rounded-full border border-[var(--gp-line-strong)] bg-white px-2 py-1 text-xs font-semibold text-[var(--gp-ink)]">
      <Globe className="size-3.5" aria-hidden />
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="bg-transparent outline-none"
        value={locale}
        onChange={async (event) => {
          const next = event.target.value === "hi" ? "hi" : "en";
          await setLocale(next);
          router.refresh();
        }}
      >
        <option value="en">EN</option>
        <option value="hi">हिन्दी</option>
      </select>
    </label>
  );
}
