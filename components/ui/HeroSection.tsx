"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-green-500/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-neutral-300 backdrop-blur">
          Smart Playlist Mixer
        </div>

        {/* Title */}
        <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Fair<span className="text-green-400">Play</span>
        </h1>

        {/* Caption */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300 sm:text-xl">
          Build one perfectly balanced playlist from all your favorite vibes.
        </p>
        <p className="mt-4 text-neutral-400">
          FairPlay analyzes each playlist’s audio fingerprint and selects the
          songs that best represent it — so no single playlist dominates the
          mix.
        </p>
      </div>
    </section>
  );
}
