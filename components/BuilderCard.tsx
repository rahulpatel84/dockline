import Link from "next/link";

type Builder = {
  slug: string;
  name: string;
  initials: string;
  location: string;
  stars: string;
  rating: string;
  tags: string[];
  featured: boolean;
};

export function BuilderCard({ builder }: { builder: Builder }) {
  return (
    <div className={`builder${builder.featured ? " feat" : ""}`}>
      <div className="avatar">{builder.initials}</div>
      <div className="info">
        <h3>
          {builder.name}
          {builder.featured && <span className="verified">Licensed</span>}
        </h3>
        <div className="loc">📍 {builder.location}</div>
        <div className="stars">
          {builder.stars}{" "}
          <span style={{ color: "var(--ink-soft)", fontSize: ".82rem", fontWeight: 600 }}>{builder.rating}</span>
        </div>
        <div className="tags">
          {builder.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <Link href="/quote" className="btn btn-ghost" style={{ fontSize: ".82rem", padding: "8px 16px" }}>
          Request a quote
        </Link>
      </div>
    </div>
  );
}
