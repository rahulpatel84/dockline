import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/jsonld";
import site from "@/data/site.json";

const description =
  "MyDockGuide privacy policy. What data we collect, how we use it, who we share it with (matched builders you request only), and your rights.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy · MyDockGuide", description, url: "/privacy", type: "website" },
  robots: { index: true, follow: true },
};

const EFFECTIVE = "July 14, 2026";

export default function PrivacyPage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/privacy",
            title: "Privacy Policy",
            description,
          }),
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Privacy", href: "/privacy" },
          ]),
        ]}
      />
      <article className="article legal">
        <div className="crumbs">
          <Link href="/">Home</Link> &nbsp;›&nbsp; Privacy Policy
        </div>
        <h1>Privacy Policy</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: -10, marginBottom: 24 }}>
          Effective {EFFECTIVE}
        </p>

        <p>
          MyDockGuide (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) respects your privacy. This policy explains what we collect, why,
          how we use it, and your choices. Questions? Reach us at{" "}
          <a href={`mailto:${site.contact?.email}`}>{site.contact?.email}</a>.
        </p>

        <h2>1. What we collect</h2>
        <p>
          <b>Information you give us.</b> When you use our forms, we collect the name, email, phone number,
          project details, ZIP code, and any other information you enter. When you subscribe to our newsletter,
          we collect your email address.
        </p>
        <p>
          <b>Information collected automatically.</b> We use privacy-friendly analytics (Vercel Analytics and
          Plausible) that record aggregate page views, referrers, screen size, country, and browser type. We do
          not use cookies to identify individual users.
        </p>
        <p>
          <b>Information we do not collect.</b> We do not track you across other websites. We do not build
          advertising profiles on you. We do not sell any information to data brokers.
        </p>

        <h2>2. How we use it</h2>
        <ul>
          <li><b>To match you with builders.</b> If you submit our quote form, we share your project details with two or three vetted licensed marine contractors we have selected as a fit.</li>
          <li><b>To send you what you asked for.</b> Newsletter, planning kit PDF, tool results emails.</li>
          <li><b>To improve the site.</b> Aggregate analytics help us prioritize which guides to write.</li>
          <li><b>To respond to your inquiries.</b> Any email you send lands in our inbox and is used only to reply to you.</li>
        </ul>

        <h2>3. Who we share it with</h2>
        <p>
          <b>Matched builders (only if you submit the quote form).</b> We share the project details you provide
          with the specific licensed marine contractors we match you with. We do not share your information with
          any builders you did not request quotes from.
        </p>
        <p>
          <b>Service providers.</b> We use trusted third parties to operate the site: Vercel (hosting), Beehiiv or
          ConvertKit (email delivery), Plausible (analytics). Each processes limited data on our behalf under
          their own privacy commitments.
        </p>
        <p>
          <b>Legal obligations.</b> We disclose information only when required by law (subpoena, court order,
          fraud investigation).
        </p>
        <p>
          <b>What we do not do.</b> We do not sell your data. We do not share it with data brokers. We do not
          use it for retargeted advertising.
        </p>

        <h2>4. Cookies</h2>
        <p>
          MyDockGuide does not use tracking cookies. We use one strictly-necessary session cookie for form state
          and one cookie for saving your progress on interactive tools (like the Hurricane Readiness Checklist).
          Neither is used for advertising or cross-site tracking.
        </p>

        <h2>5. Your rights</h2>
        <p>
          Wherever you live, you have the right to:
        </p>
        <ul>
          <li>Ask what data we hold about you</li>
          <li>Ask us to correct or delete it</li>
          <li>Ask us not to share it with builders (this means we cannot process a quote request, but everything else works)</li>
          <li>Unsubscribe from any email at any time (every email has a one-click unsubscribe)</li>
        </ul>
        <p>
          California residents have additional rights under the CCPA. EU/UK residents have additional rights under
          GDPR. To exercise any right, email us at <a href={`mailto:${site.contact?.email}`}>{site.contact?.email}</a>{" "}
          with the subject line &quot;Data request.&quot; We reply within 30 days.
        </p>

        <h2>6. Data retention</h2>
        <p>
          Quote form submissions are retained for 3 years so we can help resolve any builder disputes. Newsletter
          subscriptions are retained until you unsubscribe. Analytics are retained in aggregate form only, with no
          personal identifiers.
        </p>

        <h2>7. Security</h2>
        <p>
          The site runs on HTTPS. Form data is encrypted in transit and at rest. We use industry-standard security
          practices, though no system is 100% secure. If we ever experience a breach, we will notify affected users
          within 72 hours.
        </p>

        <h2>8. Children</h2>
        <p>
          MyDockGuide is not directed at children under 13. We do not knowingly collect information from anyone
          under 13. If we learn we have, we will delete it immediately.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          We update this policy from time to time. The effective date at the top reflects the most recent update.
          Material changes are announced by email to newsletter subscribers.
        </p>

        <h2>10. Contact</h2>
        <p>
          Questions or concerns: <a href={`mailto:${site.contact?.email}`}>{site.contact?.email}</a>. Reach us
          about anything related to your data or this policy and we&apos;ll reply within a few business days.
        </p>
      </article>
    </main>
  );
}
