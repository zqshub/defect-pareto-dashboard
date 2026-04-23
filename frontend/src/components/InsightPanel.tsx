import { InsightData } from '../types'

interface Props {
  insight: InsightData | null
  loading: boolean
}

// 图标组件
const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const LightbulbIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const WrenchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const TrendUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const CheckBadgeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
)

const InsightPanel: React.FC<Props> = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-200 border-t-purple-600"></div>
            <div className="absolute inset-0 rounded-full bg-purple-50 animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-500 font-medium">AI 正在分析头部缺陷原因...</p>
        </div>
      </div>
    )
  }

  if (!insight) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LightbulbIcon />
          </div>
          <p className="text-gray-400 font-medium">点击「AI 智能归因」按钮获取分析结果</p>
        </div>
      </div>
    )
  }

  const confidenceBadge = (c: string) => {
    switch (c) {
      case '高': return 'bg-red-50 text-red-700 border-red-200 ring-red-100'
      case '中': return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100'
      case '低': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const priorityBadge = (p: string) => {
    switch (p) {
      case '高': return 'bg-red-50 text-red-700 border-red-200'
      case '中': return 'bg-amber-50 text-amber-700 border-amber-200'
      case '低': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const stepColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
  ]

  return (
    <div className="space-y-5">
      {/* ===== 核心洞察 Banner ===== */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-5 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <TrendUpIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">核心洞察</h4>
            <p className="text-base font-semibold leading-snug">{insight.key_insight}</p>
          </div>
        </div>
      </div>

      {/* ===== 分析摘要 ===== */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-slate-700">分析摘要</h4>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed pl-8">{insight.summary}</p>
      </div>

      {/* ===== 根因分析 ===== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertIcon />
          </div>
          <h4 className="text-sm font-bold text-gray-800">根因分析</h4>
          <span className="text-xs text-gray-400">按置信度排序</span>
        </div>
        <div className="space-y-3">
          {insight.root_causes.map((rc, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 顶部：缺陷名 + 置信度 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-gray-800 text-sm">{rc.defect}</span>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${confidenceBadge(rc.confidence)}`}>
                  <CheckBadgeIcon />
                  置信度 {rc.confidence}
                </span>
              </div>
              {/* 可能原因 */}
              <div className="pl-9 space-y-1.5">
                {rc.possible_causes.map((cause, cidx) => (
                  <div key={cidx} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5"></span>
                    <span className="text-sm text-gray-600 leading-relaxed">{cause}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 排查建议 ===== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
            <WrenchIcon />
          </div>
          <h4 className="text-sm font-bold text-gray-800">排查建议</h4>
          <span className="text-xs text-gray-400">按优先级排序</span>
        </div>
        <div className="space-y-3">
          {insight.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 顶部：缺陷名 + 优先级 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-gray-800 text-sm">{rec.defect}</span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityBadge(rec.priority)}`}>
                  {rec.priority}优先级
                </span>
              </div>
              {/* 行动步骤 */}
              <div className="pl-9 space-y-2">
                {rec.actions.map((action, aidx) => (
                  <div key={aidx} className="flex items-start gap-2.5">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full ${stepColors[aidx % stepColors.length]} text-white text-[10px] font-bold flex items-center justify-center mt-0.5`}>
                      {aidx + 1}
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InsightPanel
