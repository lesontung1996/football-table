"use client";

import Image from "next/image";
import { useState } from "react";
import type { Team, WheelConfiguration } from "@/lib/random-wheel/types";
import { randomTeamSelection } from "@/lib/random-wheel/randomSelection";

interface RandomTeamWheelProps {
  teams: Team[];
  config: WheelConfiguration;
  onConfigChange: (nextConfig: WheelConfiguration) => void;
  onResult: (result: { wheelCount: 1 | 2; teams: Team[] }) => void;
}

export function RandomTeamWheel({
  teams,
  config,
  onConfigChange,
  onResult,
}: RandomTeamWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const canSpin = teams.length > 0 && !isSpinning;

  const handleWheelCountChange = (count: 1 | 2) => {
    onConfigChange({
      ...config,
      numberOfWheels: count,
    });
  };

  const handleSpin = () => {
    if (!canSpin) return;

    setIsSpinning(true);

    const first = randomTeamSelection(teams);
    const second =
      config.numberOfWheels === 2 ? randomTeamSelection(teams) : null;

    const resultTeams: Team[] = [
      first.selectedItem,
      second?.selectedItem,
    ].filter((t): t is Team => Boolean(t));

    setTimeout(() => {
      setIsSpinning(false);
      onResult({
        wheelCount: config.numberOfWheels,
        teams: resultTeams,
      });
    }, 700);
  };

  const renderWheel = (key: string) => (
    <div
      key={key}
      className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-fpl-800 to-fpl-1000 shadow-lg"
    >
      <div className="grid h-56 w-56 grid-cols-3 gap-2 rounded-full bg-fpl-1100 p-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center justify-center rounded-full bg-fpl-900/70 p-1"
          >
            <Image
              src={team.logoRef}
              alt={team.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute h-6 w-6 rounded-full bg-fpl-accent shadow-md" />
    </div>
  );

  return (
    <section className="space-y-6 rounded-xl bg-fpl-1100/80 p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Random Team Wheel
          </h2>
          <p className="text-xs text-white/70">
            Spin one or two wheels to pick random teams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-white/70">
            Wheels
          </span>
          <div className="inline-flex rounded-lg bg-fpl-1000 p-1 text-xs font-semibold text-white/80">
            <button
              type="button"
              onClick={() => handleWheelCountChange(1)}
              className={`h-7 w-10 rounded-md transition ${
                config.numberOfWheels === 1
                  ? "bg-white text-fpl-1100"
                  : "bg-transparent hover:bg-white/10"
              }`}
            >
              1
            </button>
            <button
              type="button"
              onClick={() => handleWheelCountChange(2)}
              className={`h-7 w-10 rounded-md transition ${
                config.numberOfWheels === 2
                  ? "bg-white text-fpl-1100"
                  : "bg-transparent hover:bg-white/10"
              }`}
            >
              2
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
        {renderWheel("wheel-1")}
        {config.numberOfWheels === 2 && renderWheel("wheel-2")}
      </div>

      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="text-xs text-white/70">
          Eligible teams:{" "}
          <span className="font-semibold text-white">{teams.length}</span>
        </p>
        <button
          type="button"
          onClick={handleSpin}
          disabled={!canSpin}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-fpl-accent px-6 text-sm font-semibold text-fpl-1100 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-fpl-500 disabled:text-fpl-200"
        >
          {isSpinning ? "Spinning..." : "Spin the wheel"}
        </button>
      </div>

      {!teams.length && (
        <p className="text-xs font-medium text-red-300">
          No eligible teams selected. Adjust your filters to include at least
          one team.
        </p>
      )}
    </section>
  );
}
