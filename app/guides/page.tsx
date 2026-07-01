import type { Metadata } from "next";
import posts from "@/data/posts.json";
import site from "@/data/site.json";
import { GuidesFilter } from "@/components/GuidesFilter";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, baseUrl } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Dock & Seawall Guides for Tampa Bay Owners",
  description:
    "Plain-English guides on dock permits, costs, materials, lifespan, and hiring for Tampa Bay waterfront homeowners — everything you need before you build.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Dock & Seawall Guides for Tampa Bay Owners",
    description:
      "Permits, costs, materials, lifespan, hiring — the library Tampa Bay waterfront owners read before they build.",
    url: "/guides",
    type: "website",
  },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${site.name} Guides`,
  url: `${baseUrl}/guides`,
  description:
    "Permits, costs, materials, lifespan, and hiring guides for Tampa Bay dock and seawall owners.",
  isPartOf: { "@type": "WebSite", name: site.name, url: baseUrl },
  hasPart: posts.map((p) => ({
    "@type": "Article",
    headline: p.title,
    url: `${baseUrl}/guides/${p.slug}`,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt || p.publishedAt,
  })),
};

export default function GuidesPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          collectionSchema,
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Guides", href: "/guides" },
          ]),
        ]}
      />
      <section className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap" style={{ padding: "56px 28px 90px" }}>
          <span className="eyebrow">The {site.shortName} Guides</span>
          <h1 style={{ fontSize: "2.8rem" }}>Everything before you build</h1>
          <p className="lede">
            Permits, costs, materials, lifespan, hiring — the awareness library that does the ranking and the teaching.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z"
            fill="#faf5ec"
          />
        </svg>
      </section>
      <section className="block" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <GuidesFilter posts={posts as Parameters<typeof GuidesFilter>[0]["posts"]} />
        </div>
      </section>
    </main>
  );
}
