import type { Metadata } from "next";
import Link from "next/link";
import posts from "@/data/posts.json";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Every page on MyDockGuide. Guides, tools, company info, and legal. Browse the full site in one place.";

export const metadata: Metadata = {
  title: "Sitemap",
  description,
  alternates: { canonical: "/sitemap-page" },
  openGraph: { title: "Sitemap · MyDockGuide", description, url: "/sitemap-page", type: "website" },
};

type SitemapSection = {
  title: string;
  eyebrow: string;
  links: { href: string; label: string; desc?: string }[];
};

const sections: SitemapSection[] = [
  {
    eyebrow: "01",
    title: "Start here",
    links: [
      { href: "/", label: "Home", desc: "The main entry point for Tampa Bay waterfront owners." },
      { href: "/about", label: "About MyDockGuide", desc: "Who we are and why we built this." },
      { href: "/contact", label: "Contact us", desc: "Reach the team by email." },
    ],
  },
  {
    eyebrow: "02",
    title: "Free tools",
    links: [
      { href: "/tools", label: "All tools", desc: "The full library of calculators and lookups." },
      { href: "/tools/dock-cost", label: "Dock Cost Calculator", desc: "Instant Tampa Bay dock cost estimate." },
      { href: "/tools/seawall-cost", label: "Seawall Cost Estimator", desc: "Per-linear-foot seawall pricing." },
      { href: "/tools/boat-lift-sizer", label: "Boat Lift Capacity Calculator", desc: "Size the right lift class." },
      { href: "/tools/permit-lookup", label: "Tampa Bay Permit Lookup", desc: "See which agencies your project needs." },
      { href: "/tools/dock-roi", label: "Dock ROI Calculator", desc: "Home value uplift from a new dock." },
      { href: "/tools/flood-zone", label: "FEMA Flood Zone Lookup", desc: "Zone + BFE for Tampa Bay ZIPs." },
      { href: "/tools/storm-prep", label: "Hurricane Readiness Checklist", desc: "Pre-season through post-storm." },
      { href: "/tools/material-picker", label: "Material Recommender Quiz", desc: "The right decking for your life." },
    ],
  },
  {
    eyebrow: "03",
    title: "Guides",
    links: [
      { href: "/guides", label: "All guides", desc: "Every article we have published." },
      ...posts.map((p) => ({
        href: p.externalLink || `/guides/${p.slug}`,
        label: p.title,
        desc: p.description,
      })),
    ],
  },
  {
    eyebrow: "04",
    title: "Get matched with builders",
    links: [
      { href: "/quote", label: "Get 3 free quotes", desc: "90-second form. Matched to vetted licensed contractors." },
    ],
  },
  {
    eyebrow: "05",
    title: "Newsletter",
    links: [
      { href: "/newsletter", label: "The Tampa Waterfront Weekly", desc: "Every Thursday, 3-minute read." },
    ],
  },
  {
    eyebrow: "06",
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of service" },
      { href: "/builder-agreement", label: "Builder partnership agreement" },
    ],
  },
];

export default function UserSitemapPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/sitemap-page",
            title: "Sitemap",
            description,
            speakableSelectors: [".hero h1", ".hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Sitemap", href: "/sitemap-page" },
          ]),
        ]}
      />

      <section className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap" style={{ padding: "72px 28px 100px" }}>
          <span className="eyebrow">The whole site</span>
          <h1 style={{ fontSize: "2.9rem" }}>Sitemap</h1>
          <p className="lede" style={{ maxWidth: 620 }}>
            Every page on MyDockGuide, organized. Also available as{" "}
            <a href="/sitemap.xml" style={{ color: "var(--aqua)", textDecoration: "underline" }}>
              XML for search engines
            </a>
            .
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block">
        <div className="wrap" style={{ maxWidth: 900 }}>
          {sections.map((section) => (
            <div key={section.title} className="sitemap-section">
              <div className="sitemap-header">
                <span className="sitemap-eyebrow">{section.eyebrow}</span>
                <h2>{section.title}</h2>
              </div>
              <ul className="sitemap-list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="sitemap-title">{link.label}</span>
                      {link.desc && <span className="sitemap-desc">{link.desc}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
