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

  const systemPrompt = `你是一位资深工艺工程师（10年以上制造现场经验），基于缺陷帕累托数据输出质量改善分析。

【输出格式】JSON：
{
  "summary": "2-3句话概述问题现状与风险",
  "root_causes": [{"defect": "缺陷名", "possible_causes": ["原因1","原因2"], "confidence": "高/中/低"}],
  "recommendations": [{"defect": "缺陷名", "actions": ["短期: ...","中期: ...","长期: ..."], "priority": "高/中/低"}],
  "key_insight": "一句话核心洞察"
}

【分析要求】
1. 聚焦头部缺陷（累计80%），按频次从高到低逐一分析。
2. 根因：从工艺、设备、材料、治具、人员五个维度判断，每缺陷列2-3条最可能原因。
3. 措施：每缺陷必须包含短期遏制、中期整改、长期预防各一条，标注责任部门（如生产/设备/质量/采购）。
4. 语言：工程化表述，具体、可执行，禁止空话套话。每个字段控制在1-2句话。`;

  const userPrompt = `头部缺陷数据（累计80%，优先改善项）：

${defectSummary}

请按上述格式输出归因分析。`;

  // 开发环境走 Vite 代理避免 CORS，生产环境直接请求
  const url = import.meta.env.DEV
    ? '/llm-proxy/v1/chat/completions'
    : (BASE_URL ? `${BASE_URL}/chat/completions` : 'https://api.openai.com/v1/chat/completions');

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
