import { NextResponse } from "next/server";
import crypto from "crypto";
import { kv } from "@vercel/kv";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { playlistName, trackUris } = body;

    if (!Array.isArray(trackUris)) {
      return NextResponse.json(
        { error: "Invalid track URIs" },
        { status: 400 },
      );
    }

    const stateId = crypto.randomUUID();

    // Store for 10 minutes
    await kv.set(
      `oauth:${stateId}`,
      {
        playlistName,
        trackUris,
      },
      { ex: 600 },
    );

    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

    const scopes = ["playlist-modify-private", "playlist-modify-public"].join(
      " ",
    );

    const authUrl =
      "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        state: stateId,
      });

    return NextResponse.json({ authUrl });
  } catch (err) {
    console.error("Start route error:", err);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
