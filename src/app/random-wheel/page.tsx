"use client";

import { useState } from "react";
import ResultModal from "@/components/random-wheel/ResultModal";
import RandomTeamWheel from "@/components/random-wheel/RandomTeamWheel";
import WheelConfigPanel from "@/components/random-wheel/WheelConfigPanel";
import WheelPreset from "@/components/random-wheel/WheelPreset";
import { allTeams } from "@/lib/random-wheel/defaultTeams";
import type { Team } from "@/lib/random-wheel/types";
import { useRandomTeamWheelConfig } from "@/lib/random-wheel/useRandomTeamWheelConfig";

export default function RandomWheelPage() {
  const { config, includedTeams, setTeamIds, setNumberOfWheels } =
    useRandomTeamWheelConfig();
  const [open, setOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultTeams, setResultTeams] = useState<Team[]>([]);

  if (!config) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-sm text-white/80">Loading wheel configuration…</p>
      </main>
    );
  }

  const handleConfigChange = (nextConfig: typeof config) => {
    console.log("handleConfigChange", nextConfig);
    setTeamIds(nextConfig.teamIds);
    setNumberOfWheels(nextConfig.numberOfWheels);
  };

  const handleResult = (payload: { wheelCount: 1 | 2; teams: Team[] }) => {
    setResultTeams(payload.teams);
    setOpen(true);
  };

  const applyPreset = (teamIds: number[]) => {
    setTeamIds(teamIds);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Random Team Wheel
          </h1>
          <p className="max-w-2xl text-sm text-white/80">
            Spin one or two wheels to pick clubs or national teams at random.
            Your configuration is saved to this device and mirrored in the URL
            so you can share it with friends.
          </p>
        </header>

        <div className="grid gap-6">
          <WheelPreset
            currentTeamIds={config.teamIds}
            onSelectPreset={applyPreset}
          />
          <RandomTeamWheel
            teams={includedTeams}
            config={config}
            onConfigChange={handleConfigChange}
            onResult={handleResult}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
          <WheelConfigPanel
            allTeams={allTeams}
            config={config}
            includedTeams={includedTeams}
            onConfigChange={handleConfigChange}
            isSpinning={isSpinning}
          />
        </div>
      </main>

      <ResultModal
        open={open}
        teams={resultTeams}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
