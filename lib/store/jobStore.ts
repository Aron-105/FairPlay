import fs from "fs";
import path from "path";

const jobsDir = path.join(process.cwd(), "uploads", "jobs");

if (!fs.existsSync(jobsDir)) {
  fs.mkdirSync(jobsDir, { recursive: true });
}

export function saveJob(id: string, data: any) {
  const filePath = path.join(jobsDir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data));
}

export function getJob(id: string) {
  const filePath = path.join(jobsDir, `${id}.json`);

  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

export function deleteJob(id: string) {
  const filePath = path.join(jobsDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}