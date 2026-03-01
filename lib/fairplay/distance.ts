import { FeatureVector, Song } from "./types";

export function euclideanDistance(song: Song, meanVector: FeatureVector) {
  let sum = 0;
  let count = 0;

  for (const key of Object.keys(meanVector) as (keyof FeatureVector)[]) {
    const value = song.features[key];
    if (value !== undefined) {
      sum += (value - meanVector[key]) ** 2;
      count++;
    }
  }

  if (count === 0) return Infinity;

  return Math.sqrt(sum / count);
}
