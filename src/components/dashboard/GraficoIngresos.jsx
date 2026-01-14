import { useState, useMemo, useEffect } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

// ICONOS LUCIDE REACT MODERNOS para ingresos
import { 
  TrendingUp,
  DollarSign,
  MoreHorizontal,
  Wallet,
  CreditCard,
  TrendingUp as TrendingUpIcon,
  Briefcase,
  Smartphone,
  Users,
  Gift,
  Zap,
  Home,
  Book,
  Heart,
  ShoppingCart,
  Car,
  Film,
  Shirt,
  Coffee,
  Utensils,
  Wifi,
  Phone,
  Shield,
  TrendingDown
} from 'lucide-react'

// PALETA DE COLORES VARIADA PARA INGRESOS
const generateCategoryColor = (categoryName) => {
  // Hash simple basado en el nombre para consistencia
  const hash = categoryName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Paleta variada pero con predominio de tonos verdes para ingresos
  const colorMap = {
    // Sueldos y nóminas: Verdes
    'sueldo': '#10b981',
    'salario': '#059669',
    'nómina': '#047857',
    'nomina': '#065f46',
    'empleo': '#064e3b',
    'trabajo': '#0f766e',
    
    // Freelance/Consultoría: Azules
    'freelance': '#3b82f6',
    'consultoría': '#2563eb',
    'consultoria': '#1d4ed8',
    'independiente': '#1e40af',
    'autónomo': '#1e3a8a',
    'autonomo': '#1e3a8a',
    
    // Inversiones: Esmeraldas
    'inversión': '#34d399',
    'inversion': '#10b981',
    'dividendos': '#059669',
    'bolsa': '#047857',
    'acciones': '#065f46',
    'cripto': '#059669',
    
    // Ventas: Verdes lima
    'ventas': '#84cc16',
    'venta': '#65a30d',
    'ecommerce': '#4d7c0f',
    'tienda': '#3f6212',
    'online': '#365314',
    
    // Alquiler/Propiedades: Turquesas
    'alquiler': '#14b8a6',
    'renta': '#0d9488',
    'propiedad': '#0f766e',
    'inmueble': '#115e59',
    'hipoteca': '#134e4a',
    
    // Bonos/Extras: Amarillos/Naranjas
    'bonus': '#f59e0b',
    'extra': '#d97706',
    'extras': '#b45309',
    'propina': '#92400e',
    'comisión': '#78350f',
    'comision': '#78350f',
    'incentivo': '#fbbf24',
    
    // Subsidios/Ayudas: Violetas
    'subsidio': '#8b5cf6',
    'ayuda': '#7c3aed',
    'beca': '#6d28d9',
    'subvención': '#5b21b6',
    'subvencion': '#5b21b6',
    
    // Reembolsos: Cian
    'reembolso': '#06b6d4',
    'devolución': '#0891b2',
    'devolucion': '#0e7490',
    'reintegro': '#155e75',
    
    // Educación/Formación: Índigos
    'educación': '#6366f1',
    'educacion': '#4f46e5',
    'curso': '#4338ca',
    'formación': '#3730a3',
    'formacion': '#3730a3',
    'capacitación': '#312e81',
    'capacitacion': '#312e81',
    
    // Regalos/Herencia: Rosas
    'regalo': '#ec4899',
    'regalos': '#db2777',
    'herencia': '#be185d',
    'donación': '#9d174d',
    'donacion': '#9d174d',
    
    // Otros ingresos: Variados
    'otros': '#94a3b8',
    'varios': '#64748b',
    'misceláneo': '#475569',
    'miscelaneo': '#334155',
    'diversos': '#1e293b',
    'ingreso': '#10b981',
  };
  
  // Convertir a minúsculas y sin acentos
  const normalized = categoryName.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  
  // Buscar coincidencia exacta primero
  if (colorMap[normalized]) {
    return colorMap[normalized];
  }
  
  // Buscar coincidencia parcial en las claves
  for (const [key, color] of Object.entries(colorMap)) {
    // Verificar si la categoría contiene la palabra clave o viceversa
    if (normalized.includes(key) || key.includes(normalized)) {
      return color;
    }
  }
  
  // Si no se encuentra, generar color basado en hash con variedad
  // Usamos diferentes rangos de colores según el hash
  const hashNum = Math.abs(hash);
  
  // Asignar diferentes paletas según el módulo del hash
  const colorGroups = [
    // Verdes (40%)
    ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#0f766e', '#134e4a'],
    // Azules (20%)
    ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
    // Esmeraldas (15%)
    ['#34d399', '#10b981', '#059669', '#047857'],
    // Turquesas (10%)
    ['#14b8a6', '#0d9488', '#0f766e', '#115e59'],
    // Amarillos/Naranjas (10%)
    ['#f59e0b', '#d97706', '#b45309', '#92400e'],
    // Violetas (5%)
    ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6'],
  ];
  
  const groupIndex = hashNum % colorGroups.length;
  const colorIndex = hashNum % colorGroups[groupIndex].length;
  
  return colorGroups[groupIndex][colorIndex];
};

// Configuración FLEXIBLE de iconos por categoría (para ingresos)
const getIconForCategoria = (categoria) => {
  const iconMap = {
    // Sueldos y Empleo
    'sueldo': Wallet,
    'salario': Wallet,
    'nómina': Wallet,
    'nomina': Wallet,
    'empleo': Briefcase,
    'trabajo': Briefcase,
    'contrato': Briefcase,
    
    // Freelance/Independiente
    'freelance': Smartphone,
    'consultoría': Users,
    'consultoria': Users,
    'independiente': TrendingUpIcon,
    'autónomo': TrendingUpIcon,
    'autonomo': TrendingUpIcon,
    'proyecto': Briefcase,
    
    // Inversiones
    'inversión': TrendingUpIcon,
    'inversion': TrendingUpIcon,
    'dividendos': TrendingUpIcon,
    'bolsa': TrendingUpIcon,
    'acciones': TrendingUpIcon,
    'cripto': TrendingUpIcon,
    'fondos': TrendingUpIcon,
    
    // Ventas
    'ventas': ShoppingCart,
    'venta': ShoppingCart,
    'ecommerce': ShoppingCart,
    'tienda': ShoppingCart,
    'online': ShoppingCart,
    'mercado': ShoppingCart,
    
    // Alquiler/Propiedades
    'alquiler': Home,
    'renta': Home,
    'propiedad': Home,
    'inmueble': Home,
    'hipoteca': Home,
    'arrendamiento': Home,
    
    // Bonos y Extras
    'bonus': Gift,
    'extra': Zap,
    'extras': Zap,
    'propina': DollarSign,
    'comisión': CreditCard,
    'comision': CreditCard,
    'incentivo': Gift,
    'premio': Gift,
    
    // Subsidios/Becas
    'subsidio': Shield,
    'ayuda': Shield,
    'beca': Book,
    'subvención': Shield,
    'subvencion': Shield,
    
    // Reembolsos
    'reembolso': CreditCard,
    'devolución': CreditCard,
    'devolucion': CreditCard,
    'reintegro': CreditCard,
    
    // Educación
    'educación': Book,
    'educacion': Book,
    'curso': Book,
    'formación': Book,
    'formacion': Book,
    'capacitación': Book,
    'capacitacion': Book,
    
    // Regalos/Herencia
    'regalo': Gift,
    'regalos': Gift,
    'herencia': Gift,
    'donación': Gift,
    'donacion': Gift,
    
    // Otros
    'otros': MoreHorizontal,
    'varios': MoreHorizontal,
    'misceláneo': MoreHorizontal,
    'miscelaneo': MoreHorizontal,
    'diversos': MoreHorizontal,
    'ingreso': DollarSign,
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
export default function GraficoIngresos({ modo = 'mesActual' }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroMes, setFiltroMes] = useState('');

  // Obtener datos de la API de ingresos
  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const res = await fetch('/api/ingresos');
        if (!res.ok) throw new Error('Error cargando ingresos');
        const data = await res.json();
        setIngresos(data);
      } catch (err) {
        console.error('Error fetching ingresos:', err);
        // Datos de ejemplo como fallback con variedad de categorías
        setIngresos([
          { id: 1, fecha: '2025-10-01', concepto: 'Salario mensual', metodo: 'Transferencia', categoria: 'Sueldo', cuenta: 'BBVA', monto: 2500 },
          { id: 2, fecha: '2025-10-05', concepto: 'Trabajo freelance', metodo: 'PayPal', categoria: 'Freelance', cuenta: 'PayPal', monto: 450 },
          { id: 3, fecha: '2025-10-10', concepto: 'Venta de artículos', metodo: 'Bizum', categoria: 'Ventas', cuenta: 'Revolut', monto: 120 },
          { id: 4, fecha: '2025-10-15', concepto: 'Consultoría proyecto', metodo: 'Transferencia', categoria: 'Consultoría', cuenta: 'BBVA', monto: 800 },
          { id: 5, fecha: '2025-10-20', concepto: 'Propinas restaurante', metodo: 'Efectivo', categoria: 'Propinas', cuenta: 'Efectivo', monto: 85 },
          { id: 6, fecha: '2025-10-25', concepto: 'Dividendos inversiones', metodo: 'Transferencia', categoria: 'Inversiones', cuenta: 'BBVA', monto: 300 },
          { id: 7, fecha: '2025-10-28', concepto: 'Bonus trimestral', metodo: 'Transferencia', categoria: 'Bonus', cuenta: 'BBVA', monto: 500 },
          { id: 8, fecha: '2025-10-30', concepto: 'Alquiler local', metodo: 'Transferencia', categoria: 'Alquiler', cuenta: 'BBVA', monto: 700 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  // Función para formatear mes a texto
  const formatearMesTexto = (mesFormato) => {
    if (!mesFormato) return '';
    const [año, mes] = mesFormato.split('-');
    const fecha = new Date(año, parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    }).replace(/^\w/, c => c.toUpperCase());
  };

  // Obtener mes actual en formato YYYY-MM
  const mesActual = useMemo(() => {
    const ahora = new Date();
    return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  // Calcular ingresos por categoría
  const calcularIngresosPorCategoria = useMemo(() => {
    const ingresosFiltrados = ingresos.filter(ingreso => {
      if (!ingreso.fecha) return false;
      const fecha = new Date(ingreso.fecha);
      const mesIngreso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      switch (modo) {
        case 'filtrados':
          return !filtroMes || mesIngreso === filtroMes;
        case 'mesActual':
        default:
          return mesIngreso === mesActual;
      }
    });

    // Agrupar por categoría
    const porCategoria = {};
    let total = 0;
    
    ingresosFiltrados.forEach(ingreso => {
      const categoria = ingreso.categoria || 'Otros';
      porCategoria[categoria] = (porCategoria[categoria] || 0) + (ingreso.monto || 0);
      total += ingreso.monto || 0;
    });

    return { porCategoria, total };
  }, [ingresos, modo, filtroMes, mesActual]);

  // Calcular distribución por cuenta (Efectivo vs BBVA)
  const distribucionPorCuenta = useMemo(() => {
    const ingresosFiltrados = ingresos.filter(ingreso => {
      if (!ingreso.fecha) return false;
      const fecha = new Date(ingreso.fecha);
      const mesIngreso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      switch (modo) {
        case 'filtrados':
          return !filtroMes || mesIngreso === filtroMes;
        case 'mesActual':
        default:
          return mesIngreso === mesActual;
      }
    });

    let efectivo = 0;
    let bbva = 0;
    let otrasCuentas = 0;
    
    ingresosFiltrados.forEach(ingreso => {
      const cuenta = ingreso.cuenta?.toLowerCase() || '';
      const monto = ingreso.monto || 0;
      
      if (cuenta.includes('efectivo') || cuenta === 'efectivo') {
        efectivo += monto;
      } else if (cuenta.includes('bbva')) {
        bbva += monto;
      } else {
        otrasCuentas += monto;
      }
    });

    const total = efectivo + bbva + otrasCuentas;
    
    return {
      efectivo,
      bbva,
      otrasCuentas,
      total,
      porcentajeEfectivo: total > 0 ? (efectivo / total) * 100 : 0,
      porcentajeBBVA: total > 0 ? (bbva / total) * 100 : 0,
      porcentajeOtras: total > 0 ? (otrasCuentas / total) * 100 : 0,
    };
  }, [ingresos, modo, filtroMes, mesActual]);

  // Preparar datos para el gráfico
  const { datos, mesTexto, total } = useMemo(() => {
    const { porCategoria, total: totalCalculado } = calcularIngresosPorCategoria;
    
    let mesTextoCalculado = '';
    switch (modo) {
      case 'filtrados':
        mesTextoCalculado = filtroMes ? formatearMesTexto(filtroMes) : 'Ingresos filtrados';
        break;
      case 'mesActual':
      default:
        mesTextoCalculado = formatearMesTexto(mesActual);
        break;
    }

    return {
      datos: porCategoria,
      mesTexto: mesTextoCalculado,
      total: totalCalculado
    };
  }, [calcularIngresosPorCategoria, modo, filtroMes, mesActual]);

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
        color: colorMap[categoria],
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
            <p className="text-xl font-bold text-emerald-400">€{data.value.toFixed(2)}</p>
            <p className="text-sm text-slate-300">
              {data.porcentaje.toFixed(1)}% del total
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            Distribución de Ingresos
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando ingresos...</p>
        </CardContent>
      </Card>
    );
  }

  // Si no hay datos
  if (dataParaGrafico.length === 0) {
    return (
      <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            Distribución de Ingresos
          </CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            {mesTexto} • Sin datos disponibles
          </p>
        </CardHeader>
        <CardContent className="text-center py-12">
          <DollarSign className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No hay ingresos registrados</p>
          <p className="text-sm text-slate-500 mt-1">Añade ingresos para ver el gráfico</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-2 bg-emerald-900/30 rounded-lg">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          Distribución de Ingresos
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1">
          <p className="text-sm text-slate-400">
            {mesTexto} • {dataParaGrafico.length} categorías
          </p>
          <p className="text-sm font-semibold text-emerald-400">
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

        {/* DISTRIBUCIÓN POR CUENTA (EFECTIVO vs BBVA) */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-400" />
            Distribución por cuenta
          </h3>
          <div className="space-y-3">
            {/* Barra de efectivo */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-slate-300">Efectivo</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-300">€{distribucionPorCuenta.efectivo.toFixed(2)}</span>
                  <span className="text-emerald-400 text-xs ml-2">
                    ({distribucionPorCuenta.porcentajeEfectivo.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(distribucionPorCuenta.porcentajeEfectivo, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Barra de BBVA */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-slate-300">BBVA</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-300">€{distribucionPorCuenta.bbva.toFixed(2)}</span>
                  <span className="text-blue-400 text-xs ml-2">
                    ({distribucionPorCuenta.porcentajeBBVA.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-400 transition-all duration-300"
                  style={{ width: `${Math.min(distribucionPorCuenta.porcentajeBBVA, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Barra de otras cuentas */}
            {distribucionPorCuenta.otrasCuentas > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span className="text-slate-300">Otras cuentas</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-300">€{distribucionPorCuenta.otrasCuentas.toFixed(2)}</span>
                    <span className="text-slate-400 text-xs ml-2">
                      ({distribucionPorCuenta.porcentajeOtras.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-slate-400 transition-all duration-300"
                    style={{ width: `${Math.min(distribucionPorCuenta.porcentajeOtras, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Resumen */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700">
              <div className="text-center p-2 bg-emerald-900/20 rounded-lg">
                <div className="text-xs text-emerald-400">Efectivo</div>
                <div className="text-sm font-semibold text-emerald-300">
                  €{distribucionPorCuenta.efectivo.toFixed(0)}
                </div>
              </div>
              <div className="text-center p-2 bg-blue-900/20 rounded-lg">
                <div className="text-xs text-blue-400">BBVA</div>
                <div className="text-sm font-semibold text-blue-300">
                  €{distribucionPorCuenta.bbva.toFixed(0)}
                </div>
              </div>
              <div className="text-center p-2 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-400">Total</div>
                <div className="text-sm font-semibold text-slate-300">
                  €{distribucionPorCuenta.total.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    <div className="text-xs font-semibold text-emerald-300">
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
                <div className="text-xs text-slate-400">Mayor ingreso</div>
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
                <div className="text-sm font-medium text-emerald-300">
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