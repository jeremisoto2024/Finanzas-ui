import { BanknotesIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Total gastado este mes</CardTitle>
            <BanknotesIcon className="h-5 w-5 text-emerald-400" />
          </CardHeader>

          <CardContent>€ 523,40</CardContent>
        </Card>

        <Button className="w-full">
          Añadir gasto
        </Button>
      </motion.div>
    </Layout>
  )
}