import { InsightData } from '../types'

interface Props {
  insight: InsightData | null
  loading: boolean
}

const InsightPanel: React.FC<Props> = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-500">AI 正在分析头部缺陷原因...</p>
        </div>
      </div>
    )
  }

  if (!insight) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400 h-64 flex items-center justify-center">
        <p>点击「AI 智能归因」按钮获取分析结果</p>
      </div>
    )
  }

  const priorityColor = (p: string) => {
    switch (p) {
      case '高': return 'bg-red-100 text-red-800'
      case '中': return 'bg-yellow-100 text-yellow-800'
      case '低': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* 关键洞察 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-primary">
        <h4 className="text-sm font-semibold text-primary mb-1">核心洞察</h4>
        <p className="text-gray-700 text-sm">{insight.key_insight}</p>
      </div>

      {/* 总体摘要 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">分析摘要</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{insight.summary}</p>
      </div>

      {/* 根因分析 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">根因分析</h4>
        <div className="space-y-3">
          {insight.root_causes.map((rc, idx) => (
            <div key={idx} className="border-l-3 border-orange-300 pl-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-800">{rc.defect}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(rc.confidence)}`}>
                  置信度: {rc.confidence}
                </span>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                {rc.possible_causes.map((cause, cidx) => (
                  <li key={cidx}>{cause}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 排查建议 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">排查建议</h4>
        <div className="space-y-3">
          {insight.recommendations.map((rec, idx) => (
            <div key={idx} className="border-l-3 border-green-400 pl-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-800">{rec.defect}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(rec.priority)}`}>
                  优先级: {rec.priority}
                </span>
              </div>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-0.5">
                {rec.actions.map((action, aidx) => (
                  <li key={aidx}>{action}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InsightPanel
