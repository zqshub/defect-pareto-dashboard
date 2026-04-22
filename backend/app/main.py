import os
import sys

# 将 app 目录加入路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.data_generator import generate_defect_data
from app.analyzer import analyze_pareto
from app.llm_insight import get_llm_insight

app = FastAPI(
    title="产线缺陷帕累托分析看板 API",
    description="工业视觉检测缺陷数据的帕累托分析与大模型智能归因",
    version="1.0.0",
)

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据文件路径
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "defects.csv")


class InsightRequest(BaseModel):
    head_defects: list


@app.get("/")
def root():
    return {"message": "产线缺陷帕累托分析看板 API 服务运行中"}


@app.get("/api/generate-data")
def generate_data(count: int = 1000):
    """生成模拟缺陷数据 CSV"""
    try:
        path = generate_defect_data(num_records=count, output_path=DATA_PATH)
        return {"success": True, "path": path, "count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/pareto-analysis")
def pareto_analysis():
    """获取帕累托分析结果"""
    if not os.path.exists(DATA_PATH):
        # 数据不存在时自动生成
        generate_defect_data(num_records=1000, output_path=DATA_PATH)

    try:
        result = analyze_pareto(DATA_PATH, threshold=0.80)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/llm-insight")
def llm_insight(request: InsightRequest):
    """获取 LLM 智能归因分析"""
    try:
        result = get_llm_insight(request.head_defects)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
