import { WorkspaceShell } from "@/components/workspace/shell";
import { privateMeta } from "@/lib/seo";
import { requireRole } from "@/lib/session";

export const metadata = privateMeta;

const items = [
  ["/admin", "Overview"],
  ["/admin/users", "Users"],
  ["/admin/businesses", "Businesses"],
  ["/admin/listings", "Listings"],
  ["/admin/events", "Events"],
  ["/admin/posts", "Posts"],
  ["/admin/reviews", "Reviews"],
  ["/admin/coupons", "Coupons"],
  ["/admin/blog", "Blog"],
  ["/admin/settings", "Settings"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session } = await requireRole(["admin"], "/admin");
  return (
    <WorkspaceShell title="Admin panel" subtitle={session.user.name} items={items.map(([href, label]) => ({ href, label }))}>
      {children}
    </WorkspaceShell>
  );
}
