import { useEffect, useState } from 'react'
import TablaIngresos from '@/components/ingresos/TablaIngresos'
import { 
  RefreshCw, 
  AlertCircle,
  Database,
  TrendingUp
} from 'lucide-react'

export default function Ingresos() {
  const [ingresos, setIngresos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchIngresos = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ingresos')
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      setIngresos(data)
    } catch (err) {
      console.error('Error cargando ingresos:', err)
      setError(err.message || 'Error al cargar los ingresos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIngresos()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center">
        <div className="animate-spin mb-4">
          <RefreshCw className="h-12 w-12 text-emerald-400" />
        </div>
        <p className="text-slate-400 text-lg">Cargando ingresos desde Notion...</p>
        <p className="text-slate-500 text-sm mt-2">Conectando a tu base de datos</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <h2 className="text-xl font-bold text-white">Error al cargar ingresos</h2>
            </div>
            <p className="text-slate-300 mb-4">{error}</p>
            <div className="space-y-3">
              <p className="text-slate-400 text-sm">Posibles causas:</p>
              <ul className="text-slate-400 text-sm list-disc list-inside space-y-1 ml-4">
                <li>No tienes conexión a internet</li>
                <li>La API de Notion no está disponible</li>
                <li>Las variables de entorno están mal configuradas</li>
                <li>No tienes permisos para acceder a la base de datos</li>
              </ul>
            </div>
            <button
              onClick={fetchIngresos}
              className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (ingresos.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-900/30 rounded-full mb-4">
              <Database className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Base de datos vacía</h2>
            <p className="text-slate-400 mb-4">
              No hay registros de ingresos en tu base de datos de Notion
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchIngresos}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refrescar
              </button>
              <a
                href="https://notion.so"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Ir a Notion
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <TablaIngresos ingresos={ingresos} />
}