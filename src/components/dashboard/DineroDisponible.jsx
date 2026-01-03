import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function DineroDisponible() {
  const ingresoMensual = 1800
  const gastosFijos = 950
  const disponible = ingresoMensual - gastosFijos

  return (
    <Card className="bg-emerald-900/30 border border-emerald-700">
      <CardHeader>
        <CardTitle className="text-sm text-emerald-200">
          Disponible este mes
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-4xl font-bold text-white">
          € {disponible.toFixed(2)}
        </p>

        <div className="mt-4 flex justify-between text-sm text-emerald-200">
          <span>Ingresos: € {ingresoMensual}</span>
          <span>Fijos: € {gastosFijos}</span>
        </div>
      </CardContent>
    </Card>
  )
}