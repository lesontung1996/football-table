"use client";

import { useAppSelector } from "@/store/hooks";
import MatchCard from "@/components/MatchCard";
import Navigation from "@/components/Navigation";
import { groupMatchesByGameWeek } from "@/utils/matchGrouper";
import { useMemo } from "react";

export default function SchedulePage() {
  const { teams, matches } = useAppSelector((state) => state.league);

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown";
  };

  const completedMatches = matches.filter((m) => m.completed).length;
  const totalMatches = matches.length;

  // Group matches by game week
  const gameWeeks = useMemo(() => {
    if (matches.length === 0 || teams.length < 2) {
      return [];
    }
    return groupMatchesByGameWeek(matches, teams.length);
  }, [matches, teams.length]);

  return (
    <div className="min-h-screen bg-fpl-purple-dark">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-fpl-purple rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">Match Schedule</h2>
          <p className="text-white/90 mb-4">
            {totalMatches > 0
              ? `${completedMatches} of ${totalMatches} matches completed`
              : "No matches scheduled. Go to Teams page to add teams and generate schedule."}
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-fpl-purple rounded-lg p-6 text-center">
            <p className="text-white/90 mb-4">
              No matches available. Please add teams and generate a schedule
              first.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {gameWeeks.map((weekMatches, weekIndex) => (
              <div key={weekIndex} className="bg-fpl-purple rounded-lg p-6">
                <div className="mb-4 pb-4 border-b border-white/20">
                  <h3 className="text-xl font-bold text-white">
                    Game Week {weekIndex + 1}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    {weekMatches.length} match
                    {weekMatches.length !== 1 ? "es" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weekMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      homeTeamName={getTeamName(match.homeTeamId)}
                      awayTeamName={getTeamName(match.awayTeamId)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
