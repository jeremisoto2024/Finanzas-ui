import { useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
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

// Configuración de iconos por categoría
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

// COLORES ESPECÍFICOS PARA CADA CATEGORÍA (para evitar que se inviertan)
const coloresPorCategoria = {
  'Alquiler': '#3b82f6',       // AZUL para Alquiler
  'Alimentación': '#10b981',   // VERDE para Alimentación
  'Transporte': '#f59e0b',     // AMARILLO/ÁMBAR para Transporte
  'Entretenimiento': '#8b5cf6', // VIOLETA para Entretenimiento
  'Salud': '#ef4444',          // ROJO para Salud
  'Ropa': '#ec4899',           // ROSA para Ropa
  'Regalos': '#14b8a6',        // TURQUESA para Regalos
  'Ahorro': '#84cc16',         // VERDE LIMA para Ahorro
  'Café': '#f97316',           // NARANJA para Café
  'Restaurante': '#6366f1',    // ÍNDIGO para Restaurante
  'Internet': '#06b6d4',       // CIAN para Internet
  'Teléfono': '#8b5cf6',       // VIOLETA para Teléfono
  'Luz': '#fbbf24',            // AMARILLO para Luz
  'Otros': '#94a3b8',          // GRIS para Otros
}

// Colores por defecto si no hay configuración
const coloresDefault = [
  '#3b82f6', // Azul - Alquiler
  '#10b981', // Verde - Alimentación
  '#f59e0b', // Ámbar - Transporte
  '#8b5cf6', // Violeta - Entretenimiento
  '#ef4444', // Rojo - Salud
  '#ec4899', // Rosa - Ropa
  '#14b8a6', // Turquesa - Regalos
  '#84cc16', // Verde lima - Ahorro
  '#f97316', // Naranja - Café
  '#6366f1', // Índigo - Restaurante
]

export default function GraficoGastos() {
  const [activeIndex, setActiveIndex] = useState(null)
  const porCategoria = gastosPorCategoria(gastos)

  // Ordenar los datos por monto (de mayor a menor) para consistencia
  const dataOrdenada = Object.entries(porCategoria)
    .sort(([, montoA], [, montoB]) => montoB - montoA)
    .map(([categoria, monto], index) => ({
      name: categoria,
      value: monto,
      // Usar color específico por categoría, si no existe, usar color por defecto basado en índice
      color: coloresPorCategoria[categoria] || coloresDefault[index % coloresDefault.length],
      icon: categoriaIconos[categoria] || DollarSign,
    }))

  const total = dataOrdenada.reduce((acc, item) => acc + item.value, 0)

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 min-w-[180px]">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: data.color }}
            />
            <p className="text-sm font-semibold text-white">{data.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-white">€{data.value.toFixed(2)}</p>
            <p className="text-sm text-slate-300">
              {((data.value / total) * 100).toFixed(1)}% del total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

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
        {/* GRÁFICO CON COLORES CORREGIDOS */}
        <motion.div
          className="h-72 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataOrdenada}
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
                label={null}
              >
                {dataOrdenada.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                    strokeWidth={activeIndex === index ? 3 : 1}
                    stroke="#1e293b"
                    className="transition-all duration-200 cursor-pointer"
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              
              {/* Leyenda con colores específicos */}
              <Legend 
                content={() => (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {dataOrdenada.slice(0, 3).map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 rounded-md"
                      >
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-slate-300">{item.name}</span>
                      </div>
                    ))}
                    {dataOrdenada.length > 3 && (
                      <div className="px-2 py-1 bg-slate-800/50 rounded-md text-xs text-slate-400">
                        +{dataOrdenada.length - 3} más
                      </div>
                    )}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* LEYENDA MEJORADA - CON COLORES CORRECTOS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300">Detalle por categoría</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {dataOrdenada.length} categorías
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
            {dataOrdenada.map((item, index) => {
              const Icon = item.icon
              const porcentaje = ((item.value / total) * 100).toFixed(1)

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    activeIndex === index 
                      ? 'bg-slate-800 border-l-2' 
                      : 'bg-slate-800/30 hover:bg-slate-800/50'
                  }`}
                  style={{ 
                    borderLeftColor: activeIndex === index ? item.color : 'transparent',
                    borderLeftWidth: '2px'
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div 
                      className="p-1.5 rounded-md flex-shrink-0"
                      style={{ 
                        backgroundColor: `${item.color}20`,
                      }}
                    >
                      <Icon className="h-3 w-3" style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-white truncate block">
                        {item.name}
                      </span>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                        <div 
                          className="h-1.5 rounded-full"
                          style={{ 
                            width: `${Math.min(porcentaje, 100)}%`,
                            backgroundColor: item.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-xs font-semibold text-slate-300">
                      €{item.value.toFixed(0)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {porcentaje}%
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* RESUMEN CON COLORES CLAROS */}
          <div className="pt-3 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400">Mayor gasto</div>
                {dataOrdenada.length > 0 && (
                  <div className="flex items-center justify-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: dataOrdenada[0].color }}
                    />
                    <div className="text-sm font-medium text-white truncate">
                      {dataOrdenada[0].name}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400">Promedio/cat</div>
                <div className="text-sm font-medium text-slate-300">
                  €{(total / dataOrdenada.length).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}