import type { MetadataRoute } from "next";
import posts from "@/data/posts.json";
import site from "@/data/site.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.baseUrl.replace(/\/$/, "");
  const now = new Date();

  const toolPaths = [
    "dock-cost",
    "seawall-cost",
    "boat-lift-sizer",
    "permit-lookup",
    "dock-roi",
    "flood-zone",
    "storm-prep",
    "material-picker",
  ];

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/newsletter`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/sitemap-page`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/builder-agreement`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...toolPaths.map((p) => ({
      url: `${base}/tools/${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];

  const postUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/guides/${p.slug}`,
    lastModified: new Date(p.updatedAt || p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...postUrls];
}
