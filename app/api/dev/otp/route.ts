import { devOtpEchoEnabled, readDevOtp } from "@/lib/sms";

export async function GET(request: Request) {
  if (!devOtpEchoEnabled()) {
    return Response.json({ error: "OTP echo is disabled" }, { status: 404 });
  }
  const phone = new URL(request.url).searchParams.get("phone") ?? "";
  const code = readDevOtp(phone);
  if (!code) return Response.json({ code: null });
  return Response.json({ code });
}
