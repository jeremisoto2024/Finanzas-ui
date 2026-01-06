import { gastosMensuales } from '@/lib/gastos'
import FilaGasto from './FilaGasto'

export default function TablaGastos() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/80 text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Concepto</th>
            <th className="px-4 py-3 text-left">Método</th>
            <th className="px-4 py-3 text-left">Categoría</th>
            <th className="px-4 py-3 text-left">Cuenta</th>
            <th className="px-4 py-3 text-right">Monto</th>
          </tr>
        </thead>

        <tbody>
          {gastosMensuales.map((gasto) => (
            <FilaGasto key={gasto.id} gasto={gasto} />
          ))}
        </tbody>
      </table>
    </div>
  )
}