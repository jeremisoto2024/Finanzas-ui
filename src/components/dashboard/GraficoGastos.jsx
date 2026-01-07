import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { gastos } from '@/lib/data'
import { gastosPorCategoria } from '@/lib/finanzas'
import { categoriasConfig } from '@/lib/categorias'
import { motion } from 'framer-motion'

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
  MoreHorizontal
} from 'lucide-react'

// Configuración de iconos por categoría (si no tienes categoriasConfig)
const categoriaIconos = {
  'Alquiler': Home,
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
  'Otros': MoreHorizontal
}

export default function GraficoGastos() {
  const [activeIndex, setActiveIndex] = useState(null)
  const porCategoria = gastosPorCategoria(gastos)

  const data = Object.entries(porCategoria).map(([categoria, monto]) => ({
    name: categoria,
    value: monto,
    color: categoriasConfig?.[categoria]?.color || '#3b82f6', // Azul por defecto
    icon: categoriaIconos[categoria] || DollarSign,
  }))

  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-blue-900/30 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          Distribución de Gastos
        </CardTitle>
        <p className="text-sm text-slate-400 mt-1">
          Total: <span className="font-semibold text-red-400">€{total.toFixed(2)}</span>
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* GRÁFICO MEJORADO */}
        <motion.div
          className="h-72 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                isAnimationActive
                animationDuration={600}
                activeIndex={activeIndex}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                labelLine={false}
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                    strokeWidth={activeIndex === index ? 3 : 1}
                    stroke="#1e293b"
                    className="transition-all duration-200"
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`€ ${value.toFixed(2)}`, 'Gasto']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                }}
                itemStyle={{
                  color: '#e2e8f0',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
                labelStyle={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '6px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* LEYENDA MEJORADA */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300">Detalle por categoría</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {data.length} categorías
            </span>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {data
              .sort((a, b) => b.value - a.value)
              .map((item, index) => {
                const Icon = item.icon
                const porcentaje = ((item.value / total) * 100).toFixed(1)

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      activeIndex === index 
                        ? 'bg-slate-800 border-l-4' 
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                    }`}
                    style={{ 
                      borderLeftColor: activeIndex === index ? item.color : 'transparent',
                      borderLeftWidth: '4px'
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="p-2 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${item.color}20`,
                          border: `1px solid ${item.color}30`
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-white block">
                          {item.name}
                        </span>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                          <div 
                            className="h-1.5 rounded-full"
                            style={{ 
                              width: `${porcentaje}%`,
                              backgroundColor: item.color,
                              maxWidth: '100%'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-sm font-semibold text-slate-300">
                        €{item.value.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {porcentaje}% • {((item.value / total) * 100).toFixed(0)} de 100
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>

          {/* RESUMEN */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Categoría con más gasto: 
                <span className="font-medium text-white ml-2">
                  {data.length > 0 ? data.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
                </span>
              </div>
              <div className="text-sm text-slate-400">
                Promedio: 
                <span className="font-medium text-slate-300 ml-2">
                  €{(total / data.length).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}