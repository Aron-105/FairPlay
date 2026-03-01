export interface Song {
  trackName: string;
  albumName: string;
  artistNames: string;
  playlistSource: string;
  trackUri: string;

  features: Partial<FeatureVector>;
  isLiked: boolean;
}

export interface Playlist {
  name: string;
  songs: Song[];
  useLength: boolean;
}

export interface FeatureVector {
  Danceability: number;
  Energy: number;
  Key: number;
  Loudness: number;
  Mode: number;
  Speechiness: number;
  Acousticness: number;
  Instrumentalness: number;
  Liveness: number;
  Valence: number;
  Tempo: number;
}