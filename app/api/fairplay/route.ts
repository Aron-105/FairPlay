import { NextResponse } from "next/server";
import { mergePlaylists } from "@/lib/fairplay/mergePlaylists";

export async function POST(req: Request) {
  const body = await req.json();
  const { playlists } = body;

  if (!playlists || playlists.length === 0) {
    return NextResponse.json(
      { error: "No playlists provided" },
      { status: 400 },
    );
  }

  const likedUris = new Set<string>();

  playlists.forEach((p: any) => {
    p.songs.forEach((s: any) => {
      if (s.isLiked) likedUris.add(s.trackUri);
    });
  });

  const finalSongs = mergePlaylists(playlists, likedUris);

  return NextResponse.json({
    finalSongs,
    finalCount: finalSongs.length,
  });
}
