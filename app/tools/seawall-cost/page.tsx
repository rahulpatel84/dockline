import type { Metadata } from "next";
import Link from "next/link";
import { SeawallCostCalculator } from "@/components/SeawallCostCalculator";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Estimate a Tampa Bay seawall replacement or new build — vinyl, concrete, aluminum, or rip-rap. Interactive calculator with per-linear-foot pricing, tiebacks, cap, and permit fees.";

export const metadata: Metadata = {
  title: "Seawall Cost Estimator (Tampa Bay, 2026)",
  description,
  keywords: [
    "seawall cost Tampa",
    "seawall estimator Florida",
    "vinyl seawall cost per foot",
    "seawall replacement cost Tampa Bay",
    "rip rap cost Florida",
  ],
  alternates: { canonical: "/tools/seawall-cost" },
  openGraph: { title: "Seawall Cost Estimator (Tampa Bay, 2026)", description, url: "/tools/seawall-cost", type: "website" },
  twitter: { card: "summary_large_image", title: "Seawall Cost Estimator (Tampa Bay, 2026)", description },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Seawall Cost Estimator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  featureList: [
    "Per-linear-foot seawall estimate for Tampa Bay",
    "Vinyl / concrete / aluminum / rip-rap / steel materials",
    "Tieback style and cap options",
    "Seagrass survey and removal add-ons",
  ],
};

export default function SeawallCostToolPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/seawall-cost",
            title: "Seawall Cost Estimator (Tampa Bay, 2026)",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Seawall Cost Estimator", href: "/tools/seawall-cost" },
          ]),
          softwareSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · Tampa Bay 2026</span>
          <h1 style={{ fontSize: "2.6rem" }}>Seawall Cost Estimator</h1>
          <p className="lede">
            Vinyl, concrete, aluminum, or rip-rap — get a Tampa Bay estimate per linear foot including tiebacks, cap,
            and county permit fees.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <SeawallCostCalculator />
        </div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">How it works</div>
            <h2>Seawall cost, honestly</h2>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <h3>Length × height × material</h3>
              <p>Cost scales linearly with length and disproportionately with retained height. Every foot over 6 ft of retained height adds ~8% to the wall cost.</p>
            </div>
            <div className="how-card">
              <h3>Tiebacks are not optional</h3>
              <p>Any seawall over 6 ft of retained height needs tiebacks — helical anchors are the modern standard in Tampa Bay. Skipping them is how walls fail.</p>
            </div>
            <div className="how-card">
              <h3>Get quotes with your worksheet</h3>
              <p>Take the breakdown above to 2–3 vetted local contractors. Wildly different numbers on the same spec usually mean one of them is skipping something.</p>
              <Link href="/quote" className="btn btn-coral" style={{ marginTop: 12 }}>Get 3 free quotes →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
