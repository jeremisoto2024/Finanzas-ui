import TablaIngresos from '@/components/ingresos/TablaIngresos'

export default function Ingresos() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Ingresos del mes</h1>
      <TablaIngresos />
    </div>
  )
}