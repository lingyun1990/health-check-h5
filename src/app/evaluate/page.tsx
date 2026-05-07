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
    <main className="mx-auto min-h-screen w-full max-w-md px-3 pb-5 pt-3">
      <section className="rounded-2xl bg-gradient-to-br from-[#225f56] to-[#3b8a77] p-3 text-white shadow-soft">
        <h1 className="flex items-center justify-center gap-2 text-[1.45rem] font-bold leading-tight tracking-normal">
          轻松开始
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-[#ffd76a] text-[#5a3b16] shadow-sm">
            <span className="absolute left-[7px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#5a3b16]" />
            <span className="absolute right-[7px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#5a3b16]" />
            <span className="absolute bottom-[6px] left-1/2 h-3 w-4 -translate-x-1/2 rounded-b-full border-b-[3px] border-[#5a3b16]" />
          </span>
        </h1>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/20 bg-white/14 p-2.5 backdrop-blur">
            <p className="text-sm font-bold leading-5 text-[#ffe28a]">省时省钱省力</p>
            <p className="mt-1 text-[11px] leading-4 text-white/72">帮您省去不必要的检查费用</p>
          </div>
          <div className="rounded-xl border border-white/20 bg-white/14 p-2.5 backdrop-blur">
            <p className="text-sm font-bold leading-5 text-[#ffe28a]">精准恢复方向</p>
            <p className="mt-1 text-[11px] leading-4 text-white/72">快速帮您找到精准恢复方向</p>
          </div>
        </div>
      </section>

      <section className="mt-2 overflow-hidden rounded-2xl border border-line bg-[#fffdf9]">
        <div className="grid grid-cols-2 gap-2 p-2">
          {filteredSymptoms.length === 0 ? (
            <div className="col-span-2 rounded-xl border border-dashed border-line bg-[#fbf8f1] p-5 text-center text-sm text-ink/56">
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
              className={`flex min-h-[48px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition ${
                checked
                  ? "border-leaf bg-mint text-[#103a35] shadow-[inset_0_0_0_1px_#2d6a4f]"
                  : "border-line bg-white text-ink active:bg-[#fbf8f1]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="shrink-0 text-xs text-ink/42">{symptom.id}.</span>
                <strong className="truncate text-[15px] font-semibold leading-5">{symptom.name}</strong>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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

      <section className="mt-2 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-[#fffdf9] p-3">
        <button
          type="button"
          onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
          disabled={isSearching || pageIndex === 0}
          className="h-11 rounded-xl border border-line bg-white text-sm font-semibold text-leaf disabled:cursor-not-allowed disabled:opacity-45"
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
          className="h-11 rounded-xl bg-leaf text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pageIndex >= steps.length - 1 ? (isSubmitting ? "正在生成..." : "生成结果") : "下一页"}
        </button>
      </section>

    </main>
  );
}
