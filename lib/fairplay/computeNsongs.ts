import { Playlist } from "./types";

export function computeNsongs(playlists: Playlist[]) {
  const groupA = playlists.filter(p=>p.useLength);

  if (groupA.length===0) {
    return Math.min(...playlists.map(p=>p.songs.length));
  }

  return Math.min(...groupA.map(p=>p.songs.length));
}