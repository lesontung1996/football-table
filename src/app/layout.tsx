import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Navigation from "@/components/Navigation";
import LoadingWrapper from "@/components/LoadingWrapper";
import { GoogleAnalytics } from "@next/third-parties/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://footballwheel.com";

const siteTitle =
  "Football Wheel — Random Team Picker | 1 Click | Free | No Sign-Up";
const siteDescription =
  "Instantly pick a random football team in one click. Premier League, Champions League, national teams & more. Fully customizable, no sign-up, no fuss — just spin and play.";
const siteKeywords = [
  "football wheel",
  "random football team picker",
  "football wheel spinner",
  "football team wheel",
  "wheel of football teams",
  "spin the wheel football teams",
  "random soccer team",
  "random football club",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Football Wheel",
  description: siteDescription,
  keywords: siteKeywords,
  url: baseUrl,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: siteKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "Football Wheel",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <GoogleAnalytics gaId="G-ZVQRFGB3M2" />
      <body className={`${quicksand.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <StoreProvider>
          <div className="flex flex-col min-h-screen bg-fpl-1200">
            <Navigation />
            <LoadingWrapper>{children}</LoadingWrapper>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
