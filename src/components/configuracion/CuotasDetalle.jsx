import { useState } from 'react'
import {
  CheckCircle,
  Clock,
  CreditCard,
  Wallet,
  Banknote,
  Calendar,
  Euro,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

const METODOS = [
  { value: 'credito', label: 'Crédito', icon: CreditCard, color: 'text-purple-400' },
  { value: 'debito', label: 'Débito', icon: CreditCard, color: 'text-blue-400' },
  { value: 'efectivo', label: 'Efectivo', icon: Banknote, color: 'text-emerald-400' },
  { value: 'transferencia', label: 'Transferencia', icon: TrendingUp, color: 'text-cyan-400' },
  { value: 'bizum', label: 'Bizum', icon: Wallet, color: 'text-pink-400' }
]

const CUENTAS = ['BBVA', 'Santander', 'Efectivo', 'Revolut', 'PayPal']

export default function CuotasDetalle({ cuotas: cuotasIniciales }) {
  const [cuotas, setCuotas] = useState(cuotasIniciales)

  const actualizarCuota = (index, campo, valor) => {
    const nuevas = [...cuotas]
    nuevas[index] = {
      ...nuevas[index],
      [campo]: valor
    }
    setCuotas(nuevas)
  }

  // Calcular estadísticas
  const totalPagado = cuotas.filter(c => c.pagada).reduce((sum, c) => sum + c.monto, 0)
  const totalPendiente = cuotas.filter(c => !c.pagada).reduce((sum, c) => sum + c.monto, 0)
  const porcentajePagado = cuotas.length > 0 ? 
    (cuotas.filter(c => c.pagada).length / cuotas.length) * 100 : 0

  return (
    <div className="mt-6">
      {/* HEADER CON ESTADÍSTICAS */}
      <div className="mb-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Plan de Cuotas</h3>
            <p className="text-sm text-slate-400">{cuotas.length} cuotas programadas</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400">Pagado</div>
              <div className="text-sm font-bold text-emerald-400">€{totalPagado.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400">Pendiente</div>
              <div className="text-sm font-bold text-amber-400">€{totalPendiente.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Progreso de pago</span>
            <span>{porcentajePagado.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${porcentajePagado}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* LISTA DE CUOTAS */}
      <div className="space-y-2">
        {cuotas.map((cuota, index) => {
          const MetodoIcon = METODOS.find(m => m.value === cuota.metodo)?.icon || CreditCard
          const metodoColor = METODOS.find(m => m.value === cuota.metodo)?.color || 'text-slate-400'
          
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-200 ${
                cuota.pagada 
                  ? 'bg-emerald-900/20 border-emerald-800/30' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/30'
              }`}
            >
              <div className="p-4">
                {/* HEADER DE LA CUOTA */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actualizarCuota(index, 'pagada', !cuota.pagada)}
                      className={`p-1.5 rounded-lg transition-all ${
                        cuota.pagada 
                          ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-800/40' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {cuota.pagada ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <span className={`text-sm font-medium ${
                        cuota.pagada ? 'text-emerald-300' : 'text-slate-300'
                      }`}>
                        Cuota {cuota.numero}
                      </span>
                      {cuota.pagada && (
                        <div className="text-xs text-emerald-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Pagada
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MONTO */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      cuota.pagada ? 'text-emerald-400' : 'text-slate-100'
                    }`}>
                      €{cuota.monto.toFixed(2)}
                    </div>
                    {!cuota.pagada && (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Próximo vencimiento
                      </div>
                    )}
                  </div>
                </div>

                {/* FORMULARIO DE EDICIÓN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {/* MONTO EDITABLE */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                      <Euro className="h-3 w-3" />
                      Monto de la cuota
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500">€</span>
                      </div>
                      <input
                        type="number"
                        value={cuota.monto}
                        onChange={(e) => actualizarCuota(index, 'monto', Number(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* MÉTODO DE PAGO */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                      <CreditCard className="h-3 w-3" />
                      Método de pago
                    </label>
                    <div className="relative">
                      <select
                        value={cuota.metodo || ''}
                        onChange={(e) => actualizarCuota(index, 'metodo', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                      >
                        <option value="" className="text-slate-500">Seleccionar método</option>
                        {METODOS.map((m) => {
                          const Icon = m.icon
                          return (
                            <option key={m.value} value={m.value} className="text-slate-800">
                              {m.label}
                            </option>
                          )
                        })}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {cuota.metodo ? (
                          <MetodoIcon className={`h-4 w-4 ${metodoColor}`} />
                        ) : (
                          <CreditCard className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CUENTA */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1.5">
                      <Wallet className="h-3 w-3" />
                      Cuenta de pago
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {CUENTAS.map((cuenta) => (
                        <button
                          key={cuenta}
                          type="button"
                          onClick={() => actualizarCuota(index, 'cuenta', cuenta)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            cuota.cuenta === cuenta
                              ? 'bg-blue-600 text-white border border-blue-500'
                              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          {cuenta}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => actualizarCuota(index, 'cuenta', '')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          !cuota.cuenta
                            ? 'bg-slate-700 text-white border border-slate-600'
                            : 'bg-slate-800/30 text-slate-400 hover:bg-slate-700 border border-slate-800'
                        }`}
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                </div>

                {/* RESUMEN DE LA CUOTA */}
                <div className="mt-4 pt-3 border-t border-slate-800/50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        cuota.pagada ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></div>
                      <span className="text-slate-400">Estado:</span>
                      <span className={`font-medium ${
                        cuota.pagada ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {cuota.pagada ? 'Pagada' : 'Pendiente'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {cuota.metodo && (
                        <div className="flex items-center gap-1.5">
                          <MetodoIcon className={`h-4 w-4 ${metodoColor}`} />
                          <span className="text-slate-400 text-xs">
                            {METODOS.find(m => m.value === cuota.metodo)?.label}
                          </span>
                        </div>
                      )}
                      {cuota.cuenta && (
                        <>
                          <div className="h-1 w-1 rounded-full bg-slate-600"></div>
                          <span className="text-slate-300 text-xs font-medium">{cuota.cuenta}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* RESUMEN FINAL */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-emerald-300">Cuotas pagadas</h4>
          </div>
          <div className="text-2xl font-bold text-white">
            {cuotas.filter(c => c.pagada).length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            de {cuotas.length} totales
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-amber-300">Cuotas pendientes</h4>
          </div>
          <div className="text-2xl font-bold text-white">
            {cuotas.filter(c => !c.pagada).length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            por €{totalPendiente.toFixed(2)}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-blue-300">Próxima cuota</h4>
          </div>
          {cuotas.filter(c => !c.pagada).length > 0 ? (
            <>
              <div className="text-lg font-bold text-white">
                Cuota {cuotas.filter(c => !c.pagada)[0]?.numero}
              </div>
              <div className="text-sm text-slate-300">
                €{cuotas.filter(c => !c.pagada)[0]?.monto.toFixed(2)}
              </div>
            </>
          ) : (
            <div className="text-sm text-emerald-400">
              ¡Todas las cuotas están pagadas! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  )
}