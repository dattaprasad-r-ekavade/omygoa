import Link from "next/link";
import { NoticeBanner, PageIntro } from "@/components/workspace/table";
import { listAllEvents } from "@/lib/queries";
import { formatWhenTime, one } from "@/lib/utils";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const notice = one((await searchParams).notice);
  const rows = await listAllEvents();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <PageIntro title="Events" hint="Publish, pause or remove events. Each row has a public QR when it is published." />
        <Link href="/admin/events/new" className="rounded-full bg-[var(--gp-indigo)] px-4 py-2 text-sm font-semibold text-white">
          New event
        </Link>
      </div>
      <NoticeBanner code={notice} />
      <div className="overflow-x-auto rounded-3xl bg-white">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="text-xs tracking-wide text-[var(--gp-ink-2)] uppercase">
            <tr>
              {["Event", "When", "Town", "Status"].map((column) => (
                <th key={column} className="px-4 py-3 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--gp-line)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/events/${row.id}`} className="font-semibold text-[var(--gp-indigo)]">
                    {row.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatWhenTime(row.startsAt)}</td>
                <td className="px-4 py-3">{row.townName}</td>
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
