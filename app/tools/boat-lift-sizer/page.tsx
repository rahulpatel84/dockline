import type { Metadata } from "next";
import Link from "next/link";
import { BoatLiftSizer } from "@/components/BoatLiftSizer";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Size the boat lift you actually need. Enter boat dry weight, fuel, water, gear, and safety margin — we pick the correct commercial lift class and warn if you're borderline.";

export const metadata: Metadata = {
  title: "Boat Lift Capacity Calculator (Tampa Bay)",
  description,
  keywords: [
    "boat lift capacity calculator",
    "what size boat lift do I need",
    "boat lift sizing Tampa",
    "boat lift weight class",
    "PWC lift Florida",
  ],
  alternates: { canonical: "/tools/boat-lift-sizer" },
  openGraph: { title: "Boat Lift Capacity Calculator (Tampa Bay)", description, url: "/tools/boat-lift-sizer", type: "website" },
  twitter: { card: "summary_large_image", title: "Boat Lift Capacity Calculator (Tampa Bay)", description },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Boat Lift Sizer",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  featureList: [
    "Calculate fully-loaded boat weight from dry + fuel + water + gear",
    "Pick correct commercial lift class (4.5k – 40k lb)",
    "Applies configurable safety margin (industry: 20–25%)",
    "Warnings for borderline or twin-outboard setups",
  ],
};

export default function BoatLiftToolPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/boat-lift-sizer",
            title: "Boat Lift Capacity Calculator (Tampa Bay)",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Boat Lift Sizer", href: "/tools/boat-lift-sizer" },
          ]),
          softwareSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · Sized for Tampa Bay saltwater</span>
          <h1 style={{ fontSize: "2.6rem" }}>Boat Lift Capacity Calculator</h1>
          <p className="lede">
            Undersize a lift and you snap cables. Oversize and you overpay by thousands. This calculator uses your boat&apos;s
            real fully-loaded weight to spec the right lift class.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap"><BoatLiftSizer /></div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Sizing rules</div>
            <h2>Why the math matters</h2>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <h3>Fully-loaded, not dry</h3>
              <p>Dry weight is the number on the brochure. Fully loaded — with fuel, water, batteries, gear, and 2 people at the dock — is what a lift actually lifts. That&apos;s always higher.</p>
            </div>
            <div className="how-card">
              <h3>The 20–25% rule</h3>
              <p>Add 20–25% safety margin on top of fully-loaded. In Tampa Bay we push toward 25% because salt corrosion + storm surge asymmetry both cost you rated capacity.</p>
            </div>
            <div className="how-card">
              <h3>Match spec to installer</h3>
              <p>Every lift brand rounds capacity differently. Bring this number to a licensed Tampa Bay lift installer — they&apos;ll match to a specific model.</p>
              <Link href="/quote" className="btn btn-coral" style={{ marginTop: 12 }}>Get 3 free lift quotes →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
