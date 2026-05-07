"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { scoreAssessment } from "@/lib/scoring";

export default function ResultPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem("selectedSymptomIds");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as number[];
        setSelectedIds(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSelectedIds([]);
      }
    }
  }, []);

  const result = useMemo(() => scoreAssessment(selectedIds), [selectedIds]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-6">
      <p className="text-sm font-medium text-leaf">评估结果</p>
      <h1 className="mt-1 text-2xl font-bold text-ink">当前优先关注方向</h1>

      <section className="mt-5 rounded-lg border border-line bg-white p-4 shadow-soft">
        <p className="text-sm text-ink/58">本次勾选症状总数</p>
        <p className="mt-1 text-4xl font-bold text-leaf">{result.selectedCount}</p>
      </section>

      <section className="mt-4 rounded-lg border border-line bg-white p-4 shadow-soft">
        <p className="text-sm font-semibold text-ink">前三个优先关注方向</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {result.topFactors.map((factor) => (
            <span key={factor.name} className="rounded-lg bg-mint px-3 py-2 text-sm font-semibold text-leaf">
              {factor.rank}. {factor.name} {factor.percent}%
            </span>
          ))}
        </div>
      </section>

      <section className="mt-4 space-y-3">
        {result.scores.map((score) => (
          <div key={score.name} className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-ink">
                  {score.rank}. {score.name}
                </p>
                <p className="mt-1 text-sm text-ink/58">
                  命中 {score.hits} / 总数 {score.total}
                </p>
              </div>
              <p className="text-xl font-bold text-leaf">{score.percent}%</p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-mint">
              <div
                className="h-full rounded-full bg-leaf transition-all"
                style={{ width: `${Math.min(score.percent, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="mt-5 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-ink/70">
        以上结果根据你勾选的症状与后台健康要素映射关系计算，仅用于初步了解当前更值得关注的健康管理方向。
        它不代表疾病诊断，也不说明你患有某种疾病。若症状持续、明显加重或影响日常生活，建议及时咨询专业人员。
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3 pb-6">
        <Link
          href="/evaluate"
          className="flex h-11 items-center justify-center rounded-lg border border-line bg-white text-sm font-semibold text-ink"
        >
          重新评估
        </Link>
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded-lg bg-leaf text-sm font-semibold text-white"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
