import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Navigation from "@/components/Navigation";
import LoadingWrapper from "@/components/LoadingWrapper";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://footballwheel.com";

const siteTitle = "Football Wheel — Random Football Team Picker";
const siteDescription =
  "Spin the wheel to pick random football teams for your next match. Use Champions League, Premier League, or custom leagues. One or two wheels — instant matchups. Free and fun for friends and mini-leagues.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Football Wheel",
  description: siteDescription,
  url: baseUrl,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: siteTitle,
  description: siteDescription,
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
