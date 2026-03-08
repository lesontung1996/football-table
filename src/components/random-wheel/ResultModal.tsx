"use client";

import Image from "next/image";
import type { Team } from "@/lib/random-wheel/types";
import { X } from "lucide-react";

interface ResultModalProps {
  open: boolean;
  teams: Team[];
  onClose: () => void;
}

export default function ResultModal({
  open,
  teams,
  onClose,
}: ResultModalProps) {
  if (!open) return null;

  const title = teams.length === 1 ? "Selected team" : "Selected teams";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-fpl-1100 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-xs text-white/70">
              Share the result with your friends or spin again.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 h-8 rounded-lg px-3 text-xs font-semibold text-white/80 ring-1 ring-white/40 hover:bg-white/10"
          >
            <X size={16} />
            <span className="sr-only">Close</span>
          </button>
        </header>

        <div className="space-y-3">
          {teams.length === 0 && (
            <p className="text-sm text-red-200">
              No team was selected. Try adjusting your filters and spinning
              again.
            </p>
          )}

          {teams.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center gap-3 rounded-xl bg-fpl-1000/80 p-3"
                >
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={team.logoRef}
                      alt={team.name}
                      width={100}
                      height={100}
                      className="h-12 w-12 object-contain"
                    />
                    <span className="absolute -top-1 -left-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-fpl-accent text-[11px] font-bold text-fpl-1100 border border-fpl-1200">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {team.name}
                    </p>
                    <p className="text-xs text-white/70">
                      {team.leagueOrNation} •{" "}
                      <span className="font-mono uppercase">{team.tla}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
