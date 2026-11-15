import { PostList } from "@/components/site/post-list";
import { listJobs } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export function generateMetadata() {
  return pageMeta({
    title: "Jobs",
    description: "Shifts, seasonal work and full-time roles with businesses across Goa.",
    path: "/jobs",
  });
}

export default async function JobsPage() {
  const jobs = await listJobs().catch(() => []);
  return (
    <PostList
      title="Jobs"
      intro="Explore local opportunities with cafes, stays, studios and tours."
      items={jobs.map((job) => ({
        href: `/jobs/${job.slug}`,
        title: job.title,
        meta: `${job.town?.name ?? "Goa"} · ${job.jobType} · ${job.workplace}${job.salaryLabel ? ` · ${job.salaryLabel}` : ""}`,
        body: job.description,
        tone: "tone-lilac",
      }))}
    />
  );
}
