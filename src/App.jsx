import { useState } from 'react'
import Layout from './components/layout/Layout'
import { GastosProvider } from '@/contexts/GastosContext' // Importar el provider

import Dashboard from './pages/Dashboard'
import Gastos from './pages/Gastos'
import Configuracion from './pages/Configuracion'

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  return (
    // Envolver toda la aplicación con GastosProvider
    <GastosProvider>
      <Layout>
        {activePage === 'Dashboard' && <Dashboard />}
        {activePage === 'Gastos' && <Gastos />}
        {activePage === 'Configuración' && <Configuracion />}
      </Layout>
    </GastosProvider>
  )
}