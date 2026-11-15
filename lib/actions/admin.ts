"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { businesses, events, settings } from "@/lib/db/schema";
import { requireRole } from "@/lib/session";
import { normalizeIndianPhone, slugify } from "@/lib/utils";

const businessSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(80).optional(),
  tagline: z.string().trim().max(160).optional(),
  description: z.string().trim().max(4000).optional(),
  categoryId: z.string().optional(),
  townId: z.string().optional(),
  address: z.string().trim().max(240).optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().trim().max(160).optional(),
  plan: z.enum(["free", "starter", "growth", "featured"]),
  registrationStatus: z.enum(["pending", "approved", "rejected"]),
  listingStatus: z.enum(["pending", "active", "rejected", "suspended"]),
  businessType: z.enum(["products", "services", "manufacturer", "retail", "wholesale", "b2b", "b2c"]),
  featured: z.string().optional(),
  verified: z.string().optional(),
});

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2).max(140),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().max(4000).optional(),
  category: z.string().trim().max(80).optional(),
  townId: z.string().optional(),
  venue: z.string().trim().max(160).optional(),
  address: z.string().trim().max(240).optional(),
  startsAt: z.string().min(8),
  endsAt: z.string().optional(),
  priceLabel: z.string().trim().max(80).optional(),
  status: z.enum(["draft", "needs_review", "published", "payment_pending", "paused"]),
  coverUrl: z.string().trim().max(240).optional(),
});

function back(path: string, notice: string): never {
  redirect(`${path}?notice=${notice}`);
}

export async function saveBusiness(formData: FormData) {
  await requireRole(["admin"], "/admin/businesses");
  const parsed = businessSchema.safeParse({
    id: String(formData.get("id") ?? "") || undefined,
    name: formData.get("name"),
    slug: String(formData.get("slug") ?? "") || undefined,
    tagline: formData.get("tagline") ?? "",
    description: formData.get("description") ?? "",
    categoryId: String(formData.get("categoryId") ?? "") || undefined,
    townId: String(formData.get("townId") ?? "") || undefined,
    address: formData.get("address") ?? "",
    phone: formData.get("phone") ?? "",
    whatsapp: formData.get("whatsapp") ?? "",
    email: formData.get("email") ?? "",
    plan: formData.get("plan"),
    registrationStatus: formData.get("registrationStatus"),
    listingStatus: formData.get("listingStatus"),
    businessType: formData.get("businessType"),
    featured: formData.get("featured") ? "1" : undefined,
    verified: formData.get("verified") ? "1" : undefined,
  });
  if (!parsed.success) back("/admin/businesses", "invalid");
  const data = parsed.data;
  const db = await getDb();
  const slug = slugify(data.slug || data.name);
  const values = {
    name: data.name,
    slug,
    tagline: data.tagline || null,
    description: data.description || "",
    categoryId: data.categoryId || null,
    townId: data.townId || null,
    address: data.address || null,
    phone: normalizeIndianPhone(data.phone || ""),
    whatsapp: normalizeIndianPhone(data.whatsapp || ""),
    email: data.email || null,
    plan: data.plan,
    registrationStatus: data.registrationStatus,
    listingStatus: data.listingStatus,
    businessType: data.businessType,
    featured: data.featured === "1",
    verified: data.verified === "1",
    updatedAt: new Date(),
  };
  if (data.id) {
    await db.update(businesses).set(values).where(eq(businesses.id, data.id));
  } else {
    await db.insert(businesses).values({
      ...values,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  }
  revalidatePath("/admin/businesses");
  revalidatePath("/explore");
  revalidatePath("/");
  back("/admin/businesses", "saved");
}

export async function deleteBusiness(formData: FormData) {
  await requireRole(["admin"], "/admin/businesses");
  const id = String(formData.get("id") ?? "");
  if (!id) back("/admin/businesses", "invalid");
  const db = await getDb();
  await db.delete(businesses).where(eq(businesses.id, id));
  revalidatePath("/admin/businesses");
  revalidatePath("/explore");
  back("/admin/businesses", "deleted");
}

export async function saveEvent(formData: FormData) {
  const { session } = await requireRole(["admin"], "/admin/events");
  const parsed = eventSchema.safeParse({
    id: String(formData.get("id") ?? "") || undefined,
    title: formData.get("title"),
    slug: String(formData.get("slug") ?? "") || undefined,
    description: formData.get("description") ?? "",
    category: formData.get("category") ?? "",
    townId: String(formData.get("townId") ?? "") || undefined,
    venue: formData.get("venue") ?? "",
    address: formData.get("address") ?? "",
    startsAt: formData.get("startsAt"),
    endsAt: String(formData.get("endsAt") ?? "") || undefined,
    priceLabel: formData.get("priceLabel") ?? "",
    status: formData.get("status"),
    coverUrl: formData.get("coverUrl") ?? "",
  });
  if (!parsed.success) back("/admin/events", "invalid");
  const data = parsed.data;
  const startsAt = new Date(data.startsAt);
  if (Number.isNaN(startsAt.getTime())) back("/admin/events", "invalid");
  const endsAt = data.endsAt ? new Date(data.endsAt) : null;
  const db = await getDb();
  const values = {
    title: data.title,
    slug: slugify(data.slug || data.title),
    description: data.description || "",
    category: data.category || null,
    townId: data.townId || null,
    venue: data.venue || null,
    address: data.address || null,
    startsAt,
    endsAt: endsAt && !Number.isNaN(endsAt.getTime()) ? endsAt : null,
    priceLabel: data.priceLabel || null,
    status: data.status,
    coverUrl: data.coverUrl || null,
    updatedAt: new Date(),
  };
  if (data.id) {
    await db.update(events).set(values).where(eq(events.id, data.id));
  } else {
    await db.insert(events).values({
      ...values,
      id: crypto.randomUUID(),
      organizerUserId: session.user.id,
      qrToken: crypto.randomUUID(),
      createdAt: new Date(),
    });
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  back("/admin/events", "saved");
}

export async function deleteEvent(formData: FormData) {
  await requireRole(["admin"], "/admin/events");
  const id = String(formData.get("id") ?? "");
  if (!id) back("/admin/events", "invalid");
  const db = await getDb();
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/admin/events");
  revalidatePath("/events");
  back("/admin/events", "deleted");
}

export async function saveSettings(formData: FormData) {
  await requireRole(["admin"], "/admin/settings");
  const db = await getDb();
  const keys = ["coming_soon_title", "coming_soon_body", "support_note"];
  for (const key of keys) {
    const value = String(formData.get(key) ?? "");
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }
  revalidatePath("/admin/settings");
  back("/admin/settings", "saved");
}
