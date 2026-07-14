import type { Metadata } from "next";
import Link from "next/link";
import { MaterialQuiz } from "@/components/MaterialQuiz";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Which dock material fits your Tampa Bay life? Answer 6 questions — priorities, longevity, sun, cleaning, traffic, aesthetic — and we score pressure-treated, composite, ipe, and aluminum against your answers.";

export const metadata: Metadata = {
  title: "Dock Material Recommender Quiz (Tampa Bay)",
  description,
  keywords: [
    "dock material recommender",
    "composite vs wood dock",
    "ipe vs composite dock",
    "Tampa dock material guide",
    "aluminum dock decking",
  ],
  alternates: { canonical: "/tools/material-picker" },
  openGraph: { title: "Dock Material Recommender Quiz (Tampa Bay)", description, url: "/tools/material-picker", type: "website" },
  twitter: { card: "summary_large_image", title: "Dock Material Recommender Quiz (Tampa Bay)", description },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Material Recommender",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
};

export default function MaterialPickerPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/material-picker",
            title: "Dock Material Recommender Quiz (Tampa Bay)",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Material Recommender", href: "/tools/material-picker" },
          ]),
          softwareSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · 6-question quiz</span>
          <h1 style={{ fontSize: "2.6rem" }}>Material Recommender</h1>
          <p className="lede">
            The "which decking should I use?" question has no universal answer. Tell us how you&apos;ll actually use the
            dock — we&apos;ll score every option against your life.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap"><MaterialQuiz /></div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">The four contenders</div>
            <h2>What each material actually is</h2>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <h3>Pressure-treated pine</h3>
              <p>Cheapest per sq ft, 10–15 year lifespan in Tampa saltwater. Needs annual sealing to look and last well.</p>
            </div>
            <div className="how-card">
              <h3>Composite (Trex / Azek / Fiberon)</h3>
              <p>The Tampa Bay default over the past decade. Zero maintenance, 25–30 year warranties, higher upfront cost.</p>
            </div>
            <div className="how-card">
              <h3>Ipe hardwood</h3>
              <p>Brazilian hardwood — 3× denser than pine. Looks like a yacht deck. 30–50 year lifespan. Premium price.</p>
            </div>
            <div className="how-card">
              <h3>Marine-grade aluminum</h3>
              <p>Modern industrial look. Won&apos;t warp, splinter, or rot. Great in full sun. Best for modern homes.</p>
              <Link href="/quote" className="btn btn-coral" style={{ marginTop: 12 }}>Get quotes →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
