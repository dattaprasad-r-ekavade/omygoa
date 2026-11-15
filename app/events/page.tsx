import Link from "next/link";
import { getLocale } from "@/lib/i18n/locale";
import { listEvents } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatWhenTime } from "@/lib/utils";

export function generateMetadata() {
  return pageMeta({
    title: "Events in Goa",
    description: "Music, workshops, markets and meetups happening across Goa.",
    path: "/events",
  });
}

export default async function EventsPage() {
  const events = await listEvents().catch(() => []);
  const locale = await getLocale();
  return (
    <div className="gp-wrap py-8">
      <h1 className="font-display text-4xl font-semibold">{locale === "hi" ? "गोवा के इवेंट" : "Events in Goa"}</h1>
      <p className="mt-2 text-sm text-[var(--gp-ink-2)]">
        {locale === "hi" ? "संगीत, वर्कशॉप, बाज़ार और मुलाकातें।" : "Music, workshops, markets and meetups."}
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`} className="goan-card overflow-hidden">
            <div className="h-44 bg-[var(--gp-lilac)]">
              {event.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-[var(--gp-indigo)]">{formatWhenTime(event.startsAt)}</p>
              <h2 className="mt-1 font-display text-xl font-semibold">{event.title}</h2>
              <p className="text-sm text-[var(--gp-ink-2)]">
                {event.venue} · {event.townName}
              </p>
              {event.priceLabel ? <p className="mt-2 text-sm font-medium">{event.priceLabel}</p> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
