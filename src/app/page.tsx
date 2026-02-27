"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Navigation from "@/components/Navigation";
import CreateGameModal from "@/components/CreateGameModal";
import { useRouter } from "next/navigation";
import { clearTeams, setTeams } from "@/store/slices/normalizeTeamSlice";
import { clearMatches, setMatches } from "@/store/slices/normalizeMatchSlice";
import { gamesSelectors, setCurrentGame } from "@/store/slices/gamesSlice";
import { GameMeta } from "@/types";
import { loadLeagueStateForKey } from "@/utils/storage";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const games = useAppSelector(gamesSelectors.selectAll);
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
    <div className="min-h-screen bg-fpl-1200">
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
        {games.length === 0 ? (
          <div className="rounded-lg bg-fpl-purple p-6">
            <p className="py-8 text-center text-white/90">
              No games yet. Click{" "}
              <span className="font-semibold">Create Game</span> to start.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game, index) => (
              <button
                key={game.id}
                id={`${game.id}`}
                type="button"
                onClick={() => handleOpenGame(game)}
                className="flex w-full flex-col rounded-lg bg-fpl-1000 p-2 text-left hover:bg-fpl-900"
              >
                <div className="inline-flex items-center">
                  <div className="h-5 inline-flex items-center bg-fpl-400 rounded">
                    <span className="inline-flex items-center justify-center w-5 h-5 text-center rounded font-semibold bg-gray-50 text-fpl-1200 mr-2">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-fpl-1200 mr-2">
                      {new Date(game.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                {game.playerNamesSnapshot.length > 0 && (
                  <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 mt-4 mb-2 mx-4 font-medium text-white list-disc list-inside">
                    {game.playerNamesSnapshot.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                )}
              </button>
            ))}
          </div>
        )}
      </main>
      <CreateGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        games={games}
      />
    </div>
  );
}
