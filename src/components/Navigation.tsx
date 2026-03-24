"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentGameId } from "@/store/slices/gamesSlice";
import { ArrowLeft, Medal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Route = {
  path: string;
  label: string;
};

export default function Navigation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const currentGameId = useAppSelector(selectCurrentGameId);

  const inGameRoutes: Route[] = [
    {
      path: "/schedule",
      label: "Schedule",
    },
    {
      path: "/table",
      label: "Table",
    },
  ];

  const leagueRoute: Route = {
    path: "/league",
    label: "Create League",
  };

  const isHomeRoute = pathname === "/";
  const isInGameRoutes = inGameRoutes.some((route) => pathname === route.path);

  return (
    <nav className="sticky top-0 h-16 z-50 bg-fpl-1200 text-white border-b border-fpl-800">
      <div className="2xl:container w-full mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            {isInGameRoutes && (
              <Link
                href="/league"
                className="flex items-center gap-2 rounded-md bg-transparent border border-white px-3 py-1 text-sm font-medium hover:bg-white/10"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
            )}
            <Link
              href="/"
              className={cn(
                "group flex items-center gap-3",
                isInGameRoutes && "hidden md:flex",
              )}
              aria-label="Go to Football Wheel home"
              onMouseEnter={() => setIsAnimating(true)}
            >
              <picture>
                <Image
                  src="/images/football-wheel-logo.svg"
                  alt="Football Wheel"
                  width={50}
                  height={50}
                  className={cn(
                    isAnimating &&
                      "transition-transform duration-500 ease-out rotate-[360deg]",
                  )}
                  onTransitionEnd={() => setIsAnimating(false)}
                />
              </picture>
              <span className="text-h3 font-bold">Football Wheel</span>
            </Link>
          </div>
          {isInGameRoutes && currentGameId && (
            <div className="flex gap-2">
              {inGameRoutes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    pathname === route.path
                      ? "bg-fpl-1000 font-semibold"
                      : "hover:bg-fpl-1000"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          )}
          {isHomeRoute && (
            <Link
              href="/league"
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-fpl-1000"
            >
              <Medal size={16} />
              {leagueRoute.label}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
