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

export const metadata: Metadata = {
  title: "Football Wheel",
  description: "Football wheel for quick random team selection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${quicksand.variable} antialiased`}>
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
