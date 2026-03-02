"use client";

import { useAppSelector } from "@/store/hooks";
import { selectIsLoading } from "@/store/slices/gamesSlice";
import { LoaderCircle } from "lucide-react";

export default function LoadingWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoading = useAppSelector(selectIsLoading);

  if (isLoading) {
    return (
      <div className="flex h-[70dvh] flex-col items-center justify-center gap-4 py-8 text-center text-white/90">
        <LoaderCircle size={24} className="animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}
