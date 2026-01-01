import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { gastos } from '@/lib/data'
import { gastosPorCategoria } from '@/lib/finanzas'
import { categoriasConfig } from '@/lib/categorias'
import { motion } from 'framer-motion'
import { Tooltip } from 'recharts'

export default function GraficoGastos() {
  const porCategoria = gastosPorCategoria(gastos)

  const data = Object.entries(porCategoria).map(
    ([categoria, monto]) => ({
      name: categoria,
      value: monto,
      color: categoriasConfig[categoria]?.color || '#94a3b8',
    })
  )

  return (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-sm text-slate-300">
          Gastos por categoría
        </CardTitle>
      </CardHeader>

     <CardContent>
  <div className="flex justify-center items-center">
    <PieChart width={240} height={240}>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={50}
        outerRadius={90}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.color}
          />
        ))}
      </Pie>
      <Tooltip
  contentStyle={{
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    color: '#e5e7eb',
  }}
  formatter={(value, name) => [€ ${value.toFixed(2)}, name]}
/>
    </PieChart>
  </div>
</CardContent>
</Card>
</motion.div>)
}