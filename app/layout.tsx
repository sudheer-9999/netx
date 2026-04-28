import "./globals.css";
import type { Metadata } from "next";
import { Orbitron, Exo_2, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-exo",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://netx-steel.vercel.app";
const siteName = "NetX Events";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "NetX Events | Jamming Sessions, Sports Tournaments & Campus Events",
    template: "%s | NetX Events",
  },
  description:
    "NetX Events creates high-energy jamming sessions, sports tournaments, and youth-first campus experiences in Kurnool.",
  keywords: [
    "NetX",
    "NetX Events",
    "NetX Events events",
    "NetX Kurnool",
    "event organizers",
    "jamming sessions",
    "college events",
    "sports tournaments",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "NetX Events | Jamming Sessions, Sports Tournaments & Campus Events",
    description:
      "NetX Events creates real experiences with jamming sessions, tournaments, and community-first events.",
    siteName,
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "NetX Events Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NetX Events | Official Site",
    description:
      "NetX Events creates real experiences with jamming sessions, tournaments, and campus events.",
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: ["NetX", "NetX Events"],
    url: siteUrl,
    logo: `${siteUrl}/logo.jpeg`,
    email: "netxevents@outlook.com",
    telephone: "+91-8328412214",
    sameAs: ["https://www.instagram.com/netx.events"],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={cn(
        orbitron.variable,
        exo2.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="font-exo">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
        {children}
      </body>
    </html>
  );
}
