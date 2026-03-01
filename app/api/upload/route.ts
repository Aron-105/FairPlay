import { NextResponse } from "next/server";
import { parseCsv } from "@/lib/fairplay/parseCsv";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const playlists = [];

  const likedUris = new Set<string>();

  // First pass: detect liked playlist
  for (const file of files) {
    if (file.name.includes("Liked")) {
      const content = await file.text();
      const rows = content.split("\n").filter((r) => r.trim() !== "");
      const headers = rows[0].split(",");
      const uriIndex = headers.findIndex((h) => h.trim() === "Track URI");

      if (uriIndex !== -1) {
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(",");
          const uri = cols[uriIndex]?.trim();
          if (uri) likedUris.add(uri);
        }
      }
    }
  }

  // Second pass: parse all playlists
  for (const file of files) {
    if (!file.name.endsWith(".csv")) continue;

    const content = await file.text();
    const playlistName = file.name.replace(".csv", "");

    playlists.push(parseCsv(playlistName, content, likedUris, true));
  }

  return NextResponse.json({ playlists });
}
