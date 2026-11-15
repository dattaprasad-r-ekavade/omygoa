import Link from "next/link";
import type { ReactNode } from "react";

export function PostList({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: { href: string; title: string; meta: string; body?: string | null; tone?: string }[];
}) {
  return (
    <div className="gp-wrap py-8">
      <h1 className="font-display text-4xl font-semibold">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--gp-ink-2)]">{intro}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`goan-card p-4 ${item.tone ?? ""}`}>
            <h2 className="font-display text-xl font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-[var(--gp-ink-2)]">{item.meta}</p>
            {item.body ? <p className="mt-2 line-clamp-3 text-sm">{item.body}</p> : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PostDetail({
  backHref,
  backLabel,
  kicker,
  title,
  meta,
  children,
}: {
  backHref: string;
  backLabel: string;
  kicker?: string;
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="gp-wrap py-8">
      <Link href={backHref} className="text-sm text-[var(--gp-indigo)]">
        ← {backLabel}
      </Link>
      {kicker ? <p className="mt-4 text-xs font-semibold tracking-wide text-[var(--gp-indigo)] uppercase">{kicker}</p> : null}
      <h1 className="mt-1 font-display text-4xl font-semibold">{title}</h1>
      {meta ? <p className="mt-2 text-sm text-[var(--gp-ink-2)]">{meta}</p> : null}
      <div className="mt-6 max-w-3xl space-y-4 text-sm leading-7">{children}</div>
    </div>
  );
}
