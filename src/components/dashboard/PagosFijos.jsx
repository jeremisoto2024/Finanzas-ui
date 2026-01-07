import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Home, Smartphone, Film, Wifi, Car, ShoppingBag } from 'lucide-react'

const pagos = [
  { nombre: 'Alquiler', monto: 750, icon: Home },
  { nombre: 'Teléfono', monto: 35, icon: Smartphone },
  { nombre: 'Netflix', monto: 12, icon: Film },
  { nombre: 'Internet', monto: 45, icon: Wifi },
  { nombre: 'Transporte', monto: 120, icon: Car },
  { nombre: 'Supermercado', monto: 250, icon: ShoppingBag },
]

export default function PagosFijos() {
  const total = pagos.reduce((acc, p) => acc + p.monto, 0)

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
        {pagos.map((pago) => {
          const Icon = pago.icon
          return (
            <div
              key={pago.nombre}
              className="flex items-center justify-between p-3 hover:bg-slate-800/30 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{pago.nombre}</span>
                  <div className="text-xs text-slate-500">Pago mensual</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-300">€{pago.monto}</span>
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
                {pagos.length} servicios
              </span>
            </div>
            <div className="text-right">
              <span className={`text-lg font-bold ${total > 700 ? 'text-red-400' : 'text-green-400'}`}>
                €{total}
              </span>
              <div className="text-xs text-slate-500">
                {total > 700 ? 'Alto' : 'Moderado'} gasto fijo
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}