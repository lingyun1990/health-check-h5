import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { factors } from "./scoring";
import type { SubmissionRecord } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "submissions.json");

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, "[]", "utf8");
  }
}

export async function readSubmissions(): Promise<SubmissionRecord[]> {
  await ensureDataFile();
  const raw = await readFile(dataFile, "utf8");
  try {
    const parsed = JSON.parse(raw) as SubmissionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addSubmission(record: SubmissionRecord): Promise<void> {
  const records = await readSubmissions();
  records.unshift(record);
  await writeFile(dataFile, JSON.stringify(records, null, 2), "utf8");
}

function csvCell(value: string | number) {
  const text = String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function submissionsToCsv(records: SubmissionRecord[]) {
  const headers = [
    "提交时间",
    "勾选症状总数",
    "勾选症状",
    "前三优先方向",
    ...factors.flatMap((factor) => [`${factor.name}命中次数`, `${factor.name}百分比`]),
  ];

  const rows = records.map((record) => [
    record.createdAt,
    record.selectedSymptoms.length,
    record.selectedSymptoms.join("；"),
    record.topFactors.join(" / "),
    ...factors.flatMap((factor) => {
      const score = record.scores.find((item) => item.name === factor.name);
      return [score?.hits ?? 0, `${score?.percent ?? 0}%`];
    }),
  ]);

  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
