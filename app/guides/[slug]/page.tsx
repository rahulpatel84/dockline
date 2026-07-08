import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "@/data/posts.json";
import site from "@/data/site.json";
import { ArticleBody } from "@/components/ArticleBody";
import { PostCard } from "@/components/PostCard";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/jsonld";

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
    keywords: [p.category, "Tampa Bay dock", "Tampa dock guide", p.title],
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.description,
      url,
      type: "article",
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt || p.publishedAt,
      authors: [p.author],
      section: p.category,
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: p.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: [site.ogImage],
    },
  };
}

type FaqBlock = { type: string; heading?: string; items?: { q: string; a: string }[] };

function extractFaqs(body: unknown[]): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  for (const raw of body) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as FaqBlock;
    if ((b.type === "faq" || b.type === "faqs") && Array.isArray(b.items)) {
      for (const it of b.items) {
        if (it && typeof it.q === "string" && typeof it.a === "string") faqs.push({ q: it.q, a: it.a });
      }
    }
  }
  return faqs;
}

const stageLabel = { aware: "Awareness", consider: "Consideration", decide: "Decision" } as const;
const stagePill = { aware: "aware", consider: "consider", decide: "decide" } as const;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const faqs = extractFaqs(post.body as unknown[]);

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
          ...(faqs.length ? [faqSchema(faqs)] : []),
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
          <div className="av">MG</div>
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
