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
import { Tabs } from "radix-ui";

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
      <main className="2xl:container w-full mx-auto p-4">
        <p className="text-body-sm text-white/80">Setting up your wheel…</p>
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
      <main className="2xl:container w-full mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,5fr),minmax(0,2fr)] gap-6">
          <RandomTeamWheel
            teams={includedTeams}
            config={config}
            onConfigChange={handleConfigChange}
            onResult={handleResult}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
          <Tabs.Root
            defaultValue="quick-select"
            className="flex flex-col rounded-xl bg-fpl-1100/80 p-4 h-[calc(100dvh-6rem)] min-h-[575px] max-h-[800px]"
          >
            <Tabs.List
              aria-label="Team wheel setup and history"
              className="grid grid-cols-3 mb-3 border-b border-white/10"
            >
              <Tabs.Trigger
                value="quick-select"
                className="relative pb-1.5 border-b-2 border-transparent font-medium whitespace-nowrap text-body-sm text-white/50 transition-colors data-[state=active]:border-fpl-accent data-[state=active]:text-white hover:text-white/80"
              >
                Quick presets
              </Tabs.Trigger>
              <Tabs.Trigger
                value="team-selection"
                className="relative pb-1.5 border-b-2 border-transparent font-medium whitespace-nowrap text-body-sm text-white/50 transition-colors data-[state=active]:border-fpl-accent data-[state=active]:text-white hover:text-white/80"
              >
                Choose teams
              </Tabs.Trigger>
              <Tabs.Trigger
                value="result-history"
                className="relative pb-1.5 border-b-2 border-transparent font-medium whitespace-nowrap text-body-sm text-white/50 transition-colors data-[state=active]:border-fpl-accent data-[state=active]:text-white hover:text-white/80"
              >
                Previous spins
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
              value="quick-select"
              className="overflow-hidden flex-1"
            >
              <WheelPreset
                currentTeamIds={config.teamIds}
                onSelectPreset={applyPreset}
              />
            </Tabs.Content>
            <Tabs.Content
              value="team-selection"
              className="overflow-hidden flex-1"
            >
              <WheelConfigPanel
                allTeams={allTeams}
                config={config}
                includedTeams={includedTeams}
                onConfigChange={handleConfigChange}
                isSpinning={isSpinning}
              />
            </Tabs.Content>
            <Tabs.Content
              value="result-history"
              className="overflow-hidden flex-1"
            >
              <ResultHistory
                entries={history}
                onClear={openClearHistoryModal}
              />
            </Tabs.Content>
          </Tabs.Root>
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
