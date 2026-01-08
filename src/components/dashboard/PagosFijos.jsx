import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Home, Smartphone, Film, Wifi, Car, ShoppingBag, Heart, Gamepad2, Phone, Coffee, Utensils, Gift, MoreHorizontal, BookOpen, Music, DollarSign, Calendar, CreditCard, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

// Mapeo de iconos con colores específicos para cada categoría
const iconMap = {
  'Alquiler': { icon: Home, color: 'bg-blue-100 text-blue-600' },
  'Alimentación': { icon: ShoppingBag, color: 'bg-emerald-100 text-emerald-600' },
  'Transporte': { icon: Car, color: 'bg-amber-100 text-amber-600' },
  'Entretenimiento': { icon: Gamepad2, color: 'bg-purple-100 text-purple-600' },
  'Salud': { icon: Heart, color: 'bg-pink-100 text-pink-600' },
  'Servicios': { icon: Wifi, color: 'bg-cyan-100 text-cyan-600' },
  'Telefonía': { icon: Phone, color: 'bg-indigo-100 text-indigo-600' },
  'Tecnología': { icon: Smartphone, color: 'bg-violet-100 text-violet-600' },
  'Educación': { icon: BookOpen, color: 'bg-teal-100 text-teal-600' },
  'Hogar': { icon: Home, color: 'bg-orange-100 text-orange-600' },
  'Café': { icon: Coffee, color: 'bg-rose-100 text-rose-600' },
  'Restaurante': { icon: Utensils, color: 'bg-red-100 text-red-600' },
  'Regalos': { icon: Gift, color: 'bg-teal-100 text-teal-600' },
  'Otros': { icon: MoreHorizontal, color: 'bg-slate-100 text-slate-600' },
  'Netflix': { icon: Film, color: 'bg-red-100 text-red-600' },
  'Internet': { icon: Wifi, color: 'bg-blue-100 text-blue-600' },
  'Gimnasio': { icon: Heart, color: 'bg-green-100 text-green-600' },
  'Spotify': { icon: Music, color: 'bg-emerald-100 text-emerald-600' },
  'Amazon': { icon: ShoppingBag, color: 'bg-orange-100 text-orange-600' },
  'Apple': { icon: Smartphone, color: 'bg-slate-100 text-slate-900' }
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
      <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Pagos Fijos Mensuales
            </CardTitle>
            <div className="text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full">
              0 servicios
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay pagos fijos</h3>
            <p className="text-slate-600 mb-4">Agrega tus primeros pagos fijos desde Configuración</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow">
              <Calendar className="h-4 w-4" />
              Ir a Configuración
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const pagosActivos = pagosFijos.filter(p => p.activo)
  const pagosMostrar = pagosActivos.slice(0, 6)
  const tieneMasPagos = pagosActivos.length > 6

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            Pagos Fijos Mensuales
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full">
              {pagosActivos.length} servicios
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full ${
              total > 700 ? 'bg-red-500/20 text-red-100' : 
              total > 300 ? 'bg-amber-500/20 text-amber-100' : 
              'bg-emerald-500/20 text-emerald-100'
            }`}>
              {total > 700 ? '⚡ Alto' : total > 300 ? '⚠ Moderado' : '✓ Bajo'}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          {pagosMostrar.map((pago) => {
            const iconData = iconMap[pago.categoria] || iconMap[pago.nombre] || { icon: ShoppingBag, color: 'bg-slate-100 text-slate-600' }
            const Icon = iconData.icon
            
            return (
              <div
                key={pago.id}
                className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-slate-100 hover:border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`relative ${iconData.color} p-3 rounded-xl transition-transform group-hover:scale-110 group-hover:shadow-lg`}>
                    <Icon className="h-5 w-5" />
                    {pago.frecuencia === 'mensual' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{pago.nombre}</span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {pago.categoria}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span className="capitalize">{pago.frecuencia}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <CreditCard className="h-3 w-3" />
                        <span>{pago.metodo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-lg font-bold text-slate-900">€{pago.monto.toFixed(2)}</span>
                    {total > 0 && (
                      <div className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                        {Math.round((pago.monto / total) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {pago.fechaInicio && (
                      <span className="flex items-center gap-1 justify-end">
                        <AlertCircle className="h-3 w-3" />
                        Próximo: {new Date(pago.fechaInicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {tieneMasPagos && (
            <div className="pt-3">
              <div className="text-center">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg font-medium hover:from-slate-200 hover:to-slate-300 transition-all">
                  <span className="text-sm">
                    Ver {pagosActivos.length - 6} pagos más
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="pt-6 mt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-800">Total gastos fijos</span>
                  <div className="text-xs text-slate-600">Suma de todos los servicios activos</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  total > 700 ? 'text-red-600' : 
                  total > 300 ? 'text-amber-600' : 
                  'text-emerald-600'
                }`}>
                  €{total.toFixed(2)}
                  <span className="text-lg">/mes</span>
                </div>
                <div className="text-xs font-medium text-slate-600 mt-1">
                  {total > 700 ? '🔴 Gasto fijo alto' : total > 300 ? '🟡 Gasto moderado' : '🟢 Gasto bajo'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}