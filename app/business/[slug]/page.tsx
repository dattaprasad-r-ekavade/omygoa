import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { BusinessCardView } from "@/components/site/business-card";
import { LocationMap } from "@/components/maps/location-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEnquiry, toggleSave } from "@/lib/actions/public";
import { getCommon, getLocale } from "@/lib/i18n/locale";
import { getBusiness, isSaved } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { getSession } from "@/lib/session";
import { DAY_ORDER, dayLabel, displayPhone, siteUrl, telHref, whatsappHref, one } from "@/lib/utils";
import { NoticeBanner } from "@/components/workspace/table";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusiness(slug).catch(() => null);
  if (!business) return pageMeta({ title: "Business", description: "A Goa business on OmyGoa.", path: `/business/${slug}` });
  const place = [business.categoryName, business.townName, "Goa"].filter(Boolean).join(" in ").replace(" in Goa", ", Goa");
  return pageMeta({
    title: `${business.name} — ${place}`,
    description: business.tagline || business.description.slice(0, 160),
    path: `/business/${business.slug}`,
  });
}

export default async function BusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const business = await getBusiness(slug).catch(() => null);
  if (!business || (business.listingStatus !== "active" && business.listingStatus !== "pending")) notFound();
  const locale = await getLocale();
  const common = await getCommon(locale);
  const session = await getSession().catch(() => null);
  const saved = session ? await isSaved(session.user.id, business.id).catch(() => false) : false;
  const share = `${siteUrl()}/business/${business.slug}`;
  const qr = await QRCode.toString(share, { type: "svg", margin: 1, width: 180 });
  const tel = telHref(business.phone);
  const wa = whatsappHref(business.whatsapp || business.phone);
  const lat = Number(business.lat);
  const lng = Number(business.lng);

  return (
    <div className="gp-wrap py-8">
      <p className="text-sm text-[var(--gp-ink-2)]">
        <Link href="/">Home</Link> / <Link href="/explore">Explore</Link> / {business.name}
      </p>
      <NoticeBanner code={one(sp.notice)} />
      <div className="mt-4 overflow-hidden rounded-[1.8rem] border border-[var(--gp-line)] bg-white">
        <div className={`relative h-56 ${business.coverUrl ? "" : "tone-butter"}`}>
          {business.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.coverUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <p className="grid h-full place-items-center text-sm text-[var(--gp-ink-2)]">Cover photo not added yet</p>
          )}
        </div>
        <div className="p-6">
          <h1 className="font-display text-4xl font-semibold">{business.name}</h1>
          {business.tagline ? <p className="mt-1 text-[var(--gp-ink-2)]">{business.tagline}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {business.categoryName ? <Badge tone="mint">{business.categoryName}</Badge> : null}
            {business.townName ? <Badge tone="blue">{business.townName}</Badge> : null}
            {business.open !== null ? <Badge tone={business.open ? "mint" : "peach"}>{business.open ? common.actions.open : common.actions.closed}</Badge> : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tel ? (
              <Button asChild>
                <a href={tel}>{displayPhone(business.phone)}</a>
              </Button>
            ) : null}
            {wa ? (
              <Button asChild variant="outline">
                <a href={wa}>{common.actions.whatsapp}</a>
              </Button>
            ) : null}
            <form action={toggleSave}>
              <input type="hidden" name="businessId" value={business.id} />
              <input type="hidden" name="slug" value={business.slug} />
              <Button type="submit" variant="outline">
                {saved ? common.actions.saved : common.actions.save}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <section className="goan-card p-5">
            <h2 className="font-display text-xl font-semibold">About {business.name}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--gp-ink-2)]">{business.description}</p>
          </section>
          <section className="goan-card p-5" id="enquiry">
            <h2 className="font-display text-xl font-semibold">Send an enquiry</h2>
            <form action={sendEnquiry} className="mt-3 grid gap-3">
              <input type="hidden" name="businessId" value={business.id} />
              <input type="hidden" name="slug" value={business.slug} />
              <Input name="name" required placeholder="Your name" defaultValue={session?.user.name ?? ""} />
              <Input name="email" type="email" required placeholder="you@example.com" defaultValue={session?.user.email ?? ""} />
              <Input name="phone" placeholder="Mobile" />
              <Textarea name="message" required placeholder="What would you like to ask?" />
              <Button type="submit">{common.actions.enquiry}</Button>
            </form>
          </section>
          <section className="goan-card p-5">
            <h2 className="font-display text-xl font-semibold">Customer reviews ({business.reviews.length})</h2>
            {business.reviews.length === 0 ? <p className="mt-2 text-sm text-[var(--gp-ink-2)]">No published reviews yet.</p> : null}
            <ul className="mt-3 space-y-3">
              {business.reviews.map((review) => (
                <li key={review.id} className="rounded-2xl bg-[var(--gp-canvas)] p-3">
                  <p className="text-sm font-semibold">
                    {review.authorName} · {"★".repeat(review.rating)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--gp-ink-2)]">{review.body}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-3 font-display text-xl font-semibold">You may also like</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {business.related.map((item) => (
                <BusinessCardView key={item.id} business={item} labels={common.actions} />
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-4">
          <section className="rounded-3xl bg-[var(--gp-mint)] p-4 text-sm">
            <h2 className="font-semibold">Business information</h2>
            <p className="mt-2">{displayPhone(business.phone)}</p>
            <p>{business.townName}</p>
            <p>{business.address}</p>
            {business.email ? <p>{business.email}</p> : null}
          </section>
          <section className="goan-card p-4 text-sm">
            <h2 className="font-semibold">Opening hours</h2>
            <ul className="mt-2 space-y-1">
              {DAY_ORDER.map((day) => (
                <li key={day} className="flex justify-between">
                  <span>{dayLabel(day)}</span>
                  <span>{business.hours?.[day] ?? "Closed"}</span>
                </li>
              ))}
            </ul>
          </section>
          {Number.isFinite(lat) && Number.isFinite(lng) ? <LocationMap lat={lat} lng={lng} label={business.name} /> : null}
          <section className="goan-card p-4">
            <h2 className="text-sm font-semibold">Share</h2>
            <div className="mt-2" dangerouslySetInnerHTML={{ __html: qr }} />
          </section>
        </aside>
      </div>
    </div>
  );
}
