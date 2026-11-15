import { cookies } from "next/headers";

export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("omy_locale")?.value;
  return value === "hi" ? "hi" : "en";
}

export async function getCommon(locale: Locale) {
  return locale === "hi"
    ? (await import("./locales/hi/common")).messages
    : (await import("./locales/en/common")).messages;
}

export async function getHomeCopy(locale: Locale) {
  return locale === "hi" ? (await import("./locales/hi/home")).messages : (await import("./locales/en/home")).messages;
}

export async function getExploreCopy(locale: Locale) {
  return locale === "hi"
    ? (await import("./locales/hi/explore")).messages
    : (await import("./locales/en/explore")).messages;
}

export async function getAuthCopy(locale: Locale) {
  return locale === "hi" ? (await import("./locales/hi/auth")).messages : (await import("./locales/en/auth")).messages;
}
