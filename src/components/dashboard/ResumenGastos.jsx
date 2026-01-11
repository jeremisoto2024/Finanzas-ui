import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useGastos } from '@/contexts/GastosContext'

// ICONOS LUCIDE REACT MODERNOS
import { 
  Home,
  ShoppingCart,
  Car,
  Film,
  Heart,
  Shirt,
  Gift,
  TrendingUp,
  Coffee,
  Utensils,
  Wifi,
  Phone,
  Zap,
  DollarSign,
  MoreHorizontal,
  TrendingDown,
  Target,
  PieChart
} from 'lucide-react'

// Configuración de iconos por categoría
const categoriaIconos = {
  'Vivienda': Home,
  'Alimentación': ShoppingCart,
  'Transporte': Car,
  'Entretenimiento': Film,
  'Salud': Heart,
  'Ropa': Shirt,
  'Regalos': Gift,
  'Ahorro': TrendingUp,
  'Café': Coffee,
  'Restaurante': Utensils,
  'Internet': Wifi,
  'Teléfono': Phone,
  'Luz': Zap,
  'Tecnología': Zap,
  'Familia': Heart,
  'Hogar': Home,
  'Otros': MoreHorizontal
}

// COLORES ESPECÍFICOS PARA CADA CATEGORÍA
const coloresPorCategoria = {
  'Vivienda': '#3b82f6',
  'Alquiler': '#3b82f6',
  'Alimentación': '#10b981',
  'Transporte': '#f59e0b',
  'Entretenimiento': '#8b5cf6',
  'Salud': '#ef4444',
  'Ropa': '#ec4899',
  'Regalos': '#14b8a6',
  'Ahorro': '#84cc16',
  'Café': '#f97316',
  'Restaurante': '#6366f1',
  'Internet': '#06b6d4',
  'Teléfono': '#8b5cf6',
  'Luz': '#fbbf24',
  'Tecnología': '#8b5cf6',
  'Familia': '#ec4899',
  'Hogar': '#10b981',
  'Otros': '#94a3b8',
}

export default function ResumenGastos() {
  const { 
    gastosFiltrados, 
    totalGastosFiltrados, 
    gastosPorCategoria, 
    filtroMes,
    formatearMesTexto 
  } = useGastos();

  const total = totalGastosFiltrados;
  const porCategoria = gastosPorCategoria;
  
  // Calcular categoría con mayor gasto
  const categoriaMayorGasto = Object.entries(porCategoria).reduce((max, [cat, monto]) => 
    monto > max.monto ? { categoria: cat, monto } : max, 
    { categoria: '', monto: 0 }
  );
  
  const porcentajeMayorGasto = total > 0 ? (categoriaMayorGasto.monto / total) * 100 : 0;

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
            Resumen de Gastos
            {filtroMes && (
              <span className="text-xs font-normal text-slate-400 ml-2">
                ({formatearMesTexto(filtroMes)})
              </span>
            )}
          </CardTitle>
          <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-lg">
            {Object.keys(porCategoria).length} categorías
          </div>
        </div>
        
        {/* TOTAL PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="text-3xl font-bold text-red-400">
            €{total.toFixed(2)}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {gastosFiltrados.length} transacciones
            {filtroMes ? ` en ${formatearMesTexto(filtroMes)}` : ' totales'}
          </p>
        </motion.div>
      </CardHeader>
     
      <CardContent className="space-y-4">
        {/* INSIGHTS RÁPIDOS */}
        {categoriaMayorGasto.categoria && (
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">Mayor gasto</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: coloresPorCategoria[categoriaMayorGasto.categoria] || '#94a3b8'
                  }}
                ></div>
                <span className="text-sm text-slate-300">{categoriaMayorGasto.categoria}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-red-400">
                  €{categoriaMayorGasto.monto.toFixed(2)}
                </span>
                <div className="text-xs text-slate-500">
                  {porcentajeMayorGasto.toFixed(1)}% del total
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LISTA DE CATEGORÍAS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300">Gastos por categoría</h3>
            <div className="text-xs text-slate-500">
              {Object.entries(porCategoria).length} categorías activas
            </div>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {Object.entries(porCategoria)
              .sort(([, montoA], [, montoB]) => montoB - montoA)
              .map(([categoria, monto], index) => {
                const Icon = categoriaIconos[categoria] || DollarSign;
                const color = coloresPorCategoria[categoria] || '#94a3b8';
                const porcentaje = total > 0 ? (monto / total) * 100 : 0;

                return (
                  <motion.div
                    key={categoria}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, ease: 'easeOut' }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="p-2 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ 
                          backgroundColor: `${color}20`,
                          border: `1px solid ${color}30`
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-white truncate block">
                          {categoria}
                        </span>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${porcentaje}%`,
                              backgroundColor: color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-sm font-semibold text-slate-300">
                        €{monto.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {porcentaje.toFixed(1)}%
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        </div>

        {/* RESUMEN FOOTER */}
        <div className="pt-3 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400">Promedio/cat</div>
              <div className="text-sm font-medium text-slate-300">
                €{Object.keys(porCategoria).length > 0 ? (total / Object.keys(porCategoria).length).toFixed(0) : '0'}
              </div>
            </div>
            <div className="text-center p-2 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400">Transacciones</div>
              <div className="text-sm font-medium text-slate-300">
                {gastosFiltrados?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}