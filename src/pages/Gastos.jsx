import { useEffect, useState } from 'react'
import { getGastos } from '@/lib/api'
import TablaGastos from '@/components/gastos/TablaGastos'

export default function Gastos() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGastos()
      .then(setGastos)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-slate-400">Cargando gastos...</p>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Gastos</h1>
      <TablaGastos gastos={gastos} />
    </div>
  )
}