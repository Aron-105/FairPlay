"use client";

import { useRef, useState } from "react";
import Summary from "./Summary";
import { Playlist as FullPlaylist } from "@/lib/fairplay/types";

interface PlaylistSelectorProps {
  playlists: FullPlaylist[];
}

export default function PlaylistSelector({ playlists }: PlaylistSelectorProps) {
  const [settings, setSettings] = useState(
    playlists.map((p) => ({
      name: p.name,
      trackCount: p.songs.length,
      included: true,
      useLength: true,
    })),
  );

  const [minSongsThreshold, setMinSongsThreshold] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const summaryRef = useRef<HTMLDivElement | null>(null);

  const toggleIncluded = (index: number) => {
    setSettings((prev) =>
      prev.map((p, i) => (i === index ? { ...p, included: !p.included } : p)),
    );
  };

  const handleConfirm = async () => {
    const selectedPlaylists = settings
      .filter((p) => p.included)
      .map((p) => {
        const full = playlists.find((pl) => pl.name === p.name);

        return {
          ...full,
          useLength: p.trackCount >= minSongsThreshold,
        };
      })
      .filter(Boolean);

    if (selectedPlaylists.length === 0) return;

    setIsProcessing(true);

    const res = await fetch("/api/fairplay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlists: selectedPlaylists }),
    });

    setIsProcessing(false);

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      alert("Something went wrong.");
      return;
    }

    const data = await res.json();
    setResult(data);

    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // --- Prediction Logic ---
  const includedPlaylists = settings.filter((p) => p.included);

  let contributionPerLarge = 0;
  let predictedTotal = 0;

  if (includedPlaylists.length > 0) {
    const qualifying = includedPlaylists.filter(
      (p) => p.trackCount >= minSongsThreshold,
    );

    const smallestQualifying =
      qualifying.length > 0
        ? Math.min(...qualifying.map((p) => p.trackCount))
        : 0;

    contributionPerLarge = smallestQualifying;

    predictedTotal = includedPlaylists.reduce((total, p) => {
      if (p.trackCount >= minSongsThreshold && smallestQualifying > 0) {
        return total + smallestQualifying;
      }
      return total + p.trackCount;
    }, 0);
  }

  return (
    <section
      id="playlist-selection"
      className="bg-neutral-950 py-24 text-white"
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-10 text-2xl font-semibold">Your Playlists</h2>

        {/* Threshold Input */}
        <div className="mb-12">
          <label className="block text-sm text-neutral-400 mb-3">
            Representation Threshold
          </label>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={minSongsThreshold}
              onChange={(e) => setMinSongsThreshold(Number(e.target.value))}
              className="w-40 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-green-400 transition"
            />

            {/* Info Tooltip */}
            <div className="relative group">
              <div className="w-7 h-7 flex items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-neutral-300 cursor-default hover:border-green-400 hover:text-green-400 transition">
                i
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[360px] bg-black text-sm text-neutral-300 p-5 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition pointer-events-none z-20 shadow-2xl">
                {/* Visualization goes here */}
                <div className="space-y-4">
                  <p className="text-neutral-400 text-xs uppercase tracking-wide">
                    Example
                  </p>

                  <div className="space-y-2 text-xs">
                    <div>Playlist A — 200 songs</div>
                    <div>Playlist B — 120 songs</div>
                    <div>Playlist C — 40 songs</div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <p className="text-neutral-400 text-xs uppercase tracking-wide">
                      With Threshold = 100
                    </p>

                    {/* Visual Bars */}
                    <div className="space-y-3">
                      {/* A */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>A</span>
                          <span>120 used</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[60%] bg-green-400 rounded-full" />
                        </div>
                      </div>

                      {/* B */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>B</span>
                          <span>120 used</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[100%] bg-green-400 rounded-full" />
                        </div>
                      </div>

                      {/* C */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>C</span>
                          <span>40 used</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[33%] bg-green-400 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 text-center text-green-400 font-medium">
                      Final Playlist: 280 songs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            Large playlists will contribute the same number of songs as the
            smallest qualifying playlist.
          </p>
        </div>

        {/* Playlist Cards */}
        {/* Scroll Window Wrapper */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {/* Top Fade */}
          <div className="pointer-events-none absolute top-6 left-0 right-0 h-12 bg-gradient-to-b from-neutral-950 to-transparent z-10 rounded-t-2xl" />

          {/* Bottom Fade */}
          <div className="pointer-events-none absolute bottom-6 left-0 right-0 h-12 bg-gradient-to-t from-neutral-950 to-transparent z-10 rounded-b-2xl" />

          {/* Scrollable Content */}
          <div className="relative max-h-[500px] overflow-y-auto space-y-6 pr-3 custom-scrollbar">
            {settings.map((playlist, index) => {
              const isLiked = playlist.name.toLowerCase().includes("liked");

              return (
                <div
                  key={playlist.name}
                  onClick={() => toggleIncluded(index)}
                  className={`group relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 ease-out transform ${
                    playlist.included
                      ? "border-green-400 bg-green-500/10 shadow-[0_0_0_1px_rgba(34,197,94,0.4)] hover:shadow-[0_0_0_2px_rgba(34,197,94,0.6)]"
                      : "border-white/10 bg-black/30 hover:border-white/30 opacity-80 hover:opacity-100"
                  } hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]`}
                >
                  <div className="flex justify-between items-start">
                    {/* Left Side */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-lg font-semibold transition ${
                            playlist.included
                              ? "text-white"
                              : "text-neutral-300"
                          }`}
                        >
                          {playlist.name.replace(/_/g, " ")}
                        </h3>

                        {/* Liked Info Icon */}
                        {isLiked && (
                          <div className="relative">
                            <div className="relative inline-flex items-center group/icon">
                              {/* Info Icon */}
                              <div className="w-6 h-6 flex items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-neutral-300 cursor-default hover:border-green-400 hover:text-green-400 transition">
                                i
                              </div>

                              {/* Contained Info Panel */}
                              <div
                                className="
          absolute left-8 top-1/2 -translate-y-1/2
          w-72
          bg-neutral-900
          text-neutral-300
          text-sm
          p-4
          rounded-xl
          border border-white/10
          shadow-xl
          opacity-0
          scale-95
          pointer-events-none
          transition-all duration-200
          group-hover/icon:opacity-100
          group-hover/icon:scale-100
        "
                              >
                                <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wide">
                                  Liked Songs
                                </p>
                                <p>
                                  Liked songs are always prioritized. Songs
                                  you’ve liked will be included in their
                                  respective playlists, and any liked-only songs
                                  will be appended to the final result — even if
                                  this playlist is not selected.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <p
                        className={`text-sm mt-1 transition ${
                          playlist.included
                            ? "text-neutral-400"
                            : "text-neutral-500"
                        }`}
                      >
                        {playlist.trackCount} tracks
                      </p>
                    </div>

                    {/* Include State */}
                    <div className="flex items-center gap-2">
                      {/* Animated Checkmark */}
                      <svg
                        className={`w-5 h-5 text-green-400 transition-all duration-300 ${
                          playlist.included
                            ? "opacity-100 scale-100 translate-x-0"
                            : "opacity-0 scale-75 -translate-x-2"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>

                      <span
                        className={`text-base font-bold tracking-wide transition ${
                          playlist.included
                            ? "text-green-400"
                            : "text-neutral-400 group-hover:text-neutral-300"
                        }`}
                      >
                        {playlist.included ? "Included in Mix" : "Excluded"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prediction Preview */}
        {includedPlaylists.length > 0 && (
          <div className="mt-10 rounded-2xl border border-green-400/30 bg-green-500/5 p-6 backdrop-blur">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-400 mb-1">
                  Predicted Result
                </p>

                <p className="text-xl font-semibold text-green-400">
                  Final playlist will contain: {predictedTotal} songs
                </p>

                {contributionPerLarge > 0 && (
                  <p className="text-sm text-neutral-300 mt-2">
                    Each large playlist contributes:{" "}
                    <span className="text-green-400 font-medium">
                      {contributionPerLarge} songs
                    </span>
                  </p>
                )}
              </div>

              <div className="text-xs text-neutral-500 max-w-xs">
                Toggle playlists and adjust the threshold to see how it impacts
                the final mix.
              </div>
            </div>
          </div>
        )}

        {/* Confirm */}
        <div className="mt-12">
          <button
            className="w-full rounded-xl bg-green-500 py-3 font-medium text-black hover:bg-green-400 transition disabled:opacity-50"
            disabled={!settings.some((p) => p.included) || isProcessing}
            onClick={handleConfirm}
          >
            {isProcessing ? "Processing..." : "Generate Balanced Playlist"}
          </button>
        </div>

        {result && (
          <div ref={summaryRef}>
            <Summary result={result} />
          </div>
        )}
      </div>
    </section>
  );
}
