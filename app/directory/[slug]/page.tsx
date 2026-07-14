import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import builders from "@/data/builders.json";
import site from "@/data/site.json";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, baseUrl, faqSchema, reviewsFromTestimonials, webPageSchema } from "@/lib/jsonld";

type Builder = (typeof builders)[number];

export const dynamicParams = false;

export function generateStaticParams() {
  return builders.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = builders.find((x) => x.slug === slug);
  if (!b) return { title: "Builder not found" };
  const title = `${b.name} — Tampa Bay Dock Builder`;
  const description = b.tagline ?? `${b.name} is a licensed Tampa Bay dock builder serving ${b.location}.`;
  return {
    title,
    description,
    keywords: [b.name, "Tampa dock builder", b.location, ...(b.tags ?? [])],
    alternates: { canonical: `/directory/${b.slug}` },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      title,
      description,
      url: `/directory/${b.slug}`,
      type: "profile",
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: b.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [site.ogImage],
    },
  };
}

export default async function BuilderProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const builder = builders.find((b) => b.slug === slug) as Builder | undefined;
  if (!builder) notFound();
  const b = builder as Required<Builder>;

  const related = builders.filter((x) => x.slug !== b.slug).slice(0, 3);

  const url = `${baseUrl}/directory/${b.slug}`;
  const reviews = b.testimonials ? reviewsFromTestimonials(b.testimonials, b.name) : [];
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#business`,
    name: b.name,
    description: b.about,
    url,
    telephone: b.phone,
    email: b.email,
    image: `${baseUrl}/og.png`,
    priceRange: "$$",
    address: { "@type": "PostalAddress", streetAddress: b.address, addressRegion: "FL", addressCountry: "US" },
    areaServed: b.serviceAreas?.map((a) => ({ "@type": "Place", name: a })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: b.ratingValue,
      reviewCount: b.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    knowsAbout: b.tags,
    foundingDate: b.established ? String(b.established) : undefined,
    hasOfferCatalog: b.services
      ? {
          "@type": "OfferCatalog",
          name: `${b.name} services`,
          itemListElement: b.services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, description: s.desc },
          })),
        }
      : undefined,
    ...(reviews.length ? { review: reviews } : {}),
  };

  const yearsActive = b.established ? new Date().getFullYear() - b.established : null;

  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: `/directory/${b.slug}`,
            title: `${b.name} — Tampa Bay Dock Builder`,
            description: b.tagline ?? b.about,
            speakableSelectors: [".profile-hero h1", ".profile-tagline"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Find a Builder", href: "/directory" },
            { name: b.name, href: `/directory/${b.slug}` },
          ]),
          profileSchema,
          ...(b.faqs && b.faqs.length ? [faqSchema(b.faqs)] : []),
        ]}
      />

      <section className="profile-hero">
        <div className="wrap">
          <div className="crumbs profile-crumbs">
            <Link href="/">Home</Link> · <Link href="/directory">Find a Builder</Link> · <span>{b.name}</span>
          </div>

          <div className="profile-head">
            <div className={`profile-avatar${b.featured ? " is-feat" : ""}`}>{b.initials}</div>
            <div className="profile-id">
              <div className="profile-badges">
                {b.featured && <span className="badge badge-gold">★ Featured</span>}
                <span className="badge badge-verified">Licensed · Verified</span>
                {b.insured && <span className="badge badge-soft">Insured</span>}
              </div>
              <h1>{b.name}</h1>
              <p className="profile-tagline">{b.tagline}</p>
              <div className="profile-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
                    <circle cx="12" cy="9" r="2.6" />
                  </svg>
                  {b.location}
                </span>
                <span>
                  <span className="stars" aria-hidden="true">
                    {b.stars}
                  </span>
                  <b>{b.ratingValue.toFixed(1)}</b> ({b.reviewCount} reviews)
                </span>
                {yearsActive !== null && (
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" strokeLinecap="round" />
                    </svg>
                    {yearsActive}+ years in business
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z"
            fill="#faf5ec"
          />
        </svg>
      </section>

      <section className="block profile-body">
        <div className="wrap profile-grid">
          <div className="profile-main">
            <article className="prof-card">
              <h2>About {b.name}</h2>
              <p>{b.about}</p>
              <div className="prof-tagrow">
                {b.tags.map((t) => (
                  <span key={t} className="prof-tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>

            <article className="prof-card">
              <h2>Services</h2>
              <div className="prof-services">
                {b.services?.map((s) => (
                  <div key={s.name} className="prof-service">
                    <div className="prof-service-ic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3>{s.name}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {b.projects && b.projects.length > 0 && (
              <article className="prof-card">
                <h2>Recent projects</h2>
                <div className="prof-projects">
                  {b.projects.map((p) => (
                    <div key={p.name} className="prof-project">
                      <div className="prof-project-year">{p.year}</div>
                      <div className="prof-project-body">
                        <h3>{p.name}</h3>
                        <p>{p.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}

            {b.testimonials && b.testimonials.length > 0 && (
              <article className="prof-card">
                <h2>What clients say</h2>
                <div className="prof-quotes">
                  {b.testimonials.map((t) => (
                    <blockquote key={t.author} className="prof-quote">
                      <p>“{t.quote}”</p>
                      <footer>
                        — {t.author}, <span>{t.neighborhood}</span>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </article>
            )}

            {b.faqs && b.faqs.length > 0 && (
              <article className="prof-card">
                <h2>FAQs</h2>
                <div className="prof-faqs">
                  {b.faqs.map((f) => (
                    <details key={f.q} className="prof-faq">
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </article>
            )}
          </div>

          <aside className="profile-side">
            <div className="prof-cta-card">
              <h3>Get a quote from {b.name.split(" ")[0]}</h3>
              <p>Free, no-obligation. We&apos;ll send your project details directly.</p>
              <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                Request a quote →
              </Link>
              <Link
                href="/quote"
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
              >
                Get matched to 3 builders
              </Link>
            </div>

            <div className="prof-side-card">
              <h4>Contact</h4>
              <ul className="prof-contact">
                <li>
                  <span className="lbl">Phone</span>
                  <a href={`tel:${b.phone?.replace(/[^\d+]/g, "")}`}>{b.phone}</a>
                </li>
                <li>
                  <span className="lbl">Email</span>
                  <a href={`mailto:${b.email}`}>{b.email}</a>
                </li>
                <li>
                  <span className="lbl">Website</span>
                  <a href={b.website} target="_blank" rel="noopener noreferrer">
                    {b.website?.replace(/^https?:\/\//, "")}
                  </a>
                </li>
                <li>
                  <span className="lbl">Address</span>
                  <span>{b.address}</span>
                </li>
                <li>
                  <span className="lbl">Hours</span>
                  <span>{b.hours}</span>
                </li>
              </ul>
            </div>

            <div className="prof-side-card">
              <h4>Credentials</h4>
              <ul className="prof-contact">
                <li>
                  <span className="lbl">License</span>
                  <span>{b.license}</span>
                </li>
                <li>
                  <span className="lbl">Established</span>
                  <span>{b.established}</span>
                </li>
                <li>
                  <span className="lbl">Insurance</span>
                  <span>{b.insured ? "General liability + workers' comp" : "Contact for details"}</span>
                </li>
              </ul>
            </div>

            {b.serviceAreas && b.serviceAreas.length > 0 && (
              <div className="prof-side-card">
                <h4>Service areas</h4>
                <div className="prof-areas">
                  {b.serviceAreas.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="block prof-related-section">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 28 }}>
            <span className="kick">Also worth a look</span>
            <h2>Other Tampa Bay builders</h2>
          </div>
          <div className="prof-related">
            {related.map((r) => (
              <Link key={r.slug} href={`/directory/${r.slug}`} className="prof-related-card">
                <div className="prof-related-avatar">{r.initials}</div>
                <div>
                  <h4>{r.name}</h4>
                  <span className="prof-related-loc">{r.location}</span>
                  <span className="prof-related-rating">
                    {r.stars} {r.ratingValue.toFixed(1)} · {r.reviewCount} reviews
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
