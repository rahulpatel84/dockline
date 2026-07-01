"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Builder = {
  slug: string;
  name: string;
  initials: string;
  location: string;
  stars: string;
  rating: string;
  ratingValue: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
};

type SortKey = "featured" | "rating" | "reviews" | "name";

export function DirectoryExplorer({ builders }: { builders: Builder[] }) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeArea, setActiveArea] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const allTags = useMemo(
    () => Array.from(new Set(builders.flatMap((b) => b.tags))).sort(),
    [builders],
  );

  const allAreas = useMemo(() => {
    const areas = builders.map((b) => b.location.split("·")[0]?.trim()).filter(Boolean) as string[];
    return Array.from(new Set(areas));
  }, [builders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = builders.filter((b) => {
      if (q) {
        const hay = `${b.name} ${b.location} ${b.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (activeTags.length && !activeTags.every((t) => b.tags.includes(t))) return false;
      if (activeArea !== "all" && !b.location.toLowerCase().includes(activeArea.toLowerCase())) return false;
      return true;
    });

    out.sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.ratingValue - a.ratingValue;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return b.ratingValue - a.ratingValue;
      }
    });
    return out;
  }, [builders, query, activeTags, activeArea, sort]);

  const toggleTag = (tag: string) =>
    setActiveTags((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));

  const reset = () => {
    setQuery("");
    setActiveTags([]);
    setActiveArea("all");
    setSort("featured");
  };

  const hasFilters = query || activeTags.length > 0 || activeArea !== "all" || sort !== "featured";

  return (
    <div className="dir-explorer">
      <div className="dir-toolbar">
        <div className="dir-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search by name, area, or service…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search builders"
          />
          {query && (
            <button className="dir-clear" onClick={() => setQuery("")} aria-label="Clear search" type="button">
              ×
            </button>
          )}
        </div>

        <div className="dir-controls">
          <label className="dir-select">
            <span>Area</span>
            <select value={activeArea} onChange={(e) => setActiveArea(e.target.value)} aria-label="Filter by area">
              <option value="all">All areas</option>
              {allAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
          <label className="dir-select">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort builders">
              <option value="featured">Featured first</option>
              <option value="rating">Highest rated</option>
              <option value="reviews">Most reviews</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="dir-chips" role="group" aria-label="Filter by service">
        {allTags.map((tag) => {
          const on = activeTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`dir-chip${on ? " on" : ""}`}
              aria-pressed={on}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="dir-meta">
        <span>
          <b>{filtered.length}</b> {filtered.length === 1 ? "builder" : "builders"}
          {builders.length !== filtered.length && ` of ${builders.length}`}
        </span>
        {hasFilters && (
          <button className="dir-reset" onClick={reset} type="button">
            Reset filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="dir-empty">
          <div className="dir-empty-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3>No builders match those filters</h3>
          <p>Try clearing a filter, or let us match you with a builder.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-ghost" onClick={reset} type="button">
              Reset filters
            </button>
            <Link href="/quote" className="btn btn-coral">
              Get matched →
            </Link>
          </div>
        </div>
      ) : (
        <div className="dir-cards">
          {filtered.map((b) => (
            <BuilderCardModern key={b.slug} builder={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function BuilderCardModern({ builder }: { builder: Builder }) {
  const profileHref = `/directory/${builder.slug}`;
  return (
    <article className={`bcard${builder.featured ? " bcard-feat" : ""}`}>
      {builder.featured && <span className="bcard-ribbon">★ Featured</span>}
      <div className="bcard-top">
        <Link href={profileHref} className="bcard-avatar" aria-label={`View ${builder.name} profile`}>
          {builder.initials}
        </Link>
        <div className="bcard-id">
          <h3>
            <Link href={profileHref} className="bcard-name-link">
              {builder.name}
            </Link>
          </h3>
          <div className="bcard-loc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
              <circle cx="12" cy="9" r="2.6" />
            </svg>
            {builder.location}
          </div>
          {builder.featured && <span className="bcard-verified">Licensed · Verified</span>}
        </div>
      </div>

      <div className="bcard-rating">
        <span className="bcard-stars" aria-hidden="true">
          {builder.stars}
        </span>
        <b>{builder.ratingValue.toFixed(1)}</b>
        <span className="bcard-reviews">({builder.reviewCount} reviews)</span>
      </div>

      <div className="bcard-tags">
        {builder.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <div className="bcard-actions">
        <Link href="/quote" className="btn btn-coral bcard-cta">
          Request a quote
        </Link>
        <Link href={profileHref} className="bcard-link">
          View profile →
        </Link>
      </div>
    </article>
  );
}
