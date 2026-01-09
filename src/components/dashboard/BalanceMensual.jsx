import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, CreditCard, Target, Calendar } from 'lucide-react'
import { gastos } from '@/lib/data'
import { totalGastos } from '@/lib/finanzas'

// datos simulados (luego Notion)
const INGRESOS_MES = 1800

export default function BalanceMensual() {
  const gastosTotales = totalGastos(gastos)
  const balance = INGRESOS_MES - gastosTotales
  const positivo = balance >= 0
  const porcentajeGastado = (gastosTotales / INGRESOS_MES) * 100
  
  const hoy = new Date().getDate()
  const diasMes = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate()
  
  const promedioDiario = gastosTotales / hoy
  const proyeccion = promedioDiario * diasMes
  const porcentajeProyeccion = (proyeccion / INGRESOS_MES) * 100

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
            Balance Mensual
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-lg">
            <Calendar className="h-3 w-3" />
            <span>Día {hoy} de {diasMes}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* BARRA DE PROGRESO GASTOS/INGRESOS */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Gasto vs Ingreso</span>
            <span className="font-medium text-slate-300">{porcentajeGastado.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(porcentajeGastado, 100)}%`,
                background: porcentajeGastado > 80 
                  ? 'linear-gradient(90deg, #ef4444, #f87171)' 
                  : porcentajeGastado > 60
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #10b981, #34d399)'
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>€0</span>
            <span>Meta: €{INGRESOS_MES}</span>
          </div>
        </div>

        {/* INGRESOS */}
        <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-sm text-slate-300">Ingresos</span>
              <div className="text-xs text-slate-500">Salario mensual</div>
            </div>
          </div>
          <span className="text-lg font-bold text-emerald-400">
            €{INGRESOS_MES.toFixed(2)}
          </span>
        </div>

        {/* GASTOS */}
        <div className="flex items-center justify-between p-3 bg-rose-900/20 rounded-lg border border-rose-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-900/30 rounded-lg">
              <TrendingDown className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <span className="text-sm text-slate-300">Gastos</span>
              <div className="text-xs text-slate-500">Acumulado</div>
            </div>
          </div>
          <span className="text-lg font-bold text-rose-400">
            €{gastosTotales.toFixed(2)}
          </span>
        </div>

        {/* BALANCE */}
        <div className={`p-4 rounded-lg border ${positivo ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-rose-900/20 border-rose-800/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {positivo ? (
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
              ) : (
                <div className="p-2 bg-rose-900/30 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-rose-400" />
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-slate-300">Balance</span>
                <div className="text-xs text-slate-500">
                  {positivo ? 'Superávit' : 'Déficit'} mensual
                </div>
              </div>
            </div>
            <span className={`text-2xl font-bold ${positivo ? 'text-emerald-400' : 'text-rose-400'}`}>
              €{balance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* PROYECCIÓN */}
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Proyección del mes</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            Basado en tu gasto promedio diario de €{promedioDiario.toFixed(2)}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto proyectado:</span>
              <span className={`font-semibold ${porcentajeProyeccion > 100 ? 'text-rose-400' : 'text-slate-300'}`}>
                €{proyeccion.toFixed(0)}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${Math.min(porcentajeProyeccion, 100)}%`,
                  background: porcentajeProyeccion > 100 
                    ? 'linear-gradient(90deg, #ef4444, #f87171)' 
                    : 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{porcentajeProyeccion.toFixed(1)}% del presupuesto</span>
              <span className={porcentajeProyeccion > 100 ? 'text-rose-400' : 'text-slate-400'}>
                {porcentajeProyeccion > 100 ? 'Sobre presupuesto' : 'Dentro del presupuesto'}
              </span>
            </div>
          </div>
        </div>

        {/* RESUMEN RÁPIDO */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-2 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Día {hoy}</div>
            <div className="text-sm font-medium text-white">€{promedioDiario.toFixed(0)}/día</div>
          </div>
          <div className="text-center p-2 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Restante</div>
            <div className="text-sm font-medium text-slate-300">
              {diasMes - hoy} días
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}