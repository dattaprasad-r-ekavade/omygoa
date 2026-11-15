/**
 * Pluggable SMS sender. The console provider prints the message locally.
 * Add a provider by implementing `SmsProvider` and branching in `getSmsProvider`.
 * Suggested later adapters: MSG91, Twilio, or a Cloudflare Queue consumer.
 */
export interface SmsProvider {
  readonly name: string;
  send(to: string, message: string): Promise<void>;
}

const devOtps = new Map<string, string>();

const consoleProvider: SmsProvider = {
  name: "console",
  async send(to, message) {
    console.info(`[sms:console] to=${to} ${message}`);
  },
};

export function getSmsProvider(): SmsProvider {
  const name = process.env.SMS_PROVIDER ?? "console";
  if (name === "console") return consoleProvider;
  throw new Error(
    `SMS provider "${name}" is not registered. Implement it in lib/sms.ts or set SMS_PROVIDER=console.`,
  );
}

export function rememberDevOtp(phone: string, code: string) {
  if (!devOtpEchoEnabled()) return;
  devOtps.set(phone, code);
}

export function readDevOtp(phone: string) {
  if (!devOtpEchoEnabled()) return null;
  return devOtps.get(phone) ?? null;
}

export function devOtpEchoEnabled() {
  return process.env.SMS_PROVIDER === "console" && process.env.SMS_DEV_ECHO === "true";
}
