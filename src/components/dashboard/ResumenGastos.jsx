import { BanknotesIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { gastos } from "@/lib/data"
import { totalGastos, gastosPorCategoria } from "@/lib/finanzas"
import { categoriasConfig } from "@/lib/categorias"

export default function ResumenGastos() {
  const total = totalGastos(gastos)
  const porCategoria = gastosPorCategoria(gastos)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total gastado este mes</CardTitle>
          <BanknotesIcon className="h-5 w-5 text-emerald-400" />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-xl font-semibold">
            € {total.toFixed(2)}
          </div>

          <div className="space-y-2">
            {Object.entries(porCategoria).map(([categoria, monto]) => {
              const Icon = categoriasConfig[categoria]?.icon
              const color = categoriasConfig[categoria]?.color

              return (
                <div
                  key={categoria}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <Icon className={h-4 w-4 ${color}} />
                    )}
                    <span className="text-slate-300">
                      {categoria}
                    </span>
                  </div>

                  <span className="text-slate-400">
                    € {monto.toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}