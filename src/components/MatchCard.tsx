"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateMatch } from "@/store/slices/normalizeMatchSlice";
import { Match } from "@/types";
import useUpdateEffect from "@/hooks/useUpdateEffect";

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

  useUpdateEffect(() => {
    console.log("MatchCard useUpdateEffect", homeScore, awayScore);
    handleSave();
  }, [homeScore, awayScore]);

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
      updateMatch({
        id: match.id,
        changes: {
          homeScore: home,
          awayScore: away,
          completed: home !== null && away !== null,
        },
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
      <div className="flex items-center justify-center font-bold">
        <label htmlFor={`homeScore-${match.id}`}>{homeTeamName}</label>

        <div className="flex items-center mx-3 gap-3 bg-fpl-purple-dark rounded-lg">
          <input
            id={`homeScore-${match.id}`}
            type="text"
            inputMode="numeric"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="0"
            min="0"
            className="w-12 px-3 py-2 border-none bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
          />
          <span className="text-white/70 font-bold">-</span>
          <input
            id={`awayScore-${match.id}`}
            type="text"
            inputMode="numeric"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="0"
            min="0"
            className="w-12 px-3 py-2 border-none bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
          />
        </div>
        <label htmlFor={`awayScore-${match.id}`}>{awayTeamName}</label>
      </div>
    </div>
  );
}
