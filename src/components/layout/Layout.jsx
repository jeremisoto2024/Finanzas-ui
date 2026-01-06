import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'


import Configuracion from '../pages/Configuracion'

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      
      {/* Sidebar desktop */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1">
        <Navbar onMenu={() => setMenuAbierto(true)} />

        {/* Sidebar móvil */}
        {menuAbierto && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            
            {/* Fondo oscuro */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuAbierto(false)}
            />

            {/* Sidebar */}
            <div className="relative z-10 h-full w-64">
              <Sidebar
                mobile
                activePage={activePage}
                setActivePage={(page) => {
                  setActivePage(page)
                  setMenuAbierto(false) // cerrar menú al tocar
                }}
              />
            </div>
          </div>
        )}

        <main className="p-4 md:p-6">
          {activePage === 'Dashboard' && <Dashboard />}
          {activePage === 'Gastos' && <Gastos />}
          {activePage === 'Configuración' && <Configuracion />}
        </main>
      </div>
    </div>
  )
}