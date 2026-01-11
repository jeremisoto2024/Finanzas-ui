import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Home, Smartphone, Film, Wifi, Car, ShoppingBag, Wallet, CheckCircle, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PagosFijos() {
  const [pagosFijos, setPagosFijos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPagosFijos = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/pagos-fijos')
        
        if (response.ok) {
          const data = await response.json()
          const pagosActivos = data.filter(pago => pago.activo !== false)
          setPagosFijos(pagosActivos)
        } else {
          // Fallback a localStorage
          const datosGuardados = localStorage.getItem('pagosFijos')
          if (datosGuardados) {
            const parsedData = JSON.parse(datosGuardados)
            const pagosActivos = parsedData.filter(p => p.activo !== false)
            setPagosFijos(pagosActivos)
          }
        }
      } catch (err) {
        console.error('Error cargando pagos fijos:', err)
        const datosGuardados = localStorage.getItem('pagosFijos')
        if (datosGuardados) {
          try {
            const parsedData = JSON.parse(datosGuardados)
            const pagosActivos = parsedData.filter(p => p.activo !== false)
            setPagosFijos(pagosActivos)
          } catch (parseErr) {
            console.error('Error parsing localStorage:', parseErr)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPagosFijos()
  }, [])

  // Calcular total
  const total = pagosFijos.reduce((sum, pago) => {
    const monto = typeof pago.monto === 'number' ? pago.monto : parseFloat(pago.monto) || 0
    return sum + monto
  }, 0)

  // Mapeo de iconos
  const getIcon = (nombre) => {
    const iconMap = {
      'Alquiler': Home,
      'Teléfono': Smartphone,
      'Netflix': Film,
      'Internet': Wifi,
      'Transporte': Car,
      'Supermercado': ShoppingBag,
      'Gimnasio': ShoppingBag,
      'Spotify': Film,
      'Amazon': ShoppingBag,
      'Apple': Smartphone,
      'Servicios': Wifi,
      'Salud': ShoppingBag,
      'Entretenimiento': Film,
      'Educación': Smartphone
    }
    return iconMap[nombre] || ShoppingBag
  }

  // Formatear fecha como en la imagen (05/01/2026)
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

  if (loading) {
    return (
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-400" />
            Pagos fijos mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-slate-800 rounded"></div>
                  <div className="w-32 h-2 bg-slate-800 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-16 h-3 bg-slate-800 rounded"></div>
                <div className="w-12 h-2 bg-slate-800 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (pagosFijos.length === 0) {
    return (
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-400" />
            Pagos fijos mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm mb-2">No hay pagos fijos configurados</p>
            <p className="text-slate-500 text-xs">Ve a Configuración para agregar pagos fijos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const pagosActivos = pagosFijos.filter(p => p.activo !== false)

  return (
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-400" />
            Pagos fijos mensuales
          </div>
          <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
            {pagosActivos.length} servicios
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {pagosActivos.slice(0, 6).map((pago) => {
          const Icon = getIcon(pago.nombre)
          const montoFormateado = (typeof pago.monto === 'number' ? pago.monto : parseFloat(pago.monto || 0)).toFixed(2)
          const porcentaje = total > 0 ? Math.round((parseFloat(pago.monto) / total) * 100) : 0
          
          return (
            <div
              key={pago.id || pago.nombre}
              className="p-3 hover:bg-slate-800/30 rounded-lg transition-colors"
            >
              {/* PRIMERA LÍNEA: Nombre + Monto bien alineados */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-white">{pago.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-sm font-semibold text-slate-300">
                    €{montoFormateado}
                  </span>
                </div>
              </div>
              
              {/* SEGUNDA LÍNEA: Detalles */}
              <div className="text-xs text-slate-500 space-y-1 ml-6">
                <div className="flex items-center gap-2">
                  <span className="capitalize">{pago.frecuencia || 'mensual'}</span>
                  <span className="text-slate-700">·</span>
                  <span>{pago.metodo || 'Transferencia'}</span>
                  {pago.fechaInicio && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatearFecha(pago.fechaInicio)}
                      </span>
                    </>
                  )}
                </div>
                <div>
                  {porcentaje}% del total · {pago.categoria || 'Alquiler'}
                </div>
              </div>
            </div>
          )
        })}

        {pagosActivos.length > 6 && (
          <div className="text-center py-2">
            <span className="text-xs text-slate-500">
              +{pagosActivos.length - 6} pagos más
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-300">Total fijos</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                {pagosActivos.length} servicios
              </span>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${total > 500 ? 'text-red-400' : total > 200 ? 'text-yellow-400' : 'text-green-400'}`}>
                €{total.toFixed(2)}
              </span>
              <div className="text-xs text-slate-500">
                {total > 500 ? 'Alto impacto' : total > 200 ? 'Impacto moderado' : 'Bajo impacto'}
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Mes actual: 2026-01</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-400" />
              <span>{pagosActivos.length} pagados este mes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}