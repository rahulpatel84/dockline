import site from "@/data/site.json";

export const baseUrl = site.baseUrl.replace(/\/$/, "");

const sameAs = Object.values(site.social ?? {}).filter(Boolean) as string[];

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    name: site.name,
    alternateName: site.shortName,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}${site.logo}`,
      width: 512,
      height: 512,
    },
    image: `${baseUrl}${site.ogImage}`,
    description: site.description,
    foundingDate: site.founded,
    areaServed: site.areaServed.map((a) => ({ "@type": "Place", name: a })),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact?.addressLocality,
      addressRegion: site.contact?.addressRegion,
      postalCode: site.contact?.postalCode,
      addressCountry: site.contact?.addressCountry,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.contact?.email,
        areaServed: "US",
        availableLanguage: ["English"],
      },
    ],
    sameAs,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    name: site.name,
    alternateName: site.shortName,
    url: baseUrl,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": `${baseUrl}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/guides?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webPageSchema(p: {
  path: string;
  title: string;
  description: string;
  breadcrumb?: { name: string; href: string }[];
  speakableSelectors?: string[];
}) {
  const url = `${baseUrl}${p.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: p.title,
    description: p.description,
    inLanguage: "en-US",
    isPartOf: { "@id": `${baseUrl}#website` },
    about: { "@id": `${baseUrl}#organization` },
    ...(p.speakableSelectors?.length
      ? {
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: p.speakableSelectors,
          },
        }
      : {}),
    ...(p.breadcrumb ? { breadcrumb: breadcrumbSchema(p.breadcrumb) } : {}),
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
  readTime?: string;
  body?: unknown[];
}) {
  const url = `${baseUrl}/guides/${p.slug}`;
  const wordCount = estimateWordCount(p.body);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: p.title,
    description: p.description,
    image: [`${baseUrl}${site.ogImage}`],
    author: {
      "@type": "Organization",
      name: p.author,
      url: baseUrl,
    },
    publisher: { "@id": `${baseUrl}#organization` },
    datePublished: p.publishedAt,
    dateModified: p.updatedAt || p.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: p.category,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    ...(wordCount ? { wordCount } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article h1", ".article > p:first-of-type"],
    },
  };
}

function estimateWordCount(body?: unknown[]): number | null {
  if (!Array.isArray(body)) return null;
  let count = 0;
  for (const block of body) {
    if (!block || typeof block !== "object") continue;
    const b = block as Record<string, unknown>;
    const text = [b.html, b.text, b.heading, b.body].filter((x): x is string => typeof x === "string").join(" ");
    if (text) count += text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    if (Array.isArray(b.items)) {
      for (const it of b.items) {
        if (typeof it === "string") count += it.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return count || null;
}

export function localBusinessSchema(b: {
  slug: string;
  name: string;
  location: string;
  ratingValue: number;
  reviewCount: number;
  tags: string[];
  phone?: string;
  email?: string;
  website?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/directory/${b.slug}#business`,
    name: b.name,
    url: `${baseUrl}/directory/${b.slug}`,
    telephone: b.phone,
    email: b.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: b.location,
      addressRegion: "FL",
      addressCountry: "US",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: b.ratingValue,
      reviewCount: b.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    knowsAbout: b.tags,
    priceRange: "$$",
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function itemListSchema(items: { url: string; name: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
      name: item.name,
    })),
  };
}

export function reviewsFromTestimonials(
  testimonials: { author: string; quote: string; neighborhood?: string }[],
  businessName: string,
) {
  return testimonials.map((t) => ({
    "@type": "Review",
    reviewBody: t.quote,
    author: { "@type": "Person", name: t.author },
    itemReviewed: { "@type": "LocalBusiness", name: businessName },
    reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
  }));
}
