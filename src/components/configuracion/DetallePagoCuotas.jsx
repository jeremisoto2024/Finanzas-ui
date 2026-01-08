import { 
  Calendar, 
  CreditCard, 
  Wallet, 
  TrendingDown,
  CheckCircle,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

export default function DetallePagoCuotas({ pago }) {
  if (!pago || pago.tipo !== 'cuotas') return null

  const cuotasRestantes = pago.cuotas - pago.cuotasPagadas
  const totalPagado = pago.cuotasPagadas * pago.montoCuota
  const totalPendiente = cuotasRestantes * pago.montoCuota

  // Calcular fechas estimadas
  const calcularFechasCuotas = () => {
    const fechas = []
    const fechaInicio = new Date(pago.fechaInicio)
    
    for (let i = 0; i < pago.cuotas; i++) {
      const fechaCuota = new Date(fechaInicio)
      if (pago.frecuencia === 'mensual') {
        fechaCuota.setMonth(fechaCuota.getMonth() + i)
      } else if (pago.frecuencia === 'anual') {
        fechaCuota.setFullYear(fechaCuota.getFullYear() + i)
      }
      
      fechas.push({
        numero: i + 1,
        fecha: fechaCuota.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        pagada: i < pago.cuotasPagadas,
        monto: pago.montoCuota
      })
    }
    
    return fechas
  }

  const cuotasDetalle = calcularFechasCuotas()

  return (
    <div className="space-y-6">
      {/* RESUMEN */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-purple-400" />
          Resumen del plan de cuotas
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Total del producto</div>
            <div className="text-lg font-bold text-white">€{pago.montoTotal.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Cuotas</div>
            <div className="text-lg font-bold text-white">
              {pago.cuotasPagadas}/{pago.cuotas}
            </div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Por cuota</div>
            <div className="text-lg font-bold text-purple-400">€{pago.montoCuota.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Restante</div>
            <div className="text-lg font-bold text-amber-400">€{totalPendiente.toFixed(2)}</div>
          </div>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Progreso del pago</span>
            <span>{((pago.cuotasPagadas / pago.cuotas) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(pago.cuotasPagadas / pago.cuotas) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* DETALLE DE INFORMACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Información del plan</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Frecuencia de pago</span>
              <span className="text-sm font-medium text-white capitalize">{pago.frecuencia}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Fecha de inicio</span>
              <span className="text-sm font-medium text-white">{pago.fechaInicio}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Fecha final estimada</span>
              <span className="text-sm font-medium text-white">
                {calcularFechasCuotas()[pago.cuotas - 1]?.fecha}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Método de pago</span>
              <span className="text-sm font-medium text-white">{pago.metodoPago}</span>
            </div>
            {pago.cuenta && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Cuenta</span>
                <span className="text-sm font-medium text-white">{pago.cuenta}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-white mb-4">Resumen financiero</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Total pagado</span>
              </div>
              <div className="text-sm font-bold text-emerald-400">€{totalPagado.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300">Pendiente</span>
              </div>
              <div className="text-sm font-bold text-amber-400">€{totalPendiente.toFixed(2)}</div>
            </div>
            <div className="text-xs text-slate-500">
              {cuotasRestantes > 0 
                ? `Quedan ${cuotasRestantes} cuotas por pagar (${pago.frecuencia})`
                : '¡Plan completado! 🎉'}
            </div>
          </div>
        </div>
      </div>

      {/* CALENDARIO DE CUOTAS */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-white mb-4">Calendario de cuotas</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {cuotasDetalle.map((cuota) => (
            <div
              key={cuota.numero}
              className={`flex items-center justify-between p-3 rounded-lg transition ${
                cuota.pagada
                  ? 'bg-emerald-900/20 border border-emerald-800/30'
                  : 'bg-slate-800/30 border border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  cuota.pagada ? 'bg-emerald-900/30' : 'bg-slate-800'
                }`}>
                  {cuota.pagada ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    Cuota {cuota.numero}
                  </div>
                  <div className="text-xs text-slate-400">{cuota.fecha}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-semibold ${
                  cuota.pagada ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  €{cuota.monto.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">
                  {cuota.pagada ? 'Pagada' : 'Pendiente'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMENDACIONES */}
      {cuotasRestantes > 0 && (
        <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <h4 className="text-sm font-semibold text-blue-300">Recomendación</h4>
          </div>
          <p className="text-sm text-slate-300">
            Considera pagar {cuotasRestantes > 1 ? 'algunas cuotas' : 'la última cuota'} por adelantado 
            para reducir el interés total pagado.
          </p>
        </div>
      )}
    </div>
  )
}