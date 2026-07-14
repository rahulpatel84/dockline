import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Free interactive tools for Tampa Bay waterfront owners — dock cost calculator, seawall estimator, boat lift sizer, permit lookup, and storm prep checklists. Built on 2026 local data.";

export const metadata: Metadata = {
  title: "Free Dock & Waterfront Tools for Tampa Bay",
  description,
  keywords: [
    "dock cost calculator",
    "seawall estimator Tampa",
    "boat lift sizer",
    "Tampa Bay dock tools",
    "waterfront home tools Florida",
  ],
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Dock & Waterfront Tools for Tampa Bay",
    description,
    url: "/tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Dock & Waterfront Tools for Tampa Bay",
    description,
  },
};

type ToolCard = {
  href: string;
  title: string;
  blurb: string;
  status: "live" | "soon";
  tag: string;
};

const tools: ToolCard[] = [
  {
    href: "/tools/dock-cost",
    title: "Dock Cost Calculator",
    blurb:
      "Estimate a Tampa Bay dock build with your size, materials, county, and add-ons. Get a low–high range and a line-by-line breakdown.",
    status: "live",
    tag: "Cost",
  },
  {
    href: "/tools/seawall-cost",
    title: "Seawall Cost Estimator",
    blurb:
      "Vinyl, concrete, or aluminum — get a per-linear-foot estimate for a Tampa Bay seawall including tiebacks and cap.",
    status: "live",
    tag: "Cost",
  },
  {
    href: "/tools/boat-lift-sizer",
    title: "Boat Lift Capacity Calculator",
    blurb:
      "Enter your boat's weight, engine, and gear. We size the lift class you actually need (and warn if you're borderline).",
    status: "live",
    tag: "Boat lifts",
  },
  {
    href: "/tools/permit-lookup",
    title: "Tampa Bay Permit Lookup",
    blurb:
      "Which permits apply to your dock? Pick your county and dock type — we list every agency you'll need and typical timelines.",
    status: "live",
    tag: "Permits",
  },
  {
    href: "/tools/dock-roi",
    title: "Dock ROI Calculator",
    blurb:
      "How much of a Tampa Bay dock's cost do you get back when you sell? Get a ballpark based on neighborhood and dock condition.",
    status: "live",
    tag: "Home value",
  },
  {
    href: "/tools/flood-zone",
    title: "FEMA Flood Zone Lookup",
    blurb:
      "Enter your address to see your FEMA flood zone, base flood elevation, and what it means for what you can build.",
    status: "live",
    tag: "Insurance",
  },
  {
    href: "/tools/storm-prep",
    title: "Hurricane Readiness Checklist",
    blurb: "The pre-storm dock, seawall, and boat lift checklist Tampa Bay owners need every June through November.",
    status: "live",
    tag: "Storm",
  },
  {
    href: "/tools/material-picker",
    title: "Material Recommender Quiz",
    blurb:
      "Answer 6 questions about how you'll use your dock — we recommend decking + piling combinations that fit your life.",
    status: "live",
    tag: "Materials",
  },
];

export default function ToolsHubPage() {
  const liveTools = tools.filter((t) => t.status === "live");

  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/tools",
            title: "Free Dock & Waterfront Tools for Tampa Bay",
            description,
            speakableSelectors: [".hero h1", ".hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools" },
          ]),
          itemListSchema(liveTools.map((t) => ({ url: t.href, name: t.title }))),
        ]}
      />

      <section className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap" style={{ padding: "56px 28px 90px" }}>
          <span className="eyebrow">Free tools · Tampa Bay</span>
          <h1 style={{ fontSize: "2.8rem" }}>Skip the guesswork.</h1>
          <p className="lede">
            Every calculator, checklist, and lookup we build is grounded in real Tampa Bay data — not national averages.
            Free forever, no email required.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z"
            fill="#faf5ec"
          />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="tools-grid">
            {tools.map((t) =>
              t.status === "live" ? (
                <Link key={t.href} href={t.href} className="tool-card">
                  <div className="tool-tag">{t.tag}</div>
                  <h3>{t.title}</h3>
                  <p>{t.blurb}</p>
                  <span className="tool-cta">Open the tool →</span>
                </Link>
              ) : (
                <div key={t.href} className="tool-card is-soon" aria-disabled="true">
                  <div className="tool-tag">{t.tag}</div>
                  <h3>{t.title}</h3>
                  <p>{t.blurb}</p>
                  <span className="tool-cta">Coming soon</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
