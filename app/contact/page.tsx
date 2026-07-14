import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema, baseUrl } from "@/lib/jsonld";
import site from "@/data/site.json";

const description =
  "Reach the MyDockGuide team. Homeowner questions, builder partnerships, press inquiries, or feedback.";

export const metadata: Metadata = {
  title: "Contact MyDockGuide",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact MyDockGuide", description, url: "/contact", type: "website" },
  twitter: { card: "summary_large_image", title: "Contact MyDockGuide", description },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${baseUrl}/contact#contactpage`,
  url: `${baseUrl}/contact`,
  name: "Contact MyDockGuide",
  description,
  mainEntity: {
    "@type": "Organization",
    name: site.name,
    email: site.contact?.email,
  },
};

type ContactBucket = {
  eyebrow: string;
  title: string;
  blurb: string;
  email: string;
  responseTime: string;
};

const buckets: ContactBucket[] = [
  {
    eyebrow: "Homeowner",
    title: "I have a dock question",
    blurb: "Working on a Tampa Bay dock, seawall, or boat lift and stuck on something specific? Ask us. We answer every message from a real homeowner.",
    email: site.contact?.email ?? "hello@mydockguide.com",
    responseTime: "Within 1 business day",
  },
  {
    eyebrow: "Builders",
    title: "I want to join the network",
    blurb: "Licensed Tampa Bay marine contractor interested in receiving matched leads? We onboard a limited number of new builders each quarter.",
    email: `${site.contact?.email?.split("@")[0] ?? "hello"}@${site.contact?.email?.split("@")[1] ?? "mydockguide.com"}`,
    responseTime: "Within 3 business days",
  },
  {
    eyebrow: "Press & partnerships",
    title: "I'm a journalist, realtor, or partner",
    blurb: "Media inquiries, realtor co-branded PDF program, insurance broker partnerships, or public data requests. We reply to press within 24 hours.",
    email: site.contact?.email ?? "hello@mydockguide.com",
    responseTime: "24 hours for press",
  },
];

export default function ContactPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/contact",
            title: "Contact MyDockGuide",
            description,
            speakableSelectors: [".hero h1", ".hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
          ]),
          contactPageSchema,
        ]}
      />

      <section className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap" style={{ padding: "72px 28px 100px" }}>
          <span className="eyebrow">Say hello</span>
          <h1 style={{ fontSize: "2.8rem" }}>Get in touch.</h1>
          <p className="lede" style={{ maxWidth: 620 }}>
            Every email hits a real inbox. Pick the bucket that matches your question and we&apos;ll be back to you fast.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="contact-grid">
            {buckets.map((b) => (
              <div key={b.title} className="contact-card">
                <span className="contact-eyebrow">{b.eyebrow.toUpperCase()}</span>
                <h3>{b.title}</h3>
                <p>{b.blurb}</p>
                <a href={`mailto:${b.email}`} className="btn btn-ocean" style={{ marginTop: 14 }}>
                  Email us →
                </a>
                <small className="contact-response">{b.responseTime}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap" style={{ maxWidth: 720, textAlign: "center" }}>
          <h2 style={{ color: "var(--ocean)", fontSize: "1.8rem", marginBottom: 14 }}>Prefer to just start?</h2>
          <p style={{ color: "var(--ink-soft)", marginBottom: 22 }}>
            If you already know you want quotes for a dock, seawall, or boat lift project, skip the email and use our
            90-second matching form.
          </p>
          <a href="/quote" className="btn btn-coral">Get 3 free quotes →</a>
        </div>
      </section>
    </main>
  );
}
