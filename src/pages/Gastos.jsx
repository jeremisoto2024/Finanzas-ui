import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

// 👉 Datos mock (luego Notion)
const gastos = [
  {
    id: 1,
    nombre: 'Refresco',
    monto: 2.2,
    fecha: '2026-01-05',
    metodo: 'Apple Pay',
    categoria: 'Alimentación',
    cuenta: 'BBVA',
  },
  {
    id: 2,
    nombre: 'Mami',
    monto: 20,
    fecha: '2026-01-03',
    metodo: 'Bizum',
    categoria: 'Otros',
    cuenta: 'BBVA',
  },
  {
    id: 3,
    nombre: 'AliExpress',
    monto: 16.65,
    fecha: '2026-01-03',
    metodo: 'Tarjeta',
    categoria: 'Otros',
    cuenta: 'BBVA',
  },
]

export default function Gastos() {
  const totalMes = gastos.reduce((acc, g) => acc + g.monto, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Gastos</h1>

        {/* Mes (placeholder por ahora) */}
        <select className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-sm">
          <option>Enero 2026</option>
        </select>
      </div>

      {/* Total */}
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardContent className="p-4">
          <p className="text-sm text-slate-400">Total del mes</p>
          <p className="text-2xl font-bold text-rose-400">
            € {totalMes.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <MagnifyingGlassIcon className="h-4 w-4" />
            Movimientos
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-right">Cantidad</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Método</th>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Cuenta</th>
              </tr>
            </thead>

            <tbody>
              {gastos.map((gasto) => (
                <tr
                  key={gasto.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40"
                >
                  <td className="px-4 py-2">{gasto.nombre}</td>
                  <td className="px-4 py-2 text-right text-rose-400">
                    € {gasto.monto.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{gasto.fecha}</td>
                  <td className="px-4 py-2">{gasto.metodo}</td>
                  <td className="px-4 py-2">{gasto.categoria}</td>
                  <td className="px-4 py-2">{gasto.cuenta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Exportar (visual) */}
      <button className="text-sm text-slate-400 hover:text-slate-200">
        Exportar movimientos
      </button>
    </div>
  )
}
