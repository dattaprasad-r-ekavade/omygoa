import { WorkspaceShell } from "@/components/workspace/shell";
import { privateMeta } from "@/lib/seo";
import { requireUser } from "@/lib/session";

export const metadata = privateMeta;

const items = [
  ["/dashboard", "Overview"],
  ["/dashboard/saved", "Saved"],
  ["/dashboard/posts", "My posts"],
  ["/dashboard/enquiries", "Enquiries"],
  ["/dashboard/profile", "Profile"],
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser("/dashboard");
  return (
    <WorkspaceShell title="Dashboard" subtitle={session.user.name} items={items.map(([href, label]) => ({ href, label }))}>
      {children}
    </WorkspaceShell>
  );
}
