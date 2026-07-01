import site from "@/data/site.json";

export const baseUrl = site.baseUrl.replace(/\/$/, "");

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: baseUrl,
    logo: `${baseUrl}${site.logo}`,
    description: site.description,
    areaServed: site.areaServed.map((a) => ({ "@type": "Place", name: a })),
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: baseUrl,
    description: site.description,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/guides?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };
}

export function articleSchema(p: {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    author: { "@type": "Organization", name: p.author },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${baseUrl}${site.logo}` },
    },
    datePublished: p.publishedAt,
    dateModified: p.updatedAt || p.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/guides/${p.slug}` },
    articleSection: p.category,
    inLanguage: "en-US",
  };
}

export function localBusinessSchema(b: {
  slug: string;
  name: string;
  location: string;
  ratingValue: number;
  reviewCount: number;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/directory/${b.slug}`,
    name: b.name,
    address: { "@type": "PostalAddress", addressLocality: b.location, addressRegion: "FL", addressCountry: "US" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: b.ratingValue,
      reviewCount: b.reviewCount,
    },
    knowsAbout: b.tags,
  };
}
