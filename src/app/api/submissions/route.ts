import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { addSubmission, readSubmissions } from "@/lib/submissions";
import { scoreAssessment } from "@/lib/scoring";
import type { SubmissionRecord } from "@/lib/types";

export async function GET() {
  const records = await readSubmissions();
  return NextResponse.json({ records });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { selectedSymptomIds?: unknown };
  const selectedSymptomIds = Array.isArray(body.selectedSymptomIds)
    ? body.selectedSymptomIds.filter((id): id is number => Number.isInteger(id))
    : [];

  const result = scoreAssessment(selectedSymptomIds);
  const record: SubmissionRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    selectedSymptomIds,
    selectedSymptoms: result.selectedSymptoms.map((symptom) => symptom.name),
    scores: result.scores,
    topFactors: result.topFactors.map((score) => score.name),
  };

  await addSubmission(record);

  return NextResponse.json({ record });
}
