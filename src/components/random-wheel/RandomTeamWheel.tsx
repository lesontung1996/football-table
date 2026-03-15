"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Team, WheelConfiguration } from "@/lib/random-wheel/types";
import { randomTeamSelection } from "@/lib/random-wheel/randomSelection";
import SpinningWheel from "./SpinningWheel";

const MIN_FULL_SPINS = 4;
const MAX_FULL_SPINS = 7;

interface RandomTeamWheelProps {
  teams: Team[];
  config: WheelConfiguration;
  onConfigChange: (nextConfig: WheelConfiguration) => void;
  onResult: (result: { wheelCount: 1 | 2; teams: Team[] }) => void;
  isSpinning: boolean;
  setIsSpinning: (isSpinning: boolean) => void;
}

function computeTargetRotation(
  currentRotation: number,
  winnerIndex: number,
  sliceAngle: number,
): number {
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const fullSpins =
    MIN_FULL_SPINS +
    Math.floor(Math.random() * (MAX_FULL_SPINS - MIN_FULL_SPINS + 1));
  const winnerCenterAngle = (winnerIndex + 0.5) * sliceAngle;
  const pointerAngle = 0;
  const finalRestAngle = (pointerAngle - winnerCenterAngle + 90 + 360) % 360;
  let delta = (finalRestAngle - currentMod + 360) % 360;
  if (delta < 180) delta += 360;
  return (
    currentRotation +
    fullSpins * 360 +
    delta +
    (Math.random() * (sliceAngle - sliceAngle * -1) + sliceAngle * -1) / 2
  );
}

export default function RandomTeamWheel({
  teams,
  config,
  onConfigChange,
  onResult,
  isSpinning,
  setIsSpinning,
}: RandomTeamWheelProps) {
  const [wheelRotations, setWheelRotations] = useState({ first: 0, second: 0 });
  const [pendingWinners, setPendingWinners] = useState<{
    wheelCount: 1 | 2;
    teams: Team[];
  } | null>(null);
  const completedCountRef = useRef(0);

  const canSpin = teams.length > 0 && !isSpinning;

  const handleWheelCountChange = (count: 1 | 2) => {
    onConfigChange({
      ...config,
      numberOfWheels: count,
    });
  };

  const finalizeSpin = useCallback(async () => {
    if (!pendingWinners) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSpinning(false);
    onResult(pendingWinners);
    setPendingWinners(null);
    completedCountRef.current = 0;
  }, [pendingWinners, onResult, setIsSpinning]);

  const handleWheel1SpinEnd = useCallback(() => {
    completedCountRef.current += 1;
    if (completedCountRef.current >= (config.numberOfWheels === 2 ? 2 : 1)) {
      finalizeSpin();
    }
  }, [config.numberOfWheels, finalizeSpin]);

  const handleWheel2SpinEnd = useCallback(() => {
    completedCountRef.current += 1;
    if (completedCountRef.current >= 2) {
      finalizeSpin();
    }
  }, [finalizeSpin]);

  const handleSpin = useCallback(() => {
    if (!canSpin) return;

    const firstRandomTeam = randomTeamSelection(teams);
    const secondRandomTeam =
      config.numberOfWheels === 2 ? randomTeamSelection(teams) : null;

    const resultTeams: Team[] = [firstRandomTeam, secondRandomTeam].filter(
      (t): t is Team => Boolean(t),
    );

    const sliceAngle = 360 / teams.length;
    const firstIndex = teams.findIndex((t) => t.id === firstRandomTeam.id);
    const secondIndex =
      secondRandomTeam != null
        ? teams.findIndex((t) => t.id === secondRandomTeam.id)
        : -1;

    setWheelRotations((prev) => {
      const firstTarget =
        firstIndex >= 0
          ? computeTargetRotation(prev.first, firstIndex, sliceAngle)
          : prev.first;
      const secondTarget =
        secondIndex >= 0
          ? computeTargetRotation(prev.second, secondIndex, sliceAngle)
          : prev.second;

      return {
        first: firstTarget,
        second: secondTarget,
      };
    });

    setPendingWinners({
      wheelCount: config.numberOfWheels,
      teams: resultTeams,
    });
    setIsSpinning(true);
    completedCountRef.current = 0;
  }, [canSpin, teams, config.numberOfWheels, setIsSpinning]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key === "Enter" &&
        canSpin &&
        !["INPUT", "TEXTAREA"].includes(
          (e.target as HTMLElement)?.tagName ?? "",
        )
      ) {
        e.preventDefault();
        handleSpin();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canSpin, handleSpin]);

  const ctaText = useMemo(() => {
    const texts = ["Spin the fixtures", "Who’s up next?", "Send it!"];

    return texts[Math.floor(Math.random() * texts.length)];
  }, []);

  return (
    <section
      className="flex flex-col justify-between space-y-6 rounded-xl bg-fpl-1100/80 p-4 overflow-hidden"
      aria-label="Random Team Wheel"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Pick a random football team
          </h1>
          <p className="text-body-xs text-white/70">
            Spin the wheel with your mates. One click, no sign-up, no fuss.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-body-xs font-medium text-white/70">
            You can spin 2 wheels for faster matchups
          </span>
          <div className="inline-flex rounded-lg bg-fpl-1000 p-1 text-body-xs font-semibold text-white/80">
            <button
              type="button"
              disabled={isSpinning}
              onClick={() => handleWheelCountChange(1)}
              className={`h-7 w-10 rounded-md transition disabled:cursor-not-allowed disabled:opacity-50 ${
                config.numberOfWheels === 1
                  ? "bg-white text-fpl-1100"
                  : "bg-transparent hover:bg-white/10"
              }`}
              aria-pressed={config.numberOfWheels === 1}
            >
              1
            </button>
            <button
              type="button"
              disabled={isSpinning}
              onClick={() => handleWheelCountChange(2)}
              className={`h-7 w-10 rounded-md transition disabled:cursor-not-allowed disabled:opacity-50 ${
                config.numberOfWheels === 2
                  ? "bg-white text-fpl-1100"
                  : "bg-transparent hover:bg-white/10"
              }`}
              aria-pressed={config.numberOfWheels === 2}
            >
              2
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
        <SpinningWheel
          teams={teams}
          rotation={wheelRotations.first}
          isSpinning={isSpinning}
          onSpinEnd={handleWheel1SpinEnd}
          onClick={handleSpin}
          aria-label="Wheel 1"
        />
        {config.numberOfWheels === 2 && (
          <SpinningWheel
            teams={teams}
            rotation={wheelRotations.second}
            isSpinning={isSpinning}
            onSpinEnd={handleWheel2SpinEnd}
            onClick={handleSpin}
            aria-label="Wheel 2"
          />
        )}
      </div>

      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="text-body-xs text-white/70">
          Eligible teams:{" "}
          <span className="font-semibold text-white">{teams.length}</span>
        </p>
        <button
          type="button"
          onClick={handleSpin}
          disabled={!canSpin}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-fpl-accent px-6 text-body-sm font-semibold text-fpl-1100 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-fpl-500 disabled:text-fpl-200"
          aria-label={isSpinning ? "Spinning" : "Spin the wheel"}
        >
          {isSpinning ? "Who's it gonna be..." : ctaText}
        </button>
      </div>
    </section>
  );
}
