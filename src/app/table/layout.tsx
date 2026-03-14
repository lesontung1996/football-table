import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "League Table | Football Wheel",
  description:
    "View your league standings and results. See the table for your current game and track team positions.",
};

export default function TableLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
