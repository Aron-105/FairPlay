import { Song, FeatureVector } from "./types";

export function normalizeFeatures(songs: Song[]) {
  if (songs.length === 0) return;

  const keys = Object.keys(songs[0].features) as (keyof FeatureVector)[];

  const stats: Partial<
    Record<keyof FeatureVector, { mean: number; std: number }>
  > = {};

  for (const key of keys) {
    const values = songs
      .map((s) => s.features[key])
      .filter((v): v is number => v !== undefined);

    if (values.length === 0) continue;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    const std = Math.sqrt(
      values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length,
    );

    stats[key] = { mean, std };
  }

  for (const song of songs) {
    for (const key of keys) {
      const value = song.features[key];
      const stat = stats[key];

      if (value !== undefined && stat !== undefined && stat.std !== 0) {
        song.features[key] = (value - stat.mean) / stat.std;
      }
    }
  }
}
