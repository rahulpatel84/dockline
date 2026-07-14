import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";
import site from "@/data/site.json";

const description =
  "MyDockGuide is the independent, plain-English resource for Tampa Bay waterfront owners. Free guides, real cost data, and honest builder matching.";

export const metadata: Metadata = {
  title: "About MyDockGuide",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About MyDockGuide", description, url: "/about", type: "website" },
  twitter: { card: "summary_large_image", title: "About MyDockGuide", description },
};

export default function AboutPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/about",
            title: "About MyDockGuide",
            description,
            speakableSelectors: [".hero h1", ".hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ]),
        ]}
      />

      <section className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap" style={{ padding: "72px 28px 100px" }}>
          <span className="eyebrow">Our mission</span>
          <h1 style={{ fontSize: "2.9rem" }}>Honest answers for waterfront owners.</h1>
          <p className="lede" style={{ maxWidth: 640 }}>
            We started MyDockGuide because Tampa Bay waterfront owners deserved better than sales-pitch websites and
            aggregator directories. Plain-English guides. Real numbers. Vetted local builders. That&apos;s it.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2 style={{ fontSize: "2rem", color: "var(--ocean)", marginBottom: 16 }}>Why we exist</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--ink-soft)", marginBottom: 20, lineHeight: 1.7 }}>
            Building or repairing a dock in Tampa Bay is one of the most expensive and confusing decisions a
            homeowner makes. Between four permit agencies, twelve material choices, a decade&apos;s worth of storm
            damage possibilities, and a marine contracting industry with wildly varying quality, most owners are
            flying blind.
          </p>
          <p style={{ fontSize: "1.1rem", color: "var(--ink-soft)", marginBottom: 20, lineHeight: 1.7 }}>
            We fix that. We track real Tampa Bay dock costs across hundreds of projects a year, we interview local
            marine contractors and realtors, we walk permit reviewers through their process, and we translate all of
            it into guides a homeowner can actually use. When you&apos;re ready to build, we match you with two or
            three vetted licensed local contractors we would trust with our own waterfront.
          </p>

          <h2 style={{ fontSize: "2rem", color: "var(--ocean)", margin: "40px 0 16px" }}>What we believe</h2>
          <ul style={{ fontSize: "1.05rem", color: "var(--ink)", lineHeight: 1.8, paddingLeft: 22 }}>
            <li><b>Waterfront owners deserve honest numbers.</b> Not brochure prices. Real 2026 Tampa Bay cost data.</li>
            <li><b>Every dock touches four agencies.</b> That&apos;s not a reason to panic. It&apos;s a reason to plan.</li>
            <li><b>The cheapest quote is almost never the cheapest dock.</b> We show you why.</li>
            <li><b>Local knowledge beats national databases.</b> Aggregators cannot compete with a resource focused on Tampa Bay.</li>
            <li><b>Free forever.</b> Guides, tools, and matching stay free for homeowners. Builders pay for qualified leads. That is the whole business model.</li>
          </ul>

          <h2 style={{ fontSize: "2rem", color: "var(--ocean)", margin: "40px 0 16px" }}>Who we are</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--ink-soft)", marginBottom: 20, lineHeight: 1.7 }}>
            MyDockGuide is a small, independent team based in the Tampa Bay area. We combine field-level knowledge
            of marine construction with modern editorial standards. Every guide is researched against real projects,
            real quotes, and real interviews. We don&apos;t take builder money for editorial coverage, and we don&apos;t
            recommend anyone we haven&apos;t independently vetted.
          </p>

          <h2 style={{ fontSize: "2rem", color: "var(--ocean)", margin: "40px 0 16px" }}>How the matching works</h2>
          <p style={{ fontSize: "1.1rem", color: "var(--ink-soft)", marginBottom: 20, lineHeight: 1.7 }}>
            When you request quotes, we hand your project details to two or three licensed marine contractors we
            have already checked against licensing, insurance, and reference standards. Every builder in our network
            has been reviewed. Builders pay us a per-lead fee only when we match a project to them. Homeowners never
            pay. We do not sell your information to anyone else.
          </p>

          <div style={{ background: "var(--sand-2)", padding: 30, borderRadius: 16, marginTop: 40, textAlign: "center" }}>
            <h3 style={{ color: "var(--ocean)", fontSize: "1.4rem", marginBottom: 10 }}>Ready to plan your project?</h3>
            <p style={{ marginBottom: 18, color: "var(--ink-soft)" }}>
              Start with the free Dock Cost Calculator or get matched to vetted local builders.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/tools/dock-cost" className="btn btn-ocean">Open cost calculator →</Link>
              <Link href="/quote" className="btn btn-coral">Get 3 free quotes →</Link>
            </div>
          </div>

          <h2 style={{ fontSize: "2rem", color: "var(--ocean)", margin: "40px 0 16px" }}>Get in touch</h2>
          <p style={{ fontSize: "1.05rem", color: "var(--ink-soft)", lineHeight: 1.7 }}>
            Questions, feedback, partnership ideas, or press inquiries: reach out at{" "}
            <a href={`mailto:${site.contact?.email}`} style={{ color: "var(--teal)", fontWeight: 600 }}>
              {site.contact?.email}
            </a>
            {" "}or use our <Link href="/contact" style={{ color: "var(--teal)", fontWeight: 600 }}>contact page</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
