import { NextResponse } from "next/server";
import { mergePlaylists } from "@/lib/fairplay/mergePlaylists";
import { generateCsv } from "@/lib/fairplay/generateCsv";
import crypto from "crypto";
import { saveJob } from "@/lib/store/jobStore";

export async function POST(req: Request) {
  const body = await req.json();
  const { playlists } = body;

  if (!playlists || playlists.length === 0) {
    return NextResponse.json(
      { error: "No playlists provided" },
      { status: 400 }
    );
  }

  const likedUris = new Set<string>();

  playlists.forEach((p: any) => {
    p.songs.forEach((s: any) => {
      if (s.isLiked) likedUris.add(s.trackUri);
    });
  });

  const finalSongs = mergePlaylists(playlists, likedUris);

  const jobId = crypto.randomUUID();

  saveJob(jobId, finalSongs);

  return NextResponse.json({
    jobId,
    finalCount: finalSongs.length,
  });
}