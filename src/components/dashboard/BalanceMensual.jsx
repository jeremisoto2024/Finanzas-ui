// components/BalanceMensual.jsx
import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, DollarSign } from 'lucide-react'

function BalanceMensual() {
  const [ingresos, setIngresos] = useState([])
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mes, setMes] = useState(new Date().getMonth())
  const [ano, setAno] = useState(new Date().getFullYear())

  // Obtener ingresos desde la API
  const fetchIngresos = async () => {
    try {
      const res = await fetch('/api/ingresos')
      if (!res.ok) throw new Error('Error cargando ingresos')
      const data = await res.json()
      setIngresos(data)
    } catch (err) {
      console.error('Error fetching ingresos:', err)
      setError(err.message)
    }
  }

  // Obtener gastos desde la API
  const fetchGastos = async () => {
    try {
      const res = await fetch('/api/gastos')
      if (!res.ok) throw new Error('Error cargando gastos')
      const data = await res.json()
      setGastos(data)
    } catch (err) {
      console.error('Error fetching gastos:', err)
      setError(err.message)
    }
  }

  // Cargar todos los datos
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchIngresos(), fetchGastos()])
    } catch (err) {
      setError('Error cargando datos financieros')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [mes, ano])

  // Calcular totales
  const calcularTotales = () => {
    const ingresosDelMes = ingresos.filter(item => {
      if (!item.fecha) return false
      const fecha = new Date(item.fecha)
      return fecha.getMonth() === mes && fecha.getFullYear() === ano
    })

    const gastosDelMes = gastos.filter(item => {
      if (!item.fecha) return false
      const fecha = new Date(item.fecha)
      return fecha.getMonth() === mes && fecha.getFullYear() === ano
    })

    const totalIngresos = ingresosDelMes.reduce((sum, item) => sum + (item.monto || 0), 0)
    const totalGastos = gastosDelMes.reduce((sum, item) => sum + (item.monto || 0), 0)
    const balance = totalIngresos - totalGastos

    return {
      totalIngresos,
      totalGastos,
      balance,
      ingresosDelMes,
      gastosDelMes
    }
  }

  const { totalIngresos, totalGastos, balance, ingresosDelMes, gastosDelMes } = calcularTotales()

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-center gap-3">
          <RefreshCw className="h-5 w-5 text-slate-400 animate-spin" />
          <span className="text-slate-400">Cargando balance...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-300">Error: {error}</span>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Balance Mensual</h2>
          <p className="text-slate-400 text-sm">
            {new Date(ano, mes).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i).toLocaleDateString('es-ES', { month: 'long' })}
              </option>
            ))}
          </select>
          
          <select
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1 text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingresos */}
        <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-emerald-300 text-sm font-medium">Ingresos</p>
              <p className="text-2xl font-bold text-white mt-1">
                €{totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <p className="text-emerald-400 text-sm">
            {ingresosDelMes.length} transacciones
          </p>
        </div>

        {/* Gastos */}
        <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-red-300 text-sm font-medium">Gastos</p>
              <p className="text-2xl font-bold text-white mt-1">
                €{totalGastos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2 bg-red-900/30 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <p className="text-red-400 text-sm">
            {gastosDelMes.length} transacciones
          </p>
        </div>

        {/* Balance */}
        <div className={`${
          balance >= 0 
            ? 'bg-emerald-900/20 border-emerald-800/30' 
            : 'bg-red-900/20 border-red-800/30'
        } border rounded-lg p-5`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-300 text-sm font-medium">Balance</p>
              <p className={`text-2xl font-bold mt-1 ${
                balance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                €{balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              balance >= 0 ? 'bg-emerald-900/30' : 'bg-red-900/30'
            }`}>
              <DollarSign className={`h-5 w-5 ${
                balance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`} />
            </div>
          </div>
          <p className={`text-sm ${
            balance >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {balance >= 0 ? 'Positivo' : 'Negativo'} este mes
          </p>
        </div>
      </div>

      {/* Botón de refresco */}
      <div className="mt-6 flex justify-between items-center pt-5 border-t border-slate-800">
        <div className="text-slate-400 text-sm">
          Última actualización: {new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>
    </div>
  )
}

export default BalanceMensual