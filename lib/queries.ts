import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  adCampaigns,
  billingRecords,
  blogPosts,
  businesses,
  categories,
  coupons,
  enquiries,
  events,
  jobApplications,
  jobs,
  notifications,
  petAdoptions,
  prelovedItems,
  rentals,
  reviews,
  savedBusinesses,
  services,
  settings,
  subscriptionPlans,
  towns,
  user,
} from "@/lib/db/schema";
import { isOpenNow, parseHours, type WeeklyHours } from "@/lib/utils";

export type BusinessCard = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  hoursJson: string | null;
  lat: string | null;
  lng: string | null;
  plan: string;
  featured: boolean;
  verified: boolean;
  registrationStatus: string;
  listingStatus: string;
  businessType: string;
  womanOwned: boolean;
  localGoan: boolean;
  wheelchairAccessible: boolean;
  petFriendly: boolean;
  familyFriendly: boolean;
  coverUrl: string | null;
  createdAt: Date;
  categoryName: string | null;
  categorySlug: string | null;
  townName: string | null;
  townSlug: string | null;
  region: string | null;
  ratingAvg: number | null;
  ratingCount: number;
  open: boolean | null;
  hours: WeeklyHours | null;
};

export type ListingFilters = {
  q?: string;
  category?: string;
  town?: string;
  region?: string;
  sort?: string;
  open?: string;
  type?: string;
  woman?: string;
  local?: string;
  access?: string;
  pet?: string;
  family?: string;
  rating?: string;
  featured?: string;
  status?: string;
};

function decorate<T extends { hoursJson: string | null; ratingAvg: number | null }>(
  row: T,
): T & { open: boolean | null; hours: WeeklyHours | null } {
  const hours = parseHours(row.hoursJson);
  return { ...row, hours, open: isOpenNow(hours) };
}

const businessSelect = {
  id: businesses.id,
  name: businesses.name,
  slug: businesses.slug,
  tagline: businesses.tagline,
  description: businesses.description,
  phone: businesses.phone,
  whatsapp: businesses.whatsapp,
  email: businesses.email,
  website: businesses.website,
  address: businesses.address,
  hoursJson: businesses.hoursJson,
  lat: businesses.lat,
  lng: businesses.lng,
  plan: businesses.plan,
  featured: businesses.featured,
  verified: businesses.verified,
  registrationStatus: businesses.registrationStatus,
  listingStatus: businesses.listingStatus,
  businessType: businesses.businessType,
  womanOwned: businesses.womanOwned,
  localGoan: businesses.localGoan,
  wheelchairAccessible: businesses.wheelchairAccessible,
  petFriendly: businesses.petFriendly,
  familyFriendly: businesses.familyFriendly,
  coverUrl: businesses.coverUrl,
  createdAt: businesses.createdAt,
  ownerUserId: businesses.ownerUserId,
  categoryId: businesses.categoryId,
  townId: businesses.townId,
  categoryName: categories.name,
  categorySlug: categories.slug,
  townName: towns.name,
  townSlug: towns.slug,
  region: towns.region,
  ratingAvg: sql<number | null>`(select avg(${reviews.rating}) from ${reviews} where ${reviews.businessId} = ${businesses.id} and ${reviews.status} = 'approved')`,
  ratingCount: sql<number>`(select count(*) from ${reviews} where ${reviews.businessId} = ${businesses.id} and ${reviews.status} = 'approved')`,
};

function businessQuery(db: Awaited<ReturnType<typeof getDb>>) {
  return db
    .select(businessSelect)
    .from(businesses)
    .leftJoin(categories, eq(categories.id, businesses.categoryId))
    .leftJoin(towns, eq(towns.id, businesses.townId));
}

export async function listTowns() {
  const db = await getDb();
  return db.select().from(towns).orderBy(asc(towns.region), asc(towns.name));
}

export async function listCategories() {
  const db = await getDb();
  return db.select().from(categories).orderBy(asc(categories.sort), asc(categories.name));
}

export async function listBusinesses(filters: ListingFilters = {}) {
  const db = await getDb();
  const where = [eq(businesses.listingStatus, filters.status ?? "active")];
  if (filters.q) {
    const term = `%${filters.q}%`;
    where.push(or(like(businesses.name, term), like(businesses.tagline, term), like(businesses.description, term))!);
  }
  if (filters.category) where.push(eq(categories.slug, filters.category));
  if (filters.town) where.push(eq(towns.slug, filters.town));
  if (filters.region) where.push(eq(towns.region, filters.region));
  if (filters.type) where.push(eq(businesses.businessType, filters.type));
  if (filters.woman === "1") where.push(eq(businesses.womanOwned, true));
  if (filters.local === "1") where.push(eq(businesses.localGoan, true));
  if (filters.access === "1") where.push(eq(businesses.wheelchairAccessible, true));
  if (filters.pet === "1") where.push(eq(businesses.petFriendly, true));
  if (filters.family === "1") where.push(eq(businesses.familyFriendly, true));
  if (filters.featured === "1") where.push(eq(businesses.featured, true));
  if (filters.sort === "verified") where.push(eq(businesses.verified, true));

  const sort =
    filters.sort === "newest"
      ? desc(businesses.createdAt)
      : filters.sort === "featured"
        ? desc(businesses.featured)
        : desc(businesses.featured);

  const rows = await businessQuery(db).where(and(...where)).orderBy(sort, asc(businesses.name));
  let cards = rows.map((row) => decorate(row));
  if (filters.open === "open") cards = cards.filter((card) => card.open === true);
  if (filters.open === "closed") cards = cards.filter((card) => card.open === false);
  const min = Number(filters.rating ?? 0);
  if (min > 0) cards = cards.filter((card) => (card.ratingAvg ?? 0) >= min);
  if (filters.sort === "top") {
    cards = [...cards].sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));
  }
  return cards;
}

export async function getBusiness(slug: string) {
  const db = await getDb();
  const rows = await businessQuery(db).where(eq(businesses.slug, slug)).limit(1);
  const row = rows[0];
  if (!row) return null;
  const reviewRows = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.businessId, row.id), eq(reviews.status, "approved")))
    .orderBy(desc(reviews.createdAt));
  const related = await businessQuery(db)
    .where(and(eq(businesses.listingStatus, "active"), sql`${businesses.id} != ${row.id}`))
    .orderBy(desc(businesses.featured))
    .limit(3);
  return { ...decorate(row), reviews: reviewRows, related: related.map((item) => decorate(item)) };
}

export async function listEvents(status = "published") {
  const db = await getDb();
  return db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      description: events.description,
      category: events.category,
      venue: events.venue,
      address: events.address,
      startsAt: events.startsAt,
      endsAt: events.endsAt,
      coverUrl: events.coverUrl,
      priceLabel: events.priceLabel,
      status: events.status,
      qrToken: events.qrToken,
      townName: towns.name,
      townSlug: towns.slug,
      organizerUserId: events.organizerUserId,
      businessId: events.businessId,
    })
    .from(events)
    .leftJoin(towns, eq(towns.id, events.townId))
    .where(status === "all" ? sql`1 = 1` : eq(events.status, status))
    .orderBy(asc(events.startsAt));
}

export async function getEvent(slug: string) {
  const db = await getDb();
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      description: events.description,
      category: events.category,
      venue: events.venue,
      address: events.address,
      startsAt: events.startsAt,
      endsAt: events.endsAt,
      coverUrl: events.coverUrl,
      priceLabel: events.priceLabel,
      status: events.status,
      qrToken: events.qrToken,
      townName: towns.name,
      lat: towns.lat,
      lng: towns.lng,
    })
    .from(events)
    .leftJoin(towns, eq(towns.id, events.townId))
    .where(eq(events.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

async function withTown<T extends { townId: string | null }>(
  rows: T[],
) {
  const db = await getDb();
  const townRows = await db.select().from(towns);
  const map = new Map(townRows.map((town) => [town.id, town]));
  return rows.map((row) => ({ ...row, town: row.townId ? map.get(row.townId) ?? null : null }));
}

export async function listJobs() {
  const db = await getDb();
  const rows = await db.select().from(jobs).where(eq(jobs.status, "open")).orderBy(desc(jobs.createdAt));
  return withTown(rows);
}

export async function getJob(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  if (!rows[0]) return null;
  const [row] = await withTown(rows);
  return row ?? null;
}

export async function listRentals() {
  const db = await getDb();
  const rows = await db.select().from(rentals).where(eq(rentals.status, "available")).orderBy(desc(rentals.createdAt));
  return withTown(rows);
}

export async function getRental(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(rentals).where(eq(rentals.slug, slug)).limit(1);
  if (!rows[0]) return null;
  const [row] = await withTown(rows);
  return row ?? null;
}

export async function listPreloved() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(prelovedItems)
    .where(eq(prelovedItems.status, "available"))
    .orderBy(desc(prelovedItems.createdAt));
  return withTown(rows);
}

export async function getPreloved(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(prelovedItems).where(eq(prelovedItems.slug, slug)).limit(1);
  if (!rows[0]) return null;
  const [row] = await withTown(rows);
  return row ?? null;
}

export async function listPets() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(petAdoptions)
    .where(eq(petAdoptions.status, "available"))
    .orderBy(desc(petAdoptions.createdAt));
  return withTown(rows);
}

export async function getPet(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(petAdoptions).where(eq(petAdoptions.slug, slug)).limit(1);
  if (!rows[0]) return null;
  const [row] = await withTown(rows);
  return row ?? null;
}

export async function listServices() {
  const db = await getDb();
  const rows = await db.select().from(services).where(eq(services.status, "active")).orderBy(desc(services.createdAt));
  return withTown(rows);
}

export async function listPosts() {
  const db = await getDb();
  const [jobRows, rentalRows, itemRows, petRows] = await Promise.all([
    db.select().from(jobs).orderBy(desc(jobs.createdAt)),
    db.select().from(rentals).orderBy(desc(rentals.createdAt)),
    db.select().from(prelovedItems).orderBy(desc(prelovedItems.createdAt)),
    db.select().from(petAdoptions).orderBy(desc(petAdoptions.createdAt)),
  ]);
  const townRows = await db.select().from(towns);
  const map = new Map(townRows.map((town) => [town.id, town.name]));
  return [
    ...jobRows.map((row) => ({
      id: row.id,
      section: "jobs" as const,
      title: row.title,
      status: row.status,
      town: row.townId ? map.get(row.townId) ?? "" : "",
      userId: row.userId,
      createdAt: row.createdAt,
      href: `/jobs/${row.slug}`,
    })),
    ...rentalRows.map((row) => ({
      id: row.id,
      section: "rentals" as const,
      title: row.title,
      status: row.status,
      town: row.townId ? map.get(row.townId) ?? "" : "",
      userId: row.userId,
      createdAt: row.createdAt,
      href: `/rentals/${row.slug}`,
    })),
    ...itemRows.map((row) => ({
      id: row.id,
      section: row.isFree ? ("giveaway" as const) : ("preloved" as const),
      title: row.title,
      status: row.status,
      town: row.townId ? map.get(row.townId) ?? "" : "",
      userId: row.userId,
      createdAt: row.createdAt,
      href: `/preloved/${row.slug}`,
    })),
    ...petRows.map((row) => ({
      id: row.id,
      section: "pets" as const,
      title: row.name,
      status: row.status,
      town: row.townId ? map.get(row.townId) ?? "" : "",
      userId: row.userId,
      createdAt: row.createdAt,
      href: `/pet-adoption/${row.slug}`,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function listBlog() {
  const db = await getDb();
  return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlog(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function listPlans() {
  const db = await getDb();
  return db.select().from(subscriptionPlans).orderBy(asc(subscriptionPlans.sort));
}

export async function adminOverview() {
  const db = await getDb();
  const [businessRows, userRows, reviewRows, enquiryRows, listingRows] = await Promise.all([
    db.select().from(businesses),
    db.select().from(user),
    db.select().from(reviews),
    db.select().from(enquiries),
    db.select().from(businesses),
  ]);
  const pendingBusinesses = businessRows.filter((row) => row.registrationStatus === "pending").length;
  const byStatus = {
    active: listingRows.filter((row) => row.listingStatus === "active").length,
    pending: listingRows.filter((row) => row.listingStatus === "pending").length,
    rejected: listingRows.filter((row) => row.listingStatus === "rejected").length,
    suspended: listingRows.filter((row) => row.listingStatus === "suspended").length,
  };
  const recent = [...businessRows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6);
  const cats = await listCategories();
  const townsRows = await listTowns();
  return {
    businesses: businessRows.length,
    users: userRows.length,
    reviews: reviewRows.length,
    enquiries: enquiryRows.length,
    pendingBusinesses,
    byStatus,
    recent,
    categories: cats,
    towns: townsRows,
  };
}

export async function listUsers() {
  const db = await getDb();
  return db.select().from(user).orderBy(desc(user.createdAt));
}

export async function listAllBusinesses() {
  const db = await getDb();
  return businessQuery(db).orderBy(desc(businesses.createdAt));
}

export async function getBusinessById(id: string) {
  const db = await getDb();
  const rows = await businessQuery(db).where(eq(businesses.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listAllEvents() {
  return listEvents("all");
}

export async function getEventById(id: string) {
  const db = await getDb();
  const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listAllReviews() {
  const db = await getDb();
  return db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      rating: reviews.rating,
      body: reviews.body,
      status: reviews.status,
      createdAt: reviews.createdAt,
      businessName: businesses.name,
      businessSlug: businesses.slug,
    })
    .from(reviews)
    .leftJoin(businesses, eq(businesses.id, reviews.businessId))
    .orderBy(desc(reviews.createdAt));
}

export async function listCoupons() {
  const db = await getDb();
  return db.select().from(coupons).orderBy(desc(coupons.createdAt));
}

export async function listAllBlog() {
  const db = await getDb();
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function listSettings() {
  const db = await getDb();
  return db.select().from(settings).orderBy(asc(settings.key));
}

export async function ownerBusinesses(userId: string) {
  const db = await getDb();
  return businessQuery(db).where(eq(businesses.ownerUserId, userId)).orderBy(desc(businesses.createdAt));
}

export async function ownerLeads(userId: string) {
  const db = await getDb();
  return db
    .select({
      id: enquiries.id,
      name: enquiries.name,
      email: enquiries.email,
      phone: enquiries.phone,
      message: enquiries.message,
      status: enquiries.status,
      createdAt: enquiries.createdAt,
      businessName: businesses.name,
    })
    .from(enquiries)
    .innerJoin(businesses, eq(businesses.id, enquiries.businessId))
    .where(eq(businesses.ownerUserId, userId))
    .orderBy(desc(enquiries.createdAt));
}

export async function ownerReviews(userId: string) {
  const db = await getDb();
  return db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      rating: reviews.rating,
      body: reviews.body,
      status: reviews.status,
      createdAt: reviews.createdAt,
      businessName: businesses.name,
    })
    .from(reviews)
    .innerJoin(businesses, eq(businesses.id, reviews.businessId))
    .where(eq(businesses.ownerUserId, userId))
    .orderBy(desc(reviews.createdAt));
}

export async function ownerBilling(userId: string) {
  const db = await getDb();
  return db.select().from(billingRecords).where(eq(billingRecords.userId, userId)).orderBy(desc(billingRecords.createdAt));
}

export async function savedFor(userId: string) {
  const db = await getDb();
  const rows = await businessQuery(db)
    .innerJoin(savedBusinesses, eq(savedBusinesses.businessId, businesses.id))
    .where(eq(savedBusinesses.userId, userId))
    .orderBy(desc(savedBusinesses.createdAt));
  return rows.map((row) => decorate(row));
}

export async function isSaved(userId: string, businessId: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(savedBusinesses)
    .where(and(eq(savedBusinesses.userId, userId), eq(savedBusinesses.businessId, businessId)))
    .limit(1);
  return Boolean(rows[0]);
}

export async function userEnquiries(userId: string) {
  const db = await getDb();
  return db
    .select({
      id: enquiries.id,
      message: enquiries.message,
      status: enquiries.status,
      createdAt: enquiries.createdAt,
      businessName: businesses.name,
      businessSlug: businesses.slug,
    })
    .from(enquiries)
    .leftJoin(businesses, eq(businesses.id, enquiries.businessId))
    .where(eq(enquiries.userId, userId))
    .orderBy(desc(enquiries.createdAt));
}

export async function userNotifications(userId: string) {
  const db = await getDb();
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function listCampaigns() {
  const db = await getDb();
  return db
    .select({
      id: adCampaigns.id,
      title: adCampaigns.title,
      placement: adCampaigns.placement,
      status: adCampaigns.status,
      budgetInr: adCampaigns.budgetInr,
      createdAt: adCampaigns.createdAt,
      businessName: businesses.name,
    })
    .from(adCampaigns)
    .leftJoin(businesses, eq(businesses.id, adCampaigns.businessId))
    .orderBy(desc(adCampaigns.createdAt));
}

export async function listApplicationsForUser(userId: string) {
  const db = await getDb();
  return db
    .select({
      id: jobApplications.id,
      status: jobApplications.status,
      createdAt: jobApplications.createdAt,
      jobTitle: jobs.title,
    })
    .from(jobApplications)
    .leftJoin(jobs, eq(jobs.id, jobApplications.jobId))
    .where(eq(jobApplications.userId, userId));
}

export async function sitemapEntries() {
  const db = await getDb();
  const [biz, ev, jobRows, rentalRows, itemRows, petRows, posts] = await Promise.all([
    db.select({ slug: businesses.slug, updatedAt: businesses.updatedAt }).from(businesses).where(eq(businesses.listingStatus, "active")),
    db.select({ slug: events.slug, updatedAt: events.updatedAt }).from(events).where(eq(events.status, "published")),
    db.select({ slug: jobs.slug }).from(jobs).where(eq(jobs.status, "open")),
    db.select({ slug: rentals.slug }).from(rentals).where(eq(rentals.status, "available")),
    db.select({ slug: prelovedItems.slug }).from(prelovedItems).where(eq(prelovedItems.status, "available")),
    db.select({ slug: petAdoptions.slug }).from(petAdoptions).where(eq(petAdoptions.status, "available")),
    db.select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.status, "published")),
  ]);
  return { biz, ev, jobRows, rentalRows, itemRows, petRows, posts };
}
