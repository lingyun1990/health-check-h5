"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { symptoms } from "@/lib/scoring";

const pageSize = 10;

const groups = [
  { title: "头部五官", start: 1, end: 29 },
  { title: "呼吸口腔", start: 30, end: 50 },
  { title: "手足四肢", start: 51, end: 63 },
  { title: "排便泌尿", start: 64, end: 70 },
  { title: "女性周期", start: 71, end: 79 },
  { title: "消化皮肤 / 其他", start: 80, end: 95 },
];

function getCategory(id: number) {
  return groups.find((group) => id >= group.start && id <= group.end)?.title ?? "身体表现";
}

export default function EvaluatePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = useMemo(() => {
    return Array.from({ length: Math.ceil(symptoms.length / pageSize) }, (_, index) => {
      const startIndex = index * pageSize;
      const endIndex = Math.min((index + 1) * pageSize, symptoms.length) - 1;
      const first = symptoms[startIndex];
      const last = symptoms[endIndex];
      const firstCategory = getCategory(first.id);
      const lastCategory = getCategory(last.id);

      return {
        title: firstCategory === lastCategory ? firstCategory : `${firstCategory} / ${lastCategory}`,
        start: startIndex + 1,
        end: endIndex + 1,
        items: symptoms.slice(startIndex, endIndex + 1),
      };
    });
  }, []);

  const filteredSymptoms = useMemo(() => {
    const value = keyword.trim();
    if (!value) return steps[pageIndex]?.items ?? [];
    return symptoms.filter((symptom) => {
      return symptom.name.includes(value) || String(symptom.id).includes(value);
    });
  }, [keyword, pageIndex, steps]);

  const currentStep = steps[pageIndex] ?? steps[0];
  const progress = Math.round(((pageIndex + 1) / steps.length) * 100);
  const isSearching = keyword.trim().length > 0;

  function toggleSymptom(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function submitAssessment() {
    setIsSubmitting(true);
    sessionStorage.setItem("selectedSymptomIds", JSON.stringify(selectedIds));

    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedSymptomIds: selectedIds }),
      });
    } finally {
      router.push("/result");
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-3 pb-8 pt-3">
      <section className="rounded-lg bg-gradient-to-br from-[#225f56] to-[#3b8a77] p-5 text-white shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/78">身体状态轻评估</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-normal">勾选最近有过的表现</h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/78">不用想太久，看到符合自己的表现就点一下。每页 10 项，慢慢填。</p>
          </div>
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 text-center backdrop-blur">
            <div>
              <p className="text-xl font-bold">{selectedIds.length}/95</p>
              <p className="text-xs text-white/76">已选择</p>
            </div>
          </div>
        </div>
      </section>

      <header className="sticky top-0 z-10 mt-3 rounded-lg border border-line bg-[#fffdf9]/95 p-4 shadow-[0_8px_24px_rgba(44,34,23,0.08)] backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink/52">{isSearching ? "搜索结果" : `第 ${pageIndex + 1} 步 / 共 ${steps.length} 步`}</p>
            <h2 className="mt-1 text-xl font-bold text-ink">{isSearching ? "按关键词筛选症状" : currentStep.title}</h2>
          </div>
          <span className="shrink-0 rounded-full bg-mint px-3 py-1 text-sm font-semibold text-leaf">
            {isSearching ? `${filteredSymptoms.length} 项` : `${currentStep.start}-${currentStep.end} 项`}
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eee7dd]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-leaf to-[#c86b4a] transition-all"
            style={{ width: `${isSearching ? 100 : progress}%` }}
          />
        </div>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索症状，例如：头疼、胃胀"
          className="mt-4 h-11 w-full rounded-lg border border-line bg-white px-4 text-base outline-none focus:border-leaf focus:ring-4 focus:ring-leaf/15"
        />
        <div className="mt-3 flex justify-between text-sm text-ink/52">
          <span>已选 {selectedIds.length} 项</span>
          <span>{isSearching ? `匹配 ${filteredSymptoms.length} 项` : `共 ${symptoms.length} 项`}</span>
        </div>
      </header>

      <section className="mt-3 overflow-hidden rounded-lg border border-line bg-[#fffdf9]">
        <div className="grid gap-2 p-3">
          {filteredSymptoms.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-[#fbf8f1] p-5 text-center text-sm text-ink/56">
              没有找到相关症状，可以换个关键词试试。
            </div>
          ) : null}

          {filteredSymptoms.map((symptom) => {
          const checked = selectedIds.includes(symptom.id);
          return (
            <button
              key={symptom.id}
              type="button"
              onClick={() => toggleSymptom(symptom.id)}
              className={`flex min-h-[58px] items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition ${
                checked
                  ? "border-leaf bg-mint text-[#103a35] shadow-[inset_0_0_0_1px_#2d6a4f]"
                  : "border-line bg-white text-ink active:bg-[#fbf8f1]"
              }`}
            >
              <span className="min-w-0">
                <span className="text-sm text-ink/48">{symptom.id}.</span>{" "}
                <strong className="text-base font-semibold">{symptom.name}</strong>
                <span className={`mt-1 block text-xs ${checked ? "text-leaf" : "text-ink/45"}`}>
                  {getCategory(symptom.id)}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
                  checked ? "bg-white text-leaf" : "bg-[#fbf8f1] text-ink/45"
                }`}
              >
                {checked ? "有" : "未选"}
              </span>
            </button>
          );
        })}
        </div>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-line bg-[#fffdf9] p-3">
        <button
          type="button"
          onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
          disabled={isSearching || pageIndex === 0}
          className="h-11 rounded-lg border border-line bg-white text-sm font-semibold text-leaf disabled:cursor-not-allowed disabled:opacity-45"
        >
          上一页
        </button>
        <button
          type="button"
          onClick={() => {
            if (pageIndex >= steps.length - 1) {
              submitAssessment();
              return;
            }
            setPageIndex((value) => Math.min(steps.length - 1, value + 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={isSubmitting || isSearching}
          className="h-11 rounded-lg bg-leaf text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pageIndex >= steps.length - 1 ? (isSubmitting ? "正在生成..." : "生成结果") : "下一页"}
        </button>
      </section>

      <div className="mt-4 pb-4">
        <button
          type="button"
          onClick={submitAssessment}
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center rounded-lg border border-leaf/25 bg-white px-5 text-base font-semibold text-leaf shadow-sm disabled:opacity-60"
        >
          {isSubmitting ? "正在生成..." : "直接生成结果"}
        </button>
      </div>
    </main>
  );
}
