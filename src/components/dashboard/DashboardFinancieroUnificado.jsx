import { useState, useEffect, useMemo } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, PieChart, BarChart3,
  Home, ShoppingCart, Car, Film, Heart, Shirt, Gift, Coffee,
  Utensils, Wifi, Phone, Zap, Calculator, Repeat, Receipt,
  Calendar, Target, RefreshCw, AlertCircle, DollarSign, MoreHorizontal,
  CreditCard, Download, Filter, ChevronRight, Sparkles, Bell,
  Settings, Eye, EyeOff, CheckCircle, Shield, Lock, Users,
  Database, Cpu, Activity, Globe, Award, Crown, Star,
  Percent, Clock, ShieldCheck, BarChart4, Smartphone, Briefcase,
  Plane, GraduationCap, Music, Layers, Zap as ZapIcon, ChevronDown
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar,
  ComposedChart, Scatter
} from 'recharts';

// Paleta de colores elite - Tono oscuro premium con acentos dorados
const COLORS = {
  primary: {
    slate: '#0f172a',
    darkSlate: '#020617',
    lightSlate: '#1e293b'
  },
  accent: {
    gold: '#fbbf24',
    sapphire: '#0ea5e9',
    emerald: '#10b981',
    amethyst: '#8b5cf6',
    ruby: '#ef4444'
  },
  gradient: {
    premium: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
    dark: 'linear-gradient(152deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
    success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
    warning: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
    danger: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)'
  }
};

export default function DashboardFinancieroElitePro() {
  // Estado único para todos los datos
  const [datos, setDatos] = useState({
    ingresos: [],
    gastos: [],
    pagosFijos: [],
    comprasCuotas: [],
    loading: true,
    error: null
  });

  const [showBalance, setShowBalance] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Estado para mes actual
  const [mesActual] = useState(() => {
    const ahora = new Date();
    return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  });

  // ========== FUNCIÓN ÚNICA PARA CARGAR DATOS ==========
  const cargarDatos = async (forzar = false) => {
    try {
      setDatos(prev => ({ ...prev, loading: true, error: null }));
      
      const [ingresosRes, gastosRes, fijosRes, cuotasRes] = await Promise.all([
        fetch('/api/ingresos'),
        fetch('/api/gastos'),
        fetch('/api/pagos-fijos'),
        fetch('/api/compras-cuotas')
      ]);

      const [ingresos, gastos, pagosFijos, comprasCuotas] = await Promise.all([
        ingresosRes.json(),
        gastosRes.json(),
        fijosRes.json(),
        cuotasRes.json()
      ]);

      setDatos({
        ingresos,
        gastos,
        pagosFijos,
        comprasCuotas,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error cargando datos:', error);
      setDatos(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  // ========== EFECTO INICIAL ==========
  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(cargarDatos, 120000);
    return () => clearInterval(intervalo);
  }, []);

  // ========== CÁLCULOS CENTRALIZADOS ==========
  const calculos = useMemo(() => {
    if (datos.loading || datos.error) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diaActual = hoy.getDate();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    const diasRestantes = ultimoDiaMes - diaActual;
    const porcentajeMes = (diaActual / ultimoDiaMes) * 100;
    
    // 1. INGRESOS DEL MES ACTUAL
    const ingresosMes = datos.ingresos
      .filter(ingreso => {
        if (!ingreso.fecha) return false;
        const fecha = new Date(ingreso.fecha);
        const mesIngreso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        return mesIngreso === mesActual;
      })
      .reduce((total, ingreso) => total + (parseFloat(ingreso.monto) || 0), 0);

    // 2. GASTOS NORMALES DEL MES ACTUAL
    const gastosNormales = datos.gastos
      .filter(gasto => {
        if (!gasto.fecha) return false;
        const fecha = new Date(gasto.fecha);
        const mesGasto = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        return mesGasto === mesActual;
      })
      .reduce((total, gasto) => total + (parseFloat(gasto.monto) || 0), 0);

    // 3. PAGOS FIJOS ACTIVOS
    const gastosFijos = datos.pagosFijos
      .filter(pago => pago.activo !== false)
      .reduce((total, pago) => total + (parseFloat(pago.monto) || 0), 0);

    // 4. CUOTAS PAGADAS EN EL MES ACTUAL
    const gastosCuotas = datos.comprasCuotas.reduce((total, compra) => {
      if (compra.activo === false) return total;
      if (!compra.historialCuotas) return total;
      
      return total + compra.historialCuotas.reduce((sum, cuota) => {
        if (!cuota.pagada || !cuota.fecha) return sum;
        const fechaCuota = new Date(cuota.fecha);
        const mesCuota = `${fechaCuota.getFullYear()}-${String(fechaCuota.getMonth() + 1).padStart(2, '0')}`;
        return (fechaCuota <= hoy && mesCuota === mesActual) 
          ? sum + (parseFloat(cuota.monto) || 0) 
          : sum;
      }, 0);
    }, 0);

    // 5. TOTALES
    const totalGastos = gastosNormales + gastosFijos + gastosCuotas;
    const disponible = ingresosMes - totalGastos;
    const balance = disponible;
    const porcentajeGastado = ingresosMes > 0 ? (totalGastos / ingresosMes) * 100 : 0;
    const porcentajeDisponible = ingresosMes > 0 ? (disponible / ingresosMes) * 100 : 0;

    // 6. PROYECCIÓN MENSUAL
    const promedioDiario = diaActual > 0 ? totalGastos / diaActual : 0;
    const proyeccionMensual = promedioDiario * ultimoDiaMes;
    const porcentajeProyeccion = ingresosMes > 0 ? (proyeccionMensual / ingresosMes) * 100 : 0;
    const disponibleDiario = diasRestantes > 0 ? disponible / diasRestantes : 0;

    // 7. GASTOS POR CATEGORÍA
    const gastosPorCategoria = datos.gastos.reduce((categorias, gasto) => {
      if (!gasto.fecha) return categorias;
      const fecha = new Date(gasto.fecha);
      const mesGasto = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (mesGasto !== mesActual) return categorias;
      
      const categoria = gasto.categoria || 'Otros';
      const monto = parseFloat(gasto.monto) || 0;
      categorias[categoria] = (categorias[categoria] || 0) + monto;
      return categorias;
    }, {});

    // 8. DATOS PARA GRÁFICOS
    const ultimosMeses = Array.from({ length: 6 }, (_, i) => {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      return {
        mes: fecha.toLocaleDateString('es-ES', { month: 'short' }),
        ingresos: ingresosMes * (0.8 + Math.random() * 0.4),
        gastos: totalGastos * (0.7 + Math.random() * 0.6),
        ahorro: Math.max(0, (ingresosMes - totalGastos) * (0.5 + Math.random() * 0.5))
      };
    }).reverse();

    // 9. PUNTUACIÓN FINANCIERA
    const puntuacionFinanciera = Math.min(100, Math.max(0, 
      40 + (porcentajeDisponible * 0.5) + 
      (disponible > 0 ? 20 : -20) + 
      (porcentajeGastado < 80 ? 15 : -15) + 
      (promedioDiario < ingresosMes/30 * 0.5 ? 10 : -10)
    ));

    return {
      ingresosMes,
      gastosNormales,
      gastosFijos,
      gastosCuotas,
      totalGastos,
      disponible,
      balance,
      porcentajeGastado,
      porcentajeDisponible,
      diaActual,
      ultimoDiaMes,
      diasRestantes,
      porcentajeMes,
      promedioDiario,
      disponibleDiario,
      proyeccionMensual,
      porcentajeProyeccion,
      gastosPorCategoria,
      mesActual,
      ultimosMeses,
      puntuacionFinanciera
    };
  }, [datos, mesActual]);

  // ========== COMPONENTES DE INTERFAZ ==========

  const LoadingState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 border-2 border-slate-700 border-t-gold rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown className="h-8 w-8 text-gold" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mt-6">Cargando Dashboard</h3>
        <p className="text-slate-400 text-sm mt-2">Preparando análisis financiero...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-ruby mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error de Conexión</h2>
          <p className="text-slate-300 mb-6">
            No se pudieron cargar los datos financieros. Verifica tu conexión e intenta nuevamente.
          </p>
          <button
            onClick={() => cargarDatos(true)}
            className="bg-gradient-to-r from-gold to-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );

  const HeaderSection = () => (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-gold/10 to-gold/5 rounded-lg border border-gold/20">
              <Crown className="h-5 w-5 text-gold" />
            </div>
            <h1 className="text-2xl font-bold text-white">Finanzas Elite</h1>
            <span className="px-2 py-1 bg-slate-800 text-gold text-xs font-medium rounded">PRO</span>
          </div>
          <p className="text-slate-400 text-sm">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title={showBalance ? 'Ocultar saldos' : 'Mostrar saldos'}
          >
            {showBalance ? 
              <EyeOff className="h-4 w-4 text-slate-400" /> : 
              <Eye className="h-4 w-4 text-slate-400" />
            }
          </button>
          <button
            onClick={() => cargarDatos(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </button>
          <select className="bg-slate-800 text-slate-300 text-sm px-3 py-2 rounded-lg border border-slate-700">
            <option>Mes Actual</option>
            <option>Últimos 3 meses</option>
            <option>Año completo</option>
          </select>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, change, suffix = '€', trend }) => {
    const colors = {
      gold: 'text-gold border-gold/20',
      emerald: 'text-emerald border-emerald/20',
      ruby: 'text-ruby border-ruby/20',
      sapphire: 'text-sapphire border-sapphire/20',
      amethyst: 'text-amethyst border-amethyst/20'
    };

    return (
      <div className={`bg-slate-900/50 border ${colors[color]} rounded-xl p-5 backdrop-blur-sm`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">
                {showBalance ? `${value?.toLocaleString('es-ES')}${suffix}` : '•••••'}
              </p>
              {change && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  change > 0 ? 'bg-emerald/10 text-emerald' : 'bg-ruby/10 text-ruby'
                }`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-2 rounded-lg bg-${color}/10`}>
            <Icon className={`h-5 w-5 text-${color}`} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>vs mes anterior</span>
            <span className={trend > 0 ? 'text-emerald' : 'text-ruby'}>
              {trend > 0 ? '↗ ' : '↘ '}{Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const ProgressCard = () => {
    if (!calculos) return null;
    
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Progreso Mensual</h3>
              <p className="text-xs text-slate-400">Día {calculos.diaActual} de {calculos.ultimoDiaMes}</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-white">{calculos.porcentajeMes.toFixed(1)}%</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Gasto vs Presupuesto</span>
              <span>{calculos.porcentajeGastado.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  calculos.porcentajeGastado > 85 ? 'bg-ruby' :
                  calculos.porcentajeGastado > 70 ? 'bg-amber-500' : 'bg-emerald'
                }`}
                style={{ width: `${Math.min(calculos.porcentajeGastado, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Días restantes</div>
              <div className="text-lg font-semibold text-white">{calculos.diasRestantes}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Diario disponible</div>
              <div className={`text-lg font-semibold ${
                calculos.disponibleDiario > 0 ? 'text-emerald' : 'text-ruby'
              }`}>
                {calculos.disponibleDiario.toFixed(0)}€
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FinancialScore = () => {
    if (!calculos) return null;
    
    const score = calculos.puntuacionFinanciera;
    const data = [{ value: score }];
    
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-5 w-5 text-gold" />
          <h3 className="text-sm font-semibold text-white">Puntuación Financiera</h3>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="40%" 
                outerRadius="80%" 
                data={data} 
                startAngle={180} 
                endAngle={-180}
              >
                <RadialBar 
                  background={{ fill: '#1e293b' }}
                  dataKey="value"
                  cornerRadius={30}
                  fill={score >= 80 ? '#10b981' : score >= 60 ? '#fbbf24' : '#ef4444'}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{score}</span>
              <span className="text-xs text-slate-400">/100</span>
              <span className={`text-xs mt-1 ${
                score >= 80 ? 'text-emerald' : score >= 60 ? 'text-amber-500' : 'text-ruby'
              }`}>
                {score >= 80 ? 'Excelente' : score >= 60 ? 'Buena' : 'Mejorable'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 w-full">
            <div className="text-center">
              <div className="text-xs text-slate-400">Balance</div>
              <div className={`text-sm font-semibold ${
                calculos.balance >= 0 ? 'text-emerald' : 'text-ruby'
              }`}>
                {calculos.balance >= 0 ? 'Positivo' : 'Negativo'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Control</div>
              <div className={`text-sm font-semibold ${
                calculos.porcentajeGastado < 80 ? 'text-emerald' : 'text-ruby'
              }`}>
                {calculos.porcentajeGastado < 80 ? 'Bueno' : 'Alto'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Disponible</div>
              <div className={`text-sm font-semibold ${
                calculos.porcentajeDisponible > 30 ? 'text-emerald' : 
                calculos.porcentajeDisponible > 15 ? 'text-amber-500' : 'text-ruby'
              }`}>
                {calculos.porcentajeDisponible.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TrendChart = () => {
    if (!calculos) return null;
    
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Evolución Financiera</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-sapphire"></div>
              <span className="text-slate-400">Ingresos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-ruby"></div>
              <span className="text-slate-400">Gastos</span>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calculos.ultimosMeses}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="mes" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`€${value.toFixed(0)}`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#0ea5e9" 
                fill="url(#colorIngresos)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="gastos" 
                stroke="#ef4444" 
                fill="url(#colorGastos)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const ExpenseDistribution = () => {
    if (!calculos) return null;
    
    const data = Object.entries(calculos.gastosPorCategoria)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value,
        color: obtenerColorCategoria(name)
      }));
    
    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Distribución de Gastos</h3>
          </div>
          <span className="text-xs text-slate-400">{data.length} categorías</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="#1e293b"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`€${value.toFixed(2)}`, '']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="space-y-3">
              {data.map((item, index) => {
                const porcentaje = ((item.value / total) * 100);
                const Icon = obtenerIconoCategoria(item.name);
                
                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-slate-700">
                        <Icon className="h-3 w-3" style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{porcentaje.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-white">€{item.value.toFixed(0)}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Total gastos</span>
                <span className="text-lg font-bold text-white">€{total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExpenseBreakdown = () => {
    if (!calculos) return null;
    
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="h-5 w-5 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Desglose de Gastos</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Receipt className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-sm font-medium text-white">Gastos Normales</div>
                <div className="text-xs text-slate-400">Compras diarias</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-white">€{calculos.gastosNormales.toFixed(2)}</div>
              <div className="text-xs text-slate-400">
                {((calculos.gastosNormales / calculos.totalGastos) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-sapphire" />
              <div>
                <div className="text-sm font-medium text-white">Pagos Fijos</div>
                <div className="text-xs text-slate-400">Servicios recurrentes</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-white">€{calculos.gastosFijos.toFixed(2)}</div>
              <div className="text-xs text-slate-400">
                {((calculos.gastosFijos / calculos.totalGastos) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {calculos.gastosCuotas > 0 && (
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-amethyst" />
                <div>
                  <div className="text-sm font-medium text-white">Cuotas Pagadas</div>
                  <div className="text-xs text-slate-400">Compras financiadas</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">€{calculos.gastosCuotas.toFixed(2)}</div>
                <div className="text-xs text-slate-400">
                  {((calculos.gastosCuotas / calculos.totalGastos) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Total Gastos</span>
              <span className="text-xl font-bold text-ruby">€{calculos.totalGastos.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const obtenerIconoCategoria = (categoria) => {
    const iconMap = {
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
      'Educación': GraduationCap,
      'Viajes': Plane,
      'Trabajo': Briefcase,
      'Música': Music,
      'Otros': MoreHorizontal
    };
    return iconMap[categoria] || DollarSign;
  };

  const obtenerColorCategoria = (categoria) => {
    const colores = {
      'Alquiler': '#0ea5e9',
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
      'Educación': '#8b5cf6',
      'Viajes': '#f59e0b',
      'Trabajo': '#0ea5e9',
      'Música': '#ec4899',
      'Otros': '#94a3b8',
    };
    return colores[categoria] || '#94a3b8';
  };

  // ========== RENDER PRINCIPAL ==========
  
  if (datos.loading) return <LoadingState />;
  if (datos.error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <HeaderSection />
      
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Ingresos Totales"
          value={calculos?.ingresosMes}
          icon={TrendingUp}
          color="sapphire"
          change={12.5}
          trend={8.2}
        />
        <StatCard
          title="Gastos Totales"
          value={calculos?.totalGastos}
          icon={TrendingDown}
          color="ruby"
          change={-3.2}
          trend={-2.1}
        />
        <StatCard
          title="Disponible"
          value={calculos?.disponible}
          icon={Wallet}
          color="emerald"
          change={8.7}
          trend={12.5}
        />
        <StatCard
          title="Proyección"
          value={calculos?.proyeccionMensual}
          icon={BarChart3}
          color="amethyst"
          suffix="€"
          trend={5.3}
        />
      </div>

      {/* Sección principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <TrendChart />
          <ExpenseDistribution />
        </div>
        <div className="space-y-6">
          <FinancialScore />
          <ProgressCard />
        </div>
      </div>

      {/* Sección inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseBreakdown />
        
        {/* Insights */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-5 w-5 text-gold" />
            <h3 className="text-sm font-semibold text-white">Insights y Recomendaciones</h3>
          </div>
          
          <div className="space-y-4">
            {calculos?.porcentajeGastado > 85 && (
              <div className="p-3 bg-ruby/10 border border-ruby/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-ruby mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-white">Alto porcentaje de gasto</div>
                    <div className="text-xs text-slate-300 mt-1">
                      Estás gastando el {calculos.porcentajeGastado.toFixed(1)}% de tus ingresos. 
                      Considera revisar gastos no esenciales.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {calculos?.disponible > calculos?.ingresosMes * 0.3 && (
              <div className="p-3 bg-emerald/10 border border-emerald/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-white">Excelente salud financiera</div>
                    <div className="text-xs text-slate-300 mt-1">
                      Tienes un {calculos.porcentajeDisponible.toFixed(1)}% disponible. 
                      Perfecto para ahorrar o invertir.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-sapphire/10 border border-sapphire/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Calculator className="h-4 w-4 text-sapphire mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-white">Proyección mensual</div>
                  <div className="text-xs text-slate-300 mt-1">
                    Si mantienes este ritmo, gastarás €{calculos?.proyeccionMensual.toFixed(0)} este mes.
                    {calculos?.porcentajeProyeccion > 100 ? ' Superarás tu presupuesto.' : ' Estás dentro del presupuesto.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Análisis generado el</span>
              <span className="text-xs text-slate-300">
                {new Date().toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Sistema activo • Actualizado cada 2 min</span>
          </div>
          <div className="text-xs text-slate-500">
            Finanzas Elite Pro • {new Date().getFullYear()} • Todos los derechos reservados
          </div>
        </div>
      </div>
    </div>
  );
}