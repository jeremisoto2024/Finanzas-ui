import { useEffect, useState } from 'react'
import { getIngresos } from '@/lib/api'

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIngresos()
      .then(setIngresos)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-slate-400">Cargando ingresos...</p>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Ingresos</h1>

      <ul className="space-y-2">
        {ingresos.map((ingreso) => (
          <li
            key={ingreso.id}
            className="rounded-lg border border-slate-800 p-3"
          >
            <div className="flex justify-between">
              <span>{ingreso.nombre}</span>
              <span className="font-medium text-emerald-400">
                € {ingreso.cantidad.toFixed(2)}
              </span>
            </div>

            <div className="text-xs text-slate-400">
              {ingreso.fecha} · {ingreso.categoria} · {ingreso.metodo}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}