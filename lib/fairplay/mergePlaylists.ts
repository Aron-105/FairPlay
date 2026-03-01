import { Playlist } from "./types";
import { selectRepresentativeSongs } from "./selectRepresentative";
import { computeNsongs } from "./computeNsongs";

export function mergePlaylists(playlists: Playlist[], likedUris: Set<string>) {
  const N = computeNsongs(playlists);

  let finalSongs: any[] = [];

  for (const playlist of playlists) {
    let selected: any[];

    if (!playlist.useLength && playlist.songs.length < N) {
      selected = [...playlist.songs];
    } else {
      selected = selectRepresentativeSongs(playlist, N);
    }

    finalSongs.push(...selected);
  }

  // 🟢 1️⃣ Force include liked-only songs
  const existingUris = new Set(finalSongs.map((s) => s.trackUri));

  const likedOnlySongs = playlists
    .flatMap((p) => p.songs)
    .filter((s) => likedUris.has(s.trackUri))
    .filter((s) => !existingUris.has(s.trackUri));

  finalSongs.push(...likedOnlySongs);

  // 🟢 2️⃣ Deduplicate globally
  const uniqueMap = new Map();

  for (const song of finalSongs) {
    if (!uniqueMap.has(song.trackUri)) {
      uniqueMap.set(song.trackUri, song);
    }
  }

  return Array.from(uniqueMap.values());
}
