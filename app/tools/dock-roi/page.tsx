import type { Metadata } from "next";
import Link from "next/link";
import { DockROICalculator } from "@/components/DockROICalculator";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "How much of a Tampa Bay dock's cost do you get back at sale? Interactive ROI calculator adjusted for neighborhood tier, dock condition, and holding period.";

export const metadata: Metadata = {
  title: "Dock ROI Calculator — Home Value Uplift (Tampa Bay)",
  description,
  keywords: [
    "does a dock increase home value",
    "dock ROI calculator",
    "waterfront home value Tampa",
    "deep water canal home value",
    "dock resale value Florida",
  ],
  alternates: { canonical: "/tools/dock-roi" },
  openGraph: { title: "Dock ROI Calculator — Home Value Uplift (Tampa Bay)", description, url: "/tools/dock-roi", type: "website" },
  twitter: { card: "summary_large_image", title: "Dock ROI Calculator — Home Value Uplift (Tampa Bay)", description },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Dock ROI Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  featureList: [
    "Estimate resale uplift from a new dock",
    "Adjusts for deep-water vs. navigable vs. no-boat-access",
    "Factors condition, boat lift, holding period",
  ],
};

export default function DockROIPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/dock-roi",
            title: "Dock ROI Calculator — Home Value Uplift (Tampa Bay)",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Dock ROI Calculator", href: "/tools/dock-roi" },
          ]),
          softwareSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · Tampa Bay realtor data</span>
          <h1 style={{ fontSize: "2.6rem" }}>Dock ROI Calculator</h1>
          <p className="lede">
            Not every dock pays for itself at sale. Enter your neighborhood, dock cost, and timeline — see the honest
            resale math grounded in Tampa Bay realtor interviews.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap"><DockROICalculator /></div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Where the numbers come from</div>
            <h2>ROI isn&apos;t universal</h2>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <h3>Deep water &gt; everything</h3>
              <p>Deep-water access (no bridge, no dredging needed) is the single biggest premium. In South Tampa canals it can add $75–200k at sale on the right dock.</p>
            </div>
            <div className="how-card">
              <h3>Bad docks discount you</h3>
              <p>Buyers subtract far more from list price for a failing dock than they add for a new one. Replacing a failing dock before listing usually pays for itself twice over.</p>
            </div>
            <div className="how-card">
              <h3>Build for you first</h3>
              <p>Even in the best neighborhoods, resale math rarely covers 100% of dock cost. If you&apos;re building for lifestyle + partial resale recovery, you&apos;re thinking about it right.</p>
              <Link href="/quote" className="btn btn-coral" style={{ marginTop: 12 }}>Get 3 free quotes →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
