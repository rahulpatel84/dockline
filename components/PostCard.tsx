import Link from "next/link";
import { ThumbSVG } from "./ThumbSVG";
import { coverPath, hasCover } from "@/lib/guide-covers";

type Post = {
  slug: string;
  stage: "aware" | "consider" | "decide";
  category: string;
  title: string;
  description: string;
  readTime: string;
  externalLink?: string;
};

const labelFor = { aware: "Awareness", consider: "Consideration", decide: "Decision" } as const;
const pillFor = { aware: "aware", consider: "consider", decide: "decide" } as const;

export function PostCard({ post }: { post: Post }) {
  const href = post.externalLink || `/guides/${post.slug}`;
  const useCover = hasCover(post.slug);
  return (
    <Link href={href} className="post">
      <div className="thumb">
        {useCover ? (
          <img
            src={coverPath(post.slug)}
            alt={post.title}
            loading="lazy"
            width={1200}
            height={630}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <ThumbSVG stage={post.stage} />
        )}
      </div>
      <div className="body">
        <span className={`pill ${pillFor[post.stage]}`}>
          {labelFor[post.stage]} · {post.category}
        </span>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <div className="meta">{post.readTime} read &nbsp;·&nbsp; Read guide →</div>
      </div>
    </Link>
  );
}
