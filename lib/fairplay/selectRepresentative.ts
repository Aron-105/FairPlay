import { Playlist, Song, FeatureVector } from "./types";
import { normalizeFeatures } from "./normalize";
import { euclideanDistance } from "./distance";

export function selectRepresentativeSongs(
  playlist: Playlist,
  N: number,
): Song[] {
  const songs = [...playlist.songs];

  if (songs.length === 0) return [];

  normalizeFeatures(songs);

  // Compute mean vector
  const meanVector: FeatureVector = {} as FeatureVector;

  const keys = Object.keys(songs[0].features) as (keyof FeatureVector)[];

  for (const key of keys) {
    const values = songs
      .map((s) => s.features[key])
      .filter((v): v is number => v !== undefined);

    if (values.length === 0) continue;

    meanVector[key] = values.reduce((a, b) => a + b, 0) / values.length;
  }

  const ranked = songs
    .map((song) => ({
      song,
      dist: euclideanDistance(song, meanVector),
    }))
    .sort((a, b) => a.dist - b.dist);

  let selected = ranked.slice(0, N).map((r) => r.song);

  // Liked override
  const likedSongs = songs.filter((s) => s.isLiked);

  for (const liked of likedSongs) {
    if (!selected.find((s) => s.trackUri === liked.trackUri)) {
      selected.push(liked);

      selected.sort((a, b) => {
        return (
          euclideanDistance(b, meanVector) - euclideanDistance(a, meanVector)
        );
      });

      selected.pop();
    }
  }

  return selected;
}
