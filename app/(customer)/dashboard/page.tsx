import Link from "next/link";
import { savedFor, userEnquiries } from "@/lib/queries";
import { listPosts } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export default async function DashboardHome() {
  const session = await requireUser("/dashboard");
  const [saved, posts, enquiries] = await Promise.all([
    savedFor(session.user.id),
    listPosts(),
    userEnquiries(session.user.id),
  ]);
  const mine = posts.filter((post) => post.userId === session.user.id);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <Link href="/dashboard/posts" className="rounded-full bg-[var(--gp-indigo)] px-4 py-2 text-sm font-semibold text-white">
          My posts
        </Link>
      </div>
      <section className="mt-4 rounded-3xl bg-white p-6">
        <p className="text-xs font-semibold tracking-wide text-[var(--gp-indigo)]">YOUR OMYGOA</p>
        <h2 className="mt-1 font-display text-2xl font-semibold">Welcome back, {session.user.name.split(" ")[0]}!</h2>
        <p className="text-sm text-[var(--gp-ink-2)]">Your posts, events and saved places, together.</p>
      </section>
      <h2 className="mt-6 font-semibold">Your activity</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {[
          ["/dashboard/posts", mine.length, "My posts"],
          ["/dashboard/saved", saved.length, "Saved listings"],
          ["/dashboard/enquiries", enquiries.length, "Enquiries sent"],
        ].map(([href, value, label]) => (
          <Link key={String(label)} href={String(href)} className="rounded-3xl bg-white p-4">
            <p className="font-display text-3xl font-semibold">{value}</p>
            <p className="text-sm">{label}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-6 font-semibold">Explore your Goa</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["/explore", "Find businesses"],
          ["/events", "Goa events"],
          ["/blog", "Local stories"],
          ["/list-your-business", "Add a business"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-3xl border border-[var(--gp-line)] bg-white p-4 text-sm font-semibold">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
