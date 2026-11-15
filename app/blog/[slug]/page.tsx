import { notFound } from "next/navigation";
import { PostDetail } from "@/components/site/post-list";
import { getBlog } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatWhen } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlog(slug).catch(() => null);
  return pageMeta({
    title: post?.title ?? "Story",
    description: post?.excerpt || "A story from OmyGoa.",
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlog(slug).catch(() => null);
  if (!post || post.status !== "published") notFound();
  return (
    <PostDetail backHref="/blog" backLabel="Blog" kicker={post.authorName} title={post.title} meta={formatWhen(post.publishedAt)}>
      {post.body.split(/\n\n+/).map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="whitespace-pre-wrap">
          {paragraph}
        </p>
      ))}
    </PostDetail>
  );
}
