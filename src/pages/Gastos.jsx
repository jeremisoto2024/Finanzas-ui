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

  return 
      <TablaGastos gastos={gastos} />
}