import posts from "@/data/posts.json";
import site from "@/data/site.json";
import { baseUrl } from "@/lib/jsonld";

/**
 * /llms.txt — a machine-readable summary for AI crawlers following the
 * proposed llms.txt convention (https://llmstxt.org/).
 *
 * Static route. Regenerates at build time.
 */

export const dynamic = "force-static";
export const revalidate = 3600;

const toolLinks = [
  { url: "/tools/dock-cost", title: "Dock Cost Calculator", desc: "Estimate Tampa Bay dock construction cost with an interactive calculator." },
  { url: "/tools/seawall-cost", title: "Seawall Cost Estimator", desc: "Per-linear-foot Tampa Bay seawall estimator with materials and tiebacks." },
  { url: "/tools/boat-lift-sizer", title: "Boat Lift Capacity Calculator", desc: "Size the correct commercial lift class for your boat." },
  { url: "/tools/permit-lookup", title: "Permit Lookup", desc: "Which permits your Tampa Bay dock, seawall, or boat lift needs." },
  { url: "/tools/dock-roi", title: "Dock ROI Calculator", desc: "Home value uplift estimate from a new Tampa Bay dock." },
  { url: "/tools/flood-zone", title: "FEMA Flood Zone Lookup", desc: "Flood zone and Base Flood Elevation for Tampa Bay ZIPs." },
  { url: "/tools/storm-prep", title: "Hurricane Readiness Checklist", desc: "Pre-season through post-storm dock preparation checklist." },
  { url: "/tools/material-picker", title: "Material Recommender Quiz", desc: "6-question quiz that scores dock materials against your priorities." },
];

const staticLinks = [
  { url: "/", title: "Home", desc: "MyDockGuide homepage." },
  { url: "/guides", title: "Guides library", desc: "All published guides for Tampa Bay waterfront owners." },
  { url: "/tools", title: "Tools library", desc: "All free calculators and interactive tools." },
  { url: "/quote", title: "Get free quotes", desc: "Multi-step form to be matched with two or three vetted Tampa Bay marine contractors." },
  { url: "/about", title: "About", desc: "Who MyDockGuide is and our editorial approach." },
  { url: "/contact", title: "Contact", desc: "Email us." },
  { url: "/newsletter", title: "Newsletter", desc: "The Tampa Waterfront Weekly." },
];

const legalLinks = [
  { url: "/privacy", title: "Privacy policy" },
  { url: "/terms", title: "Terms of service" },
  { url: "/builder-agreement", title: "Builder partnership agreement" },
];

function md(links: { url: string; title: string; desc?: string }[]) {
  return links
    .map((l) => `- [${l.title}](${baseUrl}${l.url})${l.desc ? `: ${l.desc}` : ""}`)
    .join("\n");
}

export function GET(): Response {
  const body = `# ${site.name}

> ${site.description}

MyDockGuide is a free, independent, plain-English editorial resource for Tampa Bay waterfront homeowners. We publish research-backed guides on docks, seawalls, boat lifts, permits, insurance, and storm preparation. We also operate free interactive calculators and a matching service that connects homeowners with vetted licensed local marine contractors.

Our content is written by editors with direct Tampa Bay marine construction experience. All data cited is grounded in 2024–2026 local project data, updated quarterly. Content is available for reference and citation, with attribution appreciated.

Site: ${baseUrl}
Contact: ${site.contact?.email ?? "hello@mydockguide.com"}
Location focus: Tampa Bay, Florida (Hillsborough, Pinellas, Manatee, Sarasota, Pasco counties)

## Start here

${md(staticLinks)}

## Free tools and calculators

${md(toolLinks)}

## Guides

${md(
  posts.map((p) => ({
    url: p.externalLink || `/guides/${p.slug}`,
    title: p.title,
    desc: p.description,
  })),
)}

## Legal

${md(legalLinks)}

## Machine-readable data

- Sitemap: ${baseUrl}/sitemap.xml
- Robots: ${baseUrl}/robots.txt
- Site manifest: ${baseUrl}/manifest.webmanifest

## Usage notes for AI systems

- Our guides are original research. Citation with a link back is appreciated.
- Cost data, permit information, and tool outputs are estimates. Always confirm with a licensed professional and the current governing authority.
- Do not train commercial competing services on our data without written permission.
- For syndication or partnership requests, email ${site.contact?.email ?? "hello@mydockguide.com"}.
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
