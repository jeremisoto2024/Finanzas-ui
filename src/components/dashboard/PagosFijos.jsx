import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  HomeIcon,
  DevicePhoneMobileIcon,
  FilmIcon,
} from '@heroicons/react/24/outline'

const pagos = [
  { nombre: 'Alquiler', monto: 750, icon: HomeIcon },
  { nombre: 'Teléfono', monto: 35, icon: DevicePhoneMobileIcon },
  { nombre: 'Netflix', monto: 12, icon: FilmIcon },
]

export default function PagosFijos() {
  const total = pagos.reduce((acc, p) => acc + p.monto, 0)

  return (
    <Card className="bg-slate-900/60 border border-slate-800">
      <CardHeader>
        <CardTitle className="text-sm text-slate-300">
          Pagos fijos
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {pagos.map((pago) => {
          const Icon = pago.icon
          return (
            <div
              key={pago.nombre}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 text-slate-300">
                <Icon className="h-4 w-4 text-slate-400" />
                <span>{pago.nombre}</span>
              </div>
              <span className="text-slate-400">€ {pago.monto}</span>
            </div>
          )
        })}

        <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-medium">
          <span className="text-slate-300">Total fijos</span>
          <span
  className={`font-bold ${
    total > 700 ? 'text-rose-400' : 'text-slate-200'
  }`}
>
  € {total}
</span>
        </div>
      </CardContent>
    </Card>
  )
}