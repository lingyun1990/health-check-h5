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
  const topFourFactors = result.scores.slice(0, 4);

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-3 py-4">
      <h1 className="text-center text-2xl font-bold text-ink">当前优先关注方向</h1>

      <section className="mt-3 rounded-2xl border border-line bg-white p-3 shadow-soft">
        <div className="grid grid-cols-2 gap-2">
          {topFourFactors.map((factor) => (
            <span key={factor.name} className="rounded-xl bg-mint px-3 py-2 text-sm font-semibold text-leaf">
              {factor.rank}. {factor.name} {factor.percent}%
            </span>
          ))}
        </div>
      </section>

      <section className="mt-3 space-y-1.5">
        {result.scores.map((score) => (
          <div key={score.name} className="rounded-xl border border-line bg-white px-3 py-2 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-ink">
                  {score.rank}. {score.name}
                  <span className="ml-2 text-xs font-medium text-ink/50">
                    命中 {score.hits} / 总数 {score.total}
                  </span>
                </p>
              </div>
              <p className="shrink-0 text-base font-bold text-leaf">{score.percent}%</p>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mint">
              <div
                className="h-full rounded-full bg-leaf transition-all"
                style={{ width: `${Math.min(score.percent, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="mt-3 rounded-xl border border-line bg-white p-3 text-xs leading-5 text-ink/64">
        <p>
          以上结果根据你勾选的症状与后台健康要素映射关系计算，仅用于初步了解当前更值得关注的健康管理方向。
          它不代表疾病诊断，也不说明你患有某种疾病。
        </p>
        <p className="mt-2 text-base font-bold leading-6 text-leaf">去找凌云老师给您解读吧。</p>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 pb-4">
        <Link
          href="/evaluate"
          className="flex h-10 items-center justify-center rounded-xl border border-line bg-white text-sm font-semibold text-ink"
        >
          重新评估
        </Link>
        <Link
          href="/"
          className="flex h-10 items-center justify-center rounded-xl bg-leaf text-sm font-semibold text-white"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
