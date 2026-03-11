"use client";

import Image from "next/image";
import type { StoredResultEntry, Team } from "@/lib/random-wheel/types";
import { teamsById } from "@/lib/random-wheel/defaultTeams";
import { Trash } from "lucide-react";

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3600_000);
  const diffDays = Math.floor(diffMs / 86400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function resolveTeams(teamIds: number[]): Team[] {
  return teamIds
    .map((id) => teamsById.get(id))
    .filter((t): t is Team => t !== undefined);
}

interface ResultHistoryProps {
  entries: StoredResultEntry[];
  onClear: () => void;
}

export default function ResultHistory({
  entries,
  onClear,
}: ResultHistoryProps) {
  return (
    <div className="space-y-4 rounded-xl bg-fpl-1100/80 p-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">Result history</h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={entries.length === 0}
          className="flex items-center gap-2 rounded-md border border-white/40 px-3 py-1 text-sm font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash size={16} />
          Clear
        </button>
      </header>
      {entries.length === 0 ? (
        <p className="text-sm text-white/70">No spins yet.</p>
      ) : (
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
          {entries.map((entry, index) => {
            const teams = resolveTeams(entry.teamIds);
            return (
              <li
                key={`${entry.timestamp}-${index}`}
                className={`${index !== entries.length - 1 && "border-b border-white/10 pb-2"} space-y-2`}
              >
                <p className="flex items-center gap-2 text-xs text-white/80">
                  <span className="w-4 h-4 inline-flex items-center justify-center rounded-sm bg-gray-50 font-bold text-fpl-1200">
                    {index + 1}
                  </span>
                  {formatTime(entry.timestamp)}
                </p>
                <div className={`grid grid-cols-2 gap-2`}>
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className={`flex items-center gap-2 min-w-0`}
                    >
                      <div className="relative h-6 w-6 flex-shrink-0">
                        <Image
                          src={team.logoRef}
                          alt={team.name}
                          width={40}
                          height={40}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white max-w-[120px]">
                          {team.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
