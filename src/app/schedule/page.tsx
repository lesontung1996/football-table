"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import MatchCard from "@/components/MatchCard";
import {
  groupedMatchesByGameWeek,
  selectAllMatches,
} from "@/store/slices/normalizeMatchSlice";
import { selectAllTeams } from "@/store/slices/normalizeTeamSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  selectCurrentGame,
  selectCurrentGameId,
  selectIsLoading,
} from "@/store/slices/gamesSlice";
import { generateSchedule } from "@/store/slices/normalizeMatchSlice";
import { saveLeagueStateForKey } from "@/utils/storage";
import { CircleCheck } from "lucide-react";
import { Match } from "@/types";

export default function SchedulePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const currentGameId = useAppSelector(selectCurrentGameId);
  const isLoading = useAppSelector(selectIsLoading);
  const teams = useAppSelector(selectAllTeams);
  const matches = useAppSelector(selectAllMatches);
  const gameWeeks = useAppSelector(groupedMatchesByGameWeek);

  useEffect(() => {
    if (!isLoading && !currentGameId) {
      router.replace("/");
      return;
    }
  }, [isLoading]);

  useEffect(() => {
    if (teams.length > 0 && matches.length === 0) {
      dispatch(generateSchedule(teams));
    }
    if (nextMatch) {
      scrollToGameWeek(nextMatch.gameWeek);
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

  const isWeekCompleted = (weekMatches: Match[] | undefined) => {
    if (!weekMatches) return false;
    return weekMatches?.every((match) => match.completed);
  };

  const percentageCompleted = (matches: Match[] | undefined) => {
    if (!matches) return 0;
    return (
      (matches.filter((match) => match.completed).length / matches.length) * 100
    );
  };

  return (
    <>
      {gameWeeks.length > 0 && (
        <div className="sticky flex items-center top-16 z-10 px-4 py-3 bg-fpl-1200 overflow-x-scroll border-b border-fpl-800">
          <div className="flex flex-nowrap justify-center gap-4 mx-auto">
            {gameWeeks.map((weekMatches, weekIndex) => (
              <a
                href={`#game-week-${weekIndex + 1}`}
                key={weekIndex}
                className={`relative flex items-center gap-2 px-4 py-1 rounded-md border text-nowrap font-semibold overflow-hidden ${isWeekCompleted(weekMatches) ? "bg-white text-fpl-900" : "bg-fpl-900"}`}
              >
                {isWeekCompleted(weekMatches) ? (
                  <CircleCheck size={16} strokeWidth={2.5} />
                ) : (
                  <span
                    className={`absolute bottom-0 left-0 h-1 bg-green-500 transition-all`}
                    style={{ width: `${percentageCompleted(weekMatches)}%` }}
                  ></span>
                )}
                GW {weekIndex + 1}
              </a>
            ))}
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-fpl-1000 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">Match Schedule</h2>
          <p className="text-white/90 mb-4">
            {totalMatches > 0
              ? `
              ${completedMatches} of ${totalMatches} matches completed`
              : `No matches scheduled yet for this game. Generate a schedule.`}
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-fpl-1000 rounded-lg p-6 text-center">
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
                className="bg-fpl-1000 rounded-lg p-6"
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
    </>
  );
}
