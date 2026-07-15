import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";

const description =
  "The Tampa Waterfront Weekly. Every Thursday: one number, one guide, one thing to fix on your dock this week. Free.";

export const metadata: Metadata = {
  title: "The Tampa Waterfront Weekly Newsletter",
  description,
  alternates: { canonical: "/newsletter" },
  openGraph: { title: "The Tampa Waterfront Weekly", description, url: "/newsletter", type: "website" },
  twitter: { card: "summary_large_image", title: "The Tampa Waterfront Weekly", description },
};

export default function NewsletterPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/newsletter",
            title: "The Tampa Waterfront Weekly Newsletter",
            description,
            speakableSelectors: [".hero h1", ".hero .lede"],
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Newsletter", href: "/newsletter" },
          ]),
        ]}
      />

      <section className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap" style={{ padding: "72px 28px 100px" }}>
          <span className="eyebrow">Every Thursday</span>
          <h1 style={{ fontSize: "2.9rem" }}>
            The Tampa <em>Waterfront</em> Weekly.
          </h1>
          <p className="lede" style={{ maxWidth: 620 }}>
            One number. One new guide. One thing to fix on your dock this week. 400 words, 3 minute read.
            Straight to your inbox on Thursday mornings.
          </p>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z" fill="#faf5ec" />
        </svg>
      </section>

      <section className="block" style={{ paddingTop: 48 }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <div className="newsletter-card">
            <h2 style={{ fontSize: "1.6rem", color: "var(--ocean)", marginBottom: 8 }}>Join 5,000+ Tampa Bay owners</h2>
            <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>
              Free forever. One click to unsubscribe. We never share your address.
            </p>
            <NewsletterSignup />

          </div>

          <div className="newsletter-inclusions">
            <h3 style={{ color: "var(--ocean)", fontSize: "1.3rem", marginBottom: 16 }}>What&apos;s in every issue</h3>
            <ul>
              <li>
                <b>This week in Tampa Bay waterfront.</b> News, code changes, storm outlook.
              </li>
              <li>
                <b>Number of the week.</b> One recent dock cost, permit timeline, or insurance premium data point.
              </li>
              <li>
                <b>Featured guide.</b> One new or refreshed article on permits, cost, materials, or storm prep.
              </li>
              <li>
                <b>Tool spotlight.</b> One of our free calculators explained in 2 sentences.
              </li>
              <li>
                <b>Reader question.</b> A real Q&amp;A from a Tampa Bay homeowner.
              </li>
            </ul>
          </div>

          <div className="newsletter-samples">
            <h3 style={{ color: "var(--ocean)", fontSize: "1.3rem", marginBottom: 12 }}>Recent issues</h3>
            <p style={{ color: "var(--ink-soft)", fontSize: "0.95rem", marginBottom: 20 }}>
              A newsletter archive will appear here once we publish the first few issues.
            </p>
            <div className="newsletter-issue is-placeholder">
              <span className="issue-date">Coming July 2026</span>
              <h4>First issue: What Tampa Bay dock permits actually look like in Q3</h4>
              <p>Fresh 2026 permit review timelines by county, plus a homeowner story from Apollo Beach.</p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 40, padding: "24px 0", borderTop: "1px solid var(--line)" }}>
            <p style={{ color: "var(--ink-soft)", marginBottom: 12 }}>Prefer to browse the guides directly?</p>
            <Link href="/guides" className="btn btn-ghost">Read all guides →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
