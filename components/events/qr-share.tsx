"use client";

import { QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function QrShare({ title, url, svg }: { title: string; url: string; svg: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-full border border-[var(--gp-line-strong)] bg-white px-3 py-2 text-sm font-semibold">
        <QrCode className="size-4" /> Share QR
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Anyone with this code can open the public event page.</DialogDescription>
        <div className="mx-auto mt-4 w-52" dangerouslySetInnerHTML={{ __html: svg }} />
        <button
          type="button"
          className="mt-4 w-full rounded-full bg-[var(--gp-indigo)] py-2 text-sm font-semibold text-white"
          onClick={async () => {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied");
          }}
        >
          Copy link
        </button>
      </DialogContent>
    </Dialog>
  );
}
