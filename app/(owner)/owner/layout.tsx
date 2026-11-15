import { WorkspaceShell } from "@/components/workspace/shell";
import { privateMeta } from "@/lib/seo";
import { requireRole } from "@/lib/session";

export const metadata = privateMeta;

const items = [
  ["/owner", "Overview"],
  ["/owner/business", "Business"],
  ["/owner/listing", "Listing"],
  ["/owner/leads", "Leads"],
  ["/owner/reviews", "Reviews"],
  ["/owner/billing", "Billing"],
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { session } = await requireRole(["owner"], "/owner");
  return (
    <WorkspaceShell title="Your business" subtitle={session.user.name} items={items.map(([href, label]) => ({ href, label }))}>
      {children}
    </WorkspaceShell>
  );
}
