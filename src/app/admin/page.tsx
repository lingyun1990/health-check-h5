"use client";

import { useEffect, useState } from "react";
import type { SubmissionRecord } from "@/lib/types";

export default function AdminPage() {
  const [records, setRecords] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRecords() {
    setLoading(true);
    const response = await fetch("/api/submissions", { cache: "no-store" });
    const data = (await response.json()) as { records: SubmissionRecord[] };
    setRecords(data.records);
    setLoading(false);
  }

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-leaf">管理后台</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">用户提交记录</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadRecords}
            className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink"
          >
            刷新
          </button>
          <a
            href="/api/submissions/export"
            className="flex h-10 items-center rounded-lg bg-leaf px-4 text-sm font-semibold text-white"
          >
            导出 CSV
          </a>
        </div>
      </header>

      {loading ? (
        <p className="mt-8 text-sm text-ink/60">正在加载...</p>
      ) : records.length === 0 ? (
        <p className="mt-8 rounded-lg border border-line bg-white p-5 text-sm text-ink/60">暂无提交记录。</p>
      ) : (
        <section className="mt-5 space-y-4">
          {records.map((record) => (
            <article key={record.id} className="rounded-lg border border-line bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {new Date(record.createdAt).toLocaleString("zh-CN", { hour12: false })}
                  </p>
                  <p className="mt-1 text-sm text-ink/58">勾选 {record.selectedSymptoms.length} 个症状</p>
                </div>
                <p className="rounded-lg bg-mint px-3 py-2 text-sm font-semibold text-leaf">
                  前三：{record.topFactors.join(" / ")}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-ink">勾选症状</p>
                <p className="mt-2 text-sm leading-6 text-ink/68">{record.selectedSymptoms.join("；") || "无"}</p>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-ink/58">
                      <th className="py-2 pr-4 font-semibold">健康要素</th>
                      <th className="py-2 pr-4 font-semibold">命中次数</th>
                      <th className="py-2 pr-4 font-semibold">百分比</th>
                      <th className="py-2 pr-4 font-semibold">优先级</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.scores.map((score) => (
                      <tr key={score.name} className="border-b border-line/70">
                        <td className="py-2 pr-4 font-semibold text-ink">{score.name}</td>
                        <td className="py-2 pr-4 text-ink/70">{score.hits}</td>
                        <td className="py-2 pr-4 text-ink/70">{score.percent}%</td>
                        <td className="py-2 pr-4 text-ink/70">{score.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
