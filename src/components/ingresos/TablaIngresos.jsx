import { useState, useMemo, useEffect } from 'react'
import FilaIngreso from './FilaIngreso'

// ICONOS
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
  // =========================
  // ESTADOS
  // =========================
  const [ingresos, setIngresos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filtroMes, setFiltroMes] = useState('')
  const [filtroMetodo, setFiltroMetodo] = useState('')
  const [filtroCuenta, setFiltroCuenta] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

  // =========================
  // FETCH DESDE NOTION
  // =========================
  useEffect(() => {
    const cargarIngresos = async () => {
      try {
        const res = await fetch('/api/ingresos')
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Error')

        setIngresos(data)
      } catch (err) {
        setError('Error cargando ingresos')
      } finally {
        setLoading(false)
      }
    }

    cargarIngresos()
  }, [])

  // =========================
  // LISTAS
  // =========================
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

  const cuentasIngresos = ['BBVA', 'Revolut', 'Efectivo', 'PayPal', 'Bizum']

  // =========================
  // FILTROS
  // =========================
  const ingresosFiltrados = useMemo(() => {
    return ingresos.filter((ingreso) => {
      const fecha = new Date(ingreso.fecha)
      const mesIngreso = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, '0')}`

      return (
        (!filtroMes || mesIngreso === filtroMes) &&
        (!filtroMetodo || ingreso.metodo === filtroMetodo) &&
        (!filtroCuenta || ingreso.cuenta === filtroCuenta) &&
        (!filtroCategoria || ingreso.categoria === filtroCategoria)
      )
    })
  }, [ingresos, filtroMes, filtroMetodo, filtroCuenta, filtroCategoria])

  const total = ingresosFiltrados.reduce((sum, i) => sum + i.monto, 0)

  // =========================
  // MÉTRICAS
  // =========================
  const categoriaPrincipal =
    Object.entries(
      ingresosFiltrados.reduce((acc, i) => {
        acc[i.categoria] = (acc[i.categoria] || 0) + i.monto
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const cuentaMasUsada =
    Object.entries(
      ingresosFiltrados.reduce((acc, i) => {
        acc[i.cuenta] = (acc[i.cuenta] || 0) + 1
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  const metodoMasComun =
    Object.entries(
      ingresosFiltrados.reduce((acc, i) => {
        acc[i.metodo] = (acc[i.metodo] || 0) + 1
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

  // =========================
  // CSV
  // =========================
  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto']
    const filas = ingresosFiltrados.map((i) =>
      [i.fecha, i.concepto, i.metodo, i.categoria, i.cuenta, i.monto].join(',')
    )

    const csv = [headers.join(','), ...filas].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `ingresos_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()

    URL.revokeObjectURL(url)
  }

  // =========================
  // LOADING / ERROR
  // =========================
  if (loading) {
    return <div className="p-6 text-slate-300">Cargando ingresos…</div>
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>
  }

  // =========================
  // UI (TU DISEÑO)
  // =========================
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ingresos</h1>
        <div className="text-3xl font-bold text-emerald-400">
          €{total.toFixed(2)}
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-slate-400 text-sm">
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Concepto</th>
              <th className="px-4 py-2 text-left">Método</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Cuenta</th>
              <th className="px-4 py-2 text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {ingresosFiltrados.map((ingreso) => (
              <FilaIngreso key={ingreso.id} ingreso={ingreso} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}