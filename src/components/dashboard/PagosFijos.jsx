import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Home, Smartphone, Film, Wifi, Car, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PagosFijos() {
  const [pagosFijos, setPagosFijos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos de localStorage
  useEffect(() => {
    const fetchPagosFijos = async () => {
      try {
        setLoading(true)
        
        // Primero intentar con la API (como TablaGastos.jsx)
        const response = await fetch('/api/pagos-fijos')
        
        if (response.ok) {
          const data = await response.json()
          const pagosActivos = data.filter(pago => pago.activo !== false)
          setPagosFijos(pagosActivos)
        } else {
          // Si la API falla, usar localStorage
          throw new Error('API no disponible')
        }
        
      } catch (err) {
        console.error('Error cargando pagos fijos:', err)
        
        // Fallback a localStorage
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

  // Calcular total - ASEGURAR formato correcto
  const total = pagosFijos
    .filter(p => p.activo !== false)
    .reduce((acc, p) => {
      // Asegurar que el monto sea un número
      const monto = typeof p.monto === 'number' ? p.monto : parseFloat(p.monto) || 0
      return acc + monto
    }, 0)

  // Mapeo de iconos para los nombres comunes
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

  if (pagosFijos.length === 0 || pagosFijos.filter(p => p.activo !== false).length === 0) {
    return (
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <span className="p-1.5 bg-blue-900/30 rounded-lg">
              <Home className="h-3 w-3 text-blue-400" />
            </span>
            Pagos fijos mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-3">
              <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto" />
            </div>
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
      <CardHeader>
        {/* ELIMINADO EL BOTÓN "GESTIONAR" - solo título */}
        <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
          <span className="p-1.5 bg-blue-900/30 rounded-lg">
            <Home className="h-3 w-3 text-blue-400" />
          </span>
          Pagos fijos mensuales
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {pagosActivos.slice(0, 6).map((pago) => {
          const Icon = getIcon(pago.nombre)
          // Asegurar formato correcto del monto
          const montoFormateado = typeof pago.monto === 'number' 
            ? pago.monto.toFixed(2) 
            : parseFloat(pago.monto || 0).toFixed(2)
          
          return (
            <div
              key={pago.id}
              className="flex items-center justify-between p-3 hover:bg-slate-800/30 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{pago.nombre}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 capitalize">{pago.frecuencia || 'mensual'}</span>
                    {pago.metodo && (
                      <>
                        <span className="text-xs text-slate-700">•</span>
                        <span className="text-xs text-slate-500">{pago.metodo}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {/* MONTO CORREGIDO: asegurar formato €425.00 */}
                <span className="text-sm font-semibold text-slate-300">€{montoFormateado}</span>
                <div className="text-xs text-slate-500">
                  {Math.round((parseFloat(montoFormateado) / total) * 100)}% del total
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
              {/* TOTAL CORREGIDO: asegurar formato €425.00 */}
              <span className={`text-lg font-bold ${total > 0 ? 'text-red-400' : 'text-green-400'}`}>
                €{total.toFixed(2)}
              </span>
              <div className="text-xs text-slate-500">
                {total > 0 ? 'Alto' : 'Moderado'} gasto fijo
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}