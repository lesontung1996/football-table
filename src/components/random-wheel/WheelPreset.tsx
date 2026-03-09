"use client";

import { WHEEL_PRESETS as presets } from "@/lib/random-wheel/presets";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

function idSetEquals(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size !== setB.size) return false;
  for (const id of setA) {
    if (!setB.has(id)) return false;
  }
  return true;
}

interface WheelPresetProps {
  currentTeamIds: number[];
  onSelectPreset: (teamIds: number[]) => void;
}

export default function WheelPreset({
  currentTeamIds,
  onSelectPreset,
}: WheelPresetProps) {
  const activePresetId = presets.find((p) =>
    idSetEquals(p.teamIds, currentTeamIds),
  )?.id;

  return (
    <section
      className="rounded-xl bg-fpl-1100/80 p-4 overflow-x-auto"
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
              onClick={() => onSelectPreset(preset.teamIds)}
              className={`flex items-center gap-2 h-8 pr-2 rounded-md text-sm font-medium transition overflow-hidden ${
                isActive
                  ? "bg-white text-fpl-1100"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {preset.logoRef && (
                <picture className="h-8 w-8 p-1 bg-white rounded-md object-contain">
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
          className={`flex items-center gap-2 h-8 rounded-md px-2 py-1.5 text-sm font-medium transition bg-white/10 text-white hover:bg-white/20`}
        >
          <ArrowDown size={16} />
          <span>Customize</span>
        </a>
      </div>
    </section>
  );
}
