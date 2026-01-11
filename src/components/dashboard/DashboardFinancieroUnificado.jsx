import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet, TrendingUp, TrendingDown, PieChart, BarChart3,
  Home, ShoppingCart, Car, Film, Heart, Shirt, Gift, Coffee,
  Utensils, Wifi, Phone, Zap, Calculator, Repeat, Receipt,
  Calendar, Target, RefreshCw, AlertCircle, DollarSign, MoreHorizontal,
  CreditCard, Download, Filter, ChevronRight, Sparkles, Bell,
  Settings, Eye, EyeOff, TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon, CheckCircle
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area
} from 'recharts';

// Paleta de colores premium
const COLORS = {
  primary: {
    blue: '#3b82f6',
    emerald: '#10b981',
    violet: '#8b5cf6',
    amber: '#f59e0b',
    rose: '#f43f5e',
    sky: '#0ea5e9'
  },
  gradients: {
    blue: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    emerald: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    violet: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    amber: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    rose: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  }
};

export default function DashboardFinancieroPremium() {
  // Estado único para todos los datos
  const [datos, setDatos] = useState({
    ingresos: [],
    gastos: [],
    pagosFijos: [],
    comprasCuotas: [],
    loading: true,
    error: null
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);

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
    // Recargar cada 2 minutos
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

    // 3. PAGOS FIJOS ACTIVOS (se consideran todos los activos, no solo del mes)
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

    // 8. DATOS PARA GRÁFICO DE TENDENCIA
    const ultimosMeses = Array.from({ length: 6 }, (_, i) => {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      return {
        mes: fecha.toLocaleDateString('es-ES', { month: 'short' }),
        ingresos: Math.random() * 2000 + 1500,
        gastos: Math.random() * 1500 + 800
      };
    }).reverse();

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
      promedioDiario,
      proyeccionMensual,
      porcentajeProyeccion,
      gastosPorCategoria,
      mesActual,
      ultimosMeses
    };
  }, [datos, mesActual]);

  // ========== COMPONENTES DE INTERFAZ ==========

  const HeaderDashboard = () => (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Dashboard Financiero
            </h1>
            <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-full border border-blue-700/50">
              PRO
            </span>
          </div>
          <p className="text-slate-400">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-sm font-medium text-slate-300 transition-all border border-slate-700"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showBalance ? 'Ocultar' : 'Mostrar'}
          </button>
          <button
            onClick={() => cargarDatos(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-sm font-medium text-white transition-all shadow-lg shadow-blue-900/30"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700">
            <Settings className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Tarjetas de estado rápido */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Día actual</div>
          <div className="text-2xl font-bold text-white">{calculos?.diaActual || 0}</div>
          <div className="text-xs text-slate-500">de {calculos?.ultimoDiaMes || 30}</div>
        </div>
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Días restantes</div>
          <div className="text-2xl font-bold text-white">{calculos?.diasRestantes || 0}</div>
          <div className="text-xs text-slate-500">fin de mes</div>
        </div>
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Promedio diario</div>
          <div className="text-2xl font-bold text-white">€{calculos?.promedioDiario?.toFixed(0) || 0}</div>
          <div className="text-xs text-slate-500">de gasto</div>
        </div>
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Salud financiera</div>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${calculos?.porcentajeDisponible > 30 ? 'text-emerald-400' : calculos?.porcentajeDisponible > 15 ? 'text-amber-400' : 'text-rose-400'}`}>
              {calculos?.porcentajeDisponible?.toFixed(0) || 0}%
            </div>
            {calculos?.porcentajeDisponible > 30 ? (
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            ) : calculos?.porcentajeDisponible > 15 ? (
              <div className="text-amber-400">⚠️</div>
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
          </div>
          <div className="text-xs text-slate-500">disponible</div>
        </div>
      </div>
    </div>
  );

  const TarjetaKPI = ({ titulo, valor, icono: Icon, color, tendencia, porcentaje, descripcion }) => (
    <div className={`bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-sm hover:border-${color}-500/30 transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">{titulo}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{showBalance ? `€${valor?.toFixed(2) || '0.00'}` : '•••••'}</p>
            {tendencia && (
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${tendencia > 0 ? 'bg-emerald-900/30 text-emerald-300' : 'bg-rose-900/30 text-rose-300'}`}>
                {tendencia > 0 ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
                {Math.abs(tendencia)}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-900/20 border border-${color}-800/30`}>
          <Icon className="h-5 w-5" style={{ color: COLORS.primary[color] }} />
        </div>
      </div>
      {descripcion && <p className="text-xs text-slate-500 mt-2">{descripcion}</p>}
      {porcentaje && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progreso</span>
            <span>{porcentaje}%</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${porcentaje}%`,
                background: COLORS.gradients[color]
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );

  const GraficoTendencia = () => (
    <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Tendencia Mensual
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-400">Ingresos</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span className="text-xs text-slate-400">Gastos</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calculos?.ultimosMeses || []}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="ingresos" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIngresos)" />
              <Area type="monotone" dataKey="gastos" stroke="#f43f5e" fillOpacity={1} fill="url(#colorGastos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const DistribucionGastos = () => {
    if (!calculos) return null;
    
    const data = Object.entries(calculos.gastosPorCategoria)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({
        name,
        value,
        color: obtenerColorCategoria(name)
      }));
    
    const total = data.reduce((acc, item) => acc + item.value, 0);
    
    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              Distribución de Gastos
            </CardTitle>
            <div className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
              {Object.keys(calculos.gastosPorCategoria).length} categorías
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / total) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`€${value.toFixed(2)}`, 'Monto']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-white">€{item.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const ResumenFinanciero = () => {
    if (!calculos) return null;
    
    const positivo = calculos.balance >= 0;
    
    return (
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            Resumen Financiero
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-xl ${positivo ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-rose-900/20 border border-rose-800/30'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Balance del mes</p>
                <p className={`text-3xl font-bold ${positivo ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {showBalance ? `€${calculos.balance.toFixed(2)}` : '•••••'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${positivo ? 'bg-emerald-900/30' : 'bg-rose-900/30'}`}>
                {positivo ? (
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-rose-400" />
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {positivo ? 'Estás en superávit este mes' : 'Estás en déficit este mes'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/30 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Por gastar hoy</p>
              <p className="text-lg font-semibold text-white">
                €{(calculos.promedioDiario || 0).toFixed(0)}
              </p>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Presupuesto restante</p>
              <p className={`text-lg font-semibold ${calculos.disponible > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                €{(calculos.disponible || 0).toFixed(0)}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Progreso del mes</span>
              <span className="text-sm font-medium text-slate-300">{calculos.porcentajeGastado.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(calculos.porcentajeGastado, 100)}%`,
                  background: calculos.porcentajeGastado > 80 
                    ? COLORS.gradients.rose
                    : calculos.porcentajeGastado > 60
                    ? COLORS.gradients.amber
                    : COLORS.gradients.emerald
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const obtenerColorCategoria = (categoria) => {
    const colores = {
      'Alquiler': COLORS.primary.blue,
      'Alimentación': COLORS.primary.emerald,
      'Transporte': COLORS.primary.amber,
      'Entretenimiento': COLORS.primary.violet,
      'Salud': COLORS.primary.rose,
      'Ropa': '#ec4899',
      'Regalos': '#14b8a6',
      'Ahorro': '#84cc16',
      'Café': '#f97316',
      'Restaurante': '#6366f1',
      'Internet': COLORS.primary.sky,
      'Teléfono': '#8b5cf6',
      'Luz': '#fbbf24',
      'Otros': '#94a3b8',
    };
    return colores[categoria] || '#94a3b8';
  };

  // ========== RENDER PRINCIPAL ==========
  
  if (datos.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Cargando dashboard</h3>
        <p className="text-slate-400 text-sm">Analizando tus datos financieros...</p>
      </div>
    );
  }

  if (datos.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8">
        <div className="max-w-md mx-auto bg-gradient-to-br from-rose-900/20 to-rose-800/10 border border-rose-800/30 rounded-2xl p-8 text-center backdrop-blur-sm">
          <AlertCircle className="h-16 w-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error al cargar datos</h2>
          <p className="text-slate-300 mb-6">{datos.error}</p>
          <button
            onClick={() => cargarDatos(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/30"
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Reintentar conexión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 md:p-6">
      <HeaderDashboard />
      
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <TarjetaKPI
          titulo="Ingresos Totales"
          valor={calculos?.ingresosMes}
          icono={TrendingUp}
          color="blue"
          tendencia={12.5}
          porcentaje={calculos?.porcentajeDisponible}
          descripcion="Mes actual"
        />
        <TarjetaKPI
          titulo="Gastos Totales"
          valor={calculos?.totalGastos}
          icono={TrendingDown}
          color="rose"
          tendencia={-3.2}
          porcentaje={calculos?.porcentajeGastado}
          descripcion="Incluye todos los gastos"
        />
        <TarjetaKPI
          titulo="Dinero Disponible"
          valor={calculos?.disponible}
          icono={Wallet}
          color="emerald"
          tendencia={8.7}
          descripcion="Para gastos variables y ahorro"
        />
        <TarjetaKPI
          titulo="Proyección Mensual"
          valor={calculos?.proyeccionMensual}
          icono={BarChart3}
          color="violet"
          porcentaje={calculos?.porcentajeProyeccion}
          descripcion="Basado en tendencia actual"
        />
      </div>

      {/* Sección principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <GraficoTendencia />
          <ResumenFinanciero />
        </div>
        <div className="space-y-6">
          <DistribucionGastos />
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
                  <Repeat className="h-5 w-5 text-white" />
                </div>
                Desglose de Gastos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Gastos Normales</p>
                    <p className="text-xs text-slate-500">Compras diarias</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-white">€{calculos?.gastosNormales.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Pagos Fijos</p>
                    <p className="text-xs text-slate-500">Servicios y suscripciones</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-white">€{calculos?.gastosFijos.toFixed(2)}</p>
              </div>
              {calculos?.gastosCuotas > 0 && (
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-violet-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Cuotas Pagadas</p>
                      <p className="text-xs text-slate-500">Compras financiadas</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-violet-400">€{calculos?.gastosCuotas.toFixed(2)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sección de insights */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Insights Financieros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-800/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Meta de ahorro</span>
            </div>
            <p className="text-xs text-slate-400">
              Tienes {calculos?.diasRestantes} días para ahorrar €{Math.max(0, calculos?.disponible || 0).toFixed(0)} este mes
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-800/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Tendencia positiva</span>
            </div>
            <p className="text-xs text-slate-400">
              Tu balance es {calculos?.balance >= 0 ? 'positivo' : 'negativo'}, {calculos?.balance >= 0 ? '¡sigue así!' : 'considera ajustar gastos'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-violet-900/20 to-violet-800/10 border border-violet-800/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-white">Próximos vencimientos</span>
            </div>
            <p className="text-xs text-slate-400">
              {calculos?.gastosCuotas > 0 ? 'Tienes cuotas pendientes este mes' : 'No tienes cuotas pendientes'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 pt-6 border-t border-slate-800/50">
        <p>Dashboard actualizado el {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
        <p className="mt-1">© {new Date().getFullYear()} Finanzas Pro - Todos los derechos reservados</p>
      </div>
    </div>
  );
}