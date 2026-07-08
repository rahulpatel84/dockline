import Link from "next/link";
import site from "@/data/site.json";

const socialLabels: Record<string, string> = {
  twitter: "Twitter / X",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(site.social ?? {}).filter(([, url]) => Boolean(url));

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="logo">
              <span
                className="dot"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: "linear-gradient(135deg,var(--teal),var(--aqua))",
                  display: "inline-grid",
                  placeItems: "center",
                  verticalAlign: "middle",
                  marginRight: 8,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} style={{ width: 18, height: 18 }}>
                  <path d="M3 18h18M5 18v-7l7-4 7 4v7" />
                </svg>
              </span>
              {site.shortName}
            </div>
            <p className="blurb">
              Tampa Bay&apos;s independent guide to docks, seawalls &amp; boat lifts — and the licensed builders who
              make them.
            </p>
            <address
              className="foot-address"
              style={{ fontStyle: "normal", marginTop: 14, fontSize: 14, lineHeight: 1.7 }}
            >
              <div>{site.contact?.region}</div>
              <div>
                <a href={`mailto:${site.contact?.email}`}>{site.contact?.email}</a>
              </div>
            </address>
            {socials.length > 0 && (
              <div className="foot-social" style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {socials.map(([key, url]) => (
                  <a
                    key={key}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${site.name} on ${socialLabels[key] ?? key}`}
                    style={{ fontSize: 13, textDecoration: "underline" }}
                  >
                    {socialLabels[key] ?? key}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h5>Guides</h5>
            <Link href="/guides">Permits &amp; regulations</Link>
            <Link href="/guides">Costs &amp; budgeting</Link>
            <Link href="/guides">Materials &amp; design</Link>
            <Link href="/guides">Maintenance &amp; lifespan</Link>
          </div>
          <div>
            <h5>For owners</h5>
            <Link href="/quote">Get 3 free quotes</Link>
            <Link href="/directory">Find a builder</Link>
            <Link href="/guides">Free planning kit</Link>
            <Link href="/guides">Cost calculator</Link>
          </div>
          <div>
            <h5>For builders</h5>
            <Link href="/directory">List your business</Link>
            <Link href="/directory">Buy leads</Link>
            <Link href="/directory">Featured placement</Link>
            <a href={`mailto:${site.contact?.email}`}>Contact us</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>
            © {year} {site.name}. Serving Tampa, Hillsborough, Pinellas, St. Petersburg, Clearwater &amp; Apollo Beach.
          </span>
          <span>Privacy · Terms · Builder Agreement</span>
        </div>
      </div>
    </footer>
  );
}
