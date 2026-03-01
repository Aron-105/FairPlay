import { Song } from "./types";

export function normalizeFeatures(songs: Song[]) {
  const keys = Object.keys(songs[0].features);

  const stats: any = {};

  for (const key of keys) {
    const values = songs
      .map(s => s.features[key])
      .filter(v => v !== undefined) as number[];

    const mean = values.reduce((a,b)=>a+b,0)/values.length;
    const std = Math.sqrt(
      values.reduce((a,b)=>a+(b-mean)**2,0)/values.length
    );

    stats[key] = { mean, std };
  }

  for (const song of songs) {
    for (const key of keys) {
      const value = song.features[key];
      if (value !== undefined && stats[key].std !== 0) {
        song.features[key] =
          (value - stats[key].mean) / stats[key].std;
      }
    }
  }
}