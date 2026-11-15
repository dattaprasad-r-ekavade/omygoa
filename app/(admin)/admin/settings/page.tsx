import { saveSettings } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NoticeBanner, PageIntro } from "@/components/workspace/table";
import { listSettings } from "@/lib/queries";
import { one } from "@/lib/utils";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const notice = one((await searchParams).notice);
  const rows = await listSettings();
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return (
    <div>
      <PageIntro title="Settings" hint="A small set of site notes. Payments, SMS and OAuth stay in environment variables." />
      <NoticeBanner code={notice} />
      <form action={saveSettings} className="grid max-w-xl gap-3 rounded-3xl bg-white p-5">
        <label className="text-sm font-medium">
          Coming soon title
          <Input name="coming_soon_title" defaultValue={map.coming_soon_title ?? ""} className="mt-1" />
        </label>
        <label className="text-sm font-medium">
          Coming soon body
          <Textarea name="coming_soon_body" defaultValue={map.coming_soon_body ?? ""} className="mt-1" />
        </label>
        <label className="text-sm font-medium">
          Support note
          <Textarea name="support_note" defaultValue={map.support_note ?? ""} className="mt-1" />
        </label>
        <Button type="submit">Save settings</Button>
      </form>
    </div>
  );
}
