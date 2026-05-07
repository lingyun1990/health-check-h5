import symptomMap from "@/data/symptomMap.json";
import type { AssessmentResult, FactorName, SymptomItem, SymptomMap } from "./types";

const config = symptomMap as SymptomMap;

export const factors = config.factors;
export const symptoms = config.symptoms;

export function scoreAssessment(selectedSymptomIds: number[]): AssessmentResult {
  const selectedIdSet = new Set(selectedSymptomIds);
  const selectedSymptoms = symptoms.filter((symptom) => selectedIdSet.has(symptom.id));

  const scores = factors
    .map((factor) => {
      const hits = selectedSymptoms.reduce((count, symptom) => {
        return symptom.marks[factor.name as FactorName] === "@" ? count + 1 : count;
      }, 0);

      return {
        name: factor.name,
        hits,
        total: factor.total,
        percent: factor.total > 0 ? Number(((hits / factor.total) * 100).toFixed(1)) : 0,
        rank: 0,
      };
    })
    .sort((left, right) => {
      if (right.percent !== left.percent) return right.percent - left.percent;
      if (right.hits !== left.hits) return right.hits - left.hits;
      return left.name.localeCompare(right.name, "zh-CN");
    })
    .map((score, index) => ({ ...score, rank: index + 1 }));

  return {
    selectedCount: selectedSymptoms.length,
    selectedSymptoms,
    scores,
    topFactors: scores.slice(0, 3),
  };
}

export function getSymptomById(id: number): SymptomItem | undefined {
  return symptoms.find((symptom) => symptom.id === id);
}
