import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Home, Smartphone, Film, Wifi, Car, ShoppingBag, Heart, Gamepad2, Phone, Coffee, Utensils, Gift, MoreHorizontal } from 'lucide-react'

// Mapeo de iconos para las categorías
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
  'Internet': Wifi
}

export default function PagosFijos({ pagosFijos = [] }) {
  const total = pagosFijos.reduce((acc, p) => acc + p.monto, 0)

  // Si no hay pagos fijos, mostrar mensaje
  if (pagosFijos.length === 0) {
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
            <p className="text-slate-500 text-xs">Añade tus primeros pagos fijos en la configuración</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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

      <CardContent className="space-y-4">
        {pagosFijos.filter(p => p.activo).map((pago) => {
          // Obtener el icono correspondiente
          const Icon = iconMap[pago.categoria] || iconMap[pago.nombre] || ShoppingBag
          
          return (
            <div
              key={pago.id}
              className="flex items-center justify-between p-3 hover:bg-slate-800/30 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{pago.nombre}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 capitalize">{pago.frecuencia}</span>
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
                <span className="text-sm font-semibold text-slate-300">€{pago.monto.toFixed(2)}</span>
                <div className="text-xs text-slate-500">
                  {Math.round((pago.monto / total) * 100)}% del total
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-300">Total fijos</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                {pagosFijos.filter(p => p.activo).length} servicios
              </span>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${total > 700 ? 'text-red-400' : total > 300 ? 'text-amber-400' : 'text-green-400'}`}>
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