import { useState, useMemo, useEffect } from 'react';
import { 
  Download, 
  Filter,
  Calendar,
  CreditCard,
  Database,
  Tag,
  TrendingDown,
  Bell,
  ChevronDown,
  FileText,
  Wallet,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Clock,
  TrendingUp,
  PieChart,
  Target,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Percent,
  Zap,
  Shield,
  Thermometer,
  Repeat,
  Calculator,
  Receipt,
  TrendingUp as TrendingUpIcon,
  HelpCircle
} from 'lucide-react';

export default function TablaGastos() {
  // Estados para los datos de Notion
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nuevos estados para pagos fijos y cuotas
  const [pagosFijos, setPagosFijos] = useState([]);
  const [comprasCuotas, setComprasCuotas] = useState([]);

  // Estados de filtros
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // ========== CARGAR TODOS LOS DATOS ==========
  useEffect(() => {
    const fetchTodosLosDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar gastos normales
        const resGastos = await fetch('/api/gastos');
        if (!resGastos.ok) throw new Error('Error cargando gastos');
        const gastosData = await resGastos.json();
        setGastosMensuales(gastosData);

        // 2. Cargar pagos fijos
        const resPagos = await fetch('/api/pagos-fijos');
        if (resPagos.ok) {
          const pagosData = await resPagos.json();
          setPagosFijos(pagosData.filter(p => p.activo === true));
        }

        // 3. Cargar compras a cuotas
        const resCuotas = await fetch('/api/compras-cuotas');
        if (resCuotas.ok) {
          const cuotasData = await resCuotas.json();
          setComprasCuotas(cuotasData.filter(c => c.activo === true));
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching datos:', err);
        
        // Datos de ejemplo MEJORADOS para explicar
        setGastosMensuales([
          { id: 1, fecha: '2026-01-02', concepto: 'Mercado', metodo: 'App', categoria: 'Alimentación', cuenta: 'Móvil', monto: 50 },
          { id: 2, fecha: '2026-01-03', concepto: 'Mami', metodo: 'Bizum', categoria: 'Familia', cuenta: 'Bizum', monto: 20 },
        ]);
        
        setPagosFijos([
          { id: '1', nombre: 'Alquiler', monto: 850.00, metodo: 'Transferencia', categoria: 'Vivienda', frecuencia: 'mensual', activo: true, fechaInicio: '2026-02-01' }
        ]);
        
        // Datos REALES de Configuración.jsx (como los tienes)
        setComprasCuotas([
          { 
            id: '1', 
            concepto: 'AliExpress 1', 
            montoTotal: 33.74,
            cuotasTotales: 4,
            cuotasPagadas: 3, // ← 3 CUOTAS PAGADAS de 4
            fechaInicio: '2025-11-01',
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 10.00, pagada: true, fecha: '2025-11-01' },
              { numero: 2, monto: 8.64, pagada: true, fecha: '2025-12-01' },
              { numero: 3, monto: 7.64, pagada: true, fecha: '2026-01-01' },
              { numero: 4, monto: 7.46, pagada: false, fecha: '2026-02-01' } // ← PRÓXIMA CUOTA
            ]
          },
          { 
            id: '2', 
            concepto: 'Shein', 
            montoTotal: 50.74,
            cuotasTotales: 4,
            cuotasPagadas: 1, // ← 1 CUOTA PAGADA de 4
            fechaInicio: '2026-01-01',
            metodo: 'Tarjeta',
            categoria: 'Ropa',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 12.69, pagada: true, fecha: '2026-01-01' }, // ← YA PAGADA
              { numero: 2, monto: 12.69, pagada: false, fecha: '2026-02-01' }, // ← PRÓXIMA CUOTA
              { numero: 3, monto: 12.68, pagada: false, fecha: '2026-03-01' },
              { numero: 4, monto: 12.68, pagada: false, fecha: '2026-04-01' }
            ]
          },
          { 
            id: '3', 
            concepto: 'AliExpress 3', 
            montoTotal: 49.95,
            cuotasTotales: 3,
            cuotasPagadas: 1, // ← 1 CUOTA PAGADA de 3
            fechaInicio: '2026-01-01',
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 16.65, pagada: true, fecha: '2026-01-01' }, // ← YA PAGADA
              { numero: 2, monto: 16.65, pagada: false, fecha: '2026-02-01' }, // ← PRÓXIMA CUOTA
              { numero: 3, monto: 16.65, pagada: false, fecha: '2026-03-01' }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodosLosDatos();
  }, []);

  // ========== FUNCIONES DE TRANSFORMACIÓN MEJORADAS ==========

  // 1. Transformar pagos fijos en gastos
  const transformarPagosFijosAGastos = useMemo(() => {
    return pagosFijos.map(pago => {
      const fechaInicio = new Date(pago.fechaInicio || '2026-02-01');
      const diaPago = fechaInicio.getDate();
      
      let fechaGasto;
      if (filtroMes) {
        const [year, month] = filtroMes.split('-');
        fechaGasto = new Date(year, month - 1, diaPago);
      } else {
        const hoy = new Date();
        let proximoPago = new Date(hoy.getFullYear(), hoy.getMonth(), diaPago);
        if (proximoPago < hoy) {
          proximoPago.setMonth(proximoPago.getMonth() + 1);
        }
        fechaGasto = proximoPago;
      }
      
      const fechaStr = fechaGasto.toISOString().split('T')[0];
      const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
      
      // NO incluir enero 2026
      if (mesGasto === '2026-01') return null;
      
      return {
        id: `pago-fijo-${pago.id}`,
        fecha: fechaStr,
        concepto: `${pago.nombre}`,
        metodo: pago.metodo,
        categoria: pago.categoria,
        cuenta: 'Cuenta Principal',
        monto: parseFloat(pago.monto),
        origen: 'pago_fijo',
        frecuencia: pago.frecuencia,
        esFuturo: true
      };
    }).filter(Boolean);
  }, [pagosFijos, filtroMes]);

  // 2. Transformar cuotas en gastos - CON FORMATO CLARO
  const transformarCuotasAGastos = useMemo(() => {
    const gastosCuotas = [];
    
    comprasCuotas.forEach(compra => {
      // Encontrar la próxima cuota no pagada
      const proximaCuota = compra.historialCuotas?.find(cuota => !cuota.pagada);
      
      // Si no hay cuotas pendientes, no mostrar
      if (!proximaCuota) return;
      
      // Calcular cuántas cuotas se han pagado realmente
      const cuotasPagadas = compra.cuotasPagadas || 
                           compra.historialCuotas.filter(c => c.pagada).length;
      
      const cuotasPendientes = compra.cuotasTotales - cuotasPagadas;
      
      // FORMATO CLARO Y EXPLÍCITO
      const concepto = `${compra.concepto}`;
      const infoCuota = `Cuota ${proximaCuota.numero} de ${compra.cuotasTotales}`;
      const infoProgreso = `${cuotasPagadas}/${compra.cuotasTotales} pagadas`;
      
      // Solo incluir si no es enero 2026
      const fechaCuota = new Date(proximaCuota.fecha);
      const mesCuota = `${fechaCuota.getFullYear()}-${String(fechaCuota.getMonth() + 1).padStart(2, '0')}`;
      if (mesCuota === '2026-01') return;
      
      // Aplicar filtro de mes si existe
      if (filtroMes && mesCuota !== filtroMes) return;
      
      gastosCuotas.push({
        id: `cuota-${compra.id}-${proximaCuota.numero}`,
        fecha: proximaCuota.fecha,
        concepto: concepto,
        metodo: compra.metodo,
        categoria: compra.categoria,
        cuenta: 'Financiación',
        monto: parseFloat(proximaCuota.monto.toFixed(2)),
        origen: 'cuota',
        // Información para mostrar CLARAMENTE
        infoCuota: infoCuota, // "Cuota 4 de 4"
        infoProgreso: infoProgreso, // "3/4 pagadas"
        cuotaNumero: proximaCuota.numero,
        totalCuotas: compra.cuotasTotales,
        cuotasPagadas: cuotasPagadas,
        cuotasPendientes: cuotasPendientes,
        esFuturo: true
      });
    });
    
    return gastosCuotas;
  }, [comprasCuotas, filtroMes]);

  // 3. Obtener meses únicos
  const obtenerMesesDisponibles = useMemo(() => {
    const mesesSet = new Set();
    
    gastosMensuales.forEach(gasto => {
      if (gasto.fecha) {
        try {
          const fecha = new Date(gasto.fecha);
          if (!isNaN(fecha.getTime())) {
            const año = fecha.getFullYear();
            const mes = fecha.getMonth() + 1;
            const mesFormateado = `${año}-${mes.toString().padStart(2, '0')}`;
            mesesSet.add(mesFormateado);
          }
        } catch (error) {
          console.error('Error procesando fecha:', gasto.fecha, error);
        }
      }
    });
    
    transformarPagosFijosAGastos.forEach(gasto => {
      if (gasto.fecha) {
        try {
          const fecha = new Date(gasto.fecha);
          const año = fecha.getFullYear();
          const mes = fecha.getMonth() + 1;
          const mesFormateado = `${año}-${mes.toString().padStart(2, '0')}`;
          mesesSet.add(mesFormateado);
        } catch (error) {
          console.error('Error procesando fecha pago fijo:', gasto.fecha, error);
        }
      }
    });
    
    transformarCuotasAGastos.forEach(gasto => {
      if (gasto.fecha) {
        try {
          const fecha = new Date(gasto.fecha);
          const año = fecha.getFullYear();
          const mes = fecha.getMonth() + 1;
          const mesFormateado = `${año}-${mes.toString().padStart(2, '0')}`;
          mesesSet.add(mesFormateado);
        } catch (error) {
          console.error('Error procesando fecha cuota:', gasto.fecha, error);
        }
      }
    });
    
    const mesesArray = Array.from(mesesSet);
    return mesesArray.sort((a, b) => b.localeCompare(a));
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos]);

  // 4. Función para formatear mes a texto
  const formatearMesTexto = (mesFormato) => {
    if (!mesFormato) return '';
    const [año, mes] = mesFormato.split('-');
    const fecha = new Date(año, parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // ========== COMBINAR GASTOS ==========

  const todosLosGastos = useMemo(() => {
    const gastosCombinados = [...gastosMensuales];
    
    if (!filtroMes || filtroMes !== '2026-01') {
      gastosCombinados.push(...transformarPagosFijosAGastos);
      gastosCombinados.push(...transformarCuotasAGastos);
    }
    
    return gastosCombinados;
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos, filtroMes]);

  const gastosFiltrados = useMemo(() => {
    return todosLosGastos.filter(gasto => {
      if (!gasto.fecha) return false;
      
      const fechaGasto = new Date(gasto.fecha);
      if (isNaN(fechaGasto.getTime())) return false;
      
      const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
      
      const cumpleMes = !filtroMes || mesGasto === filtroMes;
      const cumpleMetodo = !filtroMetodo || gasto.metodo === filtroMetodo;
      const cumpleCategoria = !filtroCategoria || gasto.categoria === filtroCategoria;
      
      return cumpleMes && cumpleMetodo && cumpleCategoria;
    });
  }, [todosLosGastos, filtroMes, filtroMetodo, filtroCategoria]);

  // ========== CÁLCULOS ==========

  const total = useMemo(() => {
    return gastosFiltrados.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
  }, [gastosFiltrados]);

  const estadisticasPorTipo = useMemo(() => {
    const stats = {
      normal: { total: 0, count: 0, label: 'Gastos Normales' },
      pago_fijo: { total: 0, count: 0, label: 'Pagos Fijos' },
      cuota: { total: 0, count: 0, label: 'Cuotas' }
    };
    
    gastosFiltrados.forEach(gasto => {
      const tipo = gasto.origen || 'normal';
      if (stats[tipo]) {
        stats[tipo].total += gasto.monto || 0;
        stats[tipo].count += 1;
      } else {
        stats.normal.total += gasto.monto || 0;
        stats.normal.count += 1;
      }
    });
    
    return stats;
  }, [gastosFiltrados]);

  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto', 'Origen', 'Info_Cuota', 'Progreso'];
    const filas = gastosFiltrados.map(g => [
      g.fecha, 
      g.concepto, 
      g.metodo, 
      g.categoria, 
      g.cuenta, 
      g.monto, 
      g.origen || 'normal',
      g.infoCuota || '',
      g.infoProgreso || ''
    ].join(','));
    
    const csv = [headers.join(','), ...filas].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gastos_${filtroMes || 'todos'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ========== ESTADOS DE CARGA ==========
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-red-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Cargando datos financieros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <h2 className="text-xl font-bold text-white">Error al cargar datos</h2>
            </div>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDER CON EXPLICACIÓN CLARA ==========
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* EXPLICACIÓN DEL FORMATO */}
      <div className="mb-6 bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-blue-300">📊 Explicación del formato de cuotas</h3>
        </div>
        <div className="text-sm text-slate-300 space-y-1">
          <p>Cuando ves <span className="text-purple-400">"Shein (Cuota 2 de 4)"</span> significa:</p>
          <div className="ml-4">
            <p>• <span className="text-purple-400">"Cuota 2"</span>: Es la <strong>segunda cuota</strong> de la compra</p>
            <p>• <span className="text-purple-400">"de 4"</span>: Hay <strong>4 cuotas en total</strong></p>
            <p>• En Configuración dice <span className="text-amber-400">"1 de 4 pagadas"</span>: Ya pagaste <strong>1 cuota</strong>, esta es la <strong>cuota #2</strong></p>
          </div>
          <p className="mt-2 text-blue-400">💡 <strong>"Cuota X de Y"</strong> = Esta es la cuota número X de Y cuotas totales</p>
        </div>
      </div>

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard Financiero</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-red-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? formatearMesTexto(filtroMes) : 'Próximos gastos'}
              </span>
              <span className="text-slate-500 text-sm bg-slate-900 px-3 py-1 rounded-full">
                {gastosFiltrados.length} transacciones
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-3">
              {Object.entries(estadisticasPorTipo).map(([tipo, data]) => {
                if (data.count > 0) {
                  return (
                    <div key={tipo} className={`text-xs px-3 py-1 rounded-full ${
                      tipo === 'normal' ? 'bg-slate-900 text-slate-400' :
                      tipo === 'pago_fijo' ? 'bg-amber-900/30 text-amber-400' :
                      'bg-purple-900/30 text-purple-400'
                    }`}>
                      {data.count} {data.label}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          
          <button 
            onClick={exportarCSV}
            className="flex items-center gap-3 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
          >
            <Download className="h-5 w-5" />
            <FileText className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
          {/* PANEL DE FILTROS */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Calendar className="h-4 w-4 text-red-400" />
                  Mes
                </label>
                <div className="relative">
                  <select 
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  >
                    <option value="">Próximos gastos</option>
                    {obtenerMesesDisponibles.map((mes) => (
                      <option key={mes} value={mes}>
                        {formatearMesTexto(mes)}
                        {mes === '2026-01' && ' (sin pagos fijos)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <CreditCard className="h-4 w-4 text-purple-400" />
                  Método de pago
                </label>
                <div className="relative">
                  <select 
                    value={filtroMetodo}
                    onChange={(e) => setFiltroMetodo(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  >
                    <option value="">Todos los métodos</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Bizum">Bizum</option>
                    <option value="App">App</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Tag className="h-4 w-4 text-yellow-400" />
                  Categoría
                </label>
                <div className="relative">
                  <select 
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  >
                    <option value="">Todas las categorías</option>
                    <option value="Vivienda">Vivienda</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Familia">Familia</option>
                    <option value="Otros">Otros</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg mb-4">
                <div>
                  <div className="text-sm text-slate-400">Total filtrado</div>
                  <div className="text-xl font-bold text-red-400">€{total.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Transacciones</div>
                  <div className="text-lg font-semibold text-slate-300">{gastosFiltrados.length}</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setFiltroMes('');
                  setFiltroMetodo('');
                  setFiltroCategoria('');
                }}
                className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - TABLA */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {filtroMes ? `Gastos de ${formatearMesTexto(filtroMes)}` : 'Próximos gastos'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} transacciones
                  </p>
                </div>
              </div>
            </div>

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
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-slate-800">
                  {gastosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="text-slate-500">
                          <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No hay gastos para mostrar</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gastosFiltrados.map((gasto) => {
                      return (
                        <tr key={gasto.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {gasto.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {gasto.concepto}
                              {gasto.origen === 'cuota' && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Calculator className="h-3 w-3 text-purple-400" />
                                  <span className="text-xs text-purple-400">
                                    {gasto.infoCuota}
                                  </span>
                                  <HelpCircle 
                                    className="h-3 w-3 text-slate-500 cursor-help" 
                                    title={`Progreso: ${gasto.infoProgreso}\nCuotas pendientes: ${gasto.cuotasPendientes}`}
                                  />
                                </div>
                              )}
                              {gasto.origen === 'pago_fijo' && (
                                <div className="text-xs text-amber-500 mt-1">
                                  Pago fijo • {gasto.frecuencia}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                              {gasto.metodo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                              gasto.origen === 'cuota' ? 'bg-purple-900/30 text-purple-300' :
                              gasto.origen === 'pago_fijo' ? 'bg-amber-900/30 text-amber-300' :
                              'bg-blue-900/30 text-blue-300'
                            }`}>
                              {gasto.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${
                              gasto.origen === 'cuota' ? 'text-purple-400' :
                              gasto.origen === 'pago_fijo' ? 'text-amber-400' :
                              'text-red-400'
                            }`}>
                              €{gasto.monto?.toFixed(2) || '0.00'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* EJEMPLOS DE FORMATO */}
          <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">📝 Ejemplos de cómo interpretar la tabla:</h4>
            <div className="text-sm text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500"></div>
                <div>
                  <span className="text-purple-300">"AliExpress 1" con </span>
                  <span className="text-purple-400">"Cuota 4 de 4"</span>
                  <span className="text-slate-500"> → Es la </span>
                  <span className="text-amber-300">cuarta y última cuota</span>
                  <span className="text-slate-500"> (ya pagaste 3 de 4)</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500"></div>
                <div>
                  <span className="text-purple-300">"Shein" con </span>
                  <span className="text-purple-400">"Cuota 2 de 4"</span>
                  <span className="text-slate-500"> → Es la </span>
                  <span className="text-amber-300">segunda cuota</span>
                  <span className="text-slate-500"> (ya pagaste 1 de 4)</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                💡 Pasa el cursor sobre el icono <HelpCircle className="h-3 w-3 inline text-slate-500" /> para ver el progreso detallado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}