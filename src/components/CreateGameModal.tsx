import { useRef, useState, useEffect, use } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { clearTeams, setTeams } from "@/store/slices/normalizeTeamSlice";
import { clearMatches, setMatches } from "@/store/slices/normalizeMatchSlice";
import { addGame, setCurrentGame } from "@/store/slices/gamesSlice";
import { GameMeta, Team } from "@/types";
import { getGameStorageKey, loadLeagueStateForKey } from "@/utils/storage";

export default function CreateGameModal({
  isOpen,
  onClose,
  games,
}: {
  isOpen: boolean;
  onClose: () => void;
  games: GameMeta[];
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [newPlayerName, setNewPlayerName] = useState<string>("");
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const playerNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      playerNameInputRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemovePlayerField = (index: number) => {
    setPlayerNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUseLatestPlayers = () => {
    if (games.length === 0) return;
    const latest = games[0];
    const state = loadLeagueStateForKey(latest.storageKey);
    if (state) {
      setPlayerNames(state.teams.map((t) => t.name));
    } else if (latest.playerNamesSnapshot.length > 0) {
      setPlayerNames(latest.playerNamesSnapshot);
    }
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPlayerName.trim().length === 0) {
      setError("Player name cannot be empty");
      return;
    }

    if (playerNames.length >= 20) {
      setError("Maximum 20 players allowed");
      return;
    }

    const exists = playerNames.some(
      (name) => name.toLowerCase() === newPlayerName.toLowerCase(),
    );

    if (exists) {
      setError("Player name already exists");
      return;
    }

    setPlayerNames((prev) => [...prev, newPlayerName]);
    setNewPlayerName("");
    playerNameInputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedNames = playerNames
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (trimmedNames.length < 2) {
      setError("Please enter at least 2 team names.");
      return;
    }

    const now = Date.now();
    const teams: Team[] = trimmedNames.map((name, index) => ({
      id: `team-${now}-${index}-${Math.random()}`,
      name,
      matchIds: [],
    }));

    const id = `game-${now}-${Math.random()}`;
    const storageKey = getGameStorageKey(id);
    const meta: GameMeta = {
      id,
      createdAt: new Date(now).toISOString(),
      storageKey,
      playerNamesSnapshot: trimmedNames,
    };

    // Set new game as current league state
    dispatch(clearTeams());
    dispatch(clearMatches());
    dispatch(setTeams(teams));
    dispatch(setMatches([]));
    dispatch(addGame(meta));
    dispatch(setCurrentGame(id));

    onClose();
    router.push("/schedule");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-fpl-1100 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-white">Create New Game</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white">Teams </h3>
            <span className="font-normal text-white/50">
              {playerNames.length} / 20
            </span>
          </div>
          <form onSubmit={handleAddPlayer} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                ref={playerNameInputRef}
                type="text"
                value={newPlayerName}
                onChange={(e) => {
                  setNewPlayerName(e.target.value);
                  setError("");
                }}
                placeholder="Enter player name"
                className="flex-1 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fpl-purple"
                maxLength={50}
              />
              <button
                type="submit"
                disabled={playerNames.length >= 20}
                className="px-6 py-2 bg-fpl-1000 text-white rounded-lg hover:bg-fpl-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Add Player
              </button>
            </div>
            {error && <p className="text-red-300 text-sm">{error}</p>}
          </form>
          <div className="grid grid-cols-2 gap-2">
            {playerNames.length > 0
              ? playerNames.map((name, index) => (
                  <div
                    key={index}
                    className="flex items-center py-2 px-3 rounded-lg gap-2 bg-fpl-1200"
                  >
                    <span className="text-sm text-white/90">
                      {index + 1}. {name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePlayerField(index)}
                      className="rounded-md bg-red-500 ml-auto px-2 py-1 text-sm text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))
              : games.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUseLatestPlayers}
                    className="my-4 col-span-2 text-sm font-medium text-white underline-offset-2 underline hover:text-white/80"
                  >
                    Use players from previous game
                  </button>
                )}
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-transparent border border-white px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-fpl-purple hover:bg-gray-200"
              >
                Create Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
