export type FactorName = string;

export type FactorConfig = {
  name: FactorName;
  total: number;
};

export type SymptomItem = {
  id: number;
  name: string;
  marks: Partial<Record<FactorName, "@">>;
};

export type SymptomMap = {
  factors: FactorConfig[];
  symptoms: SymptomItem[];
};

export type FactorScore = {
  name: FactorName;
  hits: number;
  total: number;
  percent: number;
  rank: number;
};

export type AssessmentResult = {
  selectedCount: number;
  selectedSymptoms: SymptomItem[];
  scores: FactorScore[];
  topFactors: FactorScore[];
};

export type SubmissionRecord = {
  id: string;
  createdAt: string;
  selectedSymptomIds: number[];
  selectedSymptoms: string[];
  scores: FactorScore[];
  topFactors: string[];
};
