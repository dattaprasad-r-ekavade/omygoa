import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export const roles = ["admin", "manager", "owner", "customer"] as const;
export type Role = (typeof roles)[number];

export function roleOf(role: string | null | undefined): Role {
  if (role === "admin" || role === "manager" || role === "owner") return role;
  return "customer";
}

export async function getSession() {
  const auth = await getAuth();
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser(nextPath = "/dashboard") {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return session;
}

export async function requireRole(allowed: Role[], nextPath: string) {
  const session = await requireUser(nextPath);
  const role = roleOf(session.user.role);
  const ok =
    allowed.includes(role) ||
    (role === "admin" && allowed.some((item) => item === "owner" || item === "manager" || item === "customer"));
  if (!ok) redirect("/dashboard?notice=forbidden");
  return { session, role };
}
