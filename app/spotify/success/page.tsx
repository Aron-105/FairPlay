"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const success = status === "success";

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-semibold">
        {success
          ? "Playlist successfully added to Spotify!"
          : "Something went wrong."}
      </h1>

      <h2 className="text-lg text-neutral-400">
        {success
          ? "Disclaimer: You will need to add local files to Spotify manually if you have any."
          : ""}
      </h2>

      <div className="space-x-4">
        {success && (
          <a
            href="https://open.spotify.com"
            target="_blank"
            className="bg-green-500 px-6 py-3 rounded-xl text-black font-medium"
          >
            Open Spotify
          </a>
        )}

        <Link href="/" className="border border-white px-6 py-3 rounded-xl">
          Make Another Playlist
        </Link>
      </div>
    </div>
  );
}

export default function SpotifySuccess() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
