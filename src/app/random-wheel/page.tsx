"use client";

import { useEffect, useState } from "react";
import ResultHistory from "@/components/random-wheel/ResultHistory";
import ResultModal from "@/components/random-wheel/ResultModal";
import RandomTeamWheel from "@/components/random-wheel/RandomTeamWheel";
import WheelConfigPanel from "@/components/random-wheel/WheelConfigPanel";
import WheelPreset from "@/components/random-wheel/WheelPreset";
import { allTeams } from "@/lib/random-wheel/defaultTeams";
import {
  loadResultHistory,
  saveResultHistory,
} from "@/lib/random-wheel/resultHistory";
import type { StoredResultEntry, Team } from "@/lib/random-wheel/types";
import { useRandomTeamWheelConfig } from "@/lib/random-wheel/useRandomTeamWheelConfig";
import ClearResultHistoryModal from "@/components/random-wheel/ClearResultHistoryModal";

const RESULT_HISTORY_MAX = 50;

export default function RandomWheelPage() {
  const { config, includedTeams, setTeamIds, setNumberOfWheels } =
    useRandomTeamWheelConfig();
  const [open, setOpen] = useState(false);
  const [openClearHistory, setOpenClearHistory] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultTeams, setResultTeams] = useState<Team[]>([]);
  const [history, setHistory] = useState<StoredResultEntry[]>([]);

  useEffect(() => {
    setHistory(loadResultHistory());
  }, []);

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
    const newEntry: StoredResultEntry = {
      timestamp: Date.now(),
      teamIds: payload.teams.map((t) => t.id),
    };
    const next = [newEntry, ...history].slice(0, RESULT_HISTORY_MAX);
    setHistory(next);
    saveResultHistory(next);
  };

  const openClearHistoryModal = () => {
    setOpenClearHistory(true);
  };

  const handleClearHistory = () => {
    setOpenClearHistory(false);
    setHistory([]);
    saveResultHistory([]);
  };

  const applyPreset = (teamIds: number[]) => {
    setTeamIds(teamIds);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-h1">Random Team Wheel</h1>
          <p className="max-w-2xl text-sm text-white/80">
            Click the wheel to spin and pick a random team. <br />
            Click a league below to quick select a preset. <br />
            For more customization of teams selection, go to the{" "}
            <a href="#wheel-config" className="text-fpl-accent hover:underline">
              team selection
            </a>{" "}
            panel.
            <br />
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-6">
            <WheelConfigPanel
              allTeams={allTeams}
              config={config}
              includedTeams={includedTeams}
              onConfigChange={handleConfigChange}
              isSpinning={isSpinning}
            />

            <ResultHistory entries={history} onClear={openClearHistoryModal} />
          </div>
        </div>
      </main>

      {open && (
        <ResultModal teams={resultTeams} onClose={() => setOpen(false)} />
      )}
      {openClearHistory && (
        <ClearResultHistoryModal
          onConfirm={handleClearHistory}
          onCancel={() => setOpenClearHistory(false)}
        />
      )}
    </>
  );
}
