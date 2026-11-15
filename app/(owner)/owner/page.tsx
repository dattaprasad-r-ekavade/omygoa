import Link from "next/link";
import { ownerBusinesses, userNotifications } from "@/lib/queries";
import { requireRole } from "@/lib/session";

export default async function OwnerHome() {
  const { session } = await requireRole(["owner"], "/owner");
  const [businesses, notes] = await Promise.all([ownerBusinesses(session.user.id), userNotifications(session.user.id)]);
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Welcome, {session.user.name.split(" ")[0]}</h1>
      <p className="text-sm text-[var(--gp-ink-2)]">Register a profile, keep the listing fresh, and answer leads.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["/owner/business", "Business profiles", `${businesses.length} on this account`],
          ["/owner/listing", "Edit listing", "Hours, contact and description"],
          ["/owner/billing", "Plans", "Review a checkout"],
        ].map(([href, title, body]) => (
          <Link key={href} href={href} className="rounded-3xl bg-white p-4">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-[var(--gp-ink-2)]">{body}</p>
          </Link>
        ))}
      </div>
      <section className="mt-6 rounded-3xl bg-white p-4">
        <h2 className="font-semibold">Notifications</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {notes.length === 0 ? <li className="text-[var(--gp-ink-2)]">No notifications yet.</li> : null}
          {notes.map((note) => (
            <li key={note.id}>
              <span className="font-medium">{note.title}</span>
              <span className="text-[var(--gp-ink-2)]"> — {note.body}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
