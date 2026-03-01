import { NextResponse } from "next/server";
import { getJob } from "@/lib/store/jobStore";
import { generateCsv } from "@/lib/fairplay";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  const songs = getJob(jobId);

  if (!songs) {
    return NextResponse.json({ error: "Job expired" }, { status: 404 });
  }

  const csv = generateCsv(songs);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=fairplay_playlist.csv",
    },
  });
}