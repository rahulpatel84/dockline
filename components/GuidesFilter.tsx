"use client";

import { useState } from "react";
import { PostCard } from "./PostCard";

type Post = Parameters<typeof PostCard>[0]["post"] & {
  stage: "aware" | "consider" | "decide";
};

const filters: Array<{ label: string; value: "all" | Post["stage"] }> = [
  { label: "All", value: "all" },
  { label: "Awareness", value: "aware" },
  { label: "Consideration", value: "consider" },
  { label: "Decision", value: "decide" },
];

export function GuidesFilter({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<(typeof filters)[number]["value"]>("all");
  const list = active === "all" ? posts : posts.filter((p) => p.stage === active);

  return (
    <>
      <div
        id="filterbar"
        style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}
      >
        {filters.map((f) => (
          <button
            key={f.value}
            className={`btn ${active === f.value ? "btn-ocean" : "btn-ghost"}`}
            onClick={() => setActive(f.value)}
            type="button"
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="card-grid">
        {list.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </>
  );
}
