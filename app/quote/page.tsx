import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, baseUrl, webPageSchema } from "@/lib/jsonld";
import site from "@/data/site.json";

const description =
  "Tell us about your project. We'll match you with up to three licensed Tampa Bay dock, seawall, and boat lift builders — free, no obligation.";

export const metadata: Metadata = {
  title: "Get 3 Free Dock Quotes in Tampa Bay",
  description,
  keywords: [
    "free dock quote Tampa",
    "Tampa dock builder quote",
    "compare Tampa seawall quotes",
    "boat lift installer quote Florida",
  ],
  alternates: { canonical: "/quote" },
  openGraph: {
    title: "Get 3 Free Dock Quotes in Tampa Bay",
    description:
      "Get matched with vetted licensed Tampa Bay marine contractors — free, no obligation.",
    url: "/quote",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get 3 Free Dock Quotes in Tampa Bay",
    description,
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Dock & Seawall Builder Matching",
  provider: { "@type": "Organization", name: site.name, url: baseUrl },
  areaServed: site.areaServed.map((a) => ({ "@type": "Place", name: a })),
  description:
    "Free matching service connecting Tampa Bay waterfront homeowners with up to three licensed, insured dock and seawall contractors.",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
};

export default function QuotePage() {
  return (
    <main className="page">
      <JsonLd
        data={[
          webPageSchema({
            path: "/quote",
            title: "Get 3 Free Dock Quotes in Tampa Bay",
            description,
            speakableSelectors: [".quote-hero h1", ".quote-hero p"],
          }),
          serviceSchema,
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Get Quotes", href: "/quote" },
          ]),
        ]}
      />
      <section className="quote-hero">
        <div className="wrap">
          <h1>Get 3 free dock quotes</h1>
          <p>
            Tell us about your project. We&apos;ll match you with up to three licensed Tampa Bay builders — no
            obligation, no pressure.
          </p>
        </div>
      </section>
      <QuoteForm />
      <div style={{ height: 70 }} />
    </main>
  );
}
