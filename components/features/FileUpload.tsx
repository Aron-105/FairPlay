"use client";

import { useEffect, useRef, useState } from "react";
import PlaylistSelector from "./PlaylistSelector";

export default function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (playlists.length > 0) {
      setTimeout(() => {
        const section = document.getElementById("playlist-selection");
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [playlists]);

  const handleFiles = (fileList: FileList) => {
    const csvFiles = Array.from(fileList).filter((file) =>
      file.name.endsWith(".csv"),
    );

    if (csvFiles.length === 0) {
      alert("Only CSV files are allowed.");
      return;
    }

    setFiles(csvFiles);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select at least one CSV file.");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPlaylists(data.playlists);
  };

  return (
    <section className="bg-neutral-950 py-12 text-white">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur">
          <h2 className="mb-6 text-2xl font-semibold">
            Upload Your Exported Playlists
          </h2>

          {/* Drop Zone */}
          <div
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition ${
              dragActive ? "border-green-400 bg-white/10" : "border-white/20"
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              type="file"
              accept=".csv"
              multiple
              ref={inputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(e.target.files);
                }
              }}
            />

            <p className="text-neutral-300">Drag & drop your CSV files here</p>
            <p className="mt-2 text-sm text-neutral-500">or click to browse</p>

            {files.length > 0 && (
              <div className="mt-4 text-sm text-green-400">
                {files.length} file(s) selected
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="mt-8 w-full rounded-xl bg-green-500 py-3 font-medium text-black transition hover:bg-green-400"
          >
            View Playlists
          </button>
        </div>
      </div>
      {playlists.length > 0 && <PlaylistSelector playlists={playlists} />}
    </section>
  );
}
