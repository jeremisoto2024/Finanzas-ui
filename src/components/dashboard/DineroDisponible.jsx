import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Wallet, TrendingUp, Shield, Target, PieChart, ChevronRight } from 'lucide-react'

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
          <div className="text-xs text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded-lg flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Disponible</span>
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

        {/* BARRA DE PROGRESO */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Distribución mensual</span>
            <span className="font-medium text-slate-300">{porcentajeDisponible.toFixed(1)}% disponible</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${porcentajeDisponible}%` }}
            ></div>
            <div 
              className="h-full bg-rose-500 transition-all duration-700"
              style={{ width: `${porcentajeGastosFijos}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Disponible: {porcentajeDisponible.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span>Fijos: {porcentajeGastosFijos.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* DESGLOSE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-sm text-slate-300">Ingresos totales</span>
                <div className="text-xs text-slate-500">Este mes</div>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-400">
              €{ingresoMensual.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <PieChart className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <span className="text-sm text-slate-300">Gastos fijos</span>
                <div className="text-xs text-slate-500">Compromisos mensuales</div>
              </div>
            </div>
            <span className="text-lg font-bold text-slate-300">
              €{gastosFijos.toFixed(2)}
            </span>
          </div>
        </div>

        {/* RECOMENDACIONES */}
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Recomendación</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            Basado en la regla 50/30/20:
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-300">Disponible actual: {porcentajeDisponible.toFixed(0)}%</span>
              </div>
              <span className={`text-xs font-medium ${porcentajeDisponible >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {porcentajeDisponible >= 50 ? '✅ Saludable' : '⚠️ Puedes mejorar'}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Lo ideal es tener al menos 50% disponible después de gastos fijos
            </div>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button className="w-full flex items-center justify-between p-3 bg-emerald-900/30 hover:bg-emerald-900/40 text-emerald-300 rounded-lg border border-emerald-800/30 transition-all group">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Ver detalles de gastos fijos</span>
          </div>
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </CardContent>
    </Card>
  )
}