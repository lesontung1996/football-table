"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeTeam } from "@/store/slices/leagueSlice";

export default function TeamList() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.league.teams);

  if (teams.length === 0) {
    return (
      <div className="text-center py-8 text-white/90">
        <p>No teams added yet. Add teams to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Teams ({teams.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-between p-3 bg-fpl-purple-light rounded-lg"
          >
            <span className="font-medium text-white">{team.name}</span>
            <button
              onClick={() => dispatch(removeTeam(team.id))}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
