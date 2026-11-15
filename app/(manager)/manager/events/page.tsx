import Link from "next/link";
import { DataTable, PageIntro } from "@/components/workspace/table";
import { listAllEvents } from "@/lib/queries";
import { formatWhenTime } from "@/lib/utils";

export default async function ManagerEventsPage() {
  const rows = await listAllEvents();
  return (
    <div>
      <PageIntro title="Events" hint="Read-only for staff. Admins can publish from the admin events screen." />
      <DataTable
        columns={["Event", "When", "Status"]}
        rows={rows.map((row) => [
          <Link key={row.id} href={`/events/${row.slug}`}>
            {row.title}
          </Link>,
          formatWhenTime(row.startsAt),
          row.status,
        ])}
      />
    </div>
  );
}
