import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import site from "@/data/site.json";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema, baseUrl } from "@/lib/jsonld";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c3b46",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: baseUrl }],
  creator: site.name,
  publisher: site.name,
  generator: "Next.js",
  keywords: [
    "Tampa dock builder",
    "Tampa Bay seawall",
    "dock permits Florida",
    "boat lift Tampa",
    "marine contractor Tampa",
    "dock cost Tampa",
    "Hillsborough dock permit",
    "Pinellas dock builder",
    "St. Petersburg dock builder",
    "Clearwater seawall",
    "Apollo Beach marine contractor",
    "FDEP dock permit",
    "Army Corps dock permit Florida",
    "composite dock Tampa",
    "floating dock Tampa Bay",
    "seawall cost Florida",
    "mydockguide",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: site.verification?.google || undefined,
    yandex: site.verification?.yandex || undefined,
    other: site.verification?.bing ? { "msvalidate.01": site.verification.bing } : undefined,
  },
  alternates: {
    canonical: "/",
    languages: { "en-US": "/" },
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: baseUrl,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
    creator: site.twitter,
    site: site.twitter,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  category: "construction",
  other: {
    "geo.region": "US-FL",
    "geo.placename": "Tampa Bay",
    "geo.position": "27.9506;-82.4572",
    ICBM: "27.9506, -82.4572",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <body suppressHydrationWarning>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
