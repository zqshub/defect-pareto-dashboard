# 产线缺陷帕累托分析与大模型智能归因看板

基于工业视觉检测缺陷数据的帕累托分析（Pareto Analysis）与大模型智能归因分析看板。每次生成模拟数据时，头部缺陷类型会随机轮换，模拟真实工业场景中不同批次、产线、时期的主要质量问题变化。

## 功能特性

- **数据生成**：自动生成 1200 条模拟工业视觉检测缺陷记录 CSV，每次头部缺陷类型随机轮换
- **帕累托分析**：统计缺陷频次，计算累计百分比，提取头部缺陷（累计 80%）
- **可视化看板**：ECharts 标准帕累托图（柱状图 + 累计百分比折线图）
- **AI 智能归因**：调用大模型对头部缺陷进行根因分析和排查建议，支持多种 LLM 平台
- **数据导出**：一键下载缺陷记录 CSV 文件

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS + ECharts |
| 数据模拟 | JavaScript（随机权重分配，模拟真实工业场景） |
| LLM | OpenAI 兼容 API（支持 CloseAI / 硅基流动 / OpenAI 等平台） |

## 项目结构

```
defect-pareto-dashboard/
├── frontend/                   # React 前端（主运行方案）
│   ├── src/
│   │   ├── utils/
│   │   │   ├── dataGenerator.ts    # 数据生成（1200条，头部缺陷轮换）
│   │   │   └── paretoAnalyzer.ts   # 帕累托分析算法
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

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/zqshub/defect-pareto-dashboard.git
cd defect-pareto-dashboard/frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 LLM API

```bash
cp .env.example .env
```

编辑 `.env`，填入你的 API Key 和配置：

```env
VITE_LLM_API_KEY=sk-your-api-key-here
VITE_LLM_BASE_URL=https://api.openai.com/v1
VITE_LLM_MODEL=gpt-4o
```

**常用平台配置参考：**

| 平台 | Base URL | 推荐模型 |
|------|----------|----------|
| CloseAI | `https://api.closeai-asia.com/v1` | `claude-opus-4-7` |
| 硅基流动 | `https://api.siliconflow.cn/v1` | `deepseek-ai/DeepSeek-V3` |
| 月之暗面 Kimi | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o`, `gpt-4-turbo` |

> 开发环境下，LLM 请求会通过 Vite 代理转发，避免浏览器 CORS 限制。

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`

### 5. 使用看板

1. 点击「生成模拟数据」生成 1200 条缺陷记录
2. 查看帕累托图和缺陷分布明细
3. 点击「下载 CSV」导出数据文件
4. 点击「AI 智能归因」获取大模型分析结果

## 核心逻辑说明

### 帕累托分析算法

1. **统计频次**：遍历缺陷记录，按类别统计出现次数
2. **降序排列**：按频次从高到低排序
3. **计算百分比**：每个类别的数量 / 总数 × 100%
4. **计算累计百分比**：逐类累加百分比，最后一项强制为 100%
5. **提取头部缺陷**：累计占比达到 80% 的缺陷类别

### 数据生成设计

| 层级 | 权重范围 | 说明 |
|------|----------|------|
| 头部缺陷（2种） | 各 32%-40%，合计 68%-72% | 每次随机轮换缺陷类型 |
| 次要缺陷（5种） | 各 5%-9% | 分享剩余 28%-32% |

每次点击「生成模拟数据」，系统会随机选择 2 种缺陷作为头部缺陷，模拟不同生产批次、产线、时期的质量问题变化。例如：
- 第 1 次：划伤 38% + 漏装 34%
- 第 2 次：异物 36% + 脏污 33%
- 第 3 次：色差 35% + 裂纹 35%

### LLM 智能归因 Prompt 设计

System Prompt 要求模型扮演资深工艺工程师（10 年以上制造现场经验），基于头部缺陷数据输出结构化 JSON：

- `summary`: 总体分析摘要（工程改善口吻，2-3 句话）
- `root_causes`: 根因分析（工艺/设备/材料/治具/人员五维度，每种缺陷 2-3 条最可能原因 + 置信度）
- `recommendations`: 排查建议（短期遏制、中期整改、长期预防各一条，标注责任部门与优先级）
- `key_insight`: 核心洞察（一句话）

### 前端代理配置

开发环境下，Vite 配置了两条代理规则：

- `/api` → `http://localhost:8000`（后端 API，如需要）
- `/llm-proxy` → LLM API Base URL（解决浏览器 CORS 跨域限制）

生产环境请确保 API 端点支持 CORS，或在 Nginx 等反向代理中配置跨域头。

## 截图

![看板预览](screenshot.png)

## License

MIT
