import type { MetadataRoute } from "next";
import posts from "@/data/posts.json";
import builders from "@/data/builders.json";
import site from "@/data/site.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.baseUrl.replace(/\/$/, "");
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/guides/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const builderUrls: MetadataRoute.Sitemap = builders.map((b) => ({
    url: `${base}/directory/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...postUrls, ...builderUrls];
}
