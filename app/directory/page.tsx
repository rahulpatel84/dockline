import type { Metadata } from "next";
import Link from "next/link";
import builders from "@/data/builders.json";
import { DirectoryExplorer } from "@/components/DirectoryExplorer";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, localBusinessSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "Find licensed, insured marine contractors building docks, seawalls, and boat lifts across Tampa Bay. Reviewed and verified.";

export const metadata: Metadata = {
  title: "Tampa Bay Dock Builder Directory",
  description,
  keywords: [
    "Tampa dock builder directory",
    "licensed marine contractors Tampa",
    "seawall contractors Tampa Bay",
    "boat lift installers Florida",
    "dock builders near me",
  ],
  alternates: { canonical: "/directory" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: "Tampa Bay Dock Builder Directory",
    description:
      "Find licensed, insured marine contractors building docks, seawalls, and boat lifts across Tampa Bay.",
    url: "/directory",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tampa Bay Dock Builder Directory",
    description,
  },
};

export default function DirectoryPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/directory",
            title: "Tampa Bay Dock Builder Directory",
            description,
            speakableSelectors: [".dir-hero h1", ".dir-hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Find a Builder", href: "/directory" },
          ]),
          itemListSchema(
            builders.map((b) => ({ url: `/directory/${b.slug}`, name: b.name })),
          ),
          ...builders.map((b) => localBusinessSchema(b)),
        ]}
      />
      <section className="hero dir-hero">
        <div className="wrap dir-hero-wrap">
          <span className="eyebrow">Verified Marine Contractors</span>
          <h1>Find a Tampa Bay dock builder</h1>
          <p className="lede">
            Every builder here is licensed, insured, and reviewed. Reach out directly — or let us match you to the best
            fit.
          </p>
          <div className="dir-hero-stats">
            <div className="dir-stat">
              <b>{builders.length}</b>
              <span>Verified builders</span>
            </div>
            <div className="dir-stat">
              <b>4.8★</b>
              <span>Avg. rating</span>
            </div>
            <div className="dir-stat">
              <b>409+</b>
              <span>Local reviews</span>
            </div>
          </div>
          <div className="hero-cta" style={{ marginTop: 26 }}>
            <Link href="/quote" className="btn btn-coral">
              Get matched to 3 builders →
            </Link>
            <a href="#explorer" className="btn btn-light">
              Browse the directory
            </a>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z"
            fill="#faf5ec"
          />
        </svg>
      </section>
      <section className="block dir-section" id="explorer">
        <div className="wrap">
          <DirectoryExplorer builders={builders} />
        </div>
      </section>
    </main>
  );
}
