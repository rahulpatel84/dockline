import assets from "@/data/guide-assets.json";

/**
 * Cover + social asset paths for each guide, derived from data/guide-assets.json.
 *
 * Assets are pre-generated SVGs living in /public — see scripts/generate-assets.mjs.
 * Runtime hits the file system only for social listings (server pages) — cover
 * lookup is a plain map access and safe in client components too.
 */

const guideMap = assets.guides as Record<string, { headline: string; keyStat: string }>;

export function hasCover(slug: string): boolean {
  return slug in guideMap;
}

export function coverPath(slug: string): string {
  return hasCover(slug) ? `/covers/${slug}.svg` : "/og.png";
}

export function socialAssetPaths(slug: string): {
  instagramSquare: string;
  instagramStory: string;
  twitterCard: string;
  pinterest: string;
  carousel: string[];
} | null {
  if (!hasCover(slug)) return null;
  const base = `/social/${slug}`;
  return {
    instagramSquare: `${base}/instagram-square.svg`,
    instagramStory: `${base}/instagram-story.svg`,
    twitterCard: `${base}/twitter-card.svg`,
    pinterest: `${base}/pinterest.svg`,
    carousel: Array.from({ length: 5 }, (_, i) => `${base}/carousel-${i + 1}.svg`),
  };
}
