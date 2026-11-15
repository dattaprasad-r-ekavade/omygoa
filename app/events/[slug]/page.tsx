import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { QrShare } from "@/components/events/qr-share";
import { LocationMap } from "@/components/maps/location-map";
import { listEvents, getEvent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatWhenTime, siteUrl } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug).catch(() => null);
  return pageMeta({
    title: event?.title ?? "Event",
    description: event?.description.slice(0, 160) || "An event in Goa.",
    path: `/events/${slug}`,
  });
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug).catch(() => null);
  if (!event || event.status !== "published") notFound();
  const url = `${siteUrl()}/events/${event.slug}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 1, width: 220 });
  const more = (await listEvents().catch(() => [])).filter((item) => item.slug !== event.slug).slice(0, 2);
  const lat = Number(event.lat);
  const lng = Number(event.lng);
  return (
    <div className="gp-wrap py-8">
      <Link href="/events" className="text-sm text-[var(--gp-indigo)]">
        ← Events
      </Link>
      <div className="mt-4 overflow-hidden rounded-[1.8rem] bg-[var(--gp-butter)]">
        {event.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverUrl} alt="" className="h-72 w-full object-cover" />
        ) : (
          <div className="h-48" />
        )}
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
        <article>
          <p className="text-sm font-semibold text-[var(--gp-indigo)]">{formatWhenTime(event.startsAt)}</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">{event.title}</h1>
          <p className="mt-2 text-[var(--gp-ink-2)]">
            {event.venue} · {event.townName}
            {event.priceLabel ? ` · ${event.priceLabel}` : ""}
          </p>
          <h2 className="mt-8 font-display text-2xl font-semibold">About this event</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--gp-ink-2)]">{event.description}</p>
          <h2 className="mt-8 font-display text-2xl font-semibold">Venue</h2>
          <p className="mt-2 text-sm">{event.address}</p>
          {Number.isFinite(lat) && Number.isFinite(lng) ? (
            <div className="mt-4">
              <LocationMap lat={lat} lng={lng} label={event.venue ?? event.title} />
            </div>
          ) : null}
        </article>
        <aside className="space-y-4">
          <QrShare title={event.title} url={url} svg={svg} />
          <div>
            <h2 className="font-display text-xl font-semibold">More events</h2>
            <ul className="mt-3 space-y-3">
              {more.map((item) => (
                <li key={item.id}>
                  <Link href={`/events/${item.slug}`} className="font-semibold">
                    {item.title}
                  </Link>
                  <p className="text-sm text-[var(--gp-ink-2)]">{item.townName}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
