import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const premierLeague = localFont({
  src: [
    {
      path: "./fonts/PremierLeagueW01-Regular.woff2",
      weight: "400",
    },
    {
      path: "./fonts/PremierLeagueW01-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-premier-league",
});

export const metadata: Metadata = {
  title: "Premier League Table",
  description: "Football league table manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${premierLeague.variable} antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
