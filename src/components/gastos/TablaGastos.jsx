import { gastosMensuales } from '@/lib/gastos'
import FilaGasto from './FilaGasto'

export default function TablaGastos() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <div className="text-xs text-slate-500 px-4 py-2 md:hidden">
    Desliza → para ver más
  </div>
      <table className="min-w-[700px] w-full text-sm">
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