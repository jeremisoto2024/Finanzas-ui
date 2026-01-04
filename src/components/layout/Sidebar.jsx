import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const items = [
  { name: 'Dashboard', icon: HomeIcon },
  { name: 'Gastos', icon: ChartBarIcon },
  { name: 'Configuración', icon: Cog6ToothIcon }
]

export default function Sidebar({ mobile = false }) {
  return (
    <aside
      className={`w-64 flex-col border-r border-slate-800 bg-slate-950 p-4
        ${mobile ? 'flex' : 'hidden md:flex'}
      `}
    >
      <h2 className="mb-6 text-lg font-semibold text-emerald-400">
        Finanzas
      </h2>

      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.name}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  )
}
