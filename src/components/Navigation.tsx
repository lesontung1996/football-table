"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentGameId } from "@/store/slices/gamesSlice";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Navigation() {
  const pathname = usePathname();
  const currentGameId = useAppSelector(selectCurrentGameId);

  const inGameRoutes = [
    {
      path: "/schedule",
      label: "Schedule",
    },
    {
      path: "/table",
      label: "Table",
    },
  ];

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
            <picture>
              <Image
                src="/images/football-wheel-logo.svg"
                alt="Football Wheel"
                width={50}
                height={50}
              />
            </picture>
            <h1 className="text-h3">Football Wheel</h1>
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
        </div>
      </div>
    </nav>
  );
}
