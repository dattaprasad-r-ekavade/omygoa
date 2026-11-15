import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, tone = "butter", ...props }: React.ComponentProps<"span"> & { tone?: string }) {
  const tones: Record<string, string> = {
    butter: "bg-[var(--gp-butter)] text-[var(--gp-butter-ink)]",
    mint: "bg-[var(--gp-mint)] text-[var(--gp-mint-ink)]",
    peach: "bg-[var(--gp-peach)] text-[var(--gp-peach-ink)]",
    blue: "bg-[var(--gp-blue)] text-[var(--gp-blue-ink)]",
    lilac: "bg-[var(--gp-lilac)] text-[var(--gp-lilac-ink)]",
    ink: "bg-[var(--gp-ink)] text-white",
  };
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone] ?? tones.butter, className)}
      {...props}
    />
  );
}
