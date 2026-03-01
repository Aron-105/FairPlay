import { Song } from "./types";

export function euclideanDistance(
  song: Song,
  meanVector: any
) {
  let sum = 0;
  let count = 0;

  for (const key in meanVector) {
    const value = song.features[key];
    if (value !== undefined) {
      sum += (value - meanVector[key]) ** 2;
      count++;
    }
  }

  if (count === 0) return Infinity;

  return Math.sqrt(sum / count);
}