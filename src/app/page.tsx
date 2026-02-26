"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Navigation from "@/components/Navigation";
import CreateGameModal from "@/components/CreateGameModal";
import { useRouter } from "next/navigation";
import { clearTeams, setTeams } from "@/store/slices/normalizeTeamSlice";
import { clearMatches, setMatches } from "@/store/slices/normalizeMatchSlice";
import {
  addGame,
  gamesSelectors,
  selectCurrentGameId,
  setCurrentGame,
} from "@/store/slices/gamesSlice";
import { GameMeta, Team } from "@/types";
import { loadLeagueStateForKey } from "@/utils/storage";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const games = useAppSelector(gamesSelectors.selectAll);
  const currentGameId = useAppSelector(selectCurrentGameId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenGame = (game: GameMeta) => {
    const leagueState = loadLeagueStateForKey(game.storageKey);

    dispatch(clearTeams());
    dispatch(clearMatches());

    if (leagueState) {
      dispatch(setTeams(leagueState.teams));
      dispatch(setMatches(leagueState.matches));
    }

    dispatch(setCurrentGame(game.id));
    router.push("/schedule");
  };

  return (
    <div className="min-h-screen bg-fpl-purple-dark">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Games</h2>
            <p className="text-sm text-white/80">
              Select a game to view its schedule and table, or create a new one.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-fpl-purple hover:bg-gray-200"
          >
            Create Game
          </button>
        </div>
        <div className="rounded-lg bg-fpl-purple p-6">
          {games.length === 0 ? (
            <p className="py-8 text-center text-white/90">
              No games yet. Click{" "}
              <span className="font-semibold">Create Game</span> to start.
            </p>
          ) : (
            <div className="space-y-3">
              {games.map((game) => (
                <button
                  key={game.id}
                  id={`${game.id}`}
                  type="button"
                  onClick={() => handleOpenGame(game)}
                  className="flex w-full flex-col rounded-lg bg-fpl-purple-light px-4 py-3 text-left hover:bg-fpl-1200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">
                      {new Date(game.createdAt).toLocaleString()}
                    </span>
                    {currentGameId === game.id && (
                      <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
                        Active
                      </span>
                    )}
                  </div>
                  {game.playerNamesSnapshot.length > 0 && (
                    <p className="mt-1 text-sm font-medium text-white">
                      {game.playerNamesSnapshot.join(", ")}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <CreateGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        games={games}
      />
    </div>
  );
}
