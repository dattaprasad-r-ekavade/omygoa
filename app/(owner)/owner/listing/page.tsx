import { updateListing } from "@/lib/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NoticeBanner, PageIntro } from "@/components/workspace/table";
import { ownerBusinesses } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import { one } from "@/lib/utils";

export default async function OwnerListingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session } = await requireRole(["owner"], "/owner/listing");
  const notice = one((await searchParams).notice);
  const id = one((await searchParams).id);
  const rows = await ownerBusinesses(session.user.id);
  const current = rows.find((row) => row.id === id) ?? rows[0];
  return (
    <div>
      <PageIntro title="My listings" hint="Update the public description, hours and contact details." />
      <NoticeBanner code={notice} />
      {rows.length > 1 ? (
        <div className="mb-3 flex flex-wrap gap-2 text-sm">
          {rows.map((row) => (
            <a key={row.id} href={`/owner/listing?id=${row.id}`} className="rounded-full bg-white px-3 py-1">
              {row.name}
            </a>
          ))}
        </div>
      ) : null}
      {!current ? <p>No listing on this account yet.</p> : null}
      {current ? (
        <form action={updateListing} className="grid max-w-2xl gap-3 rounded-3xl bg-white p-5">
          <input type="hidden" name="id" value={current.id} />
          <label className="text-sm font-medium">
            Tagline
            <Input name="tagline" defaultValue={current.tagline ?? ""} className="mt-1" />
          </label>
          <label className="text-sm font-medium">
            Description
            <Textarea name="description" defaultValue={current.description} className="mt-1" />
          </label>
          <label className="text-sm font-medium">
            Address
            <Input name="address" defaultValue={current.address ?? ""} className="mt-1" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Phone
              <Input name="phone" defaultValue={current.phone ?? ""} className="mt-1" />
            </label>
            <label className="text-sm font-medium">
              WhatsApp
              <Input name="whatsapp" defaultValue={current.whatsapp ?? ""} className="mt-1" />
            </label>
          </div>
          <label className="text-sm font-medium">
            Email
            <Input name="email" defaultValue={current.email ?? ""} className="mt-1" />
          </label>
          <label className="text-sm font-medium">
            Hours JSON
            <Textarea name="hoursJson" defaultValue={current.hoursJson ?? ""} className="mt-1 font-mono text-xs" />
          </label>
          <Button type="submit">Save listing</Button>
        </form>
      ) : null}
    </div>
  );
}
