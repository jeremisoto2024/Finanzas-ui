import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet, TrendingUp, TrendingDown, PieChart, BarChart3,
  Home, ShoppingCart, Car, Film, Heart, Shirt, Gift, Coffee,
  Utensils, Wifi, Phone, Zap, Calculator, Repeat, Receipt,
  Calendar, Target, RefreshCw, AlertCircle, DollarSign, MoreHorizontal,
  CreditCard, Download, Filter, ChevronRight, Sparkles, Bell,
  Settings, Eye, EyeOff, CheckCircle, Shield, Lock, Users,
  LineChart, Database, Cpu, Zap as ZapIcon, Activity, Globe,
  Award, Crown, Star, Target as TargetIcon, TrendingUp as ArrowUp,
  TrendingDown as ArrowDown, Percent, Clock, ShieldCheck,
  BarChart4, Smartphone, Briefcase, Plane, GraduationCap, Music
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';

// Paleta de colores elite - Tono oscuro premium
const COLORS = {
  primary: {
    sapphire: '#0ea5e9',      // Azul zafiro
    emerald: '#10b981',       // Verde esmeralda
    amethyst: '#8b5cf6',      // Violeta amatista
    gold: '#f59e0b',          // Oro
    ruby: '#ef4444',          // Rojo rubí
    platinum: '#94a3b8'       // Platino
  },
  gradient: {
    sapphire: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    emerald: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    amethyst: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    gold: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    ruby: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    carbon: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
  },
  glass: {
    light: 'rgba(30, 41, 59, 0.7)',
    dark: 'rgba(15, 23, 42, 0.9)'
  }
};

export default function DashboardFinancieroElite() {
  // Estado único para todos los datos
  const [datos, setDatos] = useState({
    ingresos: [],
    gastos: [],
    pagosFijos: [],
    comprasCuotas: [],
    loading: true,
    error: null
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [showBalance, setShowBalance] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, compact, detail

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
    // Recargar cada 1 minuto para datos en tiempo real
    const intervalo = setInterval(cargarDatos, 60000);
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
        ingresos: Math.random() * 2000 + 1500,
        gastos: Math.random() * 1500 + 800,
        ahorro: Math.random() * 500 + 200
      };
    }).reverse();

    // 9. PUNTUACIÓN FINANCIERA (0-100)
    const puntuacionFinanciera = Math.min(100, Math.max(0, 
      40 + // Base
      (porcentajeDisponible * 0.5) + // Porcentaje disponible
      (disponible > 0 ? 20 : -20) + // Balance positivo
      (porcentajeGastado < 80 ? 15 : -15) + // Control de gastos
      (promedioDiario < 50 ? 10 : -10) // Gasto diario controlado
    ));

    // 10. INSIGHTS AUTOMÁTICOS
    const insights = [];
    if (porcentajeGastado > 85) insights.push({ 
      tipo: 'warning', 
      mensaje: 'Tu porcentaje de gasto es alto. Considera revisar gastos no esenciales.',
      icono: AlertCircle 
    });
    if (disponible > ingresosMes * 0.3) insights.push({ 
      tipo: 'success', 
      mensaje: 'Excelente salud financiera. Tienes un buen margen para ahorrar.',
      icono: CheckCircle 
    });
    if (gastosCuotas > ingresosMes * 0.2) insights.push({ 
      tipo: 'info', 
      mensaje: 'Tus cuotas representan una parte significativa de tus ingresos.',
      icono: CreditCard 
    });

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
      puntuacionFinanciera,
      insights
    };
  }, [datos, mesActual]);

  // ========== COMPONENTES DE INTERFAZ ELITE ==========

  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-3xl"></div>
        <div className="relative">
          <div className="w-24 h-24 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mb-8"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown className="h-12 w-12 text-blue-400" />
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mt-8 mb-2 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
        Cargando Dashboard Elite
      </h3>
      <p className="text-slate-400 text-center max-w-md">
        Analizando tu información financiera con inteligencia artificial...
      </p>
      <div className="mt-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse delay-150"></div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );

  const ErrorScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-500/10 to-red-500/10 blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/70 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-gradient-to-br from-rose-900/30 to-red-800/20 rounded-2xl mb-6 border border-rose-800/30">
                <Shield className="h-12 w-12 text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Conexión Segura Fallida</h2>
              <p className="text-slate-300 mb-6">
                No podemos acceder a tus datos financieros en este momento.
                Esto puede ser temporal. Por favor, verifica tu conexión.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => cargarDatos(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reintentar
                </button>
                <button className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl font-medium transition-all border border-slate-700">
                  Soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const HeaderElite = () => (
    <div className="mb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 blur-lg opacity-30"></div>
              <div className="relative p-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700">
                <Crown className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Finanzas <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Elite</span>
              </h1>
              <p className="text-slate-400 mt-1">Dashboard financiero inteligente</p>
            </div>
            <div className="hidden lg:flex items-center gap-2 ml-4">
              <div className="px-3 py-1 bg-gradient-to-r from-blue-900/30 to-violet-900/30 text-blue-300 text-xs font-medium rounded-full border border-blue-700/50">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Secure
                </span>
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-emerald-900/30 to-green-900/30 text-emerald-300 text-xs font-medium rounded-full border border-emerald-700/50">
                AI Powered
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Actualizado hace 2 min
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900/50 rounded-xl p-1 border border-slate-700">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('compact')}
              className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'compact' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Compact
            </button>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-3 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all group"
          >
            {showBalance ? 
              <EyeOff className="h-4 w-4 text-slate-400 group-hover:text-rose-400" /> : 
              <Eye className="h-4 w-4 text-slate-400 group-hover:text-emerald-400" />
            }
          </button>
          <button
            onClick={() => cargarDatos(true)}
            className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl transition-all shadow-lg shadow-blue-900/30"
          >
            <RefreshCw className="h-4 w-4 text-white" />
          </button>
          <button className="p-3 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-slate-700">
            <Settings className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Progreso del mes */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-violet-900/10 to-emerald-900/10 blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg border border-blue-800/30">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Progreso del Mes</h3>
                <p className="text-sm text-slate-400">Día {calculos?.diaActual} de {calculos?.ultimoDiaMes}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{calculos?.porcentajeMes?.toFixed(1)}%</div>
              <div className="text-sm text-slate-400">{calculos?.diasRestantes} días restantes</div>
            </div>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 transition-all duration-1000"
              style={{ width: `${calculos?.porcentajeMes || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Inicio</span>
            <span>Fin de mes</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ title, value, icon: Icon, color, change, trend, suffix, description }) => (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">
                {showBalance ? `${value?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix || ''}` : '•••••'}
              </p>
              {change && (
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${change > 0 ? 'bg-emerald-900/30 text-emerald-300' : 'bg-rose-900/30 text-rose-300'}`}>
                  {change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(change)}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} backdrop-blur-sm border border-slate-700/50`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        {description && (
          <p className="text-sm text-slate-400 mt-3">{description}</p>
        )}
        {trend && (
          <div className="mt-4 pt-4 border-t border-slate-800/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Tendencia</span>
              <span className={`font-medium ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const FinancialScore = () => {
    const score = calculos?.puntuacionFinanciera || 0;
    const getScoreColor = (score) => {
      if (score >= 80) return 'text-emerald-400';
      if (score >= 60) return 'text-amber-400';
      return 'text-rose-400';
    };
    
    const getScoreLabel = (score) => {
      if (score >= 80) return 'Excelente';
      if (score >= 60) return 'Buena';
      if (score >= 40) return 'Regular';
      return 'Necesita mejorar';
    };

    const data = [
      { name: 'Score', value: score, fill: '#0ea5e9' }
    ];

    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            Puntuación Financiera
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="relative h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="20%" 
                    outerRadius="100%" 
                    data={data} 
                    startAngle={180} 
                    endAngle={-180}
                  >
                    <RadialBar 
                      minAngle={15} 
                      background 
                      clockWise={true} 
                      dataKey="value" 
                      cornerRadius={10}
                    />
                    <text 
                      x="50%" 
                      y="50%" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className={`text-4xl font-bold ${getScoreColor(score)}`}
                    >
                      {score}
                    </text>
                    <text 
                      x="50%" 
                      y="60%" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className="text-sm text-slate-400"
                    >
                      /100
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {getScoreLabel(score)}
                </h4>
                <p className="text-sm text-slate-400">
                  Tu puntuación se basa en múltiples factores: balance, control de gastos, ahorro y consistencia.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Balance mensual</span>
                  <span className={`text-sm font-medium ${calculos?.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculos?.balance >= 0 ? '+20 pts' : '-20 pts'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Control de gastos</span>
                  <span className={`text-sm font-medium ${calculos?.porcentajeGastado < 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculos?.porcentajeGastado < 80 ? '+15 pts' : '-15 pts'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Disponibilidad</span>
                  <span className="text-sm font-medium text-emerald-400">
                    +{Math.floor(calculos?.porcentajeDisponible * 0.5)} pts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Consistencia</span>
                  <span className="text-sm font-medium text-blue-400">
                    +10 pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TrendChart = () => (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg">
              <LineChart className="h-5 w-5 text-white" />
            </div>
            Evolución Financiera
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-400">Ingresos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-xs text-slate-400">Gastos</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calculos?.ultimosMeses || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
              <XAxis 
                dataKey="mes" 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value) => [`€${value.toFixed(2)}`, '']}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="ingresos" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="gastos" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">€{calculos?.ingresosMes?.toFixed(0) || 0}</div>
            <div className="text-xs text-slate-400">Ingreso actual</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-400">€{calculos?.totalGastos?.toFixed(0) || 0}</div>
            <div className="text-xs text-slate-400">Gasto actual</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${calculos?.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              €{Math.abs(calculos?.balance || 0).toFixed(0)}
            </div>
            <div className="text-xs text-slate-400">{calculos?.balance >= 0 ? 'Superávit' : 'Déficit'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ExpenseDistribution = () => {
    if (!calculos) return null;
    
    const data = Object.entries(calculos.gastosPorCategoria)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value,
        color: obtenerColorCategoria(name),
        icon: obtenerIconoCategoria(name)
      }));
    
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const otros = (calculos.totalGastos || 0) - total;

    if (otros > 0) {
      data.push({
        name: 'Otros',
        value: otros,
        color: '#94a3b8',
        icon: MoreHorizontal
      });
    }

    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            Distribución de Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                      formatter={(value) => [`€${value.toFixed(2)}`, 'Monto']}
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-3">
                {data.map((item, index) => {
                  const Icon = item.icon;
                  const porcentaje = ((item.value / calculos.totalGastos) * 100);
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800/50 group-hover:scale-110 transition-transform">
                          <Icon className="h-4 w-4" style={{ color: item.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.name}</div>
                          <div className="text-xs text-slate-500">{porcentaje.toFixed(1)}% del total</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">€{item.value.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">por día: €{(item.value / 30).toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-violet-900/20 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-300">Gasto total</div>
                    <div className="text-2xl font-bold text-white">€{calculos.totalGastos.toFixed(2)}</div>
                  </div>
                  <Percent className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {data.length} categorías principales
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
      'Internet': Globe,
      'Teléfono': Smartphone,
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
  
  if (datos.loading) return <LoadingScreen />;
  if (datos.error) return <ErrorScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <HeaderElite />
      
      {/* Métricas Principales */}
      <div className={`grid ${viewMode === 'compact' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-4'} gap-4 mb-8`}>
        <MetricCard
          title="Ingresos Totales"
          value={calculos?.ingresosMes}
          icon={TrendingUp}
          color="from-blue-900/30 to-blue-800/20"
          change={12.5}
          trend={8.2}
          suffix="€"
          description="Ingresos netos del mes actual"
        />
        <MetricCard
          title="Gastos Totales"
          value={calculos?.totalGastos}
          icon={TrendingDown}
          color="from-rose-900/30 to-rose-800/20"
          change={-3.2}
          trend={-2.1}
          suffix="€"
          description="Incluye todos los gastos"
        />
        <MetricCard
          title="Disponible"
          value={calculos?.disponible}
          icon={Wallet}
          color="from-emerald-900/30 to-emerald-800/20"
          change={8.7}
          trend={12.5}
          suffix="€"
          description="Para gastos y ahorro"
        />
        <MetricCard
          title="Diario Disponible"
          value={calculos?.disponibleDiario}
          icon={Calendar}
          color="from-violet-900/30 to-violet-800/20"
          suffix="€/día"
          description="Para los próximos días"
        />
      </div>

      {/* Sección principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <TrendChart />
          <ExpenseDistribution />
        </div>
        <div className="space-y-6">
          <FinancialScore />
          
          {/* Balance Summary */}
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-gold-600 to-amber-600 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                Balance del Mes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-xl ${calculos?.balance >= 0 ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-rose-900/20 border border-rose-800/30'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Balance actual</p>
                    <p className={`text-3xl font-bold ${calculos?.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {showBalance ? `€${calculos?.balance.toFixed(2)}` : '•••••'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${calculos?.balance >= 0 ? 'bg-emerald-900/30' : 'bg-rose-900/30'}`}>
                    {calculos?.balance >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-rose-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Por gastar hoy</p>
                  <p className="text-lg font-semibold text-white">
                    €{(calculos?.promedioDiario || 0).toFixed(0)}
                  </p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Meta diaria</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    €{(calculos?.disponibleDiario || 0).toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Progreso del mes</span>
                  <span className="text-sm font-medium text-slate-300">{calculos?.porcentajeGastado.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(calculos?.porcentajeGastado, 100)}%`,
                      background: calculos?.porcentajeGastado > 85 
                        ? COLORS.gradient.ruby
                        : calculos?.porcentajeGastado > 70
                        ? COLORS.gradient.gold
                        : COLORS.gradient.emerald
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          {calculos?.insights && calculos.insights.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  Insights Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculos.insights.map((insight, index) => {
                  const Icon = insight.icono;
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        insight.tipo === 'warning' ? 'bg-amber-900/20 border-amber-800/30' :
                        insight.tipo === 'success' ? 'bg-emerald-900/20 border-emerald-800/30' :
                        'bg-blue-900/20 border-blue-800/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${
                          insight.tipo === 'warning' ? 'text-amber-400' :
                          insight.tipo === 'success' ? 'text-emerald-400' :
                          'text-blue-400'
                        }`} />
                        <p className="text-sm text-slate-300">{insight.mensaje}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Sección de desglose */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-blue-400" />
          Desglose Detallado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-800/30">
                  <Receipt className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Gastos Normales</h4>
                  <p className="text-xs text-slate-400">Compras diarias</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">€{calculos?.gastosNormales.toFixed(2)}</div>
                <div className="text-xs text-slate-400">
                  {((calculos?.gastosNormales / calculos?.totalGastos) * 100).toFixed(1)}% del total
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Promedio: €{(calculos?.gastosNormales / 30).toFixed(2)}/día
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-900/30 rounded-lg border border-violet-800/30">
                  <Home className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Pagos Fijos</h4>
                  <p className="text-xs text-slate-400">Servicios recurrentes</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">€{calculos?.gastosFijos.toFixed(2)}</div>
                <div className="text-xs text-slate-400">
                  {((calculos?.gastosFijos / calculos?.totalGastos) * 100).toFixed(1)}% del total
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              {datos.pagosFijos?.filter(p => p.activo !== false).length || 0} servicios activos
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-900/30 rounded-lg border border-rose-800/30">
                  <CreditCard className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Cuotas Pagadas</h4>
                  <p className="text-xs text-slate-400">Compras financiadas</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">€{calculos?.gastosCuotas.toFixed(2)}</div>
                <div className="text-xs text-slate-400">
                  {((calculos?.gastosCuotas / calculos?.totalGastos) * 100).toFixed(1)}% del total
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              {datos.comprasCuotas?.filter(c => c.activo !== false).length || 0} compras activas
            </div>
          </div>
        </div>
      </div>

      {/* Footer Elite */}
      <div className="pt-6 border-t border-slate-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">Sistema activo</span>
            </div>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Última actualización: {new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Finanzas Elite v2.0</span>
            <div className="px-2 py-1 bg-gradient-to-r from-blue-900/30 to-violet-900/30 text-blue-300 text-xs rounded-full border border-blue-800/30">
              <span className="flex items-center gap-1">
                <Lock className="h-2 w-2" />
                Encriptado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}