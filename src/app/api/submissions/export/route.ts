import { NextResponse } from "next/server";
import { readSubmissions, submissionsToCsv } from "@/lib/submissions";

export async function GET() {
  const records = await readSubmissions();
  const csv = "\uFEFF" + submissionsToCsv(records);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="health-factor-submissions.csv"`,
    },
  });
}
