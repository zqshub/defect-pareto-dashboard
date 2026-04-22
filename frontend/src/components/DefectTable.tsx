import { DefectCategory } from '../types'

interface Props {
  categories: DefectCategory[]
  headDefects: DefectCategory[]
  totalDefects: number
}

const DefectTable: React.FC<Props> = ({ categories, headDefects, totalDefects }) => {
  const headNames = new Set(headDefects.map(d => d.name))

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase tracking-wider">
            <th className="px-4 py-3 text-left font-semibold">排名</th>
            <th className="px-4 py-3 text-left font-semibold">缺陷类别</th>
            <th className="px-4 py-3 text-right font-semibold">数量</th>
            <th className="px-4 py-3 text-right font-semibold">占比</th>
            <th className="px-4 py-3 text-right font-semibold">累计占比</th>
            <th className="px-4 py-3 text-center font-semibold">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.map((cat, idx) => {
            const isHead = headNames.has(cat.name)
            return (
              <tr
                key={cat.name}
                className={isHead ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
              >
                <td className="px-4 py-3 font-medium">{idx + 1}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    idx === 0 ? 'bg-red-100 text-red-800' :
                    idx === 1 ? 'bg-orange-100 text-orange-800' :
                    idx < 4 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {cat.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono">{cat.count}</td>
                <td className="px-4 py-3 text-right font-mono">{cat.percentage}%</td>
                <td className="px-4 py-3 text-right font-mono font-semibold">{cat.cumulative}%</td>
                <td className="px-4 py-3 text-center">
                  {isHead && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-600 text-white">
                      头部缺陷
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50 font-semibold">
            <td className="px-4 py-3" colSpan={2}>合计</td>
            <td className="px-4 py-3 text-right font-mono">{totalDefects}</td>
            <td className="px-4 py-3 text-right font-mono">100%</td>
            <td className="px-4 py-3 text-right font-mono">100%</td>
            <td className="px-4 py-3 text-center">
              <span className="text-red-600">Top {headDefects.length} 类 = 80% 问题</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default DefectTable
