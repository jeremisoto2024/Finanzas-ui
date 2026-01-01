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

export default function GraficoGastos() {
  const porCategoria = gastosPorCategoria(gastos)

  const data = Object.entries(porCategoria).map(([categoria, monto]) => ({
    name: categoria,
    value: monto,
    color: categoriasConfig[categoria]?.color || '#94a3b8',
    icon: categoriasConfig[categoria]?.icon,
  }))

  return (
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-wide text-slate-400">
  Gastos por categoría
</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* GRÁFICO */}
        <motion.div
  className="h-64 w-full"
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                isAnimationActive
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [`€ ${value.toFixed(2)}`, name]}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  }}
                  itemStyle={{
                  color: '#e5e7eb',
                }}
                labelStyle={{
                color: '#94a3b8',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* LEYENDA PERSONALIZADA */}
        <div className="space-y-2">
          {data.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon
                      className="h-4 w-4"
                      style={{ color: item.color }}
                    />
                  )}
                  <span className="text-sm text-slate-200">
                    {item.name}
                  </span>
                </div>

                <span className="text-sm text-slate-400">
                  € {item.value.toFixed(2)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}