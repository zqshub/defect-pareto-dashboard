import { InsightData } from '../types';

// 从环境变量或配置中获取 API 信息
const API_KEY = import.meta.env.VITE_LLM_API_KEY || '';
const BASE_URL = import.meta.env.VITE_LLM_BASE_URL || '';
const MODEL = import.meta.env.VITE_LLM_MODEL || 'gpt-4o';

export async function getLLMInsight(headDefects: { name: string; count: number; percentage: number; cumulative: number }[]): Promise<InsightData> {
  if (!API_KEY) {
    throw new Error('请先配置 LLM API Key (VITE_LLM_API_KEY)');
  }

  const defectSummary = headDefects
    .map((d) => `- ${d.name}: ${d.count} 次，占比 ${d.percentage}%，累计 ${d.cumulative}%`)
    .join('\n');

  const systemPrompt = `你是一位资深的工业品质管理专家，擅长产线缺陷分析与根因排查。
请基于提供的缺陷帕累托分析数据，对头部缺陷（累计占比约80%的核心缺陷）进行智能归因分析。

你需要输出以下结构化内容（严格使用 JSON 格式）：
{
  "summary": "一段简洁的总体分析摘要（2-3句话）",
  "root_causes": [
    {"defect": "缺陷名称", "possible_causes": ["可能原因1", "可能原因2", "可能原因3"], "confidence": "高/中/低"}
  ],
  "recommendations": [
    {"defect": "缺陷名称", "actions": ["排查建议1", "排查建议2"], "priority": "高/中/低"}
  ],
  "key_insight": "最重要的一个洞察（一句话）"
}

注意：
1. 分析要具体、可落地，不要泛泛而谈。
2. 原因要基于制造业常见场景（设备磨损、来料不良、工艺参数、人员操作、环境因素等）。
3. 建议要有明确的执行步骤和检查方向。`;

  const userPrompt = `以下是产线缺陷帕累托分析的头部缺陷数据（累计占比约80%）：

${defectSummary}

请进行智能归因分析。`;

  const url = BASE_URL ? `${BASE_URL}/chat/completions` : 'https://api.openai.com/v1/chat/completions';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LLM API 请求失败: ${res.status} ${err}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || '';

  // 尝试提取 JSON
  try {
    let jsonStr = content.trim();
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }
    return JSON.parse(jsonStr) as InsightData;
  } catch {
    return {
      summary: 'LLM 返回了非 JSON 格式内容',
      raw_content: content,
      root_causes: [],
      recommendations: [],
      key_insight: '',
    } as InsightData;
  }
}
