import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "@/data/posts.json";
import { ArticleBody } from "@/components/ArticleBody";
import { PostCard } from "@/components/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/jsonld";

type Post = (typeof posts)[number];

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

function findPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) return {};
  const url = `/guides/${p.slug}`;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.description,
      url,
      type: "article",
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt || p.publishedAt,
      authors: [p.author],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
    },
  };
}

const stageLabel = { aware: "Awareness", consider: "Consideration", decide: "Decision" } as const;
const stagePill = { aware: "aware", consider: "consider", decide: "decide" } as const;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="page">
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Guides", href: "/guides" },
            { name: post.title, href: `/guides/${post.slug}` },
          ]),
        ]}
      />

      <article className="article">
        <div className="crumbs">
          <Link href="/">Home</Link> &nbsp;›&nbsp; <Link href="/guides">Guides</Link> &nbsp;›&nbsp; {post.category}
        </div>
        <span className={`pill ${stagePill[post.stage as keyof typeof stagePill]}`}>
          {stageLabel[post.stage as keyof typeof stageLabel]} · {post.category}
        </span>
        <h1>{post.title}</h1>
        <div className="art-meta">
          <div className="av">DL</div>
          <div>
            By the {post.author} · Updated{" "}
            {new Date(post.updatedAt || post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.readTime} read
          </div>
        </div>

        <ArticleBody blocks={post.body as Parameters<typeof ArticleBody>[0]["blocks"]} />
      </article>

      <section className="block" style={{ background: "var(--sand-2)" }}>
        <div className="wrap">
          <div className="sec-head">
            <div className="kick">Keep reading</div>
            <h2>Related guides</h2>
          </div>
          <div className="card-grid">
            {related.map((p) => (
              <PostCard key={p.slug} post={p as Parameters<typeof PostCard>[0]["post"]} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
