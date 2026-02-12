"use client";

import LeagueTable from "@/components/LeagueTable";
import Navigation from "@/components/Navigation";

export default function TablePage() {
  return (
    <div className="min-h-screen bg-fpl-purple-dark">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-fpl-purple rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">League Table</h2>
          <LeagueTable />
        </div>
      </main>
    </div>
  );
}
