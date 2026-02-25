"use client";

import { useAppSelector } from "@/store/hooks";
import {
  calculateTeamStats,
  getRecentResults,
  sortTeamsByRanking,
} from "@/utils/tableCalculator";
import { Match, TeamStats } from "@/types";
import { selectMatchesEntities } from "@/store/slices/normalizeMatchSlice";
import { selectAllTeams } from "@/store/slices/normalizeTeamSlice";

export default function LeagueTable() {
  const teams = useAppSelector(selectAllTeams);
  const matchesEntities = useAppSelector(selectMatchesEntities);

  // Calculate stats for all teams
  const teamStats: TeamStats[] = teams.map((team) => {
    const currentTeamMatches: Match[] = team.matchIds.map(
      (matchId) => matchesEntities[matchId],
    );
    const stats = calculateTeamStats(currentTeamMatches, team);
    const recentResults = getRecentResults(currentTeamMatches, team.id, 5);
    return {
      ...stats,
      recentResults,
    };
  });

  // Sort by ranking
  const sortedStats = sortTeamsByRanking(teamStats);

  if (sortedStats.length === 0) {
    return (
      <div className="text-center py-8 text-white/90">
        <p>
          No teams added yet. Add teams and generate schedule to see the table.
        </p>
      </div>
    );
  }

  const getResultBadgeColor = (result: string | null) => {
    switch (result) {
      case "W":
        return "bg-green-500 text-white";
      case "D":
        return "bg-gray-300 text-fpl-purple";
      case "L":
        return "bg-red-500 text-white";
      case null:
        return "bg-fpl-800";
      default:
        return "bg-fpl-800";
    }
  };

  const getResultBadgeTitle = (result: string | null) => {
    switch (result) {
      case "W":
        return "Win";
      case "D":
        return "Draw";
      case "L":
        return "Loss";
      case null:
        return "Empty";
      default:
        return "Empty";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg">
        <thead>
          <tr className="bg-fpl-purple text-white/50">
            <th className="px-3 py-4 w-16 text-left font-normal sticky left-0 bg-fpl-purple min-w-14">
              Pos
            </th>
            <th className="px-3 py-4 text-left font-normal sticky left-14 bg-fpl-purple">
              Team
            </th>
            <th className="px-3 py-4 w-16 text-center font-normal">Pl</th>
            <th className="px-3 py-4 w-16 text-center font-normal">W</th>
            <th className="px-3 py-4 w-16 text-center font-normal">D</th>
            <th className="px-3 py-4 w-16 text-center font-normal">L</th>
            <th className="px-3 py-4 w-16 text-center font-normal">GF</th>
            <th className="px-3 py-4 w-16 text-center font-normal">GA</th>
            <th className="px-3 py-4 w-16 text-center font-normal">GD</th>
            <th className="px-3 py-4 w-16 text-center font-normal">Pts</th>
            <th className="px-3 py-4 w-16 text-center font-normal">Form</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((team, index) => {
            const position = index + 1;

            return (
              <tr key={team.teamId} className={`bg-fpl-purple`}>
                <td className="px-3 py-4 font-semibold sticky left-0 bg-fpl-purple min-w-14">
                  {position}
                </td>
                <td className="px-3 py-4 font-semibold sticky left-14 bg-fpl-purple">
                  {team.teamName}
                </td>
                <td className="px-3 py-4 text-sm text-center">{team.played}</td>
                <td className="px-3 py-4 text-sm text-center">{team.wins}</td>
                <td className="px-3 py-4 text-sm text-center">{team.draws}</td>
                <td className="px-3 py-4 text-sm text-center">{team.losses}</td>
                <td className="px-3 py-4 text-sm text-center">
                  {team.goalsFor}
                </td>
                <td className="px-3 py-4 text-sm text-center">
                  {team.goalsAgainst}
                </td>
                <td className="px-3 py-4 text-sm text-center">
                  {team.goalDifference}
                </td>
                <td className="px-3 py-4 text-center font-bold">
                  {team.points}
                </td>
                <td className="p-3">
                  <div className="flex gap-1 justify-center">
                    {team.recentResults.map((result, idx) => (
                      <span
                        key={idx}
                        className={`w-5 h-5 rounded-full ${getResultBadgeColor(
                          result,
                        )} text-xs flex items-center justify-center font-bold`}
                        title={getResultBadgeTitle(result)}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
