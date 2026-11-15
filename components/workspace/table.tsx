import type * as React from "react";

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number | null | undefined | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-[var(--gp-line)] bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-[var(--gp-canvas-2)] text-xs tracking-wide text-[var(--gp-ink-2)] uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-[var(--gp-ink-2)]" colSpan={columns.length}>
                Nothing here yet.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index} className="border-t border-[var(--gp-line)]">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 align-top">
                    {cell ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function NoticeBanner({ code }: { code?: string }) {
  if (!code) return null;
  const text: Record<string, string> = {
    saved: "Saved.",
    deleted: "Deleted.",
    invalid: "Check the form and try again.",
    enquiry: "Enquiry sent. The business can reply from their leads inbox.",
    forbidden: "That area is for a different role.",
    checkout: "Checkout started. No charge is taken until Razorpay keys are configured.",
  };
  if (!text[code]) return null;
  return <p className="mb-4 rounded-2xl bg-[var(--gp-mint)] px-4 py-3 text-sm text-[var(--gp-mint-ink)]">{text[code]}</p>;
}

export function PageIntro({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      {hint ? <p className="mt-1 text-sm text-[var(--gp-ink-2)]">{hint}</p> : null}
    </div>
  );
}
