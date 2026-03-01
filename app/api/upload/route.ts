import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const playlists = [];

  for (const file of files) {
    if (!file.name.endsWith(".csv")) continue;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    const content = buffer.toString("utf-8");
    const rows = content.split("\n").filter((row) => row.trim() !== "");

    playlists.push({
      name: file.name.replace(".csv", ""), // ← NO underscore replacement
      trackCount: Math.max(rows.length - 1, 0),
    });
  }

  return NextResponse.json({ playlists });
}
