import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule | Football Wheel",
  description:
    "Fixtures for your game. See upcoming and past matches — who’s playing who, and when.",
  alternates: { canonical: "/schedule" },
};

export default function ScheduleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
