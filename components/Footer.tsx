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
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "linear-gradient(135deg,var(--teal),var(--ocean))",
                  display: "inline-grid",
                  placeItems: "center",
                  verticalAlign: "middle",
                  marginRight: 10,
                }}
              >
                <svg viewBox="0 0 40 40" fill="none" style={{ width: 22, height: 22 }} aria-hidden="true">
                  <defs>
                    <linearGradient id="mdg-foot-water" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6fc5bc" />
                      <stop offset="100%" stopColor="#15808f" />
                    </linearGradient>
                  </defs>
                  <path d="M4 30 Q 10 26 16 30 T 28 30 T 40 30 L 40 40 L 4 40 Z" fill="url(#mdg-foot-water)" opacity="0.9" />
                  <rect x="6" y="24" width="28" height="3" rx="1" fill="#fff" />
                  <rect x="9" y="24" width="2" height="10" fill="#fff" opacity="0.9" />
                  <rect x="19" y="24" width="2" height="10" fill="#fff" opacity="0.9" />
                  <rect x="29" y="24" width="2" height="10" fill="#fff" opacity="0.9" />
                  <circle cx="30" cy="12" r="4" fill="#fff" opacity="0.95" />
                </svg>
              </span>
              {site.shortName}
            </div>
            <p className="blurb">
              Tampa Bay&apos;s independent guide to docks, seawalls, and boat lifts. Plus the licensed builders who
              actually make them.
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
            <Link href="/tools/dock-cost">Dock cost calculator</Link>
            <Link href="/tools">All tools</Link>
            <Link href="/guides">Free planning kit</Link>
          </div>
          <div>
            <h5>Company</h5>
            <Link href="/about">About</Link>
            <Link href="/newsletter">Newsletter</Link>
            <a href={`mailto:${site.contact?.email}`}>Contact</a>
            <a href={`mailto:${site.contact?.email}?subject=Builder%20partnership`}>Builder partnerships</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>
            © {year} {site.name}. Serving Tampa, Hillsborough, Pinellas, St. Petersburg, Clearwater &amp; Apollo Beach.
          </span>
          <span className="foot-legal">
            <Link href="/privacy">Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms">Terms</Link>
            <span aria-hidden="true">·</span>
            <Link href="/builder-agreement">Builder agreement</Link>
            <span aria-hidden="true">·</span>
            <Link href="/sitemap-page">Sitemap</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
