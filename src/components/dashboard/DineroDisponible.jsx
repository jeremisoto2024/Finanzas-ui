import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Wallet, TrendingUp, PieChart } from 'lucide-react'

export default function DineroDisponible() {
  const ingresoMensual = 1800
  const gastosFijos = 950
  const disponible = ingresoMensual - gastosFijos
  const porcentajeDisponible = (disponible / ingresoMensual) * 100
  const porcentajeGastosFijos = (gastosFijos / ingresoMensual) * 100

  return (
    <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-800/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
            Dinero Disponible
          </CardTitle>
          <div className="text-xs text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded-lg">
            {porcentajeDisponible.toFixed(0)}% libre
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* MONTO PRINCIPAL */}
        <div className="text-center">
          <p className="text-4xl font-bold text-white mb-2">
            €{disponible.toFixed(2)}
          </p>
          <p className="text-sm text-emerald-300">
            Para gastos variables y ahorro
          </p>
        </div>

        {/* BARRA DE PROGRESO SIMPLIFICADA */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Distribución</span>
            <span className="font-medium text-slate-300">
              €{disponible} disponible
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${porcentajeDisponible}%` }}
              title={`${porcentajeDisponible.toFixed(1)}% disponible`}
            ></div>
            <div 
              className="h-full bg-slate-600 transition-all duration-500"
              style={{ width: `${porcentajeGastosFijos}%` }}
              title={`${porcentajeGastosFijos.toFixed(1)}% gastos fijos`}
            ></div>
          </div>
        </div>

        {/* DESGLOSE SIMPLIFICADO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm text-slate-300">Ingresos</span>
            </div>
            <span className="text-lg font-bold text-emerald-400">
              €{ingresoMensual.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <PieChart className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-sm text-slate-300">Gastos fijos</span>
            </div>
            <span className="text-lg font-bold text-slate-300">
              €{gastosFijos.toFixed(2)}
            </span>
          </div>
        </div>

        {/* FOOTER SIMPLE */}
        <div className="pt-2 border-t border-slate-800/50">
          <div className="flex items-center justify-center text-xs text-slate-500">
            <span>
              {porcentajeDisponible.toFixed(0)}% disponible del ingreso total
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}