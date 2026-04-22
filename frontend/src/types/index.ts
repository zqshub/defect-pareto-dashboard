export interface DefectCategory {
  name: string;
  count: number;
  percentage: number;
  cumulative: number;
}

export interface ParetoData {
  total_defects: number;
  categories: DefectCategory[];
  head_defects: DefectCategory[];
  head_count: number;
  head_percentage: number;
}

export interface RootCause {
  defect: string;
  possible_causes: string[];
  confidence: string;
}

export interface Recommendation {
  defect: string;
  actions: string[];
  priority: string;
}

export interface InsightData {
  summary: string;
  root_causes: RootCause[];
  recommendations: Recommendation[];
  key_insight: string;
}
