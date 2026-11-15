import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-[var(--gp-line-strong)] bg-white px-3 py-2 text-sm text-[var(--gp-ink)] outline-none placeholder:text-[var(--gp-ink-2)] focus:border-[var(--gp-indigo)] focus:ring-2 focus:ring-[var(--gp-indigo)]/15",
        className,
      )}
      {...props}
    />
  );
}
