import Image from "next/image";
import { AuthPanel } from "@/components/auth/auth-panel";
import { getAuthCopy, getLocale } from "@/lib/i18n/locale";
import { pageMeta } from "@/lib/seo";
import { one } from "@/lib/utils";

export function generateMetadata() {
  return pageMeta({
    title: "Welcome to OmyGoa",
    description: "Sign in with a mobile OTP, Google, or email to save places and manage a Goa business.",
    path: "/login",
  });
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const copy = await getAuthCopy(locale);
  const next = one((await searchParams).next);
  return (
    <div className="grid min-h-[70vh] lg:grid-cols-2">
      <div className="relative hidden min-h-[640px] lg:block">
        <Image src="/goa/auth/login-heritage-v2.webp" alt="" fill className="object-cover" priority />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-10 text-white">
          <p className="text-xs tracking-[0.2em] uppercase">{copy.kicker}</p>
          <p className="mt-3 font-display text-4xl font-semibold">{copy.hero}</p>
          <p className="mt-3 max-w-md text-sm text-white/85">{copy.heroBody}</p>
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#fff8ea] to-[#e7f6ee] px-6 py-12">
        <AuthPanel mode="login" copy={copy} next={next} />
      </div>
    </div>
  );
}
