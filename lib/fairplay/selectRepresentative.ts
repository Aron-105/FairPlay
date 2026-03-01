import { Playlist } from "./types";
import { normalizeFeatures } from "./normalize";
import { euclideanDistance } from "./distance";

export function selectRepresentativeSongs(
  playlist: Playlist,
  N: number
) {
  const songs = [...playlist.songs];

  normalizeFeatures(songs);

  // Compute mean vector
  const meanVector: any = {};

  const keys = Object.keys(songs[0].features);

  for (const key of keys) {
    const values = songs
      .map(s => s.features[key])
      .filter(v => v !== undefined) as number[];

    meanVector[key] =
      values.reduce((a,b)=>a+b,0)/values.length;
  }

  const ranked = songs
    .map(song => ({
      song,
      dist: euclideanDistance(song, meanVector)
    }))
    .sort((a,b)=>a.dist-b.dist);

  let selected = ranked.slice(0, N).map(r=>r.song);

  // Liked override
  const likedSongs = songs.filter(s=>s.isLiked);

  for (const liked of likedSongs) {
    if (!selected.find(s=>s.trackUri===liked.trackUri)) {
      selected.push(liked);
      selected.sort((a,b)=>{
        return euclideanDistance(b, meanVector)
             - euclideanDistance(a, meanVector);
      });
      selected.pop();
    }
  }

  return selected;
}