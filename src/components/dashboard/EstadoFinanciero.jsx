import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function EstadoFinanciero({ balance }) {
  let estado = {
    label: 'Vas cómodo',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    icon: ArrowTrendingUpIcon,
  }

  if (balance <= 300 && balance >= 0) {
    estado = {
      label: 'Vas justo',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      icon: ExclamationTriangleIcon,
    }
  }

  if (balance < 0) {
    estado = {
      label: 'Riesgo',
      color: 'text-rose-400',
      bg: 'bg-rose-400/10',
      icon: ArrowTrendingDownIcon,
    }
  }

  const Icon = estado.icon

  return (
    <Card className={`border border-slate-800 ${estado.bg}`}>
      <CardHeader>
        <CardTitle className="text-sm text-slate-300">
          Estado financiero
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-medium ${estado.color}`}>
            {estado.label}
          </p>
          <p className="text-2xl font-bold text-white">
            € {balance.toFixed(2)}
          </p>
        </div>

        <Icon className={`h-8 w-8 ${estado.color}`} />
      </CardContent>
    </Card>
  )
}
