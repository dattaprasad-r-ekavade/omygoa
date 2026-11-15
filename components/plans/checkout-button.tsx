"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ planId, label }: { planId: string; label: string }) {
  const [pending, setPending] = useState(false);
  return (
    <Button
      type="button"
      disabled={pending || planId === "plan_free"}
      onClick={async () => {
        setPending(true);
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ planId }),
        });
        const body = (await response.json()) as { mode?: string; orderId?: string; error?: string; message?: string };
        setPending(false);
        if (!response.ok) {
          toast.error(body.error ?? "Checkout needs a signed-in account");
          return;
        }
        toast.success(body.mode === "stub" ? `Stub order ${body.orderId}` : `Razorpay order ${body.orderId}`);
      }}
    >
      {pending ? "Starting…" : label}
    </Button>
  );
}
