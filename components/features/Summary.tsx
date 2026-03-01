"use client";

import { useState } from "react";

interface PlaylistBreakdown {
  name: string;
  original: number;
  contributed: number;
}

interface SummaryProps {
  jobId: string;
  result: {
    finalCount: number;
    cappedCount: number;
    totalBeforeCap: number;
    contributionPerLarge: number;
    playlistBreakdown: PlaylistBreakdown[];
    likedAdded?: number;
    duplicatesRemoved?: number;
  };
}

export default function Summary({ jobId, result }: SummaryProps) {
  const [playlistName, setPlaylistName] = useState("");

  const baseName = playlistName.trim() || "My Playlist";
  const csvFileName = baseName.replace(/\s+/g, "_") + "_FairPlay.csv";
  const spotifyName = `${baseName} - FairPlay`;

  return (
    <section className="mt-24 rounded-3xl border border-green-400/30 bg-neutral-900 p-10 shadow-2xl space-y-12">
      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-semibold text-green-400 mb-2">
          Playlist Generated Successfully
        </h2>
      </div>

      {/* NAME INPUT */}
      <div>
        <label className="block text-sm text-neutral-400 mb-2">
          Name Your Playlist
        </label>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="e.g. Gym Rotation"
          className="w-full max-w-md rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-green-400 transition"
        />
      </div>

      {/* CTA BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
        <button
          className="flex-1 rounded-xl bg-green-500 py-3 font-medium text-black hover:bg-green-400 transition"
          onClick={async () => {
            const res = await fetch(`/api/fairplay/download?jobId=${jobId}`);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = csvFileName;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
        >
          Download CSV
        </button>

        <button
          className="flex-1 rounded-xl border border-green-400 py-3 font-medium text-green-400 hover:bg-green-400 hover:text-black transition"
          onClick={() => {
            window.location.href = `/api/spotify/start?jobId=${jobId}&playlistName=${encodeURIComponent(
              spotifyName,
            )}`;
          }}
        >
          Add to Spotify Library
        </button>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-black/30 p-6 border border-white/10">
      <p className="text-neutral-400 text-sm mb-2">{label}</p>
      <p className="text-2xl font-semibold text-green-400">{value}</p>
    </div>
  );
}
