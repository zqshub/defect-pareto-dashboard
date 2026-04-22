import os
import json
from typing import Dict, List
from openai import OpenAI


def get_llm_insight(head_defects: List[Dict]) -> Dict:
    """
    调用 LLM 对头部缺陷进行智能归因分析。

    用户需要在环境变量中配置：
    - LLM_API_KEY: API Key
    - LLM_BASE_URL: API Base URL（如 https://api.openai.com/v1）
    - LLM_MODEL: 模型名称（如 gpt-4o）
    """
    api_key = os.environ.get("LLM_API_KEY")
    base_url = os.environ.get("LLM_BASE_URL")
    model = os.environ.get("LLM_MODEL", "claude-opus-4-7")

    if not api_key:
        raise ValueError("环境变量 LLM_API_KEY 未设置")

    client = OpenAI(api_key=api_key, base_url=base_url)

    # 构建缺陷数据摘要
    defect_summary = "\n".join([
        f"- {d['name']}: {d['count']} 次，占比 {d['percentage']}%，累计 {d['cumulative']}%"
        for d in head_defects
    ])

    system_prompt = """你是一位资深的工业品质管理专家，擅长产线缺陷分析与根因排查。
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
3. 建议要有明确的执行步骤和检查方向。"""

    user_prompt = f"""以下是产线缺陷帕累托分析的头部缺陷数据（累计占比约80%）：

{defect_summary}

请进行智能归因分析。"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=2000,
    )

    content = response.choices[0].message.content

    # 尝试从返回内容中提取 JSON
    try:
        # 如果返回的是 markdown 代码块，提取其中的 JSON
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0].strip()
        else:
            json_str = content.strip()

        result = json.loads(json_str)
    except (json.JSONDecodeError, IndexError):
        # 解析失败时返回原始文本
        result = {
            "summary": "LLM 返回了非 JSON 格式内容",
            "raw_content": content,
            "root_causes": [],
            "recommendations": [],
            "key_insight": "",
        }

    return result
