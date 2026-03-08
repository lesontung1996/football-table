"use client";

import { WHEEL_PRESETS as presets } from "@/lib/random-wheel/presets";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

function tlaSetEquals(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a.map((t) => t.toUpperCase()));
  const setB = new Set(b.map((t) => t.toUpperCase()));
  if (setA.size !== setB.size) return false;
  for (const t of setA) {
    if (!setB.has(t)) return false;
  }
  return true;
}

interface WheelPresetProps {
  currentTeamTlas: string[];
  onSelectPreset: (teamTlas: string[]) => void;
}

export default function WheelPreset({
  currentTeamTlas,
  onSelectPreset,
}: WheelPresetProps) {
  const activePresetId = presets.find((p) =>
    tlaSetEquals(p.teamTlas, currentTeamTlas),
  )?.id;

  return (
    <section
      className="rounded-xl bg-fpl-1100/80 p-4 shadow-xl"
      aria-label="Wheel presets"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium uppercase tracking-wide text-white/70">
          Quick Select
        </span>
        {presets.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.teamTlas)}
              className={`flex items-center gap-2 h-10 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-fpl-1100"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {preset.logoRef && (
                <picture className="h-6 w-6 p-[2px] bg-white rounded-full object-contain">
                  <Image
                    src={preset.logoRef}
                    alt={preset.label}
                    width={40}
                    height={40}
                  />
                </picture>
              )}
              {preset.label}
            </button>
          );
        })}
        <a
          href="#wheel-config"
          className={`flex items-center gap-2 h-10 rounded-md px-3 py-1.5 text-sm font-medium transition bg-white/10 text-white hover:bg-white/20`}
        >
          <ArrowDown size={16} />
          <span>Customize</span>
        </a>
      </div>
    </section>
  );
}
