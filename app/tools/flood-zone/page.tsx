import type { Metadata } from "next";
import Link from "next/link";
import { FloodZoneLookup } from "@/components/FloodZoneLookup";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Look up the FEMA flood zone (VE / AE / X) for your Tampa Bay ZIP with typical Base Flood Elevation, insurance impact, and what it means for what you can build.";

export const metadata: Metadata = {
  title: "Tampa Bay FEMA Flood Zone Lookup",
  description,
  keywords: [
    "FEMA flood zone Tampa",
    "AE flood zone Tampa Bay",
    "VE flood zone Florida",
    "base flood elevation Tampa",
    "flood insurance Tampa Bay",
  ],
  alternates: { canonical: "/tools/flood-zone" },
  openGraph: { title: "Tampa Bay FEMA Flood Zone Lookup", description, url: "/tools/flood-zone", type: "website" },
  twitter: { card: "summary_large_image", title: "Tampa Bay FEMA Flood Zone Lookup", description },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Flood Zone Lookup",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
};

export default function FloodZonePage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/flood-zone",
            title: "Tampa Bay FEMA Flood Zone Lookup",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Flood Zone Lookup", href: "/tools/flood-zone" },
          ]),
          softwareSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · Tampa Bay ZIPs</span>
          <h1 style={{ fontSize: "2.6rem" }}>FEMA Flood Zone Lookup</h1>
          <p className="lede">
            Enter a Tampa Bay ZIP and see the likely FEMA flood zone, typical Base Flood Elevation, insurance impact,
            and what you&apos;re allowed to build.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap"><FloodZoneLookup /></div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Zone decoder</div>
            <h2>What the letters mean</h2>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <h3>VE — Coastal High Hazard</h3>
              <p>Wave action + storm surge zone. Most expensive to insure. Homes must be elevated on pilings; solid walls below BFE prohibited.</p>
            </div>
            <div className="how-card">
              <h3>AE — 100-year flood</h3>
              <p>1% annual chance of flooding. Common along Tampa Bay canals. Insurance mandatory for federally-backed mortgages.</p>
            </div>
            <div className="how-card">
              <h3>X — Low / moderate</h3>
              <p>Outside the 100-year floodplain. Insurance not mandatory but recommended — preferred-risk policies are cheap.</p>
              <Link href="/quote" className="btn btn-coral" style={{ marginTop: 12 }}>Get a dock quote →</Link>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#5a6b6f", marginTop: 24 }}>
            This tool is educational and uses ZIP-level generalizations. Real flood determinations are done at the parcel level — use{" "}
            <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer">FEMA MSC</a>
            {" "}or your insurance broker for authoritative results.
          </p>
        </div>
      </section>
    </main>
  );
}
