"use client";

import { useAppSelector } from "@/store/hooks";
import {
  calculateTeamStats,
  getRecentResults,
  sortTeamsByRanking,
} from "@/utils/tableCalculator";
import { TeamStats } from "@/types";

export default function LeagueTable() {
  const { teams, matches } = useAppSelector((state) => state.league);

  // Calculate stats for all teams
  const teamStats: TeamStats[] = teams.map((team) => {
    const stats = calculateTeamStats(matches, team.id, teams);
    const recentResults = getRecentResults(matches, team.id, 5);
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

  const getResultBadgeColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500";
      case "D":
        return "bg-gray-500";
      case "L":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-fpl-purple text-white">
            <th className="px-4 py-3 text-left font-semibold">Pos</th>
            <th className="px-4 py-3 text-left font-semibold">Team</th>
            <th className="px-4 py-3 text-center font-semibold">MP</th>
            <th className="px-4 py-3 text-center font-semibold">W</th>
            <th className="px-4 py-3 text-center font-semibold">D</th>
            <th className="px-4 py-3 text-center font-semibold">L</th>
            <th className="px-4 py-3 text-center font-semibold">GF</th>
            <th className="px-4 py-3 text-center font-semibold">GA</th>
            <th className="px-4 py-3 text-center font-semibold">GD</th>
            <th className="px-4 py-3 text-center font-semibold">Pts</th>
            <th className="px-4 py-3 text-center font-semibold">Last 5</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((team, index) => {
            const position = index + 1;

            return (
              <tr key={team.teamId} className={`border-b bg-fpl-purple-light`}>
                <td className="px-4 py-3 font-semibold">{position}</td>
                <td className="px-4 py-3 font-medium">{team.teamName}</td>
                <td className="px-4 py-3 text-center">{team.played}</td>
                <td className="px-4 py-3 text-center">{team.wins}</td>
                <td className="px-4 py-3 text-center">{team.draws}</td>
                <td className="px-4 py-3 text-center">{team.losses}</td>
                <td className="px-4 py-3 text-center">{team.goalsFor}</td>
                <td className="px-4 py-3 text-center">{team.goalsAgainst}</td>
                <td
                  className={`px-4 py-3 text-center font-semibold ${
                    team.goalDifference > 0
                      ? "text-green-600"
                      : team.goalDifference < 0
                        ? "text-red-600"
                        : ""
                  }`}
                >
                  {team.goalDifference > 0 ? "+" : ""}
                  {team.goalDifference}
                </td>
                <td className="px-4 py-3 text-center font-bold">
                  {team.points}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-center">
                    {team.recentResults.length > 0 ? (
                      team.recentResults.map((result, idx) => (
                        <span
                          key={idx}
                          className={`w-6 h-6 rounded-full ${getResultBadgeColor(
                            result,
                          )} text-white text-xs flex items-center justify-center font-bold`}
                          title={
                            result === "W"
                              ? "Win"
                              : result === "D"
                                ? "Draw"
                                : "Loss"
                          }
                        >
                          {result}
                        </span>
                      ))
                    ) : (
                      <></>
                    )}
                    {team.recentResults.length < 5 &&
                      Array.from({ length: 5 - team.recentResults.length }).map(
                        (_, idx) => (
                          <span
                            key={`empty-${idx}`}
                            className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs flex items-center justify-center"
                          >
                            -
                          </span>
                        ),
                      )}
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
