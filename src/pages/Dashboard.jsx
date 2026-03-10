import { motion } from "framer-motion"
import GraficoGastos from "@/components/dashboard/GraficoGastos"
import GraficoIngresos from "@/components/dashboard/GraficoIngresos"
import DineroDisponible from "@/components/dashboard/DineroDisponible"
import PagosFijos from "@/components/dashboard/PagosFijos"


export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 space-y-6"
    >
      {/* Primera fila: Resúmenes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DineroDisponible />
        </div>
        <div className="lg:col-span-1">
        </div>
        <div className="lg:col-span-1">
          <PagosFijos />
        </div>
      </div>

      {/* Segunda fila: Gráficos de ingresos y gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GraficoIngresos />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GraficoGastos />
        </motion.div>
      </div>
    </motion.div>
  )
}