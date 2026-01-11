import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Home, Smartphone, Film, Wifi, Car, ShoppingBag, DollarSign, Settings, CreditCard, Calendar, AlertCircle, RefreshCw, Plus, Wallet, Receipt, TrendingDown, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PagosFijos() {
  const [pagosFijos, setPagosFijos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mesActual, setMesActual] = useState('')

  // Establecer mes actual
  useEffect(() => {
    const hoy = new Date()
    const año = hoy.getFullYear()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    setMesActual(`${año}-${mes}`)
  }, [])

  // Cargar datos de la API (igual que TablaGastos.jsx)
  useEffect(() => {
    const fetchPagosFijos = async () => {
      try {
        setLoading(true)
        
        // Misma API que usa TablaGastos.jsx
        const response = await fetch('/api/pagos-fijos')
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Filtrar solo pagos activos (como hace TablaGastos.jsx)
        const pagosActivos = data.filter(pago => pago.activo !== false)
        setPagosFijos(pagosActivos)
        
      } catch (err) {
        console.error('Error cargando pagos fijos:', err)
        setError(err.message)
        
        // Fallback a localStorage si la API falla (consistente con TablaGastos.jsx)
        try {
          const datosGuardados = localStorage.getItem('pagosFijos')
          if (datosGuardados) {
            const parsedData = JSON.parse(datosGuardados)
            const pagosActivos = parsedData.filter(p => p.activo !== false)
            setPagosFijos(pagosActivos)
            setError(null) // Limpiar error si hay datos en localStorage
          }
        } catch (localErr) {
          console.error('Error con localStorage:', localErr)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPagosFijos()
  }, [])

  // Función para formatear fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return ''
    try {
      const fecha = new Date(fechaStr)
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return fechaStr
    }
  }

  // Calcular total - Asegurar formato correcto
  const total = pagosFijos.reduce((sum, pago) => {
    // Asegurar que el monto sea un número
    const monto = typeof pago.monto === 'number' ? pago.monto : parseFloat(pago.monto) || 0
    return sum + monto
  }, 0)

  // Mapeo de iconos (compatible con TablaGastos.jsx)
  const getIcon = (nombre, categoria) => {
    const iconMap = {
      // Vivienda
      'Vivienda': Home,
      'Alquiler': Home,
      'Hipoteca': Home,
      'hogar': Home,
      
      // Telecomunicaciones
      'Teléfono': Smartphone,
      'telecomunicaciones': Smartphone,
      'Apple': Smartphone,
      'móvil': Smartphone,
      'Educación': Smartphone,
      
      // Entretenimiento
      'Entretenimiento': Film,
      'streaming': Film,
      'Netflix': Film,
      'Spotify': Film,
      'Disney': Film,
      'HBO': Film,
      
      // Servicios
      'Servicios': Wifi,
      'Internet': Wifi,
      'luz': Wifi,
      'agua': Wifi,
      'gas': Wifi,
      'electricidad': Wifi,
      
      // Transporte
      'Transporte': Car,
      'transporte': Car,
      'Coche': Car,
      'Gasolina': Car,
      'seguro': Car,
      'parking': Car,
      
      // Compras/Alimentación
      'Alimentación': ShoppingBag,
      'Supermercado': ShoppingBag,
      'comida': ShoppingBag,
      'restaurante': ShoppingBag,
      'Compras': ShoppingBag,
      'ropa': ShoppingBag,
      'Tecnología': ShoppingBag,
      'Amazon': ShoppingBag,
      'Shein': ShoppingBag,
      'Gimnasio': ShoppingBag,
      'Salud': ShoppingBag,
      'Farmacia': ShoppingBag,
      
      // Finanzas
      'Finanzas': DollarSign,
      'finanzas': DollarSign,
      'Préstamo': DollarSign,
      'seguro médico': DollarSign,
      'inversiones': DollarSign,
      
      // Pagos/Tarjetas
      'Tarjeta': CreditCard,
      'crédito': CreditCard,
    }

    const key = (categoria || nombre || '').toLowerCase()
    
    // Buscar coincidencia exacta
    for (const [iconKey, icon] of Object.entries(iconMap)) {
      if (key.includes(iconKey.toLowerCase()) || iconKey.toLowerCase().includes(key)) {
        return icon
      }
    }
    
    return ShoppingBag
  }

  // Función para verificar si un pago ya fue hecho este mes
  const esPagoRealizadoEsteMes = (pago) => {
    if (!pago.fechaRealPago && !pago.fechaInicio) return false
    
    const fechaPago = pago.fechaRealPago || pago.fechaInicio
    if (!fechaPago) return false
    
    try {
      const fecha = new Date(fechaPago)
      const añoPago = fecha.getFullYear()
      const mesPago = fecha.getMonth() + 1
      
      const hoy = new Date()
      const añoActual = hoy.getFullYear()
      const mesActual = hoy.getMonth() + 1
      
      return añoPago === añoActual && mesPago === mesActual
    } catch {
      return false
    }
  }

  // Loading state
  if (loading) {
    return (
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <div className="p-1.5 bg-blue-900/30 rounded-lg animate-pulse">
              <div className="h-3 w-3 bg-blue-400/50 rounded"></div>
            </div>
            <div className="h-4 w-40 bg-slate-800 rounded animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-slate-800 rounded animate-pulse"></div>
                  <div className="w-16 h-2 bg-slate-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-3 bg-slate-800 rounded animate-pulse"></div>
                <div className="w-12 h-2 bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error && pagosFijos.length === 0) {
    return (
      <Card className="bg-slate-900/60 border border-red-800/50">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <span className="p-1.5 bg-red-900/30 rounded-lg">
              <AlertCircle className="h-3 w-3 text-red-400" />
            </span>
            Pagos fijos mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 text-red-500/70 mx-auto mb-3" />
            <p className="text-red-400 text-sm mb-2">Error al conectar con la API</p>
            <p className="text-slate-500 text-xs mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-300 px-3 py-1.5 rounded-lg border border-red-800/50 transition-colors flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="h-3 w-3" />
              Reintentar conexión
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No hay pagos fijos
  if (pagosFijos.length === 0) {
    return (
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-900/30 rounded-lg">
                <Wallet className="h-3 w-3 text-blue-400" />
              </span>
              Pagos fijos mensuales
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Configurar
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-3">
              <Receipt className="h-12 w-12 text-slate-600 mx-auto" />
            </div>
            <p className="text-slate-400 text-sm mb-2">No hay pagos fijos configurados</p>
            <p className="text-slate-500 text-xs mb-4">
              {error ? 'Usando datos locales' : 'Conectado a la API ✓'}
            </p>
            <button className="text-xs bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 text-blue-300 px-4 py-2 rounded-lg border border-blue-800/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 mx-auto">
              <Plus className="h-3 w-3" />
              Agregar primer pago
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Pagos activos encontrados
  return (
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader>
        {/* ELIMINADO EL BOTÓN "GESTIONAR" - solo título con badge de servicios */}
        <CardTitle className="text-sm text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-900/30 rounded-lg">
              <Wallet className="h-3 w-3 text-blue-400" />
            </span>
            Pagos fijos mensuales
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
              {pagosFijos.length} servicios
            </span>
          </div>
          {/* Eliminado el botón "Gestionar" y el indicador de modo local */}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {pagosFijos.slice(0, 6).map((pago) => {
          const Icon = getIcon(pago.nombre, pago.categoria)
          const porcentajeTotal = total > 0 ? Math.round((pago.monto / total) * 100) : 0
          const realizadoEsteMes = esPagoRealizadoEsteMes(pago)
          
          // Asegurar formato correcto del monto
          const montoFormateado = typeof pago.monto === 'number' 
            ? pago.monto.toFixed(2) 
            : parseFloat(pago.monto || 0).toFixed(2)
          
          return (
            <div
              key={pago.id || pago.nombre}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors border ${realizadoEsteMes ? 'bg-green-900/20 border-green-800/30' : 'hover:bg-slate-800/30 border-slate-800/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${realizadoEsteMes ? 'bg-green-900/30' : 'bg-slate-800'}`}>
                  <Icon className={`h-4 w-4 ${realizadoEsteMes ? 'text-green-400' : 'text-slate-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{pago.nombre}</span>
                    {realizadoEsteMes && (
                      <CheckCircle className="h-3 w-3 text-green-400" title="Pagado este mes" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 capitalize">
                      {pago.frecuencia || 'mensual'}
                    </span>
                    {pago.metodo && (
                      <>
                        <span className="text-xs text-slate-700">•</span>
                        <span className="text-xs text-slate-500">{pago.metodo}</span>
                      </>
                    )}
                    {pago.fechaInicio && (
                      <>
                        <span className="text-xs text-slate-700">•</span>
                        <span className="text-xs text-slate-500" title="Fecha inicio">
                          <Calendar className="h-2.5 w-2.5 inline mr-0.5" />
                          {formatearFecha(pago.fechaInicio)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {/* MONTO CORREGIDO: asegurar formato €425.00 */}
                <span className="text-sm font-semibold text-slate-300">
                  €{montoFormateado}
                </span>
                <div className="text-xs text-slate-500">
                  {porcentajeTotal}% del total
                  {pago.categoria && (
                    <div className="text-xs text-blue-500 bg-blue-900/30 px-1.5 py-0.5 rounded mt-1">
                      {pago.categoria}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {pagosFijos.length > 6 && (
          <div className="text-center py-2">
            <span className="text-xs text-slate-500">
              +{pagosFijos.length - 6} pagos más
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-300">Total fijos</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                {pagosFijos.length} servicios
              </span>
            </div>
            <div className="text-right">
              {/* TOTAL CORREGIDO: asegurar formato €425.00 */}
              <span className={`text-lg font-bold ${total > 500 ? 'text-red-400' : total > 200 ? 'text-yellow-400' : 'text-green-400'}`}>
                €{total.toFixed(2)}
              </span>
              <div className="text-xs text-slate-500">
                {total > 500 ? 'Alto impacto' : total > 200 ? 'Impacto moderado' : 'Bajo impacto'}
              </div>
            </div>
          </div>
          
          {/* Información de estado */}
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mesActual && (
                <span>
                  Mes actual: <span className="text-slate-400">{mesActual}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {pagosFijos.filter(esPagoRealizadoEsteMes).length > 0 && (
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {pagosFijos.filter(esPagoRealizadoEsteMes).length} pagados este mes
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}