import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, CreditCard, Target, Calendar, RefreshCw, AlertCircle, Receipt, Repeat, Calculator, PieChart } from 'lucide-react'

export default function BalanceMensual() {
  // Estados para los datos
  const [ingresosMes, setIngresosMes] = useState(0);
  const [gastosNormales, setGastosNormales] = useState(0);
  const [gastosFijos, setGastosFijos] = useState(0);
  const [gastosCuotas, setGastosCuotas] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para proyección
  const [hoy, setHoy] = useState(0);
  const [diasMes, setDiasMes] = useState(30);
  const [promedioDiario, setPromedioDiario] = useState(0);
  const [proyeccion, setProyeccion] = useState(0);
  const [porcentajeProyeccion, setPorcentajeProyeccion] = useState(0);
  const [porcentajeGastado, setPorcentajeGastado] = useState(0);
  const [positivo, setPositivo] = useState(true);

  // ========== CALCULAR DÍAS DEL MES ==========
  const calcularDiasMes = () => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = ahora.getMonth() + 1;
    const ultimoDia = new Date(año, mes, 0).getDate();
    setHoy(ahora.getDate());
    setDiasMes(ultimoDia);
    return { hoy: ahora.getDate(), diasMes: ultimoDia };
  };

  // ========== CARGAR TODOS LOS DATOS ==========
  useEffect(() => {
    const fetchDatosBalance = async () => {
      try {
        setLoading(true);
        const { hoy: diaActual, diasMes: totalDias } = calcularDiasMes();
        
        // 1. Cargar ingresos del mes actual
        let totalIngresos = 0;
        try {
          const resIngresos = await fetch('/api/ingresos');
          if (resIngresos.ok) {
            const ingresosData = await resIngresos.json();
            const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
            
            // Filtrar ingresos del mes actual
            const ingresosMesActual = ingresosData.filter(ingreso => {
              if (!ingreso.fecha) return false;
              try {
                const fechaIngreso = new Date(ingreso.fecha);
                const mesIngreso = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}`;
                return mesIngreso === mesActual;
              } catch {
                return false;
              }
            });

            // Sumar todos los ingresos del mes actual
            totalIngresos = ingresosMesActual.reduce((sum, ingreso) => {
              const monto = parseFloat(ingreso.monto) || 0;
              return sum + monto;
            }, 0);
          }
        } catch (err) {
          console.warn('Error cargando ingresos:', err);
          totalIngresos = 1800; // Valor por defecto
        }

        // 2. Cargar gastos normales del mes actual
        let totalGastosNormales = 0;
        try {
          const resGastos = await fetch('/api/gastos');
          if (resGastos.ok) {
            const gastosData = await resGastos.json();
            const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
            
            // Filtrar gastos del mes actual
            const gastosMesActual = gastosData.filter(gasto => {
              if (!gasto.fecha) return false;
              try {
                const fechaGasto = new Date(gasto.fecha);
                const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
                return mesGasto === mesActual;
              } catch {
                return false;
              }
            });

            // Sumar todos los gastos normales del mes actual
            totalGastosNormales = gastosMesActual.reduce((sum, gasto) => {
              const monto = parseFloat(gasto.monto) || 0;
              return sum + monto;
            }, 0);
          }
        } catch (err) {
          console.warn('Error cargando gastos normales:', err);
          totalGastosNormales = 72; // Valor por defecto
        }

        // 3. Cargar pagos fijos activos del mes actual
        let totalPagosFijos = 0;
        try {
          const resPagosFijos = await fetch('/api/pagos-fijos');
          if (resPagosFijos.ok) {
            const pagosFijosData = await resPagosFijos.json();
            const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            // Filtrar pagos fijos activos y que correspondan al mes actual
            pagosFijosData.forEach(pago => {
              const activo = pago.activo === true || pago.activo === 'true' || pago.activo === undefined;
              if (!activo) return;
              
              // Usar fechaRealPago si existe, sino fechaInicio
              const fechaPagoStr = pago.fechaRealPago || pago.fechaInicio;
              if (!fechaPagoStr) return;
              
              try {
                const fechaPago = new Date(fechaPagoStr);
                fechaPago.setHours(0, 0, 0, 0);
                
                // Solo incluir si la fecha de pago es hoy o pasada y del mes actual
                if (fechaPago <= hoy) {
                  const mesPago = `${fechaPago.getFullYear()}-${String(fechaPago.getMonth() + 1).padStart(2, '0')}`;
                  if (mesPago === mesActual) {
                    const monto = parseFloat(pago.monto) || 0;
                    totalPagosFijos += monto;
                  }
                }
              } catch (err) {
                console.warn('Error procesando fecha de pago fijo:', err);
              }
            });
          }
        } catch (err) {
          console.warn('Error cargando pagos fijos:', err);
          totalPagosFijos = 750; // Valor por defecto
        }

        // 4. Cargar compras a cuotas del mes actual
        let totalCuotasPagadas = 0;
        try {
          const resCuotas = await fetch('/api/compras-cuotas');
          if (resCuotas.ok) {
            const comprasCuotasData = await resCuotas.json();
            const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            // Filtrar compras a cuotas activas
            comprasCuotasData.forEach(compra => {
              const activo = compra.activo === true || compra.activo === 'true' || compra.activo === undefined;
              if (!activo) return;
              
              if (compra.historialCuotas && Array.isArray(compra.historialCuotas)) {
                compra.historialCuotas.forEach(cuota => {
                  // Solo considerar cuotas pagadas
                  if (cuota.pagada && cuota.fecha) {
                    try {
                      const fechaCuota = new Date(cuota.fecha);
                      fechaCuota.setHours(0, 0, 0, 0);
                      
                      const mesCuota = `${fechaCuota.getFullYear()}-${String(fechaCuota.getMonth() + 1).padStart(2, '0')}`;
                      
                      // Solo incluir si la fecha es hoy o pasada y del mes actual
                      if (fechaCuota <= hoy && mesCuota === mesActual) {
                        const monto = parseFloat(cuota.monto) || 0;
                        totalCuotasPagadas += monto;
                      }
                    } catch (err) {
                      console.warn('Error procesando fecha de cuota:', err);
                    }
                  }
                });
              }
            });
          }
        } catch (err) {
          console.warn('Error cargando compras a cuotas:', err);
          totalCuotasPagadas = 47.98; // Valor por defecto
        }

        // 5. Calcular totales
        const totalGastosCalculado = totalGastosNormales + totalPagosFijos + totalCuotasPagadas;
        const balanceCalculado = totalIngresos - totalGastosCalculado;
        const positivoCalculado = balanceCalculado >= 0;
        
        // 6. Calcular proyección
        const promedioDiarioCalculado = diaActual > 0 ? totalGastosCalculado / diaActual : 0;
        const proyeccionCalculada = promedioDiarioCalculado * totalDias;
        const porcentajeProyeccionCalculado = totalIngresos > 0 ? (proyeccionCalculada / totalIngresos) * 100 : 0;
        const porcentajeGastadoCalculado = totalIngresos > 0 ? (totalGastosCalculado / totalIngresos) * 100 : 0;

        // 7. Actualizar estados
        setIngresosMes(totalIngresos);
        setGastosNormales(totalGastosNormales);
        setGastosFijos(totalPagosFijos);
        setGastosCuotas(totalCuotasPagadas);
        setTotalGastos(totalGastosCalculado);
        setBalance(balanceCalculado);
        setPositivo(positivoCalculado);
        setPromedioDiario(promedioDiarioCalculado);
        setProyeccion(proyeccionCalculada);
        setPorcentajeProyeccion(porcentajeProyeccionCalculado);
        setPorcentajeGastado(porcentajeGastadoCalculado);

      } catch (err) {
        setError(err.message);
        console.error('Error cargando datos del balance:', err);
        
        // Valores por defecto en caso de error
        const { hoy: diaActual, diasMes: totalDias } = calcularDiasMes();
        const ingresosDefecto = 1800;
        const gastosNormalesDefecto = 72;
        const gastosFijosDefecto = 750;
        const gastosCuotasDefecto = 47.98;
        const totalGastosDefecto = 869.98;
        const balanceDefecto = 930.02;
        const promedioDiarioDefecto = diaActual > 0 ? totalGastosDefecto / diaActual : 0;
        const proyeccionDefecto = promedioDiarioDefecto * totalDias;
        
        setIngresosMes(ingresosDefecto);
        setGastosNormales(gastosNormalesDefecto);
        setGastosFijos(gastosFijosDefecto);
        setGastosCuotas(gastosCuotasDefecto);
        setTotalGastos(totalGastosDefecto);
        setBalance(balanceDefecto);
        setPositivo(true);
        setPromedioDiario(promedioDiarioDefecto);
        setProyeccion(proyeccionDefecto);
        setPorcentajeProyeccion((proyeccionDefecto / ingresosDefecto) * 100);
        setPorcentajeGastado((totalGastosDefecto / ingresosDefecto) * 100);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosBalance();
    
    // Recargar datos cada 60 segundos
    const intervalo = setInterval(fetchDatosBalance, 60000);
    return () => clearInterval(intervalo);
  }, []);

  // ========== ESTADOS DE CARGA Y ERROR ==========
  if (loading) {
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
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Calculando balance...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            Balance Mensual
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-sm text-amber-400 mb-2">Error cargando datos</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition"
          >
            Reintentar
          </button>
        </CardContent>
      </Card>
    );
  }

  // ========== RENDER ==========
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
            <span>Día {hoy} de {diasMes}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* BARRA DE PROGRESO GASTOS/INGRESOS */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Gasto vs Ingreso</span>
            <span className="font-medium text-slate-300">{porcentajeGastado.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(porcentajeGastado, 100)}%`,
                background: porcentajeGastado > 80 
                  ? 'linear-gradient(90deg, #ef4444, #f87171)' 
                  : porcentajeGastado > 60
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : 'linear-gradient(90deg, #10b981, #34d399)'
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>€0</span>
            <span>Meta: €{ingresosMes.toFixed(0)}</span>
          </div>
        </div>

        {/* INGRESOS */}
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
            €{ingresosMes.toFixed(2)}
          </span>
        </div>

        {/* GASTOS - DESGLOSADOS */}
        <div className="space-y-2">
          {/* GASTOS NORMALES */}
          {gastosNormales > 0 && (
            <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800/50 rounded">
                  <Receipt className="h-3 w-3 text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">Normales</span>
              </div>
              <span className="text-sm text-slate-300">€{gastosNormales.toFixed(2)}</span>
            </div>
          )}

          {/* GASTOS FIJOS */}
          {gastosFijos > 0 && (
            <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800/50 rounded">
                  <Repeat className="h-3 w-3 text-amber-400" />
                </div>
                <span className="text-xs text-slate-400">Fijos</span>
              </div>
              <span className="text-sm text-slate-300">€{gastosFijos.toFixed(2)}</span>
            </div>
          )}

          {/* GASTOS CUOTAS */}
          {gastosCuotas > 0 && (
            <div className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-800/50 rounded">
                  <Calculator className="h-3 w-3 text-purple-400" />
                </div>
                <span className="text-xs text-slate-400">Cuotas</span>
              </div>
              <span className="text-sm text-slate-300">€{gastosCuotas.toFixed(2)}</span>
            </div>
          )}

          {/* TOTAL GASTOS */}
          <div className="flex items-center justify-between p-3 bg-rose-900/20 rounded-lg border border-rose-800/30 mt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-900/30 rounded-lg">
                <TrendingDown className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <span className="text-sm text-slate-300">Total Gastos</span>
                <div className="text-xs text-slate-500">
                  {gastosNormales > 0 && gastosFijos > 0 && gastosCuotas > 0 
                    ? 'Normales + Fijos + Cuotas'
                    : gastosNormales > 0 && gastosFijos > 0
                    ? 'Normales + Fijos'
                    : 'Acumulado'
                  }
                </div>
              </div>
            </div>
            <span className="text-lg font-bold text-rose-400">
              €{totalGastos.toFixed(2)}
            </span>
          </div>
        </div>

        {/* BALANCE */}
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
              €{balance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* PROYECCIÓN */}
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Proyección del mes</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">
            Basado en tu gasto promedio diario de €{promedioDiario.toFixed(2)}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Gasto proyectado:</span>
              <span className={`font-semibold ${porcentajeProyeccion > 100 ? 'text-rose-400' : 'text-slate-300'}`}>
                €{proyeccion.toFixed(0)}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${Math.min(porcentajeProyeccion, 100)}%`,
                  background: porcentajeProyeccion > 100 
                    ? 'linear-gradient(90deg, #ef4444, #f87171)' 
                    : 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{porcentajeProyeccion.toFixed(1)}% del presupuesto</span>
              <span className={porcentajeProyeccion > 100 ? 'text-rose-400' : 'text-slate-400'}>
                {porcentajeProyeccion > 100 ? 'Sobre presupuesto' : 'Dentro del presupuesto'}
              </span>
            </div>
          </div>
        </div>

        {/* RESUMEN RÁPIDO */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center p-2 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Día {hoy}</div>
            <div className="text-sm font-medium text-white">€{promedioDiario.toFixed(0)}/día</div>
          </div>
          <div className="text-center p-2 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Restante</div>
            <div className="text-sm font-medium text-slate-300">
              {diasMes - hoy} días
            </div>
          </div>
          <div className="text-center p-2 bg-slate-800/30 rounded-lg">
            <div className="text-xs text-slate-400">Por gastar</div>
            <div className={`text-sm font-medium ${ingresosMes - totalGastos < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              €{(ingresosMes - totalGastos).toFixed(0)}
            </div>
          </div>
        </div>

        {/* INDICADOR DE SALUD FINANCIERA */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
          {porcentajeGastado > 90 ? (
            <span className="text-rose-400">⚠️ Alto porcentaje gastado ({porcentajeGastado.toFixed(0)}%)</span>
          ) : porcentajeGastado > 70 ? (
            <span className="text-amber-400">🔶 Moderado ({porcentajeGastado.toFixed(0)}% gastado)</span>
          ) : (
            <span className="text-emerald-400">✅ Saludable ({porcentajeGastado.toFixed(0)}% gastado)</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}