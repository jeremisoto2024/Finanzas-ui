import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet, TrendingUp, TrendingDown, PieChart, BarChart3,
  Home, ShoppingCart, Car, Film, Heart, Shirt, Gift, Coffee,
  Utensils, Wifi, Phone, Zap, Calculator, Repeat, Receipt,
  Calendar, Target, RefreshCw, AlertCircle, DollarSign, MoreHorizontal,
  CreditCard, Download, Filter
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend
} from 'recharts';

export default function DashboardFinancieroUnificado() {
  // Estado único para todos los datos
  const [datos, setDatos] = useState({
    ingresos: [],
    gastos: [],
    pagosFijos: [],
    comprasCuotas: [],
    loading: true,
    error: null
  });

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
    // Recargar cada 5 minutos
    const intervalo = setInterval(cargarDatos, 300000);
    return () => clearInterval(intervalo);
  }, []);

  // ========== CÁLCULOS CENTRALIZADOS ==========
  const calculos = useMemo(() => {
    if (datos.loading || datos.error) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diaActual = hoy.getDate();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    
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
    const balance = disponible; // En este contexto, balance = disponible
    const porcentajeGastado = ingresosMes > 0 ? (totalGastos / ingresosMes) * 100 : 0;
    const porcentajeDisponible = ingresosMes > 0 ? (disponible / ingresosMes) * 100 : 0;

    // 6. PROYECCIÓN MENSUAL
    const promedioDiario = diaActual > 0 ? totalGastos / diaActual : 0;
    const proyeccionMensual = promedioDiario * ultimoDiaMes;
    const porcentajeProyeccion = ingresosMes > 0 ? (proyeccionMensual / ingresosMes) * 100 : 0;

    // 7. GASTOS POR CATEGORÍA (de los gastos normales)
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
      promedioDiario,
      proyeccionMensual,
      porcentajeProyeccion,
      gastosPorCategoria,
      mesActual
    };
  }, [datos, mesActual]);

  // ========== COMPONENTES INTERNOS ==========

  const DashboardHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Financiero</h1>
        <p className="text-slate-400 mt-2">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => cargarDatos(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>
    </div>
  );

  const KPIsPrincipales = () => {
    if (!calculos) return null;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          titulo="Ingresos"
          valor={calculos.ingresosMes}
          icono={TrendingUp}
          color="emerald"
          cambio="+12.5%"
        />
        <KPICard
          titulo="Gastos"
          valor={calculos.totalGastos}
          icono={TrendingDown}
          color="rose"
          cambio="-3.2%"
        />
        <KPICard
          titulo="Disponible"
          valor={calculos.disponible}
          icono={Wallet}
          color="blue"
          cambio="+8.7%"
          highlight={true}
        />
        <KPICard
          titulo="Balance"
          valor={calculos.balance}
          icono={DollarSign}
          color={calculos.balance >= 0 ? "emerald" : "rose"}
          cambio={calculos.balance >= 0 ? "+15%" : "-5%"}
        />
      </div>
    );
  };

  const KPICard = ({ titulo, valor, icono: Icon, color, cambio, highlight = false }) => {
    const colores = {
      emerald: 'from-emerald-900/30 to-emerald-800/10 text-emerald-400',
      rose: 'from-rose-900/30 to-rose-800/10 text-rose-400',
      blue: 'from-blue-900/30 to-blue-800/10 text-blue-400',
    };

    return (
      <div className={`bg-gradient-to-br ${colores[color]} border border-slate-800 rounded-2xl p-6 ${highlight ? 'ring-2 ring-blue-500/30' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-300 mb-1">{titulo}</p>
            <p className="text-3xl font-bold text-white">€{valor?.toFixed(2) || '0.00'}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${cambio?.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {cambio}
              <span className="text-slate-400">vs mes anterior</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-${color}-900/20`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  const DineroDisponibleCard = () => {
    if (!calculos) return null;
    
    return (
      <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <Wallet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div>Dinero Disponible</div>
                <div className="text-xs text-emerald-300 font-normal">
                  {calculos.mesActual}
                </div>
              </div>
            </CardTitle>
            <div className={`text-xs px-2 py-1 rounded-lg ${
              calculos.porcentajeDisponible > 30 ? 'bg-emerald-900/30 text-emerald-300' :
              calculos.porcentajeDisponible > 10 ? 'bg-amber-900/30 text-amber-300' :
              'bg-red-900/30 text-red-300'
            }`}>
              {calculos.porcentajeDisponible.toFixed(0)}% libre
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-2">
              €{calculos.disponible.toFixed(2)}
            </p>
            <p className="text-sm text-emerald-300">
              Para gastos variables y ahorro
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Distribución mensual</span>
              <span className="font-medium text-slate-300">
                €{calculos.disponible.toFixed(0)} disponible
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(Math.max(calculos.porcentajeDisponible, 0), 100)}%` }}
              ></div>
              <div 
                className="h-full bg-slate-600 transition-all duration-500"
                style={{ width: `${Math.min(Math.max(calculos.porcentajeGastado, 0), 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-sm text-slate-300">Ingresos totales</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-emerald-400">
                  €{calculos.ingresosMes.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Receipt className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm text-slate-300">Gastos normales</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-300">
                    €{calculos.gastosNormales.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Repeat className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-sm text-slate-300">Gastos fijos</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-300">
                    €{calculos.gastosFijos.toFixed(2)}
                  </span>
                </div>
              </div>

              {calculos.gastosCuotas > 0 && (
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Calculator className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-sm text-slate-300">Cuotas pagadas</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-purple-400">
                      €{calculos.gastosCuotas.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-900/30 rounded-lg">
                    <PieChart className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <span className="text-sm text-slate-300">Total gastos</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-400">
                    €{calculos.totalGastos.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BalanceMensualCard = () => {
    if (!calculos) return null;
    
    const positivo = calculos.balance >= 0;
    
    return (
      <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Wallet className="h-5 w-5 text-blue-400" />
              </div>
              Balance Mensual
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-lg">
              <Calendar className="h-3 w-3" />
              <span>Día {calculos.diaActual} de {calculos.ultimoDiaMes}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Gasto vs Ingreso</span>
              <span className="font-medium text-slate-300">{calculos.porcentajeGastado.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(calculos.porcentajeGastado, 100)}%`,
                  background: calculos.porcentajeGastado > 80 
                    ? 'linear-gradient(90deg, #ef4444, #f87171)' 
                    : calculos.porcentajeGastado > 60
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(90deg, #10b981, #34d399)'
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-sm text-slate-300">Ingresos</span>
                  <div className="text-xs text-slate-500">Mes actual</div>
                </div>
              </div>
              <span className="text-lg font-bold text-emerald-400">
                €{calculos.ingresosMes.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800/50 rounded">
                    <Receipt className="h-3 w-3 text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-400">Normales</span>
                </div>
                <span className="text-sm text-slate-300">€{calculos.gastosNormales.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800/50 rounded">
                    <Repeat className="h-3 w-3 text-amber-400" />
                  </div>
                  <span className="text-xs text-slate-400">Fijos</span>
                </div>
                <span className="text-sm text-slate-300">€{calculos.gastosFijos.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800/50 rounded">
                    <Calculator className="h-3 w-3 text-purple-400" />
                  </div>
                  <span className="text-xs text-slate-400">Cuotas</span>
                </div>
                <span className="text-sm text-slate-300">€{calculos.gastosCuotas.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-rose-900/20 rounded-lg border border-rose-800/30 mt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-900/30 rounded-lg">
                    <TrendingDown className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-sm text-slate-300">Total Gastos</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-rose-400">
                  €{calculos.totalGastos.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${positivo ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-rose-900/20 border-rose-800/30'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {positivo ? (
                    <div className="p-2 bg-emerald-900/30 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="p-2 bg-rose-900/30 rounded-lg">
                      <TrendingDown className="h-4 w-4 text-rose-400" />
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-slate-300">Balance</span>
                    <div className="text-xs text-slate-500">
                      {positivo ? 'Superávit' : 'Déficit'} mensual
                    </div>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${positivo ? 'text-emerald-400' : 'text-rose-400'}`}>
                  €{calculos.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ResumenGastosCard = () => {
    if (!calculos) return null;
    
    const categorias = Object.entries(calculos.gastosPorCategoria)
      .sort(([, a], [, b]) => b - a);
    
    const categoriaMayor = categorias[0] || ['', 0];
    
    return (
      <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="p-2 bg-red-900/30 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
              Resumen de Gastos
            </CardTitle>
            <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-lg">
              {categorias.length} categorías
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-red-400">
              €{calculos.totalGastos.toFixed(2)}
            </p>
          </div>
        </CardHeader>
       
        <CardContent className="space-y-4">
          {categoriaMayor[0] && (
            <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">Mayor gasto</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CategoriaIcono categoria={categoriaMayor[0]} />
                  <span className="text-sm text-slate-300">{categoriaMayor[0]}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-red-400">
                    €{categoriaMayor[1].toFixed(2)}
                  </span>
                  <div className="text-xs text-slate-500">
                    {((categoriaMayor[1] / calculos.totalGastos) * 100).toFixed(1)}% del total
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300">Gastos por categoría</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {categorias.map(([categoria, monto], index) => {
                const porcentaje = (monto / calculos.totalGastos) * 100;
                const Icon = CategoriaIcono({ categoria, soloComponente: true });
                
                return (
                  <div
                    key={categoria}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        {Icon}
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
                              backgroundColor: obtenerColorCategoria(categoria),
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
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const GraficoGastosCard = () => {
    if (!calculos) return null;
    
    const data = Object.entries(calculos.gastosPorCategoria)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({
        name,
        value,
        color: obtenerColorCategoria(name)
      }));
    
    const total = data.reduce((acc, item) => acc + item.value, 0);
    
    return (
      <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            Distribución de Gastos
          </CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Total: <span className="font-semibold text-red-400">€{total.toFixed(2)}</span>
          </p>
        </CardHeader>

        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#1e293b"
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PagosFijosCard = () => {
    const pagosActivos = datos.pagosFijos?.filter(p => p.activo !== false) || [];
    
    if (pagosActivos.length === 0) {
      return (
        <Card className="bg-slate-900/60 border border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
              <span className="p-1.5 bg-blue-900/30 rounded-lg">
                <Home className="h-3 w-3 text-blue-400" />
              </span>
              Pagos fijos mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-2">No hay pagos fijos configurados</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const total = pagosActivos.reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);

    return (
      <Card className="bg-slate-900/60 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
            <span className="p-1.5 bg-blue-900/30 rounded-lg">
              <Home className="h-3 w-3 text-blue-400" />
            </span>
            Pagos fijos mensuales
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {pagosActivos.slice(0, 6).map((pago) => (
            <div
              key={pago.id}
              className="flex items-center justify-between p-3 hover:bg-slate-800/30 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Home className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white">{pago.nombre}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 capitalize">{pago.frecuencia || 'mensual'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-300">€{pago.monto?.toFixed(2)}</span>
                <div className="text-xs text-slate-500">
                  {Math.round(((parseFloat(pago.monto) || 0) / total) * 100)}% del total
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-300">Total fijos</span>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                  {pagosActivos.length} servicios
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-red-400">
                  €{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ========== FUNCIONES AUXILIARES ==========
  
  const CategoriaIcono = ({ categoria, soloComponente = false }) => {
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
      'Otros': MoreHorizontal
    };
    
    const Icon = iconMap[categoria] || DollarSign;
    
    if (soloComponente) {
      return <Icon className="h-4 w-4" style={{ color: obtenerColorCategoria(categoria) }} />;
    }
    
    return (
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: obtenerColorCategoria(categoria) }}
      ></div>
    );
  };

  const obtenerColorCategoria = (categoria) => {
    const colores = {
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
      'Otros': '#94a3b8',
    };
    return colores[categoria] || '#94a3b8';
  };

  // ========== RENDER PRINCIPAL ==========
  
  if (datos.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-8 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Cargando dashboard financiero...</p>
        </div>
      </div>
    );
  }

  if (datos.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-8">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error cargando datos</h2>
          <p className="text-slate-300 mb-4">{datos.error}</p>
          <button
            onClick={() => cargarDatos(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
      <DashboardHeader />
      <KPIsPrincipales />
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="balance" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Balance
          </TabsTrigger>
          <TabsTrigger value="gastos" className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Gastos
          </TabsTrigger>
          <TabsTrigger value="graficos" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="fijos" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Fijos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DineroDisponibleCard />
            <BalanceMensualCard />
            <ResumenGastosCard />
            <GraficoGastosCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PagosFijosCard />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="balance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceMensualCard />
            <DineroDisponibleCard />
          </div>
        </TabsContent>

        <TabsContent value="gastos">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResumenGastosCard />
            <GraficoGastosCard />
          </div>
        </TabsContent>

        <TabsContent value="graficos">
          <GraficoGastosCard />
        </TabsContent>

        <TabsContent value="fijos">
          <PagosFijosCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}