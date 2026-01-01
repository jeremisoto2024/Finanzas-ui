import { BanknotesIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { gastos } from '@/lib/data'
import { totalGastos, gastosPorCategoria } from '@/lib/finanzas'
import { categoriasConfig } from '@/lib/categorias'
import { motion } from 'framer-motion'

export default function ResumenGastos() {
  const total = totalGastos(gastos)
  const porCategoria = gastosPorCategoria(gastos)

  return (
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          Total gastado este mes
        </CardTitle>
        <BanknotesIcon className="h-5 w-5 text-emerald-400" />
      </CardHeader>
     
      <CardContent>
      <motion.p
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
  className="text-3xl font-bold text-white"
>
  € {total.toFixed(2)}
</motion.p>

        <div className="mt-6 space-y-3">
          {Object.entries(porCategoria).map(([categoria, monto], index) => {
            const Icon = categoriasConfig[categoria]?.icon
            const color = categoriasConfig[categoria]?.color || 'text-slate-400'

            return (
              <motion.div
  key={categoria}
  initial={{ opacity: 0, x: -12 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.08, ease: 'easeOut' }}
  className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2"
>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" style={{ color }} />}
                  <span className="text-sm text-slate-200">
                    {categoria}
                  </span>
                </div>

                <span className="text-sm font-medium text-slate-400">
                  € {monto.toFixed(2)}
                </span>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}