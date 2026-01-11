import { motion } from "framer-motion"
import ResumenGastos from "@/components/dashboard/ResumenGastos"
import GraficoGastos from "@/components/dashboard/GraficoGastos"
import DineroDisponible from "@/components/dashboard/DineroDisponible"
import PagosFijos from "@/components/dashboard/PagosFijos"
import BalanceMensual from "@/components/dashboard/BalanceMensual"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md space-y-6 mx-auto"
    >
      <DineroDisponible />
      <BalanceMensual />
      <PagosFijos />
      <ResumenGastos />
      <GraficoGastos />

      <Button className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
        Añadir gasto
      </Button>
    </motion.div>
  )
}