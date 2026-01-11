import { motion } from "framer-motion"
import GraficoGastos from "@/components/dashboard/GraficoGastos"
import DineroDisponible from "@/components/dashboard/DineroDisponible"
import PagosFijos from "@/components/dashboard/PagosFijos"
import BalanceMensual from "@/components/dashboard/BalanceMensual"

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
      <GraficoGastos />
    </motion.div>
  )
}