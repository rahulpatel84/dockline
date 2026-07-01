import Link from "next/link";
import { ThumbSVG } from "./ThumbSVG";

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
  return (
    <Link href={href} className="post">
      <div className="thumb">
        <ThumbSVG stage={post.stage} />
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
