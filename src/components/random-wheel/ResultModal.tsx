"use client";

import Image from "next/image";
import type { Team } from "@/lib/random-wheel/types";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";

interface ResultModalProps {
  teams: Team[];
  onClose: () => void;
}

export default function ResultModal({ teams, onClose }: ResultModalProps) {
  const title = teams.length === 1 ? "Selected team" : "Selected teams";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!mounted || teams.length === 0) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
    });
  }, [mounted]);

  const subtitle = useMemo(() => {
    if (teams.length === 0) {
      return "No team was selected. Try adjusting your filters and spinning again.";
    }

    const messages = [
      "Nice pull! Share the draw or spin again.",
      "Fixture locked in. Ready for kick-off?",
      "New matchup secured. Who’s your money on?",
      "That spin had vibes. Save it or go again.",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }, [teams.length]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 transition-opacity duration-200 ease-out ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl bg-fpl-1100 p-5 transform transition-all duration-200 ease-out ${
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-body-xs text-white/70">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 h-8 rounded-lg px-3 text-body-xs font-semibold text-white/80 ring-1 ring-white/40 hover:bg-white/10"
          >
            <X size={16} />
            <span className="sr-only">Close</span>
          </button>
        </header>

        <div className="space-y-3">
          {teams.length === 0 && (
            <p className="text-body-sm text-red-200">
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
                      width={50}
                      height={50}
                      className="h-12 w-12 object-contain"
                    />
                    <span className="absolute -top-1 -left-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-fpl-accent text-[11px] font-bold text-fpl-1100 border border-fpl-1200">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-semibold text-white">
                      {team.name}
                    </p>
                    <p className="text-body-xs text-white/70">
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
