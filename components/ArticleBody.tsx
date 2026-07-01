import Link from "next/link";

type Block =
  | { type: "p"; html: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "keyfact"; html: string }
  | { type: "cta-soft"; heading: string; body: string; withEmail?: boolean; ctaText: string }
  | { type: "cta"; heading: string; body: string; ctaText: string; ctaHref: string }
  | { type: "disclaimer"; text: string };

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                ))}
              </ul>
            );
          case "keyfact":
            return <div key={i} className="keyfact" dangerouslySetInnerHTML={{ __html: b.html }} />;
          case "cta-soft":
            return (
              <div key={i} className="inline-cta soft">
                <h4>{b.heading}</h4>
                <p>{b.body}</p>
                {b.withEmail && (
                  <form className="mini-form" style={{ maxWidth: 420 }} action="/api/lead" method="post">
                    <input type="email" name="email" placeholder="you@email.com" required aria-label="Email address" />
                    <button className="btn btn-coral" type="submit">
                      {b.ctaText}
                    </button>
                  </form>
                )}
              </div>
            );
          case "cta":
            return (
              <div key={i} className="inline-cta">
                <h4>{b.heading}</h4>
                <p>{b.body}</p>
                <Link href={b.ctaHref} className="btn btn-coral">
                  {b.ctaText}
                </Link>
              </div>
            );
          case "disclaimer":
            return (
              <p
                key={i}
                style={{
                  fontSize: ".84rem",
                  color: "var(--ink-soft)",
                  borderTop: "1px solid var(--line)",
                  paddingTop: 18,
                  marginTop: 30,
                }}
              >
                {b.text}
              </p>
            );
        }
      })}
    </>
  );
}
