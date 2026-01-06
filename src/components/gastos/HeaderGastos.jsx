import { Card } from '@/components/ui/card'

const TOTAL_MES = 1245.50 // luego será dinámico

export default function HeaderGastos() {
  return (
    <Card className="bg-slate-900/60 border border-slate-800 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm text-slate-400">Gastos del mes</h2>
          <p className="text-2xl font-bold text-rose-400">
            € {TOTAL_MES.toFixed(2)}
          </p>
        </div>

        <span className="text-xs text-slate-500">
          Octubre 2025
        </span>
      </div>
    </Card>
  )
}