import type { Metadata } from "next";
import { siteUrl } from "@/lib/utils";

export function pageMeta(input: { title: string; description: string; path: string }): Metadata {
  const url = new URL(input.path || "/", siteUrl()).toString();
  const image = new URL(`/api/og?title=${encodeURIComponent(input.title)}`, siteUrl()).toString();
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: "OmyGoa",
      type: "website",
      locale: "en_IN",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

export const privateMeta: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};
