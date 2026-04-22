# 产线缺陷帕累托分析与大模型智能归因看板

基于工业视觉检测缺陷数据的帕累托分析（Pareto Analysis）与大模型智能归因分析看板。

## 功能特性

- **数据生成**：自动生成 1000+ 条模拟工业视觉检测缺陷记录 CSV
- **帕累托分析**：统计缺陷频次，计算累计百分比，提取头部缺陷（累计 80%）
- **可视化看板**：ECharts 标准帕累托图（柱状图 + 累计百分比折线图）
- **AI 智能归因**：调用大模型对头部缺陷进行根因分析和排查建议

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS + ECharts |
| 数据模拟 | JavaScript（同时提供 Python 参考实现） |
| LLM | OpenAI 兼容 API |

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd defect-pareto-dashboard/frontend
```

### 2. 配置 LLM API

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 填入你的 API Key 和配置
```

编辑 `.env`：

```env
VITE_LLM_API_KEY=sk-your-api-key-here
VITE_LLM_BASE_URL=https://api.openai.com/v1  # 或其他兼容平台
VITE_LLM_MODEL=gpt-4o  # 或其他模型名称
```

**常用平台配置参考：**

| 平台 | Base URL | 推荐模型 |
|------|----------|----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o`, `gpt-4-turbo` |
| 硅基流动 | `https://api.siliconflow.cn/v1` | `deepseek-ai/DeepSeek-V3` |
| 月之暗面 Kimi | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` |

### 3. 安装依赖并启动

```bash
npm install
npm run dev
```

### 4. 使用看板

1. 点击「生成模拟数据」生成缺陷记录
2. 查看帕累托图和缺陷分布明细
3. 点击「下载 CSV」导出数据文件
4. 点击「AI 智能归因」获取大模型分析结果

## 项目结构

```
defect-pareto-dashboard/
├── backend/                    # Python FastAPI 参考实现
│   ├── app/
│   │   ├── data_generator.py   # 数据生成（Python）
│   │   ├── analyzer.py         # 帕累托分析（Python）
│   │   ├── llm_insight.py      # LLM 调用（Python）
│   │   └── main.py             # FastAPI 入口
│   └── requirements.txt
├── frontend/                   # React 前端（主运行方案）
│   ├── src/
│   │   ├── utils/
│   │   │   ├── dataGenerator.ts    # 数据生成（JS）
│   │   │   └── paretoAnalyzer.ts   # 帕累托分析（JS）
│   │   ├── components/
│   │   │   ├── ParetoChart.tsx     # 帕累托图
│   │   │   ├── DefectTable.tsx     # 缺陷表格
│   │   │   └── InsightPanel.tsx    # AI 分析面板
│   │   ├── pages/
│   │   │   └── Dashboard.tsx       # 看板页面
│   │   ├── api/
│   │   │   └── index.ts            # LLM API 调用
│   │   └── types/
│   │       └── index.ts            # TypeScript 类型
│   ├── .env.example
│   └── package.json
└── README.md
```

## 缺陷数据设计

| 缺陷类别 | 设计占比 | 说明 |
|----------|----------|------|
| 划伤 | ~45% | 头部缺陷 |
| 异物 | ~28% | 头部缺陷 |
| 脏污 | ~10% | |
| 漏装 | ~7% | |
| 变形 | ~5% | |
| 色差 | ~3% | |
| 裂纹 | ~2% | |

**划伤 + 异物 合计约 73%，满足"1-2 种缺陷类型占据 70% 以上"的要求。**

## 核心逻辑说明

### 帕累托分析算法

1. **统计频次**：遍历缺陷记录，按类别统计出现次数
2. **降序排列**：按频次从高到低排序
3. **计算百分比**：每个类别的数量 / 总数 × 100%
4. **计算累计百分比**：逐类累加百分比
5. **提取头部缺陷**：累计占比达到 80% 的缺陷类别

### LLM 智能归因 Prompt 设计

系统 Prompt 要求模型输出结构化 JSON，包含：
- `summary`: 总体分析摘要
- `root_causes`: 根因分析（可能原因 + 置信度）
- `recommendations`: 排查建议（具体行动 + 优先级）
- `key_insight`: 核心洞察

## 截图

![看板预览](screenshot.png)

## License

MIT
