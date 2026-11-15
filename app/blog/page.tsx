import Link from "next/link";
import { listBlog } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { formatWhen } from "@/lib/utils";

export function generateMetadata() {
  return pageMeta({
    title: "Blog — Goa guides and local tips",
    description: "Stories, guides and practical notes for living and working in Goa.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const posts = await listBlog().catch(() => []);
  return (
    <div className="gp-wrap py-10">
      <h1 className="font-display text-4xl font-semibold">OmyGoa Blog</h1>
      <p className="mt-2 text-sm text-[var(--gp-ink-2)]">Guides and local notes. Fresh stories, written for this rebuild.</p>
      {posts.length === 0 ? <p className="mt-8">Fresh stories are on the way.</p> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="goan-card p-5">
            <p className="text-xs text-[var(--gp-ink-2)]">{formatWhen(post.publishedAt)}</p>
            <h2 className="mt-2 font-display text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-[var(--gp-ink-2)]">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
