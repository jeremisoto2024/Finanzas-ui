import { ingresosMensuales } from '@/lib/ingresos'
import FilaIngreso from './FilaIngreso'

export default function TablaIngresos() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-[800px] w-full text-sm">
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
          {ingresosMensuales.map((ingreso) => (
            <FilaIngreso key={ingreso.id} ingreso={ingreso} />
          ))}
        </tbody>
      </table>
    </div>
  )
}