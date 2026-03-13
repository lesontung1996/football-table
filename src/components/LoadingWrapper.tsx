"use client";

import { useAppSelector } from "@/store/hooks";
import { selectIsLoading } from "@/store/slices/gamesSlice";
import Image from "next/image";

export default function LoadingWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoading = useAppSelector(selectIsLoading);

  if (isLoading) {
    return (
      <div className="flex h-[80dvh] flex-col items-center justify-center gap-4 py-8 text-white/90">
        <Image
          src="/images/football-wheel-logo.svg"
          alt="Football Wheel"
          width={60}
          height={60}
          className="relative z-10 animate-spin-ease-out"
        />
        <div className="text-center space-y-1">
          <p className="text-body-sm text-white/90">
            Spinning up your fixtures
          </p>
          <p className="text-body-xs text-white/60 font-mono">Please wait...</p>
        </div>
      </div>
    );
  }

  return children;
}
