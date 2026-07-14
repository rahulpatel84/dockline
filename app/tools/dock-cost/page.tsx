import type { Metadata } from "next";
import Link from "next/link";
import { DockCostCalculator } from "@/components/DockCostCalculator";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Estimate what a dock actually costs in Tampa Bay — decking, pilings, permits, and boat lift included. Free interactive calculator built on 2026 local project data.";

export const metadata: Metadata = {
  title: "Dock Cost Calculator (Tampa Bay, 2026)",
  description,
  keywords: [
    "dock cost calculator Tampa",
    "how much does a dock cost Tampa Bay",
    "Tampa dock estimate tool",
    "boat lift cost calculator Florida",
    "composite dock cost calculator",
    "dock cost per foot Florida",
  ],
  alternates: { canonical: "/tools/dock-cost" },
  openGraph: {
    title: "Dock Cost Calculator (Tampa Bay, 2026)",
    description,
    url: "/tools/dock-cost",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dock Cost Calculator (Tampa Bay, 2026)",
    description,
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Dock Cost Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  featureList: [
    "Instant dock cost estimate for Tampa Bay",
    "Includes decking, pilings, labor, permits, boat lift add-on",
    "Timeline estimate for permitting and construction",
    "Cost breakdown per line item",
  ],
};

export default function DockCostToolPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/dock-cost",
            title: "Dock Cost Calculator (Tampa Bay, 2026)",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Dock Cost Calculator", href: "/tools/dock-cost" },
          ]),
          softwareSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · Tampa Bay 2026</span>
          <h1 style={{ fontSize: "2.6rem" }}>Dock Cost Calculator</h1>
          <p className="lede">
            Enter your dock size, materials, and county — get an honest cost range in Tampa Bay dollars, plus a
            breakdown you can bring to any builder.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z"
            fill="#faf5ec"
          />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <DockCostCalculator />
        </div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">How it works</div>
            <h2>What the calculator is (and isn&apos;t)</h2>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <h3>Built on real Tampa Bay data</h3>
              <p>
                Every constant — decking $/sqft, piling cost, county permit fees — is grounded in publicly reported
                2024–2026 marine construction data and quotes we&apos;ve tracked. We update the model quarterly.
              </p>
            </div>
            <div className="how-card">
              <h3>An estimate, not a quote</h3>
              <p>
                No calculator can replace a site visit. Bottom type, seagrass, tie-back requirements, and HOA rules can
                push the true price outside our range. Treat this as a starting number, not a signed contract.
              </p>
            </div>
            <div className="how-card">
              <h3>Get real numbers next</h3>
              <p>
                When you&apos;re ready, share this project with 2–3 vetted Tampa Bay builders. They send you written
                quotes — free, no obligation, no sales calls.
              </p>
              <Link href="/quote" className="btn btn-coral" style={{ marginTop: 12 }}>
                Get 3 free quotes →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
