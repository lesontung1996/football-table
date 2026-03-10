"use client";

import LeagueTable from "@/components/LeagueTable";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  selectCurrentGameId,
  selectIsLoading,
} from "@/store/slices/gamesSlice";

export default function TablePage() {
  const router = useRouter();
  const currentGameId = useAppSelector(selectCurrentGameId);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isLoading && !currentGameId) {
      router.replace("/");
      return;
    }
  }, [isLoading]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-fpl-1000 rounded-lg p-6">
        <h2 className="text-h1 mb-4 text-white">League Table</h2>
        <LeagueTable />
      </div>
    </main>
  );
}
