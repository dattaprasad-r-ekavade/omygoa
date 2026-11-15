import { MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BusinessCard } from "@/lib/queries";
import { displayPhone, telHref, whatsappHref } from "@/lib/utils";

const tones = ["tone-butter", "tone-mint", "tone-peach", "tone-blue", "tone-lilac"];

export function BusinessCardView({
  business,
  labels,
}: {
  business: BusinessCard;
  labels: { view: string; open: string; closed: string };
}) {
  const tone = tones[business.name.length % tones.length];
  const wa = whatsappHref(business.whatsapp || business.phone);
  const tel = telHref(business.phone);
  return (
    <article className="goan-card flex flex-col overflow-hidden">
      <Link href={`/business/${business.slug}`} className={`relative block h-36 ${business.coverUrl ? "" : tone}`}>
        {business.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-3xl" aria-hidden>
            🏠
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {business.categoryName ? <Badge tone="mint">{business.categoryName}</Badge> : null}
          {business.verified ? <Badge tone="blue">Verified</Badge> : null}
        </div>
        <h3 className="font-display text-lg leading-tight font-semibold">
          <Link href={`/business/${business.slug}`}>{business.name}</Link>
        </h3>
        {business.tagline ? <p className="text-sm text-[var(--gp-ink-2)]">{business.tagline}</p> : null}
        <p className="flex items-center gap-1 text-sm text-[var(--gp-ink-2)]">
          <MapPin className="size-3.5" /> {business.townName ?? "Goa"}
          {business.open === null ? null : (
            <span className={business.open ? "text-[var(--gp-mint-ink)]" : "text-[var(--gp-peach-ink)]"}>
              · {business.open ? labels.open : labels.closed}
            </span>
          )}
        </p>
        {business.ratingCount > 0 ? (
          <p className="text-sm">★ {Number(business.ratingAvg ?? 0).toFixed(1)} · {business.ratingCount}</p>
        ) : null}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link href={`/business/${business.slug}`} className="rounded-full bg-[var(--gp-indigo)] px-3 py-1.5 text-xs font-semibold text-white">
            {labels.view}
          </Link>
          {wa ? (
            <a href={wa} className="rounded-full border border-[var(--gp-line-strong)] p-2" aria-label="WhatsApp">
              <MessageCircle className="size-4 text-[#16834b]" />
            </a>
          ) : null}
          {tel ? (
            <a href={tel} className="rounded-full border border-[var(--gp-line-strong)] p-2" aria-label={displayPhone(business.phone)}>
              <Phone className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
