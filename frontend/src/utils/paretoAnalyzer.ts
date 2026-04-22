import { DefectRecord } from './dataGenerator';

export interface DefectCategory {
  name: string;
  count: number;
  percentage: number;
  cumulative: number;
}

export interface ParetoResult {
  totalDefects: number;
  categories: DefectCategory[];
  headDefects: DefectCategory[];
  headCount: number;
  headPercentage: number;
}

export function analyzePareto(records: DefectRecord[], threshold: number = 0.80): ParetoResult {
  // 统计频次
  const counts: Record<string, number> = {};
  for (const r of records) {
    counts[r.缺陷类别] = (counts[r.缺陷类别] || 0) + 1;
  }

  // 排序（降序）
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = records.length;

  let cumulative = 0;
  const categories: DefectCategory[] = sorted.map(([name, count]) => {
    const pct = Math.round((count / total) * 10000) / 100;
    cumulative = Math.round((cumulative + pct) * 100) / 100;
    return {
      name,
      count,
      percentage: pct,
      cumulative,
    };
  });

  // 提取头部缺陷（累计达到 threshold）
  const headDefects: DefectCategory[] = [];
  for (const cat of categories) {
    headDefects.push(cat);
    if (cat.cumulative >= threshold * 100) {
      break;
    }
  }

  const headCount = headDefects.reduce((sum, d) => sum + d.count, 0);
  const headPercentage = Math.round((headCount / total) * 10000) / 100;

  return {
    totalDefects: total,
    categories,
    headDefects,
    headCount,
    headPercentage,
  };
}
