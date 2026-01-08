import { useState } from 'react'
import CuotasDetalle from '@/components/configuracion/CuotasDetalle'
import { cuotas } from '@/lib/cuotas'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import {
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function Configuracion() {
  const [abiertoId, setAbiertoId] = useState(null)

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-200">
        Configuración
      </h1>

      {/* BLOQUE CUOTAS */}
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300">
            Compras en cuotas
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {cuotas.map((item) => {
            const pagadas = item.cuotas.filter(c => c.pagada).length
            const totalCuotas = item.cuotasTotales

            const montoPagado = item.cuotas
              .filter(c => c.pagada)
              .reduce((acc, c) => acc + c.monto, 0)

            const pendiente = item.total - montoPagado
            const abierta = abiertoId === item.id

            return (
              <div
                key={item.id}
                onClick={() =>
                  setAbiertoId(abierta ? null : item.id)
                }
                className="cursor-pointer rounded-lg border border-slate-800 p-4 space-y-2 hover:bg-slate-900/40 transition"
              >
                {/* TÍTULO */}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-200">
                    {item.concepto}
                  </span>

                  <span className="text-xs text-slate-400">
                    {pagadas} / {totalCuotas} cuotas
                  </span>
                </div>

                {/* PROGRESO */}
                <div className="h-2 w-full rounded bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{
                      width: `${(pagadas / totalCuotas) * 100}%`
                    }}
                  />
                </div>

                {/* INFO */}
                <div className="flex justify-between text-xs text-slate-400">
                  <span>
                    Pendiente: € {pendiente.toFixed(2)}
                  </span>

                  <span className="flex items-center gap-1">
                    {pagadas === totalCuotas ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                        Finalizado
                      </>
                    ) : (
                      <>
                        <ClockIcon className="h-4 w-4 text-slate-400" />
                        En curso
                      </>
                    )}
                  </span>
                </div>

                {/* DETALLE CUOTAS */}
                {abierta && (
                  <CuotasDetalle cuotas={item.cuotas} />
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}