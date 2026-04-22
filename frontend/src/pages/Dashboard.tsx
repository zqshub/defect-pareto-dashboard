import { useState, useCallback } from 'react'
import { generateDefectData, recordsToCSV, DefectRecord } from '../utils/dataGenerator'
import { analyzePareto, ParetoResult } from '../utils/paretoAnalyzer'
import { getLLMInsight } from '../api'
import { InsightData } from '../types'
import ParetoChart from '../components/ParetoChart'
import DefectTable from '../components/DefectTable'
import InsightPanel from '../components/InsightPanel'

const Dashboard = () => {
  const [records, setRecords] = useState<DefectRecord[]>([])
  const [data, setData] = useState<ParetoResult | null>(null)
  const [insight, setInsight] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(false)
  const [insightLoading, setInsightLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setInsight(null)
    try {
      // 生成 1000 条模拟数据
      const newRecords = generateDefectData(1000)
      setRecords(newRecords)

      // 帕累托分析
      const result = analyzePareto(newRecords, 0.80)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const downloadCSV = useCallback(() => {
    if (!records.length) return
    const csv = recordsToCSV(records)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'defects.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [records])

  const analyzeInsight = useCallback(async () => {
    if (!data?.headDefects.length) return
    setInsightLoading(true)
    setError(null)
    try {
      const result = await getLLMInsight(data.headDefects)
      setInsight(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 分析失败')
    } finally {
      setInsightLoading(false)
    }
  }, [data])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">产线缺陷帕累托分析看板</h1>
            <p className="text-sm text-gray-500 mt-0.5">工业视觉检测 · 智能归因分析</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '生成中...' : '生成模拟数据'}
            </button>
            {records.length > 0 && (
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                下载 CSV
              </button>
            )}
            <button
              onClick={analyzeInsight}
              disabled={!data || insightLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {insightLoading ? 'AI 分析中...' : 'AI 智能归因'}
            </button>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      {data && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">缺陷总数</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalDefects.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">缺陷类别数</p>
              <p className="text-2xl font-bold text-gray-900">{data.categories.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">头部缺陷数 (80%)</p>
              <p className="text-2xl font-bold text-red-600">{data.headCount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">头部缺陷占比</p>
              <p className="text-2xl font-bold text-red-600">{data.headPercentage}%</p>
            </div>
          </div>

          {/* Chart + Table Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">帕累托图 (Pareto Chart)</h3>
              <ParetoChart categories={data.categories} />
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">缺陷分布明细</h3>
              <DefectTable
                categories={data.categories}
                headDefects={data.headDefects}
                totalDefects={data.totalDefects}
              />
            </div>
          </div>

          {/* LLM Insight */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-4">AI 智能归因分析</h3>
            <InsightPanel insight={insight} loading={insightLoading} />
          </div>
        </main>
      )}

      {/* Empty State */}
      {!data && !loading && !error && (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-lg shadow p-12">
            <div className="text-6xl mb-4">&#128202;</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">欢迎使用产线缺陷分析看板</h2>
            <p className="text-gray-500 mb-6">点击「生成模拟数据」按钮生成 1000 条缺陷记录并开始帕累托分析</p>
            <button
              onClick={loadData}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              开始分析
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
