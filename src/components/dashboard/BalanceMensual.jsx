// components/BalanceMensual.jsx
import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCw } from 'lucide-react'

// Datos predeterminados de INGRESOS (los mismos que muestras en tu app)
const ingresosPredeterminados = [
  { id: 1, concepto: 'Salario mensual', monto: 2500, fecha: '2025-10-01', categoria: 'Salario', metodo: 'Transferencia', cuenta: 'BBVA' },
  { id: 2, concepto: 'Trabajo freelance', monto: 450, fecha: '2025-10-05', categoria: 'Freelance', metodo: 'PayPal', cuenta: 'PayPal' },
  { id: 3, concepto: 'Venta de artículos', monto: 120, fecha: '2025-10-10', categoria: 'Ventas', metodo: 'Bizum', cuenta: 'Revolut' },
  { id: 4, concepto: 'Consultoría', monto: 800, fecha: '2025-10-15', categoria: 'Freelance', metodo: 'Transferencia', cuenta: 'BBVA' },
  { id: 5, concepto: 'Propinas', monto: 85, fecha: '2025-10-20', categoria: 'Extra', metodo: 'Efectivo', cuenta: 'Efectivo' },
]

// Datos predeterminados de GASTOS (debes tener estos en tu app)
const gastosPredeterminados = [
  { id: 1, concepto: 'Alquiler', monto: 850, fecha: '2025-10-01', categoria: 'Vivienda', metodo: 'Transferencia', cuenta: 'BBVA' },
  { id: 2, concepto: 'Supermercado', monto: 320, fecha: '2025-10-03', categoria: 'Alimentación', metodo: 'Tarjeta', cuenta: 'Santander' },
  { id: 3, concepto: 'Gasolina', monto: 80, fecha: '2025-10-05', categoria: 'Transporte', metodo: 'Tarjeta', cuenta: 'Santander' },
  { id: 4, concepto: 'Internet', monto: 45, fecha: '2025-10-10', categoria: 'Servicios', metodo: 'Domiciliación', cuenta: 'BBVA' },
  { id: 5, concepto: 'Ocio', monto: 120, fecha: '2025-10-15', categoria: 'Entretenimiento', metodo: 'Bizum', cuenta: 'Revolut' },
  { id: 6, concepto: 'Gimnasio', monto: 35, fecha: '2025-10-20', categoria: 'Salud', metodo: 'Domiciliación', cuenta: 'BBVA' },
]

function BalanceMensual() {
  const [mes, setMes] = useState(new Date().getMonth())
  const [ano, setAno] = useState(new Date().getFullYear())
  const [ingresos, setIngresos] = useState(ingresosPredeterminados)
  const [gastos, setGastos] = useState(gastosPredeterminados)
  const [loading, setLoading] = useState(false)

  // Filtrar datos por mes y año seleccionados
  const filtrarPorMes = (datos) => {
    return datos.filter(item => {
      if (!item.fecha) return false
      const fecha = new Date(item.fecha)
      return fecha.getMonth() === mes && fecha.getFullYear() === ano
    })
  }

  const ingresosDelMes = filtrarPorMes(ingresos)
  const gastosDelMes = filtrarPorMes(gastos)

  // Calcular totales
  const totalIngresos = ingresosDelMes.reduce((sum, item) => sum + (item.monto || 0), 0)
  const totalGastos = gastosDelMes.reduce((sum, item) => sum + (item.monto || 0), 0)
  const balance = totalIngresos - totalGastos

  // Porcentaje de ahorro
  const porcentajeAhorro = totalIngresos > 0 
    ? ((balance / totalIngresos) * 100).toFixed(1)
    : 0

  // Función para simular actualización de datos
  const actualizarDatos = () => {
    setLoading(true)
    // Simular carga de datos
    setTimeout(() => {
      // Aquí en el futuro podrías cargar datos desde Notion
      // Por ahora solo recargamos los predeterminados
      setLoading(false)
    }, 500)
  }

  // Obtener nombre del mes en español
  const obtenerNombreMes = () => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return meses[mes]
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
      {/* Encabezado con selección de mes/año */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Balance Mensual
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Resumen de tus finanzas del mes
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={mes}
            onChange={(e) => setMes(parseInt(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          
          <button
            onClick={actualizarDatos}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Ingresos */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border border-emerald-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-emerald-300 text-sm font-medium">Ingresos</p>
              <p className="text-2xl font-bold text-white mt-2">
                €{totalIngresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="text-sm">
            <span className="text-emerald-400">{ingresosDelMes.length} transacciones</span>
            <span className="text-slate-500 mx-2">•</span>
            <span className="text-slate-400">{obtenerNombreMes()} {ano}</span>
          </div>
        </div>

        {/* Gastos */}
        <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-800/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-red-300 text-sm font-medium">Gastos</p>
              <p className="text-2xl font-bold text-white mt-2">
                €{totalGastos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-2 bg-red-900/30 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
          </div>
          <div className="text-sm">
            <span className="text-red-400">{gastosDelMes.length} transacciones</span>
            <span className="text-slate-500 mx-2">•</span>
            <span className="text-slate-400">{obtenerNombreMes()} {ano}</span>
          </div>
        </div>

        {/* Balance */}
        <div className={`${
          balance >= 0 
            ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border-emerald-800/30' 
            : 'bg-gradient-to-br from-red-900/30 to-red-950/30 border-red-800/30'
        } border rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-300 text-sm font-medium">Balance</p>
              <p className={`text-2xl font-bold mt-2 ${
                balance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                €{balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              balance >= 0 ? 'bg-emerald-900/30' : 'bg-red-900/30'
            }`}>
              <DollarSign className={`h-6 w-6 ${
                balance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`} />
            </div>
          </div>
          <div className="text-sm">
            <span className={balance >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {balance >= 0 ? '💰 Ahorro: ' : '⚠️ Déficit: '}
              {Math.abs(balance).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </span>
            <span className="text-slate-500 mx-2">•</span>
            <span className="text-slate-400">
              {porcentajeAhorro}% {balance >= 0 ? 'de ahorro' : 'de gasto extra'}
            </span>
          </div>
        </div>
      </div>

      {/* Resumen detallado */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Resumen de {obtenerNombreMes()}</h3>
        
        <div className="space-y-3">
          {/* Barra de progreso de gastos vs ingresos */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Gastos vs Ingresos</span>
              <span>{((totalGastos / (totalIngresos || 1)) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  (totalGastos / (totalIngresos || 1)) > 0.8 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min((totalGastos / (totalIngresos || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Detalles por categoría */}
          <div className="grid grid-cols-2 gap-4 pt-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Mayor ingreso:</p>
              {ingresosDelMes.length > 0 ? (
                <p className="text-sm font-medium text-white">
                  {ingresosDelMes.reduce((max, item) => item.monto > max.monto ? item : max, ingresosDelMes[0])?.concepto}
                </p>
              ) : (
                <p className="text-sm text-slate-500">Sin datos</p>
              )}
            </div>
            
            <div>
              <p className="text-xs text-slate-400 mb-1">Mayor gasto:</p>
              {gastosDelMes.length > 0 ? (
                <p className="text-sm font-medium text-white">
                  {gastosDelMes.reduce((max, item) => item.monto > max.monto ? item : max, gastosDelMes[0])?.concepto}
                </p>
              ) : (
                <p className="text-sm text-slate-500">Sin datos</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nota al pie */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center">
          <div className="text-slate-400 text-sm">
            💡 Estos datos son <span className="text-emerald-400">locales y de ejemplo</span>. 
            {balance < 0 && ' ¡Cuidado con el déficit!'}
          </div>
          <div className="text-xs text-slate-500">
            Actualizado: {new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceMensual