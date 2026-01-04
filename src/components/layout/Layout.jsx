import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

  export default function Layout({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <div className="hidden md:block">
  <Sidebar />
</div>

      <div className="flex-1">
        <Navbar onMenu={() => setMenuAbierto(true)} />
        {menuAbierto && (
  <div className="fixed inset-0 z-50 md:hidden">
    {/* Fondo oscuro */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setMenuAbierto(false)}
    />

    {/* Sidebar */}
    <div className="relative h-full w-64 bg-slate-950 border-r border-slate-800">
      <Sidebar />
    </div>
  </div>
)}

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}