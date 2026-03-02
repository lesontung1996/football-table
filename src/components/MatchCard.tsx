"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateMatch } from "@/store/slices/normalizeMatchSlice";
import { Match } from "@/types";
import { CircleCheck } from "lucide-react";

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
    match.homeScore?.toString() || "",
  );
  const [awayScore, setAwayScore] = useState<string>(
    match.awayScore?.toString() || "",
  );

  useEffect(() => {
    handleSave();
  }, [homeScore, awayScore]);

  const handleSave = () => {
    const home = homeScore === "" ? null : parseInt(homeScore, 10);
    const away = awayScore === "" ? null : parseInt(awayScore, 10);

    if (home === null || isNaN(home) || home < 0) {
      return;
    }
    if (away === null || isNaN(away) || away < 0) {
      return;
    }

    dispatch(
      updateMatch({
        id: match.id,
        changes: {
          homeScore: home,
          awayScore: away,
          completed: true,
        },
      }),
    );
  };

  const isCompleted = match.completed;

  return (
    <div
      className={`relative p-4 border rounded-lg ${
        isCompleted ? "bg-fpl-800 border-white" : "border-white/20"
      }`}
    >
      {isCompleted && (
        <CircleCheck size={20} className="absolute top-2 left-2" />
      )}
      <div className="flex items-center justify-center font-semibold">
        <label
          htmlFor={`homeScore-${match.id}`}
          className="w-1/3 cursor-pointer text-right"
        >
          {homeTeamName}
        </label>

        <div className="flex items-center mx-3 gap-3 bg-fpl-1200 rounded-lg">
          <input
            id={`homeScore-${match.id}`}
            type="number"
            inputMode="numeric"
            pattern="[0-9]+"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            placeholder="0"
            min="0"
            className="w-12 px-3 py-2 border-none bg-transparent text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
          />
          <span className="text-white/70 font-bold">-</span>
          <input
            id={`awayScore-${match.id}`}
            type="number"
            inputMode="numeric"
            pattern="[0-9]+"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            placeholder="0"
            min="0"
            className="w-12 px-3 py-2 border-none bg-transparent text-white text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/50"
          />
        </div>
        <label
          htmlFor={`awayScore-${match.id}`}
          className="w-1/3 cursor-pointer"
        >
          {awayTeamName}
        </label>
      </div>
    </div>
  );
}
