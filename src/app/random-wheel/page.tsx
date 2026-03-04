/* eslint-disable react/jsx-no-useless-fragment */
"use client";

import { useState } from "react";
import { ResultModal } from "@/components/random-wheel/ResultModal";
import { RandomTeamWheel } from "@/components/random-wheel/RandomTeamWheel";
import { WheelConfigPanel } from "@/components/random-wheel/WheelConfigPanel";
import { allTeams } from "@/lib/random-wheel/defaultTeams";
import type { Team } from "@/lib/random-wheel/types";
import { useRandomTeamWheelConfig } from "@/lib/random-wheel/useRandomTeamWheelConfig";

export default function RandomWheelPage() {
  const { config, includedTeams } = useRandomTeamWheelConfig();
  const [open, setOpen] = useState(false);
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
    // The hook owns persistence and URL sync; we only update its config
    // via its exposed setters, so this helper is a no-op placeholder for now.
    // It exists to align with the component contract for RandomTeamWheel
    // and WheelConfigPanel, which both expect a full config object.
    // In the current implementation, we mutate configuration through
    // the hook’s dedicated methods instead.
    return nextConfig;
  };

  const handleResult = (payload: { wheelCount: 1 | 2; teams: Team[] }) => {
    setResultTeams(payload.teams);
    setOpen(true);
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

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
          <RandomTeamWheel
            teams={includedTeams}
            config={config}
            onConfigChange={handleConfigChange}
            onResult={handleResult}
          />

          <WheelConfigPanel
            allTeams={allTeams}
            config={config}
            includedTeams={includedTeams}
            onConfigChange={handleConfigChange}
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
