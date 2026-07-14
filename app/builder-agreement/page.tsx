import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";
import site from "@/data/site.json";

const description =
  "Terms for marine contractors in the MyDockGuide network. Eligibility, lead pricing, service standards, and how the matching partnership works.";

export const metadata: Metadata = {
  title: "Builder Partnership Agreement",
  description,
  alternates: { canonical: "/builder-agreement" },
  openGraph: { title: "Builder Partnership Agreement · MyDockGuide", description, url: "/builder-agreement", type: "website" },
  robots: { index: true, follow: true },
};

const EFFECTIVE = "July 14, 2026";

export default function BuilderAgreementPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/builder-agreement",
            title: "Builder Partnership Agreement",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Builder Agreement", href: "/builder-agreement" },
          ]),
        ]}
      />
      <article className="article legal">
        <div className="crumbs">
          <Link href="/">Home</Link> &nbsp;›&nbsp; Builder Partnership Agreement
        </div>
        <h1>Builder Partnership Agreement</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: -10, marginBottom: 24 }}>
          Effective {EFFECTIVE}
        </p>

        <p>
          This agreement governs the relationship between MyDockGuide and licensed marine contractors who receive
          matched leads through our platform. Contact <a href={`mailto:${site.contact?.email}`}>{site.contact?.email}</a>{" "}
          to apply to the network.
        </p>

        <h2>1. Eligibility</h2>
        <p>To be considered for our network, a builder must:</p>
        <ul>
          <li>Hold a current Florida marine contractor license (verifiable at MyFloridaLicense.com)</li>
          <li>Carry current general liability and workers compensation insurance</li>
          <li>Have completed at least 20 dock, seawall, or boat lift projects in Tampa Bay in the last 24 months</li>
          <li>Provide at least three verifiable local references</li>
          <li>Agree to a background check on the primary business owner</li>
          <li>Complete our onboarding call and quality standards review</li>
        </ul>

        <h2>2. Lead pricing</h2>
        <p>
          Builders pay MyDockGuide a per-lead fee only when we match a homeowner to them. Pricing varies by
          project value tier:
        </p>
        <ul>
          <li><b>Standard lead</b> (project value $10,000 to $30,000): $95</li>
          <li><b>Premium lead</b> (project value $30,000 to $100,000): $250</li>
          <li><b>Enterprise lead</b> (project value $100,000+): $500</li>
          <li><b>Storm rebuild rush lead</b> (post-hurricane): $150</li>
        </ul>
        <p>
          Leads are invoiced monthly on the 1st, payable within 15 days. Late payment stops new lead delivery
          until account is current.
        </p>

        <h2>3. What builders get</h2>
        <ul>
          <li>Qualified project inquiries matched to your service areas and project types</li>
          <li>Homeowner contact information (name, email, phone, project details)</li>
          <li>Two-to-three-builder match per lead (never sold to 20 companies)</li>
          <li>48-hour exclusivity window on match delivery</li>
          <li>Direct-response tracking dashboard</li>
          <li>Optional featured placement in a future public directory (separate pricing)</li>
        </ul>

        <h2>4. Service standards</h2>
        <p>To stay in the network, builders must:</p>
        <ul>
          <li>Respond to matched leads within 24 hours (business day)</li>
          <li>Provide a written quote within 5 business days of site visit</li>
          <li>Maintain a minimum 4.2-star average across MyDockGuide-tracked reviews</li>
          <li>Notify us immediately of any lawsuit, license issue, or insurance lapse</li>
          <li>Never contact homeowners we did not match to you</li>
          <li>Never resell homeowner contact information to third parties</li>
        </ul>

        <h2>5. Quality review</h2>
        <p>
          We monitor lead outcomes (quoted, signed, completed, disputes) and conduct periodic quality reviews.
          Builders below service standards receive a written warning and a 30-day improvement period. Repeated
          issues result in network removal.
        </p>

        <h2>6. Non-disparagement and confidentiality</h2>
        <p>
          Builders agree not to disparage MyDockGuide or other builders in the network publicly. Lead volumes,
          pricing tiers, and dashboard data are confidential.
        </p>

        <h2>7. Non-solicitation</h2>
        <p>
          Builders may not attempt to remove homeowners from our matching system by offering off-platform incentives
          or by contacting homeowners not matched to them. This includes not contacting homeowners you meet at
          MyDockGuide events or through our newsletter list.
        </p>

        <h2>8. Termination</h2>
        <p>
          Either party may terminate this agreement with 30 days written notice. MyDockGuide may terminate
          immediately for cause: license lapse, insurance lapse, fraud, homeowner mistreatment, or non-payment.
          Termination does not release either party from obligations for leads already delivered.
        </p>

        <h2>9. Warranty and liability</h2>
        <p>
          MyDockGuide provides lead-matching services only. We do not warrant the outcome of any specific quote
          or project. Construction warranties, insurance, and liability for completed work are entirely the
          builder&apos;s responsibility. MyDockGuide is not liable for a builder&apos;s workmanship, timing, or
          business practices.
        </p>

        <h2>10. Governing law</h2>
        <p>
          Governed by Florida law. Disputes are resolved in the state or federal courts located in Hillsborough
          County, Florida.
        </p>

        <h2>11. Apply</h2>
        <p>
          Interested in joining? Email <a href={`mailto:${site.contact?.email}`}>{site.contact?.email}</a> with
          the subject line &quot;Builder application&quot;. Include your license number, service areas,
          years in business, and three recent Tampa Bay project references.
        </p>
      </article>
    </main>
  );
}
