import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { parseCsv, mergePlaylists, generateCsv } from "@/lib/fairplay";

import { saveJob } from "@/lib/store/jobStore";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const { playlists: config } = body;

  const uploadDir = path.join(process.cwd(), "uploads");
  const files = fs.readdirSync(uploadDir);

  const likedFile = files.find((f) => f.includes("Liked"));

  console.log("Detected liked file:", likedFile);

  const likedUris = new Set<string>();

  if (likedFile) {
    const content = fs.readFileSync(path.join(uploadDir, likedFile), "utf-8");

    const rows = content.split("\n").filter((r) => r.trim() !== "");
    const headers = rows[0].split(",");

    const uriIndex = headers.findIndex((h) => h.trim() === "Track URI");

    if (uriIndex === -1) {
      console.error("Track URI column not found in liked file");
    } else {
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(",");
        const uri = cols[uriIndex]?.trim();
        if (uri) likedUris.add(uri);
      }
    }
  }

  console.log("Total liked URIs:", likedUris.size);

  const playlists = [];

  const playlistFiles = files.filter((f) => f !== likedFile);

  for (const file of playlistFiles) {
    const playlistName = file.replace(".csv", "");

    const configEntry = config.find((p: any) => p.name === playlistName);

    if (!configEntry) continue; // skip unselected playlists
    const content = fs.readFileSync(path.join(uploadDir, file), "utf-8");

    const useLength =
      config.find((p: any) => p.name === file.replace(".csv", ""))?.useLength ??
      true;

    playlists.push(
      parseCsv(file.replace(".csv", ""), content, likedUris, useLength),
    );
  }

  const finalSongs = mergePlaylists(playlists, likedUris);

  const jobId = crypto.randomUUID();

  saveJob(jobId, finalSongs);

  const csv = generateCsv(finalSongs);

  return NextResponse.json({
    jobId,
    songCount: finalSongs.length,
  });
}
