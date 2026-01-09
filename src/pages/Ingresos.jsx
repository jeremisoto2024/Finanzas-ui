import { useEffect, useState } from 'react'
import TablaIngresos from '@/components/ingresos/TablaIngresos'
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

  return <TablaIngresos ingresos={ingresos} />
}