import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useGastos } from '@/contexts/GastosContext'
import { useMemo } from 'react'

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
  ShoppingBag,
  Smartphone,
  Users,
  House,
  BookOpen,
  Music,
  Gamepad2,
  Plane,
  Train,
  Bus,
  CarTaxiFront,
  Dumbbell,
  Stethoscope,
  Pill,
  Baby,
  GraduationCap,
  Briefcase,
  Wallet,
  CreditCard,
  Banknote,
  Coins,
  PiggyBank,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react'

// Configuración FLEXIBLE de iconos por categoría
const getIconForCategoria = (categoria) => {
  const iconMap = {
    // Vivienda y Alquiler
    'alquiler': Home,
    'vivienda': Home,
    'hipoteca': Home,
    'casa': Home,
    'hogar': House,
    
    // Alimentación
    'alimentación': ShoppingCart,
    'alimentacion': ShoppingCart,
    'comida': ShoppingCart,
    'mercado': ShoppingCart,
    'supermercado': ShoppingCart,
    'grocery': ShoppingCart,
    
    // Transporte
    'transporte': Car,
    'gasolina': Car,
    'combustible': Car,
    'parking': Car,
    'estacionamiento': Car,
    'taxi': CarTaxiFront,
    'uber': CarTaxiFront,
    'autobús': Bus,
    'autobus': Bus,
    'bus': Bus,
    'tren': Train,
    'metro': Train,
    'avión': Plane,
    'avion': Plane,
    'vuelo': Plane,
    
    // Entretenimiento
    'entretenimiento': Film,
    'cine': Film,
    'películas': Film,
    'peliculas': Film,
    'netflix': Film,
    'streaming': Film,
    'música': Music,
    'musica': Music,
    'spotify': Music,
    'videojuegos': Gamepad2,
    'juegos': Gamepad2,
    'ocio': Gamepad2,
    
    // Salud
    'salud': Heart,
    'médico': Stethoscope,
    'medico': Stethoscope,
    'farmacia': Pill,
    'medicina': Pill,
    'seguro': Shield,
    'gimnasio': Dumbbell,
    'deporte': Dumbbell,
    'fitness': Dumbbell,
    
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
    'laptop': Smartphone,
    
    // Familia
    'familia': Users,
    'hijos': Baby,
    'niños': Baby,
    'esposa': Users,
    'esposo': Users,
    'padres': Users,
    
    // Educación
    'educación': BookOpen,
    'educacion': BookOpen,
    'libros': BookOpen,
    'curso': BookOpen,
    'universidad': GraduationCap,
    'colegio': GraduationCap,
    
    // Trabajo
    'trabajo': Briefcase,
    'oficina': Briefcase,
    'negocio': Briefcase,
    
    // Finanzas
    'ahorro': PiggyBank,
    'inversión': TrendingUpIcon,
    'inversion': TrendingUpIcon,
    'bolsa': TrendingUpIcon,
    'impuestos': Banknote,
    'tasa': Banknote,
    
    // Servicios
    'luz': Zap,
    'electricidad': Zap,
    'agua': Zap,
    'gas': Zap,
    'agua y luz': Zap,
    
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
    'aniversario': Gift,
    
    // Otros
    'otros': MoreHorizontal,
    'varios': MoreHorizontal,
    'misceláneo': MoreHorizontal,
    'miscelaneo': MoreHorizontal,
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
  
  // Si no encuentra, buscar por primeras letras
  const palabras = categoriaLower.split(' ');
  for (const palabra of palabras) {
    if (iconMap[palabra]) {
      return iconMap[palabra];
    }
  }
  
  return DollarSign; // Icono por defecto
};

// COLORES FLEXIBLES por categoría
const getColorForCategoria = (categoria) => {
  const colorMap = {
    // Vivienda: Azules
    'alquiler': '#3b82f6',
    'vivienda': '#3b82f6',
    'hipoteca': '#2563eb',
    'hogar': '#1d4ed8',
    
    // Alimentación: Verdes
    'alimentación': '#10b981',
    'alimentacion': '#10b981',
    'comida': '#059669',
    'mercado': '#047857',
    
    // Transporte: Amarillos/Naranjas
    'transporte': '#f59e0b',
    'gasolina': '#d97706',
    'taxi': '#b45309',
    'autobús': '#92400e',
    
    // Entretenimiento: Violetas
    'entretenimiento': '#8b5cf6',
    'cine': '#7c3aed',
    'música': '#6d28d9',
    'videojuegos': '#5b21b6',
    
    // Salud: Rojos
    'salud': '#ef4444',
    'médico': '#dc2626',
    'farmacia': '#b91c1c',
    'gimnasio': '#991b1b',
    
    // Ropa: Rosas
    'ropa': '#ec4899',
    'moda': '#db2777',
    'zapatos': '#be185d',
    
    // Tecnología: Índigo
    'tecnología': '#6366f1',
    'tecnologia': '#6366f1',
    'teléfono': '#4f46e5',
    'internet': '#4338ca',
    
    // Familia: Rosa claro
    'familia': '#f472b6',
    'hijos': '#f9a8d4',
    
    // Educación: Cian
    'educación': '#06b6d4',
    'educacion': '#06b6d4',
    'libros': '#0891b2',
    
    // Trabajo: Gris
    'trabajo': '#6b7280',
    'oficina': '#4b5563',
    
    // Finanzas: Verde lima
    'ahorro': '#84cc16',
    'inversión': '#65a30d',
    
    // Servicios: Amarillo
    'luz': '#fbbf24',
    'agua': '#f59e0b',
    
    // Restaurantes: Índigo
    'restaurante': '#6366f1',
    'café': '#8b5cf6',
    
    // Regalos: Turquesa
    'regalos': '#14b8a6',
    'cumpleaños': '#0d9488',
    
    // Otros: Gris neutro
    'otros': '#94a3b8',
    'varios': '#64748b',
  };
  
  if (!categoria) return '#94a3b8';
  
  const categoriaLower = categoria.toLowerCase().trim();
  
  // Buscar coincidencia exacta
  if (colorMap[categoriaLower]) {
    return colorMap[categoriaLower];
  }
  
  // Buscar coincidencia parcial
  for (const key in colorMap) {
    if (categoriaLower.includes(key) || key.includes(categoriaLower)) {
      return colorMap[key];
    }
  }
  
  // Buscar por primeras letras
  const palabras = categoriaLower.split(' ');
  for (const palabra of palabras) {
    if (colorMap[palabra]) {
      return colorMap[palabra];
    }
  }
  
  return '#94a3b8'; // Color por defecto
};

// Prop para controlar qué datos mostrar
interface ResumenGastosProps {
  modo?: 'mesActual' | 'filtrados' | 'todos';
  titulo?: string;
}

export default function ResumenGastos({ 
  modo = 'mesActual',
  titulo = 'Resumen de Gastos'
}: ResumenGastosProps) {
  const { 
    // Datos del mes actual
    gastosMesActual,
    totalMesActual,
    gastosPorCategoriaMesActual,
    
    // Datos filtrados
    gastosFiltrados,
    totalGastosFiltrados,
    gastosPorCategoria,
    
    // Datos completos
    todosLosGastos,
    
    // Funciones
    formatearMesTexto,
    mesActual,
    filtroMes
  } = useGastos();

  // Seleccionar los datos según el modo
  const { datos, mesTexto } = useMemo(() => {
    switch (modo) {
      case 'filtrados':
        return {
          datos: {
            gastos: gastosFiltrados,
            total: totalGastosFiltrados,
            porCategoria: gastosPorCategoria,
          },
          mesTexto: filtroMes ? formatearMesTexto(filtroMes) : 'Gastos filtrados'
        };
      
      case 'todos':
        const totalTodos = todosLosGastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
        const porCategoriaTodos = {};
        todosLosGastos.forEach(gasto => {
          const cat = gasto.categoria || 'Otros';
          porCategoriaTodos[cat] = (porCategoriaTodos[cat] || 0) + (gasto.monto || 0);
        });
        
        return {
          datos: {
            gastos: todosLosGastos,
            total: totalTodos,
            porCategoria: porCategoriaTodos,
          },
          mesTexto: 'Todos los gastos históricos'
        };
      
      case 'mesActual':
      default:
        return {
          datos: {
            gastos: gastosMesActual,
            total: totalMesActual,
            porCategoria: gastosPorCategoriaMesActual,
          },
          mesTexto: formatearMesTexto(mesActual)
        };
    }
  }, [modo, gastosFiltrados, totalGastosFiltrados, gastosPorCategoria, todosLosGastos, 
      gastosMesActual, totalMesActual, gastosPorCategoriaMesActual, filtroMes, 
      formatearMesTexto, mesActual]);

  const { gastos, total, porCategoria } = datos;
  
  // Calcular categoría con mayor gasto
  const categoriaMayorGasto = useMemo(() => {
    return Object.entries(porCategoria).reduce((max, [cat, monto]) => 
      monto > max.monto ? { categoria: cat, monto } : max, 
      { categoria: '', monto: 0 }
    );
  }, [porCategoria]);
  
  const porcentajeMayorGasto = total > 0 ? (categoriaMayorGasto.monto / total) * 100 : 0;

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
            {titulo}
            <span className="text-xs font-normal text-slate-400 ml-2">
              ({mesTexto})
            </span>
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
            {gastos.length} transacciones
          </p>
        </motion.div>
      </CardHeader>
     
      <CardContent className="space-y-4">
        {/* INSIGHTS RÁPIDOS */}
        {categoriaMayorGasto.categoria && total > 0 && (
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
                    backgroundColor: getColorForCategoria(categoriaMayorGasto.categoria)
                  }}
                ></div>
                <span className="text-sm text-slate-300 capitalize">
                  {categoriaMayorGasto.categoria.toLowerCase()}
                </span>
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
          
          {Object.keys(porCategoria).length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay gastos registrados</p>
              <p className="text-xs mt-1">Usa filtros diferentes o espera a tener datos</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {Object.entries(porCategoria)
                .sort(([, montoA], [, montoB]) => montoB - montoA)
                .map(([categoria, monto], index) => {
                  const Icon = getIconForCategoria(categoria);
                  const color = getColorForCategoria(categoria);
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
                          <span className="text-sm font-medium text-white truncate block capitalize">
                            {categoria.toLowerCase()}
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
          )}
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
                {gastos.length || 0}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}