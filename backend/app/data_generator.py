import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os


def generate_defect_data(num_records: int = 1000, output_path: str = None) -> str:
    """
    生成模拟工业视觉检测缺陷记录 CSV 文件。

    缺陷分布设计：
    - 划伤 (Scratch): ~45%
    - 异物 (Foreign_Matter): ~28%
    - 脏污 (Contamination): ~10%
    - 漏装 (Missing_Part): ~7%
    - 变形 (Deformation): ~5%
    - 色差 (Color_Variance): ~3%
    - 裂纹 (Crack): ~2%

    其中划伤 + 异物合计约 73%，满足"1-2 种缺陷类型占据 70% 以上"的要求。
    """
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "data", "defects.csv")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 产线编号
    production_lines = [f"Line-{i:02d}" for i in range(1, 11)]

    # 产品批次
    batches = [f"Batch-{i:04d}" for i in range(1, 51)]

    # 缺陷类别及权重（确保1-2种占70%+）
    defect_types = [
        "划伤",      # Scratch
        "异物",      # Foreign_Matter
        "脏污",      # Contamination
        "漏装",      # Missing_Part
        "变形",      # Deformation
        "色差",      # Color_Variance
        "裂纹",      # Crack
    ]
    # 权重分配：划伤45%，异物28%，其余合计27%
    weights = [45, 28, 10, 7, 5, 3, 2]

    # 时间段：最近 30 天
    base_date = datetime(2026, 3, 1)
    dates = [base_date + timedelta(days=random.randint(0, 29)) for _ in range(num_records)]

    # AI 置信度：0.70 ~ 0.999
    confidence_scores = np.round(np.random.uniform(0.70, 0.999, num_records), 3)

    # 随机选择产线、批次、缺陷类型
    lines = np.random.choice(production_lines, size=num_records)
    batch_ids = np.random.choice(batches, size=num_records)
    defect_categories = np.random.choice(defect_types, size=num_records, p=[w / sum(weights) for w in weights])

    df = pd.DataFrame({
        "时间段": [d.strftime("%Y-%m-%d %H:%M:%S") for d in dates],
        "产线编号": lines,
        "产品批次": batch_ids,
        "缺陷类别": defect_categories,
        "AI置信度": confidence_scores,
    })

    # 按时间排序
    df = df.sort_values("时间段").reset_index(drop=True)

    df.to_csv(output_path, index=False, encoding="utf-8-sig")

    # 打印分布验证
    distribution = df["缺陷类别"].value_counts(normalize=True) * 100
    print(f"数据已生成: {output_path} ({num_records} 条记录)")
    print("缺陷分布:")
    for defect, pct in distribution.items():
        print(f"  {defect}: {pct:.1f}%")
    print(f"Top2 合计: {distribution.iloc[:2].sum():.1f}%")

    return output_path


if __name__ == "__main__":
    generate_defect_data(1000)
