import { useState, useMemo, useEffect } from 'react';
import FilaIngreso from './FilaIngreso';

// ICONOS LUCIDE REACT para ingresos (paleta verde)
import { 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  Database,
  Tag,
  CreditCard,
  Bell,
  ChevronDown,
  FileText,
  Wallet,
  AlertCircle,
  DollarSign,
  Receipt,
  Landmark,
  Sparkles,
  Banknote,
  Gift,
  Briefcase,
  Coins,
  Target,
  BarChart3,
  TrendingDown,
  Lightbulb,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Percent,
  PieChart,
  AlertTriangle,
  Zap,
  Shield,
  Thermometer,
  Home,
  ShoppingBag,
  Utensils,
  Heart,
  Repeat,
  Target as TargetIcon,
  CheckCircle
} from 'lucide-react';

export default function TablaIngresos() {
  // Estados para los datos de Notion
  const [ingresosMensuales, setIngresosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros existentes
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Fetch de datos desde Notion API
  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const res = await fetch('/api/ingresos');
        if (!res.ok) throw new Error('Error cargando ingresos');
        const data = await res.json();
        setIngresosMensuales(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching ingresos:', err);
        
        // Datos de ejemplo mejorados
        setIngresosMensuales([
          { id: 1, fecha: '2025-10-01', concepto: 'Salario mensual', metodo: 'Transferencia', categoria: 'Sueldo', cuenta: 'BBVA', monto: 2500 },
          { id: 2, fecha: '2025-10-05', concepto: 'Trabajo freelance', metodo: 'PayPal', categoria: 'Freelance', cuenta: 'PayPal', monto: 450 },
          { id: 3, fecha: '2025-10-10', concepto: 'Venta de artículos', metodo: 'Bizum', categoria: 'Ventas', cuenta: 'Revolut', monto: 120 },
          { id: 4, fecha: '2025-10-15', concepto: 'Consultoría', metodo: 'Transferencia', categoria: 'Freelance', cuenta: 'BBVA', monto: 800 },
          { id: 5, fecha: '2025-10-20', concepto: 'Propinas', metodo: 'Efectivo', categoria: 'Extras', cuenta: 'Efectivo', monto: 85 },
          { id: 6, fecha: '2025-10-25', concepto: 'Inversiones', metodo: 'Transferencia', categoria: 'Inversiones', cuenta: 'BBVA', monto: 300 },
          { id: 7, fecha: '2025-10-28', concepto: 'Reembolso', metodo: 'Tarjeta', categoria: 'Reembolsos', cuenta: 'Santander', monto: 150 },
          { id: 8, fecha: '2025-09-01', concepto: 'Salario mensual', metodo: 'Transferencia', categoria: 'Sueldo', cuenta: 'BBVA', monto: 2400 },
          { id: 9, fecha: '2025-09-10', concepto: 'Freelance diseño', metodo: 'PayPal', categoria: 'Freelance', cuenta: 'PayPal', monto: 600 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  // ========== FUNCIONES PARA DATOS DINÁMICOS ==========

  // [Todas las funciones de obtención de datos dinámicos permanecen igual...]
  // (obtenerMesesDisponibles, metodosRecepcionDisponibles, etc.)

  // ========== CÁLCULOS PRINCIPALES MEJORADOS ==========

  // 1. Total
  const total = ingresosFiltrados.reduce((sum, ingreso) => sum + ingreso.monto, 0);

  // 2. Calcular estadísticas por categoría con clasificación
  const estadisticasCategorias = useMemo(() => {
    const categorias = {};
    
    ingresosFiltrados.forEach(ingreso => {
      if (!categorias[ingreso.categoria]) {
        categorias[ingreso.categoria] = {
          total: 0,
          count: 0,
          promedio: 0,
          porcentaje: 0,
          tipo: 'variable' // Valor por defecto
        };
      }
      categorias[ingreso.categoria].total += ingreso.monto;
      categorias[ingreso.categoria].count += 1;
    });
    
    // Calcular promedio y porcentaje
    Object.keys(categorias).forEach(categoria => {
      categorias[categoria].promedio = categorias[categoria].total / categorias[categoria].count;
      categorias[categoria].porcentaje = (categorias[categoria].total / total) * 100;
      
      // Determinar tipo de ingreso (FIJO vs VARIABLE)
      const categoriasFijas = ['Sueldo', 'Pensión', 'Alquiler recibido', 'Subsidio'];
      const categoriasVariables = ['Freelance', 'Ventas', 'Inversiones', 'Propinas', 'Extras', 'Reembolsos'];
      
      if (categoriasFijas.includes(categoria)) {
        categorias[categoria].tipo = 'fijo';
      } else if (categoriasVariables.includes(categoria)) {
        categorias[categoria].tipo = 'variable';
      } else {
        // Si no está en las listas, determinar por frecuencia
        if (categorias[categoria].count >= 2) {
          categorias[categoria].tipo = 'fijo';
        } else {
          categorias[categoria].tipo = 'variable';
        }
      }
    });
    
    return categorias;
  }, [ingresosFiltrados, total]);

  // 3. Análisis de ingresos FIJOS vs VARIABLES
  const analisisTiposIngresos = useMemo(() => {
    let fijos = 0;
    let variables = 0;
    
    Object.entries(estadisticasCategorias).forEach(([_, datos]) => {
      if (datos.tipo === 'fijo') {
        fijos += datos.total;
      } else {
        variables += datos.total;
      }
    });
    
    const totalCalculado = fijos + variables;
    return {
      fijos,
      variables,
      porcentajeFijos: totalCalculado > 0 ? (fijos / totalCalculado) * 100 : 0,
      porcentajeVariables: totalCalculado > 0 ? (variables / totalCalculado) * 100 : 0,
      estabilidad: totalCalculado > 0 && fijos >= 0.6 * totalCalculado ? 'Alta' : 'Media'
    };
  }, [estadisticasCategorias]);

  // 4. Calcular categoría principal con más detalles
  const categoriaPrincipal = useMemo(() => {
    const categorias = Object.entries(estadisticasCategorias);
    if (categorias.length === 0) return { nombre: 'N/A', monto: 0, porcentaje: 0, tipo: 'N/A' };
    
    const [nombre, datos] = categorias.sort((a, b) => b[1].total - a[1].total)[0];
    return { 
      nombre, 
      monto: datos.total,
      porcentaje: datos.porcentaje,
      tipo: datos.tipo
    };
  }, [estadisticasCategorias]);

  // 5. Análisis de frecuencia de ingresos
  const analisisFrecuencia = useMemo(() => {
    if (ingresosFiltrados.length === 0) return { promedioDiario: 0, diasConIngresos: 0, ingresoPorDia: 0 };
    
    const fechasUnicas = new Set();
    let totalDias = 0;
    
    ingresosFiltrados.forEach(ingreso => {
      if (ingreso.fecha) {
        fechasUnicas.add(ingreso.fecha.split('T')[0]); // Solo la fecha
      }
    });
    
    // Calcular promedio por día con ingresos
    const diasConIngresos = fechasUnicas.size;
    const ingresoPorDia = total / diasConIngresos;
    
    // Si tenemos filtro por mes, calcular días totales del mes
    if (filtroMes) {
      const [año, mes] = filtroMes.split('-').map(Number);
      const diasEnMes = new Date(año, mes, 0).getDate();
      totalDias = diasEnMes;
    }
    
    return {
      promedioDiario: diasConIngresos > 0 ? total / diasConIngresos : 0,
      diasConIngresos,
      ingresoPorDia,
      porcentajeDiasConIngresos: totalDias > 0 ? (diasConIngresos / totalDias) * 100 : 0
    };
  }, [ingresosFiltrados, total, filtroMes]);

  // 6. Alertas de ingresos atípicos
  const alertasIngresos = useMemo(() => {
    if (ingresosFiltrados.length < 3) return [];
    
    const alertas = [];
    
    // Calcular promedio y desviación estándar
    const montos = ingresosFiltrados.map(i => i.monto);
    const promedio = montos.reduce((a, b) => a + b, 0) / montos.length;
    const desviacion = Math.sqrt(
      montos.reduce((sq, n) => sq + Math.pow(n - promedio, 2), 0) / montos.length
    );
    
    // Buscar ingresos atípicos (más de 2 desviaciones estándar)
    ingresosFiltrados.forEach(ingreso => {
      if (ingreso.monto > promedio + (2 * desviacion)) {
        alertas.push({
          tipo: 'alto',
          mensaje: `Ingreso inusualmente alto en ${ingreso.concepto}: €${ingreso.monto.toFixed(2)}`,
          categoria: ingreso.categoria,
          monto: ingreso.monto,
          fecha: ingreso.fecha
        });
      }
    });
    
    // Verificar dependencia excesiva de una categoría
    Object.entries(estadisticasCategorias).forEach(([categoria, datos]) => {
      if (datos.porcentaje > 80) {
        alertas.push({
          tipo: 'dependencia',
          mensaje: `Dependes en un ${datos.porcentaje.toFixed(1)}% de ${categoria}`,
          categoria,
          porcentaje: datos.porcentaje
        });
      }
    });
    
    return alertas.slice(0, 3); // Máximo 3 alertas
  }, [ingresosFiltrados, estadisticasCategorias]);

  // 7. Sugerencia de crecimiento inteligente mejorada
  const sugerenciaCrecimiento = useMemo(() => {
    if (Object.keys(estadisticasCategorias).length === 0) {
      return { categoria: null, crecimientoPotencial: 0, mensaje: '', tipo: 'diversificacion' };
    }
    
    // Priorizar categorías VARIABLES para crecimiento (más fácil de aumentar)
    const categoriasVariables = Object.entries(estadisticasCategorias)
      .filter(([_, datos]) => datos.tipo === 'variable')
      .sort((a, b) => b[1].promedio - a[1].promedio);
    
    if (categoriasVariables.length > 0) {
      const [nombre, datos] = categoriasVariables[0];
      const crecimientoPotencial = datos.promedio * 2; // Duplicar frecuencia
      
      return {
        categoria: nombre,
        crecimientoPotencial,
        mensaje: `Duplica tu actividad en ${nombre} para ganar ~€${crecimientoPotencial.toFixed(0)} extra/mes`,
        tipo: 'variable',
        porcentajeCrecimiento: 100
      };
    }
    
    // Si solo hay ingresos fijos, sugerir diversificación
    const [nombre, datos] = Object.entries(estadisticasCategorias)
      .sort((a, b) => b[1].total - a[1].total)[0];
    const crecimientoPotencial = datos.total * 0.10; // 10% de crecimiento
    
    return {
      categoria: nombre,
      crecimientoPotencial,
      mensaje: `Diversifica añadiendo nuevas fuentes de ingreso, podrías ganar ~€${crecimientoPotencial.toFixed(0)} más/mes`,
      tipo: 'diversificacion',
      porcentajeCrecimiento: 10
    };
  }, [estadisticasCategorias]);

  // 8. Meta de ingresos y progreso
  const metaIngresos = useMemo(() => {
    // Calcular promedio de los últimos 3 meses para establecer una meta realista
    const meses = obtenerMesesDisponibles.slice(0, 3);
    const totalesPorMes = {};
    
    ingresosMensuales.forEach(ingreso => {
      if (ingreso.fecha) {
        const fecha = new Date(ingreso.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        
        if (meses.includes(mes)) {
          totalesPorMes[mes] = (totalesPorMes[mes] || 0) + ingreso.monto;
        }
      }
    });
    
    const valores = Object.values(totalesPorMes);
    const promedioUltimosMeses = valores.length > 0 
      ? valores.reduce((a, b) => a + b, 0) / valores.length 
      : 0;
    
    const meta = promedioUltimosMeses * 1.1; // Meta: 10% más que el promedio
    const progreso = total > 0 ? (total / meta) * 100 : 0;
    
    return {
      meta: Math.round(meta),
      progreso: Math.min(progreso, 100), // Máximo 100%
      alcanzada: total >= meta,
      diferencia: total - meta
    };
  }, [ingresosMensuales, total, obtenerMesesDisponibles]);

  // [El resto de cálculos (proximosIngresos, tendenciaMensual, etc.) permanecen igual...]

  // ========== INTERFAZ MEJORADA ==========

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER CON META DE INGRESOS */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Ingresos del Mes</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-emerald-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? formatearMesTexto(filtroMes) : 'Todos los meses'}
              </span>
              <div className={`text-sm px-3 py-1 rounded-full ${
                metaIngresos.alcanzada 
                  ? 'bg-emerald-900/30 text-emerald-400' 
                  : 'bg-amber-900/30 text-amber-400'
              }`}>
                {metaIngresos.alcanzada ? '✅ Meta alcanzada' : `Meta: €${metaIngresos.meta}`}
              </div>
            </div>
            
            {/* BARRA DE PROGRESO DE META */}
            <div className="mt-3 max-w-md">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>Progreso hacia la meta</span>
                <span>{metaIngresos.progreso.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ${
                    metaIngresos.alcanzada 
                      ? 'bg-emerald-500' 
                      : 'bg-gradient-to-r from-amber-500 to-amber-400'
                  }`}
                  style={{ width: `${metaIngresos.progreso}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* BOTÓN DE EXPORTAR */}
          <button 
            onClick={exportarCSV}
            className="group flex items-center gap-3 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/30"
          >
            <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <FileText className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* LAYOUT DE DOS COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA - FILTROS Y ANÁLISIS */}
        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
          {/* PANEL DE FILTROS */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>
            
            <div className="space-y-4">
              {/* FILTRO MES - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  Mes
                </label>
                <div className="relative">
                  <select 
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
                  >
                    <option value="">Todos los meses</option>
                    {obtenerMesesDisponibles.map((mes) => (
                      <option key={mes} value={mes}>
                        {formatearMesTexto(mes)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO MÉTODO - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  Método
                </label>
                <div className="relative">
                  <select 
                    value={filtroMetodo}
                    onChange={(e) => setFiltroMetodo(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
                  >
                    <option value="">Todos los métodos</option>
                    {metodosRecepcionDisponibles.map(metodo => (
                      <option key={metodo} value={metodo}>{metodo}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO CUENTA - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Database className="h-4 w-4 text-purple-400" />
                  Cuenta
                </label>
                <div className="relative">
                  <select 
                    value={filtroCuenta}
                    onChange={(e) => setFiltroCuenta(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
                  >
                    <option value="">Todas las cuentas</option>
                    {cuentasDisponibles.map(cuenta => (
                      <option key={cuenta} value={cuenta}>{cuenta}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO CATEGORÍA - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Tag className="h-4 w-4 text-yellow-400" />
                  Categoría
                </label>
                <div className="relative">
                  <select 
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
                  >
                    <option value="">Todas las categorías</option>
                    {categoriasDisponibles.map(categoria => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* RESUMEN MEJORADO */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400">Total filtrado</div>
                    <div className="text-xl font-bold text-emerald-400">€{total.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Transacciones</div>
                    <div className="text-lg font-semibold text-slate-300">{ingresosFiltrados.length}</div>
                  </div>
                </div>
                
                {/* ESTADÍSTICAS RÁPIDAS MEJORADAS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Categorías activas:</span>
                    <span className="text-slate-300">{Object.keys(estadisticasCategorias).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Ingreso promedio:</span>
                    <span className="text-emerald-300">
                      €{(ingresosFiltrados.length > 0 ? total / ingresosFiltrados.length : 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Ingreso por día:</span>
                    <span className="text-emerald-300">
                      €{analisisFrecuencia.ingresoPorDia.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Estabilidad:</span>
                    <span className={`${
                      analisisTiposIngresos.estabilidad === 'Alta' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {analisisTiposIngresos.estabilidad}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setFiltroMes('');
                  setFiltroMetodo('');
                  setFiltroCuenta('');
                  setFiltroCategoria('');
                }}
                className="w-full mt-4 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* TARJETA DE ANÁLISIS RÁPIDO MEJORADA */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              Análisis rápido
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Fuente principal</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-white">{categoriaPrincipal.nombre}</span>
                  <div className="text-xs text-emerald-400">
                    €{categoriaPrincipal.monto.toFixed(2)} ({categoriaPrincipal.porcentaje?.toFixed(1)}%)
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Cuenta más usada</span>
                </div>
                <span className="text-sm font-medium text-white">{cuentaMasUsada}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Método favorito</span>
                </div>
                <span className="text-sm font-medium text-white">{metodoMasComun}</span>
              </div>
              
              {/* ANÁLISIS FIJOS VS VARIABLES */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-medium text-slate-400 mb-2">Composición de ingresos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Ingresos fijos</span>
                    <span className="text-emerald-400 font-medium">
                      €{analisisTiposIngresos.fijos.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Ingresos variables</span>
                    <span className="text-amber-400 font-medium">
                      €{analisisTiposIngresos.variables.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${analisisTiposIngresos.porcentajeFijos}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500 text-center">
                    {analisisTiposIngresos.porcentajeFijos.toFixed(0)}% son ingresos fijos
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ALERTAS DE INGRESOS */}
          {alertasIngresos.length > 0 && (
            <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Alertas importantes
              </h3>
              <div className="space-y-2">
                {alertasIngresos.map((alerta, index) => (
                  <div key={index} className="text-xs text-amber-300 p-2 bg-amber-900/20 rounded-lg">
                    {alerta.mensaje}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA - TABLA Y ANÁLISIS DETALLADO */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
            {/* HEADER DE TABLA MEJORADO */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Historial de ingresos</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {ingresosFiltrados.length} de {ingresosMensuales.length} transacciones
                    {filtroMes && ` en ${formatearMesTexto(filtroMes)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg">
                  <span>Desliza</span>
                  <span className="text-slate-400">→</span>
                  <span>para ver más columnas</span>
                </div>
              </div>
            </div>

            {/* TABLA MEJORADA CON TIPO DE INGRESO */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Concepto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Cuenta
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-slate-800">
                  {ingresosFiltrados.map((ingreso) => {
                    const tipo = estadisticasCategorias[ingreso.categoria]?.tipo || 'variable';
                    const colorTipo = tipo === 'fijo' ? 'text-emerald-400' : 'text-amber-400';
                    const bgTipo = tipo === 'fijo' ? 'bg-emerald-900/30' : 'bg-amber-900/30';
                    
                    return (
                      <tr key={ingreso.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {ingreso.fecha}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{ingreso.concepto}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-500" />
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                              {ingreso.metodo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-slate-500" />
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300">
                              {ingreso.categoria}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${bgTipo} ${colorTipo}`}>
                              {tipo === 'fijo' ? 'Fijo' : 'Variable'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-slate-500" />
                            {ingreso.cuenta}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1 bg-emerald-900/20 px-3 py-1.5 rounded-lg">
                            <span className="text-sm font-semibold text-emerald-400">
                              €{ingreso.monto.toFixed(2)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* FOOTER DE TABLA */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div className="text-slate-400">
                  <span className="font-medium text-slate-300">{ingresosFiltrados.length}</span> transacciones • 
                  Total: <span className="font-medium text-emerald-400">€{total.toFixed(2)}</span>
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>Actualizado recientemente</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANELES DE ANÁLISIS MEJORADOS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SUGERENCIA DE CRECIMIENTO MEJORADA */}
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">Sugerencia de crecimiento</h4>
              </div>
              {sugerenciaCrecimiento.categoria ? (
                <div>
                  <p className="text-sm text-slate-300 mb-2">
                    {sugerenciaCrecimiento.mensaje}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-blue-400">
                      {sugerenciaCrecimiento.tipo === 'variable' ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <Zap className="h-3 w-3" />
                      }
                      <span>{sugerenciaCrecimiento.tipo === 'variable' ? 'Ingreso variable' : 'Diversificación'}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {sugerenciaCrecimiento.porcentajeCrecimiento}% potencial
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-300">Agrega más ingresos para recibir sugerencias personalizadas.</p>
              )}
            </div>

            {/* PRÓXIMOS INGRESOS MEJORADOS */}
            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-emerald-300">Próximos ingresos estimados</h4>
              </div>
              {proximosIngresos.length > 0 ? (
                <div className="space-y-2">
                  {proximosIngresos.map((ingreso, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-slate-300">{ingreso.concepto}</span>
                        <div className="text-xs text-slate-500">{ingreso.categoria}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-emerald-400">€{ingreso.montoEstimado.toFixed(2)}</span>
                        <div className="text-xs text-slate-500">
                          {ingreso.proximaFecha} • {ingreso.confianza}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-300">Analizando patrones de ingresos recurrentes...</p>
              )}
            </div>
          </div>

          {/* DISTRIBUCIÓN POR CATEGORÍAS CON TIPO */}
          <div className="mt-4 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-400" />
              Distribución por categorías
            </h3>
            <div className="space-y-2">
              {Object.entries(estadisticasCategorias)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([categoria, datos]) => {
                  const esFijo = datos.tipo === 'fijo';
                  const colorBarra = esFijo ? 'from-emerald-500 to-emerald-400' : 'from-amber-500 to-amber-400';
                  
                  return (
                    <div key={categoria} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{categoria}</span>
                          {esFijo && (
                            <span className="text-xs text-emerald-500 bg-emerald-900/30 px-1.5 py-0.5 rounded">
                              Fijo
                            </span>
                          )}
                        </div>
                        <span className={`${esFijo ? 'text-emerald-400' : 'text-amber-400'}`}>
                          €{datos.total.toFixed(2)} ({datos.porcentaje.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div 
                          className={`bg-gradient-to-r ${colorBarra} h-1.5 rounded-full transition-all duration-700`}
                          style={{ width: `${datos.porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente PieChart
function PieChart({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );
}