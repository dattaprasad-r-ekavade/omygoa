"use client";

import Link from "next/link";
import type * as React from "react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/site/sign-out-button";
import { cn } from "@/lib/utils";

export function WorkspaceShell({
  title,
  subtitle,
  items,
  children,
}: {
  title: string;
  subtitle?: string;
  items: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="gp-wrap grid gap-6 py-8 md:grid-cols-[230px_1fr]">
      <aside className="h-max rounded-3xl border border-[var(--gp-line)] bg-white p-3">
        <p className="px-2 text-xs font-semibold tracking-wide text-[var(--gp-ink-2)] uppercase">{title}</p>
        {subtitle ? <p className="px-2 pb-2 text-sm">{subtitle}</p> : null}
        <nav className="mt-2 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/owner" && item.href !== "/manager" && item.href !== "/dashboard" && pathname.startsWith(item.href));
            const exact = pathname === item.href;
            const on = item.href === "/admin" || item.href === "/owner" || item.href === "/manager" || item.href === "/dashboard" ? exact : active;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-2xl px-3 py-2 text-sm font-medium",
                  on ? "bg-[var(--gp-indigo)] text-white" : "hover:bg-[var(--gp-canvas-2)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-[var(--gp-line)] px-2 pt-3">
          <SignOutButton />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
