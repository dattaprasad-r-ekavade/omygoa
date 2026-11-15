import Link from "next/link";
import { PageIntro } from "@/components/workspace/table";
import { ownerBusinesses } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function OwnerBusinessPage() {
  const { session } = await requireRole(["owner"], "/owner/business");
  const rows = await ownerBusinesses(session.user.id);
  return (
    <div>
      <PageIntro title="Business profiles" hint="New registrations are added by an admin in this foundation. Yours are listed below." />
      {rows.length === 0 ? (
        <div className="rounded-3xl bg-white p-6">
          <p>Register your business and an admin will attach it to this account.</p>
          <Link href="/list-your-business" className="mt-3 inline-flex rounded-full bg-[var(--gp-indigo)] px-4 py-2 text-sm font-semibold text-white">
            See plans
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-3xl bg-white p-4">
              <h2 className="font-semibold">{row.name}</h2>
              <p className="text-sm text-[var(--gp-ink-2)]">
                {row.townName} · {row.registrationStatus} · {row.plan}
              </p>
              <Link href={`/business/${row.slug}`} className="mt-2 inline-block text-sm text-[var(--gp-indigo)]">
                View public page
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
