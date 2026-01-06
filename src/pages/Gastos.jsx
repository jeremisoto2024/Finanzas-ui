import HeaderGastos from '@/components/gastos/HeaderGastos'
import TablaGastos from '@/components/gastos/TablaGastos'

export default function Gastos() {
  return (
    <div className="space-y-6">
      <HeaderGastos />
      <TablaGastos />
    </div>
  )
}