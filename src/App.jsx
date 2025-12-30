import { motion } from 'framer-motion'

import Layout from '@/components/layout/Layout'
import ResumenGastos from '@/components/dashboard/ResumenGastos'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-4"
      >
        <ResumenGastos />

        <Button className="w-full">
          Añadir gasto
        </Button>
      </motion.div>
    </Layout>
  )
}