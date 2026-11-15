import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWhen(value: Date | number | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export function formatWhenTime(value: Date | number | string) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
export type DayKey = (typeof DAY_KEYS)[number];
export type WeeklyHours = Record<DayKey, string | null>;

export function parseHours(raw: string | null | undefined): WeeklyHours | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<WeeklyHours>;
    return {
      sun: parsed.sun ?? null,
      mon: parsed.mon ?? null,
      tue: parsed.tue ?? null,
      wed: parsed.wed ?? null,
      thu: parsed.thu ?? null,
      fri: parsed.fri ?? null,
      sat: parsed.sat ?? null,
    };
  } catch {
    return null;
  }
}

export function isOpenNow(hours: WeeklyHours | null, now = new Date()) {
  if (!hours) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const key = weekday.slice(0, 3).toLowerCase() as DayKey;
  const range = hours[key];
  if (!range) return false;
  const match = range.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
  if (!match) return false;
  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);
  const current = hour * 60 + minute;
  return current >= start && current < end;
}

export function dayLabel(key: DayKey) {
  return { sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat" }[key];
}

export const DAY_ORDER = DAY_KEYS;

export function normalizeIndianPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return `+91${local}`;
}

export function displayPhone(phone: string | null | undefined) {
  if (!phone) return "";
  const normalized = normalizeIndianPhone(phone);
  if (!normalized) return phone;
  return `+91 ${normalized.slice(3, 8)} ${normalized.slice(8)}`;
}

export function whatsappHref(phone: string | null | undefined) {
  const normalized = phone ? normalizeIndianPhone(phone) : null;
  if (!normalized) return null;
  return `https://wa.me/${normalized.replace("+", "")}`;
}

export function telHref(phone: string | null | undefined) {
  const normalized = phone ? normalizeIndianPhone(phone) : null;
  if (!normalized) return null;
  return `tel:${normalized}`;
}

export function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
