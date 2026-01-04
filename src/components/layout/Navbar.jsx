import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'

export default function Navbar({ onMenu }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
      <button onClick={onMenu}>
        <Bars3Icon className="h-6 w-6 text-slate-300" />
      </button>

      <h1 className="text-sm font-semibold text-emerald-400">
        Finanzas
      </h1>

      <BellIcon className="h-6 w-6 text-slate-300" />
    </header>
  )
}