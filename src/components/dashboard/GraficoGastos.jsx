import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { gastos } from '@/lib/data'
import { gastosPorCategoria } from '@/lib/finanzas'
import { categoriasConfig } from '@/lib/categorias'
import { motion } from 'framer-motion'

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
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-sm text-slate-300">
          Gastos por categoría
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </motion.div>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}