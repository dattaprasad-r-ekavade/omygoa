import { WorkspaceShell } from "@/components/workspace/shell";
import { privateMeta } from "@/lib/seo";
import { requireRole } from "@/lib/session";

export const metadata = privateMeta;

const items = [
  ["/manager", "Overview"],
  ["/manager/businesses", "Businesses"],
  ["/manager/events", "Events"],
  ["/manager/listings", "Listings"],
];

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { session } = await requireRole(["manager"], "/manager");
  return (
    <WorkspaceShell title="Staff" subtitle={session.user.name} items={items.map(([href, label]) => ({ href, label }))}>
      {children}
    </WorkspaceShell>
  );
}
