import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { categorias } from "../../lib/categorias"

export default function ResumenGastos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de gastos</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {categorias.map((cat) => {
          const Icon = cat.icon
          return (
            <div
              key={cat.nombre}
              className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-3">
                <Icon className={h-4 w-4 ${cat.color}} />
                <span className="text-sm text-slate-200">
                  {cat.nombre}
                </span>
              </div>

              <span className="text-sm font-medium text-slate-100">
                €0,00
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}