import type { Metadata } from "next";
import Link from "next/link";
import posts from "@/data/posts.json";
import categories from "@/data/categories.json";
import site from "@/data/site.json";
import { PostCard } from "@/components/PostCard";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, itemListSchema, webPageSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

const featured = posts.slice(0, 3);

export default function HomePage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/",
            title: `${site.name} — ${site.tagline}`,
            description: site.description,
            breadcrumb: [{ name: "Home", href: "/" }],
            speakableSelectors: [".hero h1", ".hero .lede"],
          }),
          breadcrumbSchema([{ name: "Home", href: "/" }]),
          itemListSchema(featured.map((p) => ({ url: `/guides/${p.slug}`, name: p.title }))),
        ]}
      />

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="eyebrow">● Tampa · Hillsborough · Pinellas</span>
              <h1>
                Planning a dock?
                <br />
                Start in the <em>shallows.</em>
              </h1>
              <p className="lede">
                Honest, local guides on permits, costs, and materials for Tampa Bay waterfront owners — then we connect
                you with licensed dock &amp; seawall builders when you&apos;re ready.
              </p>
              <div className="hero-cta">
                <Link href="/guides" className="btn btn-light">
                  Read the Guides →
                </Link>
                <Link href="/quote" className="btn btn-coral">
                  Get 3 Free Quotes
                </Link>
              </div>
              <div className="hero-stats">
                <div className="s">
                  <b>40+</b>
                  <span>Local guides &amp; checklists</span>
                </div>
                <div className="s">
                  <b>$15k</b>
                  <span>Avg. Tampa dock cost</span>
                </div>
                <div className="s">
                  <b>4</b>
                  <span>Permitting agencies decoded</span>
                </div>
              </div>
            </div>
            <aside className="hero-card">
              <h4>Free Tampa Dock Planning Kit</h4>
              <p>Permit checklist + cost worksheet + 12 questions to ask any builder. Sent instantly.</p>
              <LeadCaptureForm source="home-hero" ctaText="Send it" successHeadline="Sent — your kit is on the way." />
              <div className="trustline">🔒 No spam. Just the waterfront essentials.</div>
            </aside>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,64 C240,120 480,16 720,52 C960,88 1200,28 1440,60 L1440,120 L0,120 Z"
            fill="#faf5ec"
          />
        </svg>
      </section>

      {/* FUNNEL */}
      <section className="block funnel">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">However you found us</div>
            <h2>Wherever you are, we meet you there</h2>
            <p>
              Most people don&apos;t start ready to build — they start with a question. Find your stage and we&apos;ll
              point you to exactly what helps next.
            </p>
          </div>
          <div className="funnel-grid">
            <div className="stage s1">
              <span className="tag">Awareness</span>
              <span className="num">Stage 01</span>
              <h3>Just exploring</h3>
              <p className="mood">&quot;Do I even need a permit? How much is this going to cost me?&quot;</p>
              <ul>
                <li>Permit &amp; regulation basics</li>
                <li>Ballpark cost ranges</li>
                <li>Dock vs. seawall vs. lift</li>
              </ul>
              <Link href="/guides" className="btn btn-ghost stagebtn">
                Browse free guides
              </Link>
            </div>
            <div className="stage s2">
              <span className="tag">Consideration</span>
              <span className="num">Stage 02</span>
              <h3>Weighing options</h3>
              <p className="mood">&quot;Floating or fixed? Composite or wood? What should it really cost in Tampa?&quot;</p>
              <ul>
                <li>Material &amp; design comparisons</li>
                <li>Detailed cost breakdowns</li>
                <li>Questions to ask a builder</li>
              </ul>
              <Link href="/guides" className="btn btn-ghost stagebtn">
                Compare &amp; estimate
              </Link>
            </div>
            <div className="stage s3">
              <span className="tag">Decision</span>
              <span className="num">Stage 03</span>
              <h3>Ready to build</h3>
              <p className="mood">
                &quot;I know what I want — connect me with someone trustworthy and licensed.&quot;
              </p>
              <ul>
                <li>Vetted local builder directory</li>
                <li>Up to 3 free matched quotes</li>
                <li>Licensed &amp; insured only</li>
              </ul>
              <Link href="/quote" className="btn btn-coral stagebtn">
                Get matched now
              </Link>
            </div>
          </div>
          <div className="flowline">
            <span>📖 Learn</span>
            <span className="arr">→</span>
            <span>⚖️ Compare</span>
            <span className="arr">→</span>
            <span>🤝 Connect with a builder</span>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLES */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Start here</div>
            <h2>The guides Tampa owners read first</h2>
            <p>Plain-English answers to the questions everyone asks before building a dock.</p>
          </div>
          <div className="card-grid">
            {featured.map((p) => (
              <PostCard key={p.slug} post={p as Parameters<typeof PostCard>[0]["post"]} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 38 }}>
            <Link href="/guides" className="btn btn-ocean">
              See all guides →
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="block cats">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Browse by topic</div>
            <h2>Find your answer faster</h2>
            <p>Every guide is organized around a real decision you&apos;ll face on the water.</p>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.slug} href="/guides" className="cat">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                    <path d={c.iconPath} />
                  </svg>
                </div>
                <h4>{c.title}</h4>
                <p>{c.description}</p>
                <span className="count">{c.count} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="block">
        <div className="wrap">
          <div className="magnet">
            <div className="badge" />
            <div>
              <h2>Get the free Dock Planning Kit</h2>
              <p>
                The permit checklist, a cost worksheet, and the 12 questions that separate great builders from cheap
                ones. Used by 1,000+ Tampa Bay homeowners.
              </p>
            </div>
            <LeadCaptureForm
              source="home-magnet"
              variant="stacked"
              ctaText="Email me the kit →"
              successHeadline="Sent — your kit is on the way."
            />

          </div>
        </div>
      </section>

      {/* HOW MATCHING WORKS */}
      <section className="block funnel">
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">When you&apos;re ready</div>
            <h2>How we match you with a builder</h2>
            <p>
              No sales calls. No spam. Just a fast form, a real match, and quotes from licensed Tampa Bay contractors —
              free.
            </p>
          </div>
          <div className="funnel-grid">
            <div className="stage s1">
              <span className="num">Step 01</span>
              <h3>Tell us the basics</h3>
              <p className="mood">
                90-second form: project type, size, timeline, budget range, and your ZIP.
              </p>
              <ul>
                <li>No credit card</li>
                <li>No obligation</li>
                <li>Private &amp; encrypted</li>
              </ul>
            </div>
            <div className="stage s2">
              <span className="num">Step 02</span>
              <h3>We match, quietly</h3>
              <p className="mood">
                We hand your project to 2–3 vetted, licensed builders who actually work in your ZIP.
              </p>
              <ul>
                <li>Licensed &amp; insured only</li>
                <li>Background &amp; review checked</li>
                <li>Never shared with 20 companies</li>
              </ul>
            </div>
            <div className="stage s3">
              <span className="num">Step 03</span>
              <h3>Compare on your terms</h3>
              <p className="mood">
                Builders reach out within 48 hours. You compare quotes side-by-side and pick — or walk away.
              </p>
              <ul>
                <li>Written quotes only</li>
                <li>Free comparison worksheet</li>
                <li>No follow-up harassment</li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/quote" className="btn btn-coral">
              Start the 90-second form →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
