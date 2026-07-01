import Link from "next/link";

export function Footer() {
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
              Dockline
            </div>
            <p className="blurb">
              Tampa Bay&apos;s independent guide to docks, seawalls &amp; boat lifts — and the builders who make them.
            </p>
          </div>
          <div>
            <h5>Guides</h5>
            <Link href="/guides">Permits</Link>
            <Link href="/guides">Costs</Link>
            <Link href="/guides">Materials</Link>
            <Link href="/guides">Maintenance</Link>
          </div>
          <div>
            <h5>For owners</h5>
            <Link href="/quote">Get free quotes</Link>
            <Link href="/directory">Find a builder</Link>
            <Link href="/">Free planning kit</Link>
          </div>
          <div>
            <h5>For builders</h5>
            <Link href="/directory">List your business</Link>
            <Link href="/directory">Buy leads</Link>
            <Link href="/directory">Featured placement</Link>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 Dockline. A Tampa Bay lead-gen demo.</span>
          <span>Privacy · Terms · Builder Agreement</span>
        </div>
      </div>
    </footer>
  );
}
