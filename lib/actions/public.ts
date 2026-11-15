"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { businesses, enquiries, savedBusinesses, user } from "@/lib/db/schema";
import { getSession } from "@/lib/session";
import { normalizeIndianPhone } from "@/lib/utils";

export async function setLocale(locale: "en" | "hi") {
  const jar = await cookies();
  jar.set("omy_locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}

export async function sendEnquiry(formData: FormData) {
  const businessId = String(formData.get("businessId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = normalizeIndianPhone(String(formData.get("phone") ?? "")) ?? "";
  const message = String(formData.get("message") ?? "").trim();
  if (!businessId || name.length < 2 || !email.includes("@") || message.length < 4) {
    redirect(`/business/${slug}?notice=invalid#enquiry`);
  }
  const session = await getSession();
  const db = await getDb();
  await db.insert(enquiries).values({
    id: crypto.randomUUID(),
    businessId,
    userId: session?.user.id ?? null,
    name,
    email,
    phone: phone || null,
    message,
    status: "new",
    createdAt: new Date(),
  });
  revalidatePath(`/business/${slug}`);
  redirect(`/business/${slug}?notice=enquiry#enquiry`);
}

export async function toggleSave(formData: FormData) {
  const businessId = String(formData.get("businessId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const session = await getSession();
  if (!session) redirect(`/login?next=/business/${slug}`);
  const db = await getDb();
  const existing = await db
    .select()
    .from(savedBusinesses)
    .where(and(eq(savedBusinesses.userId, session.user.id), eq(savedBusinesses.businessId, businessId)))
    .limit(1);
  if (existing[0]) {
    await db
      .delete(savedBusinesses)
      .where(and(eq(savedBusinesses.userId, session.user.id), eq(savedBusinesses.businessId, businessId)));
  } else {
    await db.insert(savedBusinesses).values({
      userId: session.user.id,
      businessId,
      createdAt: new Date(),
    });
  }
  revalidatePath(`/business/${slug}`);
  revalidatePath("/dashboard/saved");
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/profile");
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizeIndianPhone(String(formData.get("phone") ?? ""));
  if (name.length < 2) redirect("/dashboard/profile?notice=invalid");
  const db = await getDb();
  await db
    .update(user)
    .set({ name, phoneNumber: phone, updatedAt: new Date() })
    .where(eq(user.id, session.user.id));
  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?notice=saved");
}

export async function updateListing(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login?next=/owner/listing");
  const id = String(formData.get("id") ?? "");
  const db = await getDb();
  const rows = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);
  const row = rows[0];
  const role = session.user.role;
  if (!row || (row.ownerUserId !== session.user.id && role !== "admin")) {
    redirect("/owner/listing?notice=forbidden");
  }
  await db
    .update(businesses)
    .set({
      tagline: String(formData.get("tagline") ?? ""),
      description: String(formData.get("description") ?? ""),
      phone: normalizeIndianPhone(String(formData.get("phone") ?? "")),
      whatsapp: normalizeIndianPhone(String(formData.get("whatsapp") ?? "")),
      email: String(formData.get("email") ?? ""),
      address: String(formData.get("address") ?? ""),
      hoursJson: String(formData.get("hoursJson") ?? "") || null,
      updatedAt: new Date(),
    })
    .where(eq(businesses.id, id));
  revalidatePath("/owner/listing");
  revalidatePath(`/business/${row.slug}`);
  redirect("/owner/listing?notice=saved");
}
