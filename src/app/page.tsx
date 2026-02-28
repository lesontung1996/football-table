"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Navigation from "@/components/Navigation";
import CreateGameModal from "@/components/CreateGameModal";
import DeleteGamesModal from "@/components/DeleteGamesModal";
import { useRouter } from "next/navigation";
import { clearTeams, setTeams } from "@/store/slices/normalizeTeamSlice";
import { clearMatches, setMatches } from "@/store/slices/normalizeMatchSlice";
import {
  deleteGame,
  gamesSelectors,
  setCurrentGame,
} from "@/store/slices/gamesSlice";
import { GameMeta } from "@/types";
import {
  deleteLeagueStateForKey,
  loadLeagueStateForKey,
} from "@/utils/storage";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const games = useAppSelector(gamesSelectors.selectAll);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const allSelected =
    games.length > 0 && selectedGameIds.length === games.length;
  const hasSelection = selectedGameIds.length > 0;

  const toggleSelectGame = (gameId: string) => {
    setSelectedGameIds((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId],
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedGameIds([]);
    } else {
      setSelectedGameIds(games.map((g) => g.id));
    }
  };

  const handleDeleteSelectedClick = () => {
    if (!hasSelection) return;
    setIsDeleteModalOpen(true);
  };

  const toggleSelecting = () => {
    if (isSelecting) {
      setIsSelecting(false);
      setSelectedGameIds([]);
    } else {
      setIsSelecting(true);
    }
  };

  const handleConfirmDeleteSelected = () => {
    const idsToDelete = [...selectedGameIds];
    const gamesToDelete = games.filter((g) => idsToDelete.includes(g.id));

    gamesToDelete.forEach((game) => {
      deleteLeagueStateForKey(game.storageKey);
      dispatch(deleteGame(game.id));
    });

    setSelectedGameIds([]);
    setIsDeleteModalOpen(false);
  };

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
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Games</h2>
            <p className="text-sm text-white/80">
              Select a game to view its schedule and table, or create a new one.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {games.length > 0 && (
              <>
                {isSelecting && (
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-white/90">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-white/40 bg-transparent text-fpl-purple focus:ring-fpl-purple"
                      />
                      <span>Select all</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDeleteSelectedClick}
                      disabled={!hasSelection}
                      className="h-10 rounded-lg bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:bg-red-500/40 disabled:text-white/60 disabled:cursor-not-allowed"
                    >
                      Delete selected
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={toggleSelecting}
                  className="h-10 rounded-lg border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {isSelecting ? "Done" : "Select"}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="h-10 rounded-lg bg-white ml-auto px-5 py-2 text-sm font-semibold text-fpl-purple hover:bg-gray-200"
            >
              Create Game
            </button>
          </div>
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
                onClick={() =>
                  isSelecting ? toggleSelectGame(game.id) : handleOpenGame(game)
                }
                className="flex w-full flex-col rounded-lg bg-fpl-1000 p-2 text-left hover:bg-fpl-900 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  {isSelecting && (
                    <input
                      type="checkbox"
                      checked={selectedGameIds.includes(game.id)}
                      className="h-4 w-4 rounded border-white/40 bg-transparent text-fpl-purple focus:ring-fpl-purple"
                    />
                  )}
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
      <DeleteGamesModal
        isOpen={isDeleteModalOpen}
        count={selectedGameIds.length}
        onConfirm={handleConfirmDeleteSelected}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
