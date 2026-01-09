import { useState, useMemo, useEffect } from 'react'
import FilaIngreso from './FilaIngreso'

// ICONOS LUCIDE REACT para ingresos (paleta verde)
import { 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  Database,
  Tag,
  CreditCard,
  Bell,
  ChevronDown,
  FileText,
  Wallet,
  AlertCircle
} from 'lucide-react'

export default function TablaIngresos() {
  // ===============================
  // ESTADOS NUEVOS (NOTION)
  // ===============================
  const [ingresosMensuales, setIngresosMensuales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ===============================
  // FILTROS (YA EXISTÍAN)
  // ===============================
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroMetodo, setFiltroMetodo] = useState('')
  const [filtroCuenta, setFiltroCuenta] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

  // ===============================
  // FETCH A NOTION (NUEVO)
  // ===============================
  useEffect(() => {
    const cargarIngresos = async () => {
      try {
        const res = await fetch('/api/ingresos')
        if (!res.ok) throw new Error('Error cargando ingresos')
        const data = await res.json()
        setIngresosMensuales(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    cargarIngresos()
  }, [])

  // ===============================
  // OPCIONES (NO TOCADAS)
  // ===============================
  const categoriasIngresos = [
    'Sueldo',
    'Propina',
    'Ventas',
    'Transferencia',
    'Préstamo',
    'Extras',
    'Trabajo',
    'Extra',
    'Salario',
    'Freelance'
  ]

  const metodosRecepcion = [
    'Efectivo',
    'Transferencia',
    'Bizum',
    'PayPal',
    'Tarjeta',
    'Apple Pay'
  ]

  const cuentasIngresos = [
    'BBVA',
    'Revolut',
    'Efectivo',
    'PayPal',
    'Bizum'
  ]

  // ===============================
  // FILTRADO
  // ===============================
  const ingresosFiltrados = useMemo(() => {
    return ingresosMensuales.filter(ingreso => {
      const fechaIngreso = new Date(ingreso.fecha)
      const mesIngreso = `${fechaIngreso.getFullYear()}-${String(
        fechaIngreso.getMonth() + 1
      ).padStart(2, '0')}`

      const cumpleMes = !filtroMes || mesIngreso === filtroMes
      const cumpleMetodo = !filtroMetodo || ingreso.metodo === filtroMetodo
      const cumpleCuenta = !filtroCuenta || ingreso.cuenta === filtroCuenta
      const cumpleCategoria =
        !filtroCategoria || ingreso.categoria === filtroCategoria

      return (
        cumpleMes &&
        cumpleMetodo &&
        cumpleCuenta &&
        cumpleCategoria
      )
    })
  }, [ingresosMensuales, filtroMes, filtroMetodo, filtroCuenta, filtroCategoria])

  // ===============================
  // TOTALES Y MÉTRICAS
  // ===============================
  const total = ingresosFiltrados.reduce(
    (sum, ingreso) => sum + ingreso.monto,
    0
  )

  const categoriaPrincipal = useMemo(() => {
    const map = {}
    ingresosFiltrados.forEach(i => {
      map[i.categoria] = (map[i.categoria] || 0) + i.monto
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  }, [ingresosFiltrados])

  const cuentaMasUsada = useMemo(() => {
    const map = {}
    ingresosFiltrados.forEach(i => {
      map[i.cuenta] = (map[i.cuenta] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  }, [ingresosFiltrados])

  const metodoMasComun = useMemo(() => {
    const map = {}
    ingresosFiltrados.forEach(i => {
      map[i.metodo] = (map[i.metodo] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  }, [ingresosFiltrados])

  // ===============================
  // EXPORTAR CSV
  // ===============================
  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto']
    const filas = ingresosFiltrados.map(i =>
      [i.fecha, i.concepto, i.metodo, i.categoria, i.cuenta, i.monto].join(',')
    )
    const csv = [headers.join(','), ...filas].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ingresos_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  // ===============================
  // JSX (DISEÑO INTACTO)
  // ===============================
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ingresos del Mes</h1>
        <span className="text-3xl font-bold text-emerald-400">
          €{total.toFixed(2)}
        </span>
      </div>

      {loading && (
        <div className="p-6 text-slate-400">
          Cargando ingresos desde Notion…
        </div>
      )}

      {error && (
        <div className="p-6 text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-400">Fecha</th>
                <th className="px-6 py-3 text-left text-xs text-slate-400">Concepto</th>
                <th className="px-6 py-3 text-left text-xs text-slate-400">Método</th>
                <th className="px-6 py-3 text-left text-xs text-slate-400">Categoría</th>
                <th className="px-6 py-3 text-left text-xs text-slate-400">Cuenta</th>
                <th className="px-6 py-3 text-right text-xs text-slate-400">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ingresosFiltrados.map(ingreso => (
                <FilaIngreso key={ingreso.id} ingreso={ingreso} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}