"use client";

import { WHEEL_PRESETS as presets } from "@/lib/random-wheel/presets";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
      aria-label="Wheel presets"
      className="flex flex-col h-full space-y-4"
    >
      <header className="flex items-center justify-between gap-3">
        <p className="flex-shrink-1 text-body-xs text-fpl-accent/70 max-w-[60%]">
          Swap presets anytime – chaos is encouraged.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-2 h-full overflow-y-auto pb-1">
        {presets.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.teamIds)}
              className={cn(
                "flex flex-col items-center h-max p-2 rounded-md text-body-sm bg-white/70 text-fpl-1200 transition overflow-hidden whitespace-nowrap flex-shrink-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-white/85 data-[state=active]:shadow-lg",
                isActive && "bg-white",
              )}
            >
              <picture className="flex items-center justify-center mb-2 h-16 w-16 object-contain">
                <Image
                  src={preset.logoRef}
                  alt={preset.label}
                  width={80}
                  height={80}
                />
              </picture>
              <span className="text-body-sm font-bold">{preset.label}</span>
              <span className="text-[11px] text-fpl-1000">
                {preset.teamIds.length} teams
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
