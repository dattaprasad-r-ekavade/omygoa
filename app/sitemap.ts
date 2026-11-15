import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticPaths = [
    "",
    "/explore",
    "/events",
    "/jobs",
    "/rentals",
    "/preloved",
    "/pet-adoption",
    "/services",
    "/blog",
    "/list-your-business",
    "/login",
    "/signup",
    "/privacy",
  ];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
  try {
    const data = await sitemapEntries();
    for (const row of data.biz) entries.push({ url: `${base}/business/${row.slug}`, lastModified: row.updatedAt });
    for (const row of data.ev) entries.push({ url: `${base}/events/${row.slug}`, lastModified: row.updatedAt });
    for (const row of data.jobRows) entries.push({ url: `${base}/jobs/${row.slug}` });
    for (const row of data.rentalRows) entries.push({ url: `${base}/rentals/${row.slug}` });
    for (const row of data.itemRows) entries.push({ url: `${base}/preloved/${row.slug}` });
    for (const row of data.petRows) entries.push({ url: `${base}/pet-adoption/${row.slug}` });
    for (const row of data.posts) entries.push({ url: `${base}/blog/${row.slug}`, lastModified: row.publishedAt ?? now });
  } catch {
    return entries;
  }
  return entries;
}
