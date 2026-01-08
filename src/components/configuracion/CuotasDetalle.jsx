import { useState } from 'react'
import {
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const METODOS = ['credito', 'debito', 'efectivo']
const CUENTAS = ['BBVA', 'Santander', 'Efectivo']

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

  return (
    <div className="mt-3 rounded-lg bg-slate-950 border border-slate-800 divide-y divide-slate-800">
      {cuotas.map((cuota, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 px-3 py-3 text-xs items-center"
        >
          {/* ESTADO */}
          <button
            onClick={() =>
              actualizarCuota(index, 'pagada', !cuota.pagada)
            }
            className="flex items-center gap-2 text-left"
          >
            {cuota.pagada ? (
              <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
            ) : (
              <ClockIcon className="h-4 w-4 text-slate-400" />
            )}
            <span className="text-slate-300">
              Cuota {cuota.numero}
            </span>
          </button>

          {/* MONTO EDITABLE */}
          <input
            type="number"
            value={cuota.monto}
            onChange={(e) =>
              actualizarCuota(index, 'monto', Number(e.target.value))
            }
            className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-slate-200"
          />

          {/* MÉTODO */}
          <select
            value={cuota.metodo || ''}
            onChange={(e) =>
              actualizarCuota(index, 'metodo', e.target.value)
            }
            className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-slate-200"
          >
            <option value="">Método</option>
            {METODOS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* CUENTA */}
          <select
            value={cuota.cuenta || ''}
            onChange={(e) =>
              actualizarCuota(index, 'cuenta', e.target.value)
            }
            className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-slate-200"
          >
            <option value="">Cuenta</option>
            {CUENTAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* TOTAL */}
          <div
            className={`text-right font-medium ${
              cuota.pagada
                ? 'text-emerald-400'
                : 'text-slate-200'
            }`}
          >
            € {cuota.monto.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}