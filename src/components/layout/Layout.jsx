import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}