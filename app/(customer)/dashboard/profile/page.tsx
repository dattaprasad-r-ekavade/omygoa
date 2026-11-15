import { updateProfile } from "@/lib/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoticeBanner, PageIntro } from "@/components/workspace/table";
import { requireUser } from "@/lib/session";
import { one } from "@/lib/utils";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireUser("/dashboard/profile");
  const notice = one((await searchParams).notice);
  return (
    <div>
      <PageIntro title="Profile settings" />
      <NoticeBanner code={notice} />
      <form action={updateProfile} className="grid max-w-md gap-3 rounded-3xl bg-white p-5">
        <label className="text-sm font-medium">
          Name
          <Input name="name" defaultValue={session.user.name} className="mt-1" />
        </label>
        <label className="text-sm font-medium">
          Email
          <Input value={session.user.email} readOnly className="mt-1 bg-[var(--gp-canvas)]" />
        </label>
        <label className="text-sm font-medium">
          Mobile
          <Input name="phone" defaultValue={session.user.phoneNumber ?? ""} className="mt-1" />
        </label>
        <p className="text-xs text-[var(--gp-ink-2)]">Role: {session.user.role ?? "customer"}</p>
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}
