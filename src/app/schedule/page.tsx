"use client";

import { useAppSelector } from "@/store/hooks";
import MatchCard from "@/components/MatchCard";
import Navigation from "@/components/Navigation";
import {
  groupedMatchesByGameWeek,
  selectAllMatches,
} from "@/store/slices/normalizeMatchSlice";
import { selectAllTeams } from "@/store/slices/normalizeTeamSlice";
import { useEffect } from "react";

export default function SchedulePage() {
  const teams = useAppSelector(selectAllTeams);
  const matches = useAppSelector(selectAllMatches);
  const gameWeeks = useAppSelector(groupedMatchesByGameWeek);

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown";
  };

  const completedMatches = matches.filter((m) => m.completed).length;
  const totalMatches = matches.length;

  const lastCompletedMatch = matches.findLast((m) => m.completed);

  const scrollToGameWeek = (gameWeek: number) => {
    const gameWeekElement = document.getElementById(`game-week-${gameWeek}`);
    if (gameWeekElement) {
      gameWeekElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    if (lastCompletedMatch) {
      scrollToGameWeek(lastCompletedMatch.gameWeek);
    }
  }, []);

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
              <div
                key={weekIndex}
                id={`game-week-${weekIndex + 1}`}
                className="bg-fpl-purple rounded-lg p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">
                    <a href={`#game-week-${weekIndex + 1}`}>
                      Game Week {weekIndex + 1}
                    </a>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weekMatches?.map((match) => (
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
