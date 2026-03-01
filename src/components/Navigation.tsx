"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentGameId } from "@/store/slices/gamesSlice";

export default function Navigation() {
  const pathname = usePathname();
  const currentGameId = useAppSelector(selectCurrentGameId);

  const isGameListPage = pathname === "/";

  return (
    <nav className="sticky top-0 h-16 z-50 bg-fpl-1200 text-white border-b border-fpl-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {!isGameListPage && (
              <Link
                href="/"
                className="rounded-md bg-transparent border border-white px-3 py-1 text-sm font-medium hover:bg-white/10"
              >
                Back
              </Link>
            )}
            <h1 className="text-xl font-bold tracking-tight">
              Premier League Table
            </h1>
          </div>
          {!isGameListPage && currentGameId && (
            <div className="flex gap-2">
              <Link
                href="/schedule"
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === "/schedule"
                    ? "bg-fpl-purple-light font-semibold"
                    : "hover:bg-fpl-purple-light"
                }`}
              >
                Schedule
              </Link>
              <Link
                href="/table"
                className={`px-4 py-2 rounded-md transition-colors ${
                  pathname === "/table"
                    ? "bg-fpl-purple-light font-semibold"
                    : "hover:bg-fpl-purple-light"
                }`}
              >
                Table
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
