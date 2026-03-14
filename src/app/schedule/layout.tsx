import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule | Football Wheel",
  description:
    "View your fixtures and match schedule. See all upcoming and past matches for your league.",
};

export default function ScheduleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
