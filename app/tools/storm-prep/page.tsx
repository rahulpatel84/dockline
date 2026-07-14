import type { Metadata } from "next";
import { StormChecklist } from "@/components/StormChecklist";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";
import checklist from "@/data/storm-checklist.json";

const description =
  "The pre-season, 72-hour, 24-hour, and post-storm checklist Tampa Bay waterfront owners need every June through November. Progress saves in your browser.";

export const metadata: Metadata = {
  title: "Hurricane Readiness Checklist (Tampa Bay Docks & Boat Lifts)",
  description,
  keywords: [
    "hurricane checklist Tampa Bay",
    "dock hurricane prep",
    "boat lift storm prep",
    "waterfront hurricane checklist Florida",
    "post-storm dock inspection",
  ],
  alternates: { canonical: "/tools/storm-prep" },
  openGraph: {
    title: "Hurricane Readiness Checklist (Tampa Bay Docks & Boat Lifts)",
    description,
    url: "/tools/storm-prep",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hurricane Readiness Checklist (Tampa Bay Docks & Boat Lifts)",
    description,
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MyDockGuide Hurricane Readiness Checklist",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (Web)",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  featureList: [
    "Pre-season, 72-hour, 24-hour, and post-storm checklists",
    "Progress saved locally in your browser",
    "Print-friendly layout",
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Hurricane readiness for Tampa Bay docks, seawalls, and boat lifts",
  description,
  step: checklist.phases.map((p) => ({
    "@type": "HowToSection",
    name: p.title,
    itemListElement: p.items.map((it) => ({
      "@type": "HowToStep",
      name: it.text,
    })),
  })),
};

export default function StormPrepPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools/storm-prep",
            title: "Hurricane Readiness Checklist (Tampa Bay Docks & Boat Lifts)",
            description,
            speakableSelectors: [".tool-hero h1", ".tool-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
            { name: "Hurricane Readiness Checklist", href: "/tools/storm-prep" },
          ]),
          softwareSchema,
          howToSchema,
        ]}
      />

      <section className="hero tool-hero" style={{ paddingBottom: 40 }}>
        <div className="wrap" style={{ padding: "56px 28px 40px" }}>
          <span className="eyebrow">Free tool · Hurricane season</span>
          <h1 style={{ fontSize: "2.6rem" }}>Hurricane Readiness Checklist</h1>
          <p className="lede">
            The Tampa Bay-specific pre-season, 72-hour, 24-hour, and post-storm checklist for docks, seawalls, and boat
            lifts. Your progress saves in the browser.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap"><StormChecklist /></div>
      </section>
    </main>
  );
}
