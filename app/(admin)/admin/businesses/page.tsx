import Link from "next/link";
import { NoticeBanner, PageIntro } from "@/components/workspace/table";
import { listAllBusinesses } from "@/lib/queries";
import { formatWhen, one } from "@/lib/utils";

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const notice = one((await searchParams).notice);
  const rows = await listAllBusinesses();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <PageIntro title="Business registrations" hint="Create, edit and remove directory businesses." />
        <Link href="/admin/businesses/new" className="rounded-full bg-[var(--gp-indigo)] px-4 py-2 text-sm font-semibold text-white">
          New business
        </Link>
      </div>
      <NoticeBanner code={notice} />
      <div className="overflow-x-auto rounded-3xl bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs tracking-wide text-[var(--gp-ink-2)] uppercase">
            <tr>
              {["Business", "Town", "Registration", "Listing", "Plan", "Updated"].map((column) => (
                <th key={column} className="px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[var(--gp-line)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/businesses/${row.id}`} className="font-semibold text-[var(--gp-indigo)]">
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{row.townName}</td>
                <td className="px-4 py-3">{row.registrationStatus}</td>
                <td className="px-4 py-3">{row.listingStatus}</td>
                <td className="px-4 py-3">{row.plan}</td>
                <td className="px-4 py-3">{formatWhen(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
