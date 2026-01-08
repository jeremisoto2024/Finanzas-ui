import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Home, Smartphone, Film, Wifi, Car, ShoppingBag, Heart, Gamepad2, Phone, Coffee, Utensils, Gift, MoreHorizontal, BookOpen, Music } from 'lucide-react'
import { useEffect, useState } from 'react'

// Mapeo de iconos
const iconMap = {
  'Alquiler': Home,
  'Alimentación': ShoppingBag,
  'Transporte': Car,
  'Entretenimiento': Gamepad2,
  'Salud': Heart,
  'Servicios': Wifi,
  'Telefonía': Phone,
  'Tecnología': Smartphone,
  'Educación': BookOpen,
  'Hogar': Home,
  'Café': Coffee,
  'Restaurante': Utensils,
  'Regalos': Gift,
  'Otros': MoreHorizontal,
  'Netflix': Film,
  'Internet': Wifi,
  'Gimnasio': Heart,
  'Spotify': Music,
  'Amazon': ShoppingBag,
  'Apple': Smartphone
}

export default function PagosFijos() {
  const [pagosFijos, setPagosFijos] = useState([])

  // Cargar datos de localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem('pagosFijos')
    if (datosGuardados) {
      setPagosFijos(JSON.parse(datosGuardados))
    }
  }, [])

  const total = pagosFijos
    .filter(p => p.activo)
    .reduce((acc, p) => acc + p.monto, 0)

  if (pagosFijos.length === 0) {
    return (
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm text-slate-700 flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 rounded-lg">
              <Home className="h-3 w-3 text-blue-600" />
            </span>
            Pagos fijos mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="mb-3">
              <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
            </div>
            <p className="text-slate-500 text-sm mb-2">No hay pagos fijos configurados</p>
            <p className="text-slate-400 text-xs">Ve a Configuración para agregar pagos fijos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <CardTitle className="text-sm text-slate-700 flex items-center gap-2">
          <span className="p-1.5 bg-blue-100 rounded-lg">
            <Home className="h-3 w-3 text-blue-600" />
          </span>
          Pagos fijos mensuales
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {pagosFijos
          .filter(p => p.activo)
          .slice(0, 6) // Mostrar solo los primeros 6
          .map((pago) => {
            const Icon = iconMap[pago.categoria] || iconMap[pago.nombre] || ShoppingBag
            
            return (
              <div
                key={pago.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                    <Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-900">{pago.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 capitalize">{pago.frecuencia}</span>
                      {pago.metodo && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{pago.metodo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-900">€{pago.monto.toFixed(2)}</span>
                  <div className="text-xs text-slate-500">
                    {total > 0 ? Math.round((pago.monto / total) * 100) : 0}% del total
                  </div>
                </div>
              </div>
            )
          })}

        {pagosFijos.filter(p => p.activo).length > 6 && (
          <div className="text-center py-2">
            <span className="text-xs text-slate-500">
              +{pagosFijos.filter(p => p.activo).length - 6} pagos más
            </span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Total fijos</span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {pagosFijos.filter(p => p.activo).length} servicios
              </span>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${
                total > 700 ? 'text-red-600' : 
                total > 300 ? 'text-amber-600' : 
                'text-green-600'
              }`}>
                €{total.toFixed(2)}
              </span>
              <div className="text-xs text-slate-500">
                {total > 700 ? 'Alto gasto fijo' : total > 300 ? 'Gasto moderado' : 'Bajo gasto fijo'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}