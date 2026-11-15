import { notFound } from "next/navigation";
import { PostDetail } from "@/components/site/post-list";
import { getJob } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug).catch(() => null);
  return pageMeta({
    title: job?.title ?? "Job",
    description: job?.description.slice(0, 160) || "A job listing in Goa.",
    path: `/jobs/${slug}`,
  });
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug).catch(() => null);
  if (!job) notFound();
  return (
    <PostDetail backHref="/jobs" backLabel="Jobs" kicker={job.category ?? "Job"} title={job.title} meta={`${job.town?.name ?? "Goa"} · ${job.jobType} · ${job.workplace}`}>
      <p className="whitespace-pre-wrap">{job.description}</p>
      {job.salaryLabel ? <p className="font-semibold">{job.salaryLabel}</p> : null}
    </PostDetail>
  );
}
