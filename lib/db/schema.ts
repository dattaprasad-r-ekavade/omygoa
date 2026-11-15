import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" });

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role").notNull().default("customer"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: integer("phone_number_verified", { mode: "boolean" }).default(false),
});

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const towns = sqliteTable(
  "towns",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    region: text("region").notNull(),
    lat: text("lat"),
    lng: text("lng"),
  },
  (table) => [uniqueIndex("towns_slug_idx").on(table.slug)],
);

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    groupName: text("group_name").notNull().default("directory"),
    sort: integer("sort").notNull().default(0),
  },
  (table) => [uniqueIndex("categories_slug_idx").on(table.slug)],
);

export const businesses = sqliteTable(
  "businesses",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").references(() => user.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    tagline: text("tagline"),
    description: text("description").notNull().default(""),
    categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
    townId: text("town_id").references(() => towns.id, { onDelete: "set null" }),
    address: text("address"),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    email: text("email"),
    website: text("website"),
    hoursJson: text("hours_json"),
    lat: text("lat"),
    lng: text("lng"),
    plan: text("plan").notNull().default("free"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    verified: integer("verified", { mode: "boolean" }).notNull().default(false),
    registrationStatus: text("registration_status").notNull().default("pending"),
    listingStatus: text("listing_status").notNull().default("pending"),
    businessType: text("business_type").notNull().default("services"),
    womanOwned: integer("woman_owned", { mode: "boolean" }).notNull().default(false),
    localGoan: integer("local_goan", { mode: "boolean" }).notNull().default(false),
    wheelchairAccessible: integer("wheelchair_accessible", { mode: "boolean" }).notNull().default(false),
    petFriendly: integer("pet_friendly", { mode: "boolean" }).notNull().default(false),
    familyFriendly: integer("family_friendly", { mode: "boolean" }).notNull().default(false),
    coverUrl: text("cover_url"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("businesses_slug_idx").on(table.slug),
    index("businesses_town_idx").on(table.townId),
    index("businesses_category_idx").on(table.categoryId),
    index("businesses_owner_idx").on(table.ownerUserId),
  ],
);

export const businessPhotos = sqliteTable("business_photos", {
  id: text("id").primaryKey(),
  businessId: text("business_id")
    .notNull()
    .references(() => businesses.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  sort: integer("sort").notNull().default(0),
});

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    authorName: text("author_name").notNull(),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [index("reviews_business_idx").on(table.businessId)],
);

export const enquiries = sqliteTable(
  "enquiries",
  {
    id: text("id").primaryKey(),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [index("enquiries_business_idx").on(table.businessId), index("enquiries_user_idx").on(table.userId)],
);

export const events = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    organizerUserId: text("organizer_user_id").references(() => user.id, { onDelete: "set null" }),
    businessId: text("business_id").references(() => businesses.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    category: text("category"),
    townId: text("town_id").references(() => towns.id, { onDelete: "set null" }),
    venue: text("venue"),
    address: text("address"),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at"),
    coverUrl: text("cover_url"),
    priceLabel: text("price_label"),
    status: text("status").notNull().default("draft"),
    qrToken: text("qr_token").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [uniqueIndex("events_slug_idx").on(table.slug), index("events_status_idx").on(table.status)],
);

export const jobs = sqliteTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    businessId: text("business_id").references(() => businesses.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    townId: text("town_id").references(() => towns.id, { onDelete: "set null" }),
    category: text("category"),
    workplace: text("workplace").notNull().default("on-site"),
    jobType: text("job_type").notNull().default("full-time"),
    salaryLabel: text("salary_label"),
    status: text("status").notNull().default("open"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("jobs_slug_idx").on(table.slug)],
);

export const jobApplications = sqliteTable("job_applications", {
  id: text("id").primaryKey(),
  jobId: text("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  note: text("note"),
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at").notNull(),
});

export const rentals = sqliteTable(
  "rentals",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    townId: text("town_id").references(() => towns.id, { onDelete: "set null" }),
    kind: text("kind").notNull().default("other"),
    priceLabel: text("price_label"),
    furnished: integer("furnished", { mode: "boolean" }).notNull().default(false),
    status: text("status").notNull().default("available"),
    coverUrl: text("cover_url"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("rentals_slug_idx").on(table.slug)],
);

export const prelovedItems = sqliteTable(
  "preloved_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    townId: text("town_id").references(() => towns.id, { onDelete: "set null" }),
    category: text("category"),
    priceLabel: text("price_label"),
    isFree: integer("is_free", { mode: "boolean" }).notNull().default(false),
    status: text("status").notNull().default("available"),
    coverUrl: text("cover_url"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("preloved_slug_idx").on(table.slug)],
);

export const petAdoptions = sqliteTable(
  "pet_adoptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    species: text("species").notNull().default("dog"),
    breed: text("breed"),
    ageLabel: text("age_label"),
    sex: text("sex"),
    vaccinated: text("vaccinated").notNull().default("unknown"),
    description: text("description").notNull().default(""),
    personality: text("personality"),
    townId: text("town_id").references(() => towns.id, { onDelete: "set null" }),
    status: text("status").notNull().default("available"),
    coverUrl: text("cover_url"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("pets_slug_idx").on(table.slug)],
);

export const services = sqliteTable(
  "services",
  {
    id: text("id").primaryKey(),
    businessId: text("business_id").references(() => businesses.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    townId: text("town_id").references(() => towns.id, { onDelete: "set null" }),
    category: text("category"),
    priceFrom: integer("price_from"),
    phone: text("phone"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("services_slug_idx").on(table.slug)],
);

export const blogPosts = sqliteTable(
  "blog_posts",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    body: text("body").notNull().default(""),
    authorName: text("author_name").notNull().default("OmyGoa"),
    status: text("status").notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("blog_slug_idx").on(table.slug)],
);

export const coupons = sqliteTable(
  "coupons",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    description: text("description").notNull().default(""),
    percentOff: integer("percent_off"),
    amountOffInr: integer("amount_off_inr"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("coupons_code_idx").on(table.code)],
);

export const subscriptionPlans = sqliteTable(
  "subscription_plans",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    priceInr: integer("price_inr").notNull(),
    interval: text("interval").notNull().default("year"),
    blurb: text("blurb").notNull().default(""),
    featuresJson: text("features_json").notNull().default("[]"),
    highlighted: integer("highlighted", { mode: "boolean" }).notNull().default(false),
    sort: integer("sort").notNull().default(0),
  },
  (table) => [uniqueIndex("plans_slug_idx").on(table.slug)],
);

export const billingRecords = sqliteTable("billing_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  businessId: text("business_id").references(() => businesses.id, { onDelete: "set null" }),
  planId: text("plan_id").references(() => subscriptionPlans.id, { onDelete: "set null" }),
  amountInr: integer("amount_inr").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("created"),
  provider: text("provider").notNull().default("razorpay"),
  providerRef: text("provider_ref"),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at").notNull(),
});

export const adCampaigns = sqliteTable("ad_campaigns", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  businessId: text("business_id").references(() => businesses.id, { onDelete: "set null" }),
  placement: text("placement").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("pending"),
  budgetInr: integer("budget_inr").notNull().default(0),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").notNull(),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  kind: text("kind").notNull().default("info"),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
});

export const savedBusinesses = sqliteTable(
  "saved_businesses",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull(),
  },
  (table) => [uniqueIndex("saved_business_idx").on(table.userId, table.businessId)],
);

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export const schema = {
  user,
  session,
  account,
  verification,
  towns,
  categories,
  businesses,
  businessPhotos,
  reviews,
  enquiries,
  events,
  jobs,
  jobApplications,
  rentals,
  prelovedItems,
  petAdoptions,
  services,
  blogPosts,
  coupons,
  subscriptionPlans,
  billingRecords,
  adCampaigns,
  notifications,
  savedBusinesses,
  settings,
};
