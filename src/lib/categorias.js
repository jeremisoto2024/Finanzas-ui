import {
  ShoppingCartIcon,
  HomeIcon,
  TruckIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'

export const categoriasConfig = {
  Alimentación: {
    icon: ShoppingCartIcon,
    color: 'text-emerald-400',
    hex: '#34d399'
  },
  Alquiler: {
    icon: HomeIcon,
    color: 'text-indigo-400',
    hex: '#818cf8'
  },
  Transporte: {
    icon: TruckIcon,
    color: 'text-yellow-400',
    hex: '#facc15'
  },
  Otros: {
    icon: EllipsisHorizontalIcon,
    color: 'text-slate-400',
    hex: '#94a3b8'
  }
}