"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import type { messages as authEn } from "@/lib/i18n/locales/en/auth";
import { normalizeIndianPhone } from "@/lib/utils";

type Copy = typeof authEn;

export function AuthPanel({ mode, copy, next }: { mode: "login" | "signup"; copy: Copy; next?: string }) {
  const router = useRouter();
  const [emailMode, setEmailMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const destination = next && next.startsWith("/") ? next : "/dashboard";

  async function finish() {
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="font-display text-3xl font-semibold">{mode === "login" ? copy.welcome : copy.create}</h1>
      <p className="mt-2 text-sm text-[var(--gp-ink-2)]">{mode === "login" ? copy.welcomeBody : copy.createBody}</p>

      {emailMode ? (
        <form
          className="mt-6 space-y-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setPending(true);
            const email = String(data.get("email") ?? "");
            const password = String(data.get("password") ?? "");
            const name = String(data.get("name") ?? "Neighbour");
            const result =
              mode === "signup"
                ? await authClient.signUp.email({ email, password, name })
                : await authClient.signIn.email({ email, password });
            setPending(false);
            if (result.error) {
              toast.error(result.error.message ?? "Could not sign in");
              return;
            }
            await finish();
          }}
        >
          {mode === "signup" ? (
            <div>
              <Label htmlFor="name">{copy.name}</Label>
              <Input id="name" name="name" required className="mt-1" placeholder={copy.namePh} />
            </div>
          ) : null}
          <div>
            <Label htmlFor="email">{copy.email}</Label>
            <Input id="email" name="email" type="email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">{copy.password}</Label>
            <Input id="password" name="password" type="password" required minLength={8} className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {mode === "signup" ? copy.signUp : copy.signIn}
          </Button>
          <button type="button" className="text-sm text-[var(--gp-indigo)]" onClick={() => setEmailMode(false)}>
            {copy.phoneInstead}
          </button>
        </form>
      ) : (
        <form
          className="mt-6 space-y-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const normalized = normalizeIndianPhone(String(data.get("phone") ?? phone));
            if (!normalized) {
              toast.error("Enter a valid 10-digit Indian mobile number");
              return;
            }
            setPending(true);
            if (!sent) {
              const result = await authClient.phoneNumber.sendOtp({ phoneNumber: normalized });
              setPending(false);
              if (result.error) {
                toast.error(result.error.message ?? "Could not send OTP");
                return;
              }
              setPhone(normalized);
              setSent(true);
              const echo = await fetch(`/api/dev/otp?phone=${encodeURIComponent(normalized)}`);
              if (echo.ok) {
                const body = (await echo.json()) as { code?: string };
                if (body.code) setDevCode(body.code);
              }
              toast.success("OTP sent");
              return;
            }
            const result = await authClient.phoneNumber.verify({ phoneNumber: normalized, code: String(data.get("code") ?? code) });
            setPending(false);
            if (result.error) {
              toast.error(result.error.message ?? "Could not verify OTP");
              return;
            }
            await finish();
          }}
        >
          {mode === "signup" ? (
            <div>
              <Label htmlFor="otp-name">{copy.name}</Label>
              <Input id="otp-name" name="name" placeholder={copy.namePh} className="mt-1" />
            </div>
          ) : null}
          <div>
            <Label htmlFor="phone">{copy.mobile}</Label>
            <div className="mt-1 flex gap-2">
              <span className="grid h-11 place-items-center rounded-2xl border border-[var(--gp-line-strong)] px-3 text-sm">+91</span>
              <Input id="phone" name="phone" inputMode="numeric" placeholder={copy.mobilePh} defaultValue={phone.replace("+91", "")} required />
            </div>
            <p className="mt-1 text-xs text-[var(--gp-ink-2)]">{copy.newHere}</p>
          </div>
          {sent ? (
            <div>
              <Label htmlFor="code">{copy.code}</Label>
              <Input id="code" name="code" value={code} onChange={(event) => setCode(event.target.value)} required className="mt-1" />
              {devCode ? (
                <p className="mt-1 text-xs text-[var(--gp-mint-ink)]">
                  {copy.devOtp}: {devCode}
                </p>
              ) : null}
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {sent ? copy.verify : copy.otp}
          </Button>
          <p className="text-center text-xs text-[var(--gp-ink-2)]">{copy.otpHint}</p>
        </form>
      )}

      <div className="my-4 text-center text-xs tracking-wide text-[var(--gp-ink-2)]">OR</div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={async () => {
          const result = await authClient.signIn.social({ provider: "google", callbackURL: destination });
          if (result?.error) toast.message(copy.googleMissing);
        }}
      >
        {copy.google}
      </Button>
      <button type="button" className="mt-4 block w-full text-center text-sm text-[var(--gp-ink-2)]" onClick={() => setEmailMode((value) => !value)}>
        {emailMode ? copy.phoneInstead : copy.emailInstead}
      </button>
      <p className="mt-6 text-center text-sm">
        {mode === "login" ? copy.new : copy.have}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-[var(--gp-indigo)]">
          {mode === "login" ? copy.signUp : copy.signIn}
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link href="/" className="text-[var(--gp-ink-2)]">
          {copy.browse}
        </Link>
      </p>
    </div>
  );
}
