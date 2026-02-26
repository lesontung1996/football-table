"use client";

import LeagueTable from "@/components/LeagueTable";
import Navigation from "@/components/Navigation";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectCurrentGameId } from "@/store/slices/gamesSlice";

export default function TablePage() {
  const router = useRouter();
  const currentGameId = useAppSelector(selectCurrentGameId);

  useEffect(() => {
    if (!currentGameId) {
      router.replace("/");
    }
  }, [currentGameId, router]);

  return (
    <div className="min-h-screen bg-fpl-1200">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-fpl-purple rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">League Table</h2>
          <LeagueTable />
        </div>
      </main>
    </div>
  );
}
