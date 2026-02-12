"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateMatchScore } from "@/store/slices/leagueSlice";
import { Match } from "@/types";

interface MatchCardProps {
  match: Match;
  homeTeamName: string;
  awayTeamName: string;
}

export default function MatchCard({
  match,
  homeTeamName,
  awayTeamName,
}: MatchCardProps) {
  const dispatch = useAppDispatch();
  const [homeScore, setHomeScore] = useState<string>(
    match.homeScore?.toString() || "0",
  );
  const [awayScore, setAwayScore] = useState<string>(
    match.awayScore?.toString() || "0",
  );

  const handleSave = () => {
    const home = homeScore === "" ? null : parseInt(homeScore, 10);
    const away = awayScore === "" ? null : parseInt(awayScore, 10);

    if (home !== null && (isNaN(home) || home < 0)) {
      return;
    }
    if (away !== null && (isNaN(away) || away < 0)) {
      return;
    }

    dispatch(
      updateMatchScore({
        matchId: match.id,
        homeScore: home,
        awayScore: away,
      }),
    );
  };

  const isCompleted = match.completed;

  return (
    <div
      className={`p-4 border rounded-lg ${
        isCompleted
          ? "bg-fpl-purple-light border-green-300"
          : "bg-fpl-purple border-white/20"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white">
              {homeTeamName} vs {awayTeamName}
            </span>
            <span className="text-white/70">vs</span>
            <span className="font-medium text-white">
              {awayTeamName} vs {homeTeamName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          inputMode="numeric"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          placeholder="0"
          min="0"
          className="w-20 px-3 py-2 border border-white/30 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
        />
        <span className="text-white/70">-</span>
        <input
          type="number"
          inputMode="numeric"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          placeholder="0"
          min="0"
          className="w-20 px-3 py-2 border border-white/30 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
        />
        <button
          onClick={handleSave}
          className="ml-auto px-4 py-2 bg-white text-fpl-purple rounded-lg hover:bg-gray-200 active:bg-gray-400 transition-colors font-medium"
        >
          {isCompleted ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}
