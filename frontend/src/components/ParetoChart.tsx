import ReactECharts from 'echarts-for-react'
import { DefectCategory } from '../types'

interface Props {
  categories: DefectCategory[]
}

const ParetoChart: React.FC<Props> = ({ categories }) => {
  const names = categories.map(c => c.name)
  const counts = categories.map(c => c.count)
  const cumulative = categories.map(c => c.cumulative)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: any[]) => {
        const bar = params.find(p => p.seriesName === '缺陷数量')
        const line = params.find(p => p.seriesName === '累计百分比')
        return `<b>${params[0].axisValue}</b><br/>
                缺陷数量: <b>${bar?.value ?? '-'}</b><br/>
                累计占比: <b>${line?.value ?? '-'}%</b>`
      }
    },
    legend: {
      data: ['缺陷数量', '累计百分比'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '缺陷数量',
        position: 'left',
        axisLabel: { formatter: '{value}' }
      },
      {
        type: 'value',
        name: '累计百分比 (%)',
        position: 'right',
        min: 0,
        max: 105,
        axisLabel: { formatter: '{value}%' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '缺陷数量',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: (params: any) => {
            if (params.dataIndex < 2) return '#ef4444'
            if (params.dataIndex < 4) return '#f59e0b'
            return '#10b981'
          }
        },
        barWidth: '50%'
      },
      {
        name: '累计百分比',
        type: 'line',
        yAxisIndex: 1,
        data: cumulative,
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#2563eb',
          width: 3
        },
        itemStyle: {
          color: '#2563eb'
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: '#ef4444',
            type: 'dashed',
            width: 2
          },
          data: [
            {
              yAxis: 80,
              label: {
                formatter: '80% 阈值线',
                position: 'end'
              }
            }
          ]
        }
      }
    ]
  }

  return (
    <div className="w-full h-[420px]">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}

export default ParetoChart
