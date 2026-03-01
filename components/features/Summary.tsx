"use client";

import { useState } from "react";
import { generateCsv } from "@/lib/fairplay/generateCsv";

interface PlaylistBreakdown {
  name: string;
  original: number;
  contributed: number;
}

interface SummaryProps {
  result: {
    finalSongs: any[];
    finalCount: number;
  };
}

export default function Summary({ result }: SummaryProps) {
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
            const csv = generateCsv(result.finalSongs);

            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = csvFileName;
            a.click();

            URL.revokeObjectURL(url);
          }}
        >
          Download CSV
        </button>

        <button
          className="flex-1 rounded-xl border border-green-400 py-3 font-medium text-green-400 hover:bg-green-400 hover:text-black transition"
          onClick={async () => {
            const trackUris = result.finalSongs
              .map((s: any) => s.trackUri)
              .filter((uri: string) => uri?.startsWith("spotify:track:"));

            try {
              const res = await fetch("/api/spotify/start", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  playlistName: spotifyName,
                  trackUris,
                }),
              });

              if (!res.ok) {
                throw new Error("Failed to start Spotify flow");
              }

              const { authUrl } = await res.json();

              window.location.href = authUrl;
            } catch (err) {
              console.error(err);
              alert("Something went wrong starting Spotify flow.");
            }
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
