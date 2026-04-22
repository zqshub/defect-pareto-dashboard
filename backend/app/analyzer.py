import pandas as pd
from typing import List, Dict


def analyze_pareto(csv_path: str, threshold: float = 0.80) -> Dict:
    """
    读取缺陷数据 CSV，进行帕累托分析。

    返回:
        {
            "total_defects": int,
            "categories": [
                {"name": str, "count": int, "percentage": float, "cumulative": float},
                ...
            ],
            "head_defects": [  # 累计占比达到 threshold 的头部缺陷
                {"name": str, "count": int, "percentage": float, "cumulative": float},
                ...
            ],
            "head_count": int,
            "head_percentage": float,
        }
    """
    df = pd.read_csv(csv_path)

    # 统计各缺陷类别的频次（降序）
    counts = df["缺陷类别"].value_counts().sort_values(ascending=False)
    total = counts.sum()

    categories = []
    cumulative = 0.0
    for name, count in counts.items():
        pct = round(count / total * 100, 2)
        cumulative = round(cumulative + pct, 2)
        categories.append({
            "name": name,
            "count": int(count),
            "percentage": pct,
            "cumulative": cumulative,
        })

    # 提取头部缺陷（累计占比达到 threshold）
    head_defects = []
    for cat in categories:
        head_defects.append(cat)
        if cat["cumulative"] >= threshold * 100:
            break

    head_count = sum(d["count"] for d in head_defects)
    head_percentage = round(head_count / total * 100, 2)

    return {
        "total_defects": int(total),
        "categories": categories,
        "head_defects": head_defects,
        "head_count": head_count,
        "head_percentage": head_percentage,
    }
