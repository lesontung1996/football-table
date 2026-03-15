import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "League Table | Football Wheel",
  description:
    "Your league table at a glance. See standings and results for your current game with mates.",
  alternates: { canonical: "/table" },
};

export default function TableLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
