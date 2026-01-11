import { useState, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useGastos } from '@/contexts/GastosContext'
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
  MoreHorizontal,
  Smartphone,
  Users,
  Shield,
  Book,
  Briefcase,
  TrendingUp as TrendingUpIcon
} from 'lucide-react'

// FUNCIÓN PARA GENERAR COLORES ÚNICOS BASADOS EN EL NOMBRE DE LA CATEGORÍA
const generateCategoryColor = (categoryName) => {
  // Hash simple basado en el nombre para consistencia
  const hash = categoryName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Colores predefinidos para categorías comunes
  const colorMap = {
    // Vivienda: Azules
    'vivienda': '#3b82f6',
    'alquiler': '#2563eb',
    'hipoteca': '#1d4ed8',
    'hogar': '#1e40af',
    
    // Alimentación: Verdes
    'alimentación': '#10b981',
    'alimentacion': '#059669',
    'comida': '#047857',
    'supermercado': '#065f46',
    'mercado': '#064e3b',
    
    // Transporte: Amarillos/Naranjas
    'transporte': '#f59e0b',
    'gasolina': '#d97706',
    'autobús': '#b45309',
    'taxi': '#92400e',
    'uber': '#78350f',
    
    // Entretenimiento: Violetas
    'entretenimiento': '#8b5cf6',
    'cine': '#7c3aed',
    'netflix': '#6d28d9',
    'streaming': '#5b21b6',
    'música': '#4c1d95',
    
    // Salud: Rojos
    'salud': '#ef4444',
    'médico': '#dc2626',
    'farmacia': '#b91c1c',
    'hospital': '#991b1b',
    'medicina': '#7f1d1d',
    
    // Ropa: Rosas
    'ropa': '#ec4899',
    'moda': '#db2777',
    'zapatos': '#be185d',
    'accesorios': '#9d174d',
    
    // Tecnología: Índigos
    'tecnología': '#6366f1',
    'tecnologia': '#4f46e5',
    'teléfono': '#4338ca',
    'internet': '#3730a3',
    'ordenador': '#312e81',
    
    // Familia: Rosas claros
    'familia': '#f472b6',
    'hijos': '#f9a8d4',
    'esposa': '#fce7f3',
    'esposo': '#fbcfe8',
    
    // Educación: Cian
    'educación': '#06b6d4',
    'educacion': '#0891b2',
    'libros': '#0e7490',
    'curso': '#155e75',
    
    // Trabajo: Grises
    'trabajo': '#6b7280',
    'oficina': '#4b5563',
    'negocio': '#374151',
    
    // Ahorro/Inversión: Verdes Lima
    'ahorro': '#84cc16',
    'inversión': '#65a30d',
    'inversion': '#4d7c0f',
    'bolsa': '#3f6212',
    
    // Servicios: Amarillos
    'luz': '#fbbf24',
    'agua': '#f59e0b',
    'gas': '#d97706',
    'electricidad': '#b45309',
    
    // Restaurantes: Índigos
    'restaurante': '#6366f1',
    'café': '#8b5cf6',
    'cafe': '#7c3aed',
    'bar': '#6d28d9',
    
    // Regalos: Turquesas
    'regalos': '#14b8a6',
    'cumpleaños': '#0d9488',
    'navidad': '#0f766e',
    'aniversario': '#115e59',
    
    // Otros: Grises neutros
    'otros': '#94a3b8',
    'varios': '#64748b',
    'misceláneo': '#475569',
    'miscelaneo': '#334155',
  };
  
  // Convertir a minúsculas y sin acentos
  const normalized = categoryName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Buscar coincidencia exacta
  if (colorMap[normalized]) {
    return colorMap[normalized];
  }
  
  // Buscar coincidencia parcial
  for (const [key, color] of Object.entries(colorMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return color;
    }
  }
  
  // Si no se encuentra, generar color basado en hash
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// Configuración FLEXIBLE de iconos por categoría
const getIconForCategoria = (categoria) => {
  const iconMap = {
    // Vivienda y Alquiler
    'alquiler': Home,
    'vivienda': Home,
    'hipoteca': Home,
    'casa': Home,
    'hogar': Home,
    
    // Alimentación
    'alimentación': ShoppingCart,
    'alimentacion': ShoppingCart,
    'comida': ShoppingCart,
    'mercado': ShoppingCart,
    'supermercado': ShoppingCart,
    
    // Transporte
    'transporte': Car,
    'gasolina': Car,
    'combustible': Car,
    'parking': Car,
    'estacionamiento': Car,
    
    // Entretenimiento
    'entretenimiento': Film,
    'cine': Film,
    'películas': Film,
    'peliculas': Film,
    'netflix': Film,
    'streaming': Film,
    
    // Salud
    'salud': Heart,
    'médico': Heart,
    'medico': Heart,
    'farmacia': Heart,
    'medicina': Heart,
    'seguro': Shield,
    'gimnasio': Heart,
    
    // Ropa y Moda
    'ropa': Shirt,
    'moda': Shirt,
    'zapatos': Shirt,
    'accesorios': Shirt,
    
    // Tecnología
    'tecnología': Smartphone,
    'tecnologia': Smartphone,
    'electrónica': Smartphone,
    'electronica': Smartphone,
    'teléfono': Phone,
    'telefono': Phone,
    'móvil': Smartphone,
    'movil': Smartphone,
    'internet': Wifi,
    'wifi': Wifi,
    'ordenador': Smartphone,
    
    // Familia
    'familia': Users,
    'hijos': Users,
    'niños': Users,
    'esposa': Users,
    'esposo': Users,
    'padres': Users,
    
    // Educación
    'educación': Book,
    'educacion': Book,
    'libros': Book,
    
    // Trabajo
    'trabajo': Briefcase,
    'oficina': Briefcase,
    
    // Finanzas
    'ahorro': TrendingUpIcon,
    'inversión': TrendingUpIcon,
    'inversion': TrendingUpIcon,
    
    // Servicios
    'luz': Zap,
    'electricidad': Zap,
    'agua': Zap,
    'gas': Zap,
    
    // Restaurantes y Café
    'restaurante': Utensils,
    'comer fuera': Utensils,
    'café': Coffee,
    'cafe': Coffee,
    'bar': Coffee,
    
    // Regalos
    'regalos': Gift,
    'cumpleaños': Gift,
    'navidad': Gift,
    
    // Otros
    'otros': MoreHorizontal,
    'varios': MoreHorizontal,
  };
  
  if (!categoria) return DollarSign;
  
  const categoriaLower = categoria.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (iconMap[categoriaLower]) {
    return iconMap[categoriaLower];
  }
  
  // Buscar coincidencia parcial
  for (const key in iconMap) {
    if (categoriaLower.includes(key) || key.includes(categoriaLower)) {
      return iconMap[key];
    }
  }
  
  return DollarSign; // Icono por defecto
};

// Componente principal
export default function GraficoGastos({ modo = 'mesActual' }) {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const { 
    gastosPorCategoriaMesActual,
    totalMesActual,
    gastosPorCategoria,
    totalGastosFiltrados,
    formatearMesTexto,
    mesActual,
    filtroMes
  } = useGastos();

  // Seleccionar los datos según el modo
  const { datos, mesTexto, total } = useMemo(() => {
    switch (modo) {
      case 'filtrados':
        const porCategoriaFiltrados = gastosPorCategoria || {};
        const totalFiltrados = totalGastosFiltrados || 0;
        return {
          datos: porCategoriaFiltrados,
          mesTexto: filtroMes ? formatearMesTexto(filtroMes) : 'Gastos filtrados',
          total: totalFiltrados
        };
      
      case 'mesActual':
      default:
        const porCategoriaMes = gastosPorCategoriaMesActual || {};
        const totalMes = totalMesActual || 0;
        return {
          datos: porCategoriaMes,
          mesTexto: formatearMesTexto(mesActual),
          total: totalMes
        };
    }
  }, [modo, gastosPorCategoriaMesActual, totalMesActual, gastosPorCategoria, 
      totalGastosFiltrados, filtroMes, formatearMesTexto, mesActual]);

  // Preparar datos para el gráfico - CON COLORES ÚNICOS POR CATEGORÍA
  const dataParaGrafico = useMemo(() => {
    const categoriasUnicas = Object.keys(datos);
    
    // Crear un mapa de colores únicos por categoría
    const colorMap = {};
    categoriasUnicas.forEach(categoria => {
      colorMap[categoria] = generateCategoryColor(categoria);
    });
    
    return categoriasUnicas
      .sort((a, b) => datos[b] - datos[a])
      .map((categoria, index) => ({
        name: categoria,
        value: datos[categoria],
        color: colorMap[categoria], // Color único basado en el nombre
        icon: getIconForCategoria(categoria),
        porcentaje: total > 0 ? (datos[categoria] / total) * 100 : 0
      }));
  }, [datos, total]);

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
            <p className="text-sm font-semibold text-white capitalize">{data.name.toLowerCase()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-white">€{data.value.toFixed(2)}</p>
            <p className="text-sm text-slate-300">
              {data.porcentaje.toFixed(1)}% del total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Si no hay datos
  if (dataParaGrafico.length === 0) {
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
            {mesTexto} • Sin datos disponibles
          </p>
        </CardHeader>
        <CardContent className="text-center py-12">
          <DollarSign className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No hay gastos registrados</p>
          <p className="text-sm text-slate-500 mt-1">Añade gastos para ver el gráfico</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-blue-900/30 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          Distribución de Gastos
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1">
          <p className="text-sm text-slate-400">
            {mesTexto} • {dataParaGrafico.length} categorías
          </p>
          <p className="text-sm font-semibold text-red-400">
            Total: €{total.toFixed(2)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* GRÁFICO PIE */}
        <motion.div
          className="h-72 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataParaGrafico}
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
                {dataParaGrafico.map((entry, index) => (
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
              
              {/* Leyenda simple */}
              <Legend 
                content={() => (
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {dataParaGrafico.slice(0, 3).map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 rounded-md"
                      >
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-slate-300 capitalize">
                          {item.name.toLowerCase()}
                        </span>
                      </div>
                    ))}
                    {dataParaGrafico.length > 3 && (
                      <div className="px-2 py-1 bg-slate-800/50 rounded-md text-xs text-slate-400">
                        +{dataParaGrafico.length - 3} más
                      </div>
                    )}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* LEYENDA DETALLADA */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-300">Detalle por categoría</h3>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {dataParaGrafico.length} categorías
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
            {dataParaGrafico.map((item, index) => {
              const Icon = item.icon;
              const porcentaje = item.porcentaje;

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
                      <span className="text-xs font-medium text-white truncate block capitalize">
                        {item.name.toLowerCase()}
                      </span>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
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
                      €{item.value.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {porcentaje.toFixed(1)}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RESUMEN RÁPIDO */}
          <div className="pt-3 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400">Mayor gasto</div>
                {dataParaGrafico.length > 0 && (
                  <div className="flex items-center justify-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: dataParaGrafico[0].color }}
                    />
                    <div className="text-sm font-medium text-white truncate capitalize">
                      {dataParaGrafico[0].name.toLowerCase()}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400">Promedio/cat</div>
                <div className="text-sm font-medium text-slate-300">
                  €{(total / dataParaGrafico.length).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}