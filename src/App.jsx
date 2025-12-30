import { motion } from 'framer-motion'
import { BanknotesIcon } from '@heroicons/react/24/outline'

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto rounded-xl bg-slate-900 p-6 shadow-lg"
      >
        <BanknotesIcon className="h-10 w-10 text-emerald-400 mb-4" />

        <h1 className="text-xl font-semibold">
          Finanzas Personales
        </h1>

        <p className="text-slate-400 mt-2">
          Dashboard moderno con shadcn + animaciones
        </p>
      </motion.div>
    </div>
  )
}