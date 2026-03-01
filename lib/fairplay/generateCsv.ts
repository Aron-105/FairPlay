export function generateCsv(songs: any[]) {
  const header =
    "Track Name,Album Name,Artist Name(s),Playlist Source,Track URI\n";

  const rows = songs.map(s =>
    `"${s.trackName}","${s.albumName}","${s.artistNames}","${s.playlistSource}","${s.trackUri}"`
  );

  return header + rows.join("\n");
}