import {
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function CuotasDetalle({ cuotas }) {
  return (
    <div className="mt-3 space-y-2">
      {cuotas.map((cuota, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-xs"
        >
          <div className="flex items-center gap-2 text-slate-300">
            {cuota.pagada ? (
              <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
            ) : (
              <ClockIcon className="h-4 w-4 text-slate-400" />
            )}

            <span>
              Cuota {index + 1} · {cuota.fecha}
            </span>
          </div>

          <span
            className={
              cuota.pagada
                ? 'text-emerald-400 font-medium'
                : 'text-slate-400'
            }
          >
            € {cuota.monto.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}
