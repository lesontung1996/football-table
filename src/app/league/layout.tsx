import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Leagues | Football Wheel",
  description:
    "Your games with mates. Create a league, add teams, spin the wheel for random matchups — no account needed.",
  alternates: { canonical: "/league" },
};

export default function LeagueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
