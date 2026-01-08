import {
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

export default function CuotasDetalle({ cuotas }) {
  return (
    <div className="mt-3 rounded-lg bg-slate-950 border border-slate-800 divide-y divide-slate-800">
      {cuotas.map((cuota, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-3 py-2 text-xs"
        >
          {/* INFO CUOTA */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {cuota.pagada ? (
                <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
              ) : (
                <ClockIcon className="h-4 w-4 text-slate-400" />
              )}

              <span className="text-slate-300">
                Cuota {cuota.numero}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              {/* MÉTODO DE PAGO */}
              {cuota.metodo === 'credito' && (
                <CreditCardIcon className="h-4 w-4" />
              )}
              {cuota.metodo === 'efectivo' && (
                <BanknotesIcon className="h-4 w-4" />
              )}

              <span>
                {cuota.metodo || 'Sin método'}
              </span>

              {cuota.cuenta && (
                <span className="opacity-70">
                  · {cuota.cuenta}
                </span>
              )}
            </div>
          </div>

          {/* MONTO */}
          <div className="text-right">
            <span
              className={`font-medium ${
                cuota.pagada
                  ? 'text-emerald-400'
                  : 'text-slate-200'
              }`}
            >
              € {cuota.monto.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}