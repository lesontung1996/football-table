"use client";

import Image from "next/image";
import type { Team, WheelConfiguration } from "@/lib/random-wheel/types";
import leagues from "@/data/leagues.json";
import { Check, Trash, X } from "lucide-react";

interface WheelConfigPanelProps {
  allTeams: Team[];
  config: WheelConfiguration;
  includedTeams: Team[];
  onConfigChange: (nextConfig: WheelConfiguration) => void;
  isSpinning: boolean;
}

export default function WheelConfigPanel({
  allTeams,
  config,
  includedTeams,
  onConfigChange,
  isSpinning,
}: WheelConfigPanelProps) {
  const includedIdSet = new Set(includedTeams.map((t) => t.id));

  const toggleLeagueOrNation = (
    leagueOrNation: string,
    includeAll: boolean,
  ) => {
    const leagueTeamIds = allTeams
      .filter((team) => team.leagueOrNation === leagueOrNation)
      .map((team) => team.id);
    const result = includeAll
      ? Array.from(new Set([...config.teamIds, ...leagueTeamIds]))
      : config.teamIds.filter((id) => !leagueTeamIds.includes(id));
    onConfigChange({
      ...config,
      teamIds: result,
    });
  };

  const toggleTeam = (teamId: number) => {
    const currentIncluded = new Set(config.teamIds);
    if (currentIncluded.has(teamId)) {
      currentIncluded.delete(teamId);
    } else {
      currentIncluded.add(teamId);
    }
    onConfigChange({
      ...config,
      teamIds: Array.from(currentIncluded),
    });
  };

  return (
    <section
      id="wheel-config"
      className="space-y-4 rounded-xl bg-fpl-1100/80 p-4 shadow-xl"
    >
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">Team selection</h2>
        </div>
        <button
          type="button"
          disabled={isSpinning}
          onClick={() => onConfigChange({ ...config, teamIds: [] })}
          className="flex items-center gap-2 rounded-md border border-white/40 px-3 py-1 text-sm font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash size={16} />
          Clear all
        </button>
      </header>

      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        {leagues.map((league) => {
          const groupTeams = allTeams.filter(
            (team) => team.leagueOrNation === league.code,
          );
          const total = groupTeams.length;
          const includedCount = groupTeams.filter((team) =>
            includedIdSet.has(team.id),
          ).length;
          const allIncluded = includedCount === total && total > 0;
          const noneIncluded = includedCount === 0;

          return (
            <div key={league.code} className="rounded-lg bg-fpl-1000/80 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-white">
                    {league.logoRef && (
                      <picture className="flex items-center justify-center h-10 w-10 p-1 bg-white rounded overflow-hidden">
                        <Image
                          src={league.logoRef}
                          alt={league.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-contain"
                        />
                      </picture>
                    )}
                    <div className="flex flex-col font-semibold text-white">
                      {league.name}
                      <span className="text-xs text-white/60">
                        {includedCount}/{total} teams included
                      </span>
                    </div>
                  </div>
                </div>
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={() => toggleLeagueOrNation(league.code, true)}
                    className={`rounded-md px-2 py-1 text-sm font-semibold transition ${
                      allIncluded
                        ? "bg-white text-fpl-1100"
                        : "bg-white/10 text-white hover:bg-white/20"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={() => toggleLeagueOrNation(league.code, false)}
                    className={`rounded-md px-2 py-1 text-sm font-semibold text-white transition hover:bg-white/20 bg-fpl-900 disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
                {groupTeams.map((team) => {
                  const isIncluded = includedIdSet.has(team.id);
                  return (
                    <button
                      key={team.id}
                      type="button"
                      disabled={isSpinning}
                      onClick={() => toggleTeam(team.id)}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm transition ${
                        isIncluded
                          ? "bg-fpl-900 text-white"
                          : "bg-fpl-1000 text-white/70 hover:bg-fpl-900/70"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <Image
                        src={team.logoRef}
                        alt={team.name}
                        width={50}
                        height={50}
                        className="h-6 w-6"
                      />
                      <span className="truncate">{team.name}</span>
                      {isIncluded && <Check size={16} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
