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
    <main className="2xl:container w-full mx-auto p-4">
      <div className="bg-fpl-1000 rounded-lg p-6">
        <h1 className="text-h1 mb-4 text-white">League Table</h1>
        <LeagueTable />
      </div>
    </main>
  );
}
