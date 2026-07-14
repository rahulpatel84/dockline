import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";
import site from "@/data/site.json";

const description =
  "MyDockGuide terms of service. Acceptable use, disclaimers, the fact that our content is educational and not legal or engineering advice.";

export const metadata: Metadata = {
  title: "Terms of Service",
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms of Service · MyDockGuide", description, url: "/terms", type: "website" },
  robots: { index: true, follow: true },
};

const EFFECTIVE = "July 14, 2026";

export default function TermsPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/terms",
            title: "Terms of Service",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Terms", href: "/terms" },
          ]),
        ]}
      />
      <article className="article legal">
        <div className="crumbs">
          <Link href="/">Home</Link> &nbsp;›&nbsp; Terms of Service
        </div>
        <h1>Terms of Service</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: -10, marginBottom: 24 }}>
          Effective {EFFECTIVE}
        </p>

        <p>
          These terms govern your use of MyDockGuide (mydockguide.com), including our guides, calculators, and
          the quote-matching service. By using the site you agree to these terms.
        </p>

        <h2>1. What MyDockGuide is</h2>
        <p>
          MyDockGuide is an editorial resource for Tampa Bay waterfront homeowners. We publish guides on docks,
          seawalls, boat lifts, permits, insurance, and related topics. We also provide free tools (calculators,
          checklists) and a matching service that connects homeowners with vetted licensed marine contractors.
        </p>

        <h2>2. Not legal, engineering, or professional advice</h2>
        <p>
          Everything on MyDockGuide is educational content. It is not legal advice, engineering advice, contractor
          advice, insurance advice, or a substitute for a licensed professional. Cost estimates, timelines, and
          permit information are based on our best 2026 data but individual projects vary. Always confirm with a
          licensed contractor and the current governing authority before making decisions.
        </p>

        <h2>3. No warranty on cost estimates or tool results</h2>
        <p>
          Our Dock Cost Calculator, Seawall Cost Estimator, Boat Lift Sizer, Permit Lookup, Flood Zone Lookup,
          Dock ROI Calculator, and Material Recommender produce estimates only. Actual costs, timelines, permit
          requirements, flood zones, and material recommendations vary. Do not commit to a project based on tool
          output alone. Get site visits, written quotes, and official permit determinations before contracting.
        </p>

        <h2>4. The matching service</h2>
        <p>
          When you submit a quote request, we share your project details with two or three licensed marine
          contractors we have selected as a fit. We independently verify licensing and insurance for every builder
          in our network, but we do not guarantee the quality, timeliness, price, or outcome of any specific
          builder&apos;s work.
        </p>
        <p>
          The contract for construction is between you and the builder you choose. MyDockGuide is not a party
          to that contract. Disputes about pricing, timeline, quality, or completion are between you and the
          builder. If a builder in our network mistreats you, please tell us so we can act.
        </p>

        <h2>5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Scrape or crawl the site in a way that disrupts service</li>
          <li>Submit false or misleading information in any form</li>
          <li>Use the site to spam builders or harass other users</li>
          <li>Republish substantial portions of our content without attribution</li>
          <li>Use our tools or content to compete against us commercially (building a similar service using our data)</li>
        </ul>

        <h2>6. Intellectual property</h2>
        <p>
          All content on MyDockGuide, including guides, tools, images, illustrations, and code, is copyright
          MyDockGuide unless otherwise noted. You may share and link to any page. You may quote up to 200 words
          in commentary with attribution. Anything else requires written permission.
        </p>

        <h2>7. Third-party links and affiliate disclosure</h2>
        <p>
          We link to external sites for reader convenience. Some outbound links are affiliate links (we may earn
          a commission if you purchase). Every affiliate link is marked and disclosed. We only recommend products
          we would spec on our own dock. External sites have their own terms and privacy policies; MyDockGuide is
          not responsible for their content.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, MyDockGuide is not liable for indirect, incidental,
          consequential, or punitive damages arising from your use of the site, our tools, our matching service,
          or any resulting contractor relationship. Our total aggregate liability for any claim is limited to the
          amount you paid us in the past 12 months (which for most users is zero).
        </p>

        <h2>9. Indemnification</h2>
        <p>
          You agree to indemnify MyDockGuide against claims arising from your violation of these terms or your
          misuse of the site.
        </p>

        <h2>10. Governing law</h2>
        <p>
          These terms are governed by Florida law. Any dispute is resolved in the state or federal courts located
          in Hillsborough County, Florida.
        </p>

        <h2>11. Changes to these terms</h2>
        <p>
          We update these terms occasionally. The effective date at the top reflects the most recent version.
          Continued use of the site after changes means you accept the new terms.
        </p>

        <h2>12. Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${site.contact?.email}`}>{site.contact?.email}</a>.
        </p>
      </article>
    </main>
  );
}
