import type { Metadata } from "next";
import Link from "next/link";
import { PermitLookup } from "@/components/PermitLookup";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Instantly see which permits your Tampa Bay dock, seawall, boat lift, or storm rebuild needs — county, state (FDEP), and federal (Army Corps) — with typical review timelines.";

export const metadata: Metadata = {
  title: "Tampa Bay Dock Permit Lookup",
  description,
  keywords: [
    "Tampa dock permit lookup",
    "Hillsborough dock permit",
    "Pinellas dock permit",
    "FDEP dock permit",
    "Army Corps dock permit Florida",
    "seawall permit Tampa",
  ],
  alternates: { canonical: "/tools/permit-lookup" },
  openGraph: { title: "Tampa Bay Dock Permit Lookup", description, url: "/tools/permit-lookup", type: "website" },
  twitter: { card: "summary_large_image", title: "Tampa Bay Dock Permit Lookup", description },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Permit Lookup",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  featureList: [
    "Covers Tampa Bay counties (Hillsborough, Pinellas, Manatee, Sarasota, Pasco)",
    "New dock, dock repair, boat lift, seawall, and post-storm rebuild",
    "Links out to every relevant county / FDEP / Army Corps page",
    "Realistic review timelines based on 2024–2026 data",
  ],
};

export default function PermitLookupPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/permit-lookup",
            title: "Tampa Bay Dock Permit Lookup",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Permit Lookup", href: "/tools/permit-lookup" },
          ]),
          softwareSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · Tampa Bay counties</span>
          <h1 style={{ fontSize: "2.6rem" }}>Permit Lookup</h1>
          <p className="lede">
            Pick your county and project type — we list every agency involved, with links and realistic review timelines. Nothing missed.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap"><PermitLookup /></div>
      </section>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">How permits stack</div>
            <h2>Why Tampa Bay dock permits take so long</h2>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <h3>Three-layer stack</h3>
              <p>Every dock touches county (Building + Environmental), state (FDEP), and often federal (Army Corps). Each has its own clock and none can be skipped.</p>
            </div>
            <div className="how-card">
              <h3>Seagrass and wildlife slow it down</h3>
              <p>Seagrass beds, manatee zones, and bird nesting areas trigger extra biological review and can add 8–16 weeks before construction can start.</p>
            </div>
            <div className="how-card">
              <h3>Repair vs. rebuild rules</h3>
              <p>In-kind repair (same size, same materials) usually only needs a county permit. Add a foot of length and you&apos;re back to the full stack.</p>
              <Link href="/quote" className="btn btn-coral" style={{ marginTop: 12 }}>Get a builder to handle it →</Link>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#5a6b6f", marginTop: 24 }}>
            Disclaimer: This lookup is a starting point, not legal advice. Every project is different — confirm with your county building department before you commit to a timeline.
          </p>
        </div>
      </section>
    </main>
  );
}
