import { Song, Playlist } from "./types";

export function parseCsv(
  playlistName: string,
  csvContent: string,
  likedUris: Set<string>,
  useLength: boolean
): Playlist {
  const rows = csvContent
    .split("\n")
    .filter((r) => r.trim() !== "");

  const headers = rows[0].split(",");

  const songs: Song[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(",");

    const row: Record<string, string> = {};

    headers.forEach((h, idx) => {
      row[h.trim()] = cols[idx]?.trim();
    });

    const features: any = {};

    const featureKeys = [
      "Danceability",
      "Energy",
      "Key",
      "Loudness",
      "Mode",
      "Speechiness",
      "Acousticness",
      "Instrumentalness",
      "Liveness",
      "Valence",
      "Tempo",
    ];

    for (const key of featureKeys) {
      const value = parseFloat(row[key]);
      if (!isNaN(value)) {
        features[key] = value;
      }
    }

    songs.push({
      trackName: row["Track Name"],
      albumName: row["Album Name"],
      artistNames: row["Artist Name(s)"],
      playlistSource: playlistName, // ← IMPORTANT: use exact filename
      trackUri: row["Track URI"],
      features,
      isLiked: likedUris.has(row["Track URI"]),
    });
  }

  return {
    name: playlistName,
    songs,
    useLength,
  };
}