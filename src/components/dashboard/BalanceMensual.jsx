import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { gastos } from '@/lib/data'
import { totalGastos } from '@/lib/finanzas'

// datos simulados (luego Notion)
const INGRESOS_MES = 1800

export default function BalanceMensual() {
  const gastosTotales = totalGastos(gastos)
  const balance = INGRESOS_MES - gastosTotales
  const positivo = balance >= 0
  const hoy = new Date().getDate()
const diasMes = new Date(
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  0
).getDate()

const promedioDiario = gastosTotales / hoy
const proyeccion = promedioDiario * diasMes

  return (
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-sm text-slate-300">
          Balance mensual
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ingresos */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Ingresos</span>
          <span className="text-emerald-400 font-semibold">
            € {INGRESOS_MES.toFixed(2)}
          </span>
        </div>

        {/* Gastos */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Gastos</span>
          <span className="text-rose-400 font-semibold">
            € {gastosTotales.toFixed(2)}
          </span>
        </div>

        <hr className="border-slate-700" />

        {/* Balance */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-medium">Balance</span>

          <div className="flex items-center gap-2">
            {positivo ? (
              <ArrowUpIcon className="h-4 w-4 text-emerald-400" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-rose-400" />
            )}

            <span
              className={`font-bold ${
                positivo ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              € {balance.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
  A este ritmo gastarías aprox.
  <span className="font-medium text-slate-300">
    {' '}€ {proyeccion.toFixed(0)}
  </span>{' '}
  este mes
</p>
      </CardContent>
    </Card>
  )
}