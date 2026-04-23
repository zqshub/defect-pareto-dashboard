export interface DefectRecord {
  时间段: string;
  产线编号: string;
  产品批次: string;
  缺陷类别: string;
  AI置信度: number;
}

function generateRandomWeights(): number[] {
  const weights = new Array(7).fill(0);

  // 随机选择 2 种缺陷作为头部（合计占 65%-75%）
  const indices = [0, 1, 2, 3, 4, 5, 6];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const headIndices = indices.slice(0, 2);

  // 头部缺陷合计占 68%-72%，严格贴近 70%，避免单一缺陷占比过高导致柱子顶满
  const headTotal = Math.floor(Math.random() * 5) + 68;
  const head1 = Math.floor(Math.random() * 9) + 32;
  const head2 = headTotal - head1;

  weights[headIndices[0]] = head1;
  weights[headIndices[1]] = head2;

  // 剩余 28%-32% 分配给其余 5 种缺陷，每种至少 5%
  let remaining = 100 - headTotal;
  const otherIndices = indices.slice(2);

  for (let i = 0; i < otherIndices.length; i++) {
    if (i === otherIndices.length - 1) {
      weights[otherIndices[i]] = remaining;
    } else {
      const maxW = Math.min(9, remaining - (otherIndices.length - 1 - i) * 5);
      const weight = Math.floor(Math.random() * (maxW - 5 + 1)) + 5;
      weights[otherIndices[i]] = weight;
      remaining -= weight;
    }
  }

  return weights;
}

export function generateDefectData(count: number = 1200): DefectRecord[] {
  const productionLines = Array.from({ length: 10 }, (_, i) => `Line-${String(i + 1).padStart(2, '0')}`);
  const batches = Array.from({ length: 50 }, (_, i) => `Batch-${String(i + 1).padStart(4, '0')}`);

  const defectTypes = ['划伤', '异物', '脏污', '漏装', '变形', '色差', '裂纹'];
  // 每次生成随机轮换头部缺陷，模拟不同批次/产线的真实场景
  const weights = generateRandomWeights();
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const probabilities = weights.map((w) => w / totalWeight);

  const baseDate = new Date('2026-03-01');
  const records: DefectRecord[] = [];

  for (let i = 0; i < count; i++) {
    const daysOffset = Math.floor(Math.random() * 30);
    const hoursOffset = Math.floor(Math.random() * 24);
    const minsOffset = Math.floor(Math.random() * 60);
    const secsOffset = Math.floor(Math.random() * 60);

    const date = new Date(baseDate);
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hoursOffset, minsOffset, secsOffset);

    const timeStr = date.toISOString().replace('T', ' ').slice(0, 19);
    const line = productionLines[Math.floor(Math.random() * productionLines.length)];
    const batch = batches[Math.floor(Math.random() * batches.length)];
    const confidence = parseFloat((Math.random() * 0.299 + 0.70).toFixed(3));

    // 按权重随机选择缺陷类型
    const r = Math.random();
    let cum = 0;
    let defect = defectTypes[0];
    for (let j = 0; j < defectTypes.length; j++) {
      cum += probabilities[j];
      if (r <= cum) {
        defect = defectTypes[j];
        break;
      }
    }

    records.push({
      时间段: timeStr,
      产线编号: line,
      产品批次: batch,
      缺陷类别: defect,
      AI置信度: confidence,
    });
  }

  // 按时间排序
  records.sort((a, b) => a.时间段.localeCompare(b.时间段));

  return records;
}

export function recordsToCSV(records: DefectRecord[]): string {
  const headers = ['时间段', '产线编号', '产品批次', '缺陷类别', 'AI置信度'];
  const rows = records.map((r) =>
    [r.时间段, r.产线编号, r.产品批次, r.缺陷类别, r.AI置信度].join(',')
  );
  return '﻿' + [headers.join(','), ...rows].join('\n');
}

export function parseCSV(csvText: string): DefectRecord[] {
  const lines = csvText.trim().split('\n').filter((l) => l.trim());
  // 跳过 BOM 和表头
  const startIdx = lines[0].startsWith('﻿') ? 0 : 0;
  const dataLines = lines[startIdx].includes('时间段') ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const parts = line.split(',');
    return {
      时间段: parts[0]?.trim() || '',
      产线编号: parts[1]?.trim() || '',
      产品批次: parts[2]?.trim() || '',
      缺陷类别: parts[3]?.trim() || '',
      AI置信度: parseFloat(parts[4]?.trim() || '0'),
    };
  });
}
