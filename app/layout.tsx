import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { site } from "@/site.config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallBar } from "@/components/StickyCallBar";
import { JsonLd } from "@/components/JsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `Home Care in ${site.metro}, ${site.stateAbbr} | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: `Home care in ${site.county}, ${site.stateAbbr} from a local team: companion, personal, dementia, 24-hour and overnight care. Real published rates. Free assessment.`,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": ["HomeHealthCareService", "Organization"],
  "@id": `${site.domain}/#organization`,
  name: site.name,
  url: site.domain,
  telephone: site.phone,
  email: site.email,
  description: `Non-medical home care agency serving ${site.county}, ${site.stateAbbr}: companion care, personal care, dementia care, 24-hour, live-in, overnight, respite, post-hospital, and veterans home care.`,
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: `${site.county}, ${site.stateAbbr}`,
    },
    ...site.towns.map((t) => ({ "@type": "City" as const, name: t.name })),
  ],
  serviceType: [
    "Companion care",
    "Personal care",
    "Dementia care",
    "24-hour home care",
    "Live-in care",
    "Overnight care",
    "Respite care",
    "Post-hospital care",
    "Veterans home care",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        <JsonLd data={orgJsonLd} />
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyCallBar />
      </body>
    </html>
  );
}
