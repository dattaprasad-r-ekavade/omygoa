import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber } from "better-auth/plugins";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { getSmsProvider, rememberDevOtp } from "@/lib/sms";

export async function getAuth() {
  const db = await getDb();
  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  return betterAuth({
    appName: "OmyGoa",
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    trustedOrigins: [
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:8787",
      "http://127.0.0.1:8787",
    ].filter((origin): origin is string => Boolean(origin)),
    secret: process.env.BETTER_AUTH_SECRET ?? "dev-only-secret-change-me-please-32b",
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    socialProviders:
      googleId && googleSecret
        ? {
            google: {
              clientId: googleId,
              clientSecret: googleSecret,
            },
          }
        : undefined,
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "customer",
          input: false,
        },
      },
    },
    plugins: [
      phoneNumber({
        otpLength: 6,
        expiresIn: 300,
        signUpOnVerification: {
          getTempEmail: (phone) => `${phone.replace(/\D/g, "")}@phone.omygoa.example`,
          getTempName: (phone) => phone,
        },
        sendOTP: async ({ phoneNumber: to, code }) => {
          rememberDevOtp(to, code);
          await getSmsProvider().send(to, `Your OmyGoa code is ${code}`);
        },
      }),
      nextCookies(),
    ],
  });
}

export type Auth = Awaited<ReturnType<typeof getAuth>>;
