import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Leagues | Football Wheel",
  description:
    "Create and manage your leagues. Set up a new game, choose teams, and start picking random matchups.",
};

export default function LeagueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
