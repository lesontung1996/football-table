"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTeam } from "@/store/slices/leagueSlice";
import { Team } from "@/types";

export default function TeamForm() {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.league.teams);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = teamName.trim();

    if (!trimmedName) {
      setError("Team name cannot be empty");
      return;
    }

    if (teams.length >= 20) {
      setError("Maximum 20 teams allowed");
      return;
    }

    const exists = teams.some(
      (team) => team.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (exists) {
      setError("Team name already exists");
      return;
    }

    const newTeam: Team = {
      id: `team-${Date.now()}-${Math.random()}`,
      name: trimmedName,
    };

    dispatch(addTeam(newTeam));
    setTeamName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={teamName}
          onChange={(e) => {
            setTeamName(e.target.value);
            setError("");
          }}
          placeholder="Enter team name"
          className="flex-1 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fpl-purple"
          maxLength={50}
        />
        <button
          type="submit"
          disabled={teams.length >= 20}
          className="px-6 py-2 bg-fpl-purple text-white rounded-lg hover:bg-fpl-purple-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Add Team
        </button>
      </div>
      {error && <p className="text-red-300 text-sm">{error}</p>}
      <p className="text-sm text-white/90">{teams.length} / 20 teams added</p>
    </form>
  );
}
