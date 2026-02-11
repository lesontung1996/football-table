"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { generateSchedule } from "@/store/slices/leagueSlice";
import TeamForm from "@/components/TeamForm";
import TeamList from "@/components/TeamList";
import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.league.teams);
  const matches = useAppSelector((state) => state.league.matches);

  const handleGenerateSchedule = () => {
    if (teams.length >= 2) {
      dispatch(generateSchedule());
      router.push("/schedule");
    }
  };

  return (
    <div className="min-h-screen bg-fpl-purple-dark">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-fpl-purple rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Add Teams</h2>
          <p className="text-white/90 mb-4">
            Add up to 20 teams to create your league. Once you have at least 2
            teams, you can generate the match schedule.
          </p>
          <TeamForm />
        </div>

        <div className="bg-fpl-purple rounded-lg shadow-md p-6 mb-6">
          <TeamList />
        </div>

        {teams.length >= 2 && (
          <div className="bg-fpl-purple rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Match Schedule
                </h3>
                <p className="text-white/90">
                  {matches.length > 0
                    ? `${matches.length} matches scheduled`
                    : "Generate the match schedule to start entering scores"}
                </p>
              </div>
              <button
                onClick={handleGenerateSchedule}
                className="px-6 py-3 bg-white text-fpl-purple rounded-lg hover:bg-gray-200 active:bg-gray-400 transition-colors font-semibold"
              >
                {matches.length > 0
                  ? "Regenerate Schedule"
                  : "Generate Schedule"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
