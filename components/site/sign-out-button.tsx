"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ label = "Sign out" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-xs font-semibold text-[#c52842]"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
