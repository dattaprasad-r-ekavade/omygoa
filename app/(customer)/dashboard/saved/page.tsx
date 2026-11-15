import { BusinessCardView } from "@/components/site/business-card";
import { PageIntro } from "@/components/workspace/table";
import { getCommon, getLocale } from "@/lib/i18n/locale";
import { savedFor } from "@/lib/queries";
import { requireUser } from "@/lib/session";

export default async function SavedPage() {
  const session = await requireUser("/dashboard/saved");
  const [rows, common] = await Promise.all([savedFor(session.user.id), getLocale().then((locale) => getCommon(locale))]);
  return (
    <div>
      <PageIntro title={`Saved listings (${rows.length})`} />
      {rows.length === 0 ? <p className="text-sm text-[var(--gp-ink-2)]">No saved listings yet.</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((row) => (
          <BusinessCardView key={row.id} business={row} labels={common.actions} />
        ))}
      </div>
    </div>
  );
}
