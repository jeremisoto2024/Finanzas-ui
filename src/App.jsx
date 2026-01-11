import { useState } from 'react'
import Layout from './components/layout/Layout'

import Dashboard from './pages/Dashboard'
import Gastos from './pages/Gastos'
import Configuracion from './pages/Configuracion'

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  return (
    <Layout>
      {activePage === 'Dashboard' && <Dashboard />}
      {activePage === 'Gastos' && <Gastos />}
      {activePage === 'Configuración' && <Configuracion />}
    </Layout>
  )
}