"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import MatchCard from "@/components/MatchCard";
import Navigation from "@/components/Navigation";
import {
  groupedMatchesByGameWeek,
  selectAllMatches,
} from "@/store/slices/normalizeMatchSlice";
import { selectAllTeams } from "@/store/slices/normalizeTeamSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { selectCurrentGame } from "@/store/slices/gamesSlice";
import { generateSchedule } from "@/store/slices/normalizeMatchSlice";
import { saveLeagueStateForKey } from "@/utils/storage";

export default function SchedulePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const teams = useAppSelector(selectAllTeams);
  const matches = useAppSelector(selectAllMatches);
  const gameWeeks = useAppSelector(groupedMatchesByGameWeek);

  useEffect(() => {
    if (!currentGame?.id) {
      router.replace("/");
    }
  }, [currentGame?.id, router]);

  useEffect(() => {
    if (teams.length > 0 && matches.length === 0) {
      dispatch(generateSchedule(teams));
    }
    if (lastCompletedMatch) {
      scrollToGameWeek(lastCompletedMatch.gameWeek);
    }
    focusOnNextMatch();
  }, []);

  useEffect(() => {
    saveLeagueStateForKey(currentGame?.storageKey ?? "", {
      teams,
      matches,
    });
  }, [matches]);

  const completedMatches = matches.filter((m) => m.completed).length;
  const totalMatches = matches.length;

  const lastCompletedMatchIndex = matches.findLastIndex((m) => m.completed);
  const lastCompletedMatch = matches[lastCompletedMatchIndex];
  const nextMatch = matches[lastCompletedMatchIndex + 1];

  const scrollToGameWeek = (gameWeek: number) => {
    const gameWeekElement = document.getElementById(`game-week-${gameWeek}`);
    if (gameWeekElement) {
      gameWeekElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const focusOnNextMatch = () => {
    if (!nextMatch) return;
    const matchInputElement = document.getElementById(
      `homeScore-${nextMatch.id}`,
    );
    if (matchInputElement) {
      matchInputElement.focus();
    }
  };

  return (
    <div className="min-h-screen bg-fpl-1200">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-fpl-purple rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">Match Schedule</h2>
          {totalMatches > 0 ? (
            <p className="text-white/90 mb-4">
              {completedMatches} of {totalMatches} matches completed
            </p>
          ) : (
            <p className="text-white/90 mb-4">
              No matches scheduled yet for this game. Generate a schedule.
            </p>
          )}
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
                      homeTeamName={match.homeTeamName}
                      awayTeamName={match.awayTeamName}
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
