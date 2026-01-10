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
  TrendingUp as TrendingUpIcon
} from 'lucide-react';

export default function TablaGastos() {
  // Estados para los datos de Notion
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para pagos fijos y cuotas
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

        // 2. Cargar pagos fijos desde Configuración.jsx
        const resPagos = await fetch('/api/pagos-fijos');
        if (resPagos.ok) {
          const pagosData = await resPagos.json();
          setPagosFijos(pagosData.filter(p => p.activo === true));
        }

        // 3. Cargar compras a cuotas desde Configuración.jsx
        const resCuotas = await fetch('/api/compras-cuotas');
        if (resCuotas.ok) {
          const cuotasData = await resCuotas.json();
          setComprasCuotas(cuotasData.filter(c => c.activo === true));
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching datos:', err);
        
        // Datos de ejemplo REALES basados en tus imágenes
        setGastosMensuales([
          { id: 1, fecha: '2026-01-02', concepto: 'Mercado', metodo: 'App', categoria: 'Alimentación', cuenta: 'Móvil', monto: 50 },
          { id: 2, fecha: '2026-01-03', concepto: 'Mami', metodo: 'Bizum', categoria: 'Familia', cuenta: 'Bizum', monto: 20 },
          { id: 3, fecha: '2026-01-05', concepto: 'Refresco', metodo: 'App', categoria: 'Alimentación', cuenta: 'Móvil', monto: 2 },
        ]);
        
        // PAGOS FIJOS YA REALIZADOS (con fechas PASADAS)
        setPagosFijos([
          { 
            id: '1', 
            nombre: 'Alquiler Enero', 
            monto: 750.00, 
            metodo: 'Transferencia', 
            categoria: 'Vivienda', 
            frecuencia: 'mensual', 
            activo: true, 
            fechaInicio: '2026-01-01', // ← FECHA PASADA (ya pagado)
            fechaRealPago: '2026-01-01' // Fecha cuando realmente se pagó
          }
        ]);
        
        // CUOTAS YA PAGADAS (solo las que ya se han efectuado)
        setComprasCuotas([
          { 
            id: '1', 
            concepto: 'AliExpress 1', 
            montoTotal: 33.74,
            cuotasTotales: 4,
            cuotasPagadas: 3, // ← 3 CUOTAS YA PAGADAS
            montoPrimeraCuota: 10.00,
            montoUltimaCuota: 7.46,
            fechaInicio: '2025-11-01',
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 10.00, pagada: true, fecha: '2025-11-01' }, // ← YA PAGADA
              { numero: 2, monto: 8.64, pagada: true, fecha: '2025-12-01' }, // ← YA PAGADA
              { numero: 3, monto: 7.64, pagada: true, fecha: '2026-01-01' }, // ← YA PAGADA
              { numero: 4, monto: 7.46, pagada: false, fecha: '2026-02-01' } // ← FUTURA (NO aparecerá)
            ]
          },
          { 
            id: '2', 
            concepto: 'Shein', 
            montoTotal: 50.74,
            cuotasTotales: 4,
            cuotasPagadas: 1, // ← 1 CUOTA YA PAGADA
            fechaInicio: '2026-01-01',
            metodo: 'Tarjeta',
            categoria: 'Ropa',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 12.69, pagada: true, fecha: '2026-01-01' }, // ← YA PAGADA
              { numero: 2, monto: 12.69, pagada: false, fecha: '2026-02-01' }, // ← FUTURA (NO aparecerá)
              { numero: 3, monto: 12.68, pagada: false, fecha: '2026-03-01' },
              { numero: 4, monto: 12.68, pagada: false, fecha: '2026-04-01' }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodosLosDatos();
  }, []);

  // ========== FUNCIONES DE TRANSFORMACIÓN ==========

  // 1. Transformar pagos fijos YA EFECTUADOS en gastos
  const transformarPagosFijosAGastos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    
    return pagosFijos.map(pago => {
      // Usar fechaRealPago si existe, sino fechaInicio
      const fechaPagoStr = pago.fechaRealPago || pago.fechaInicio;
      const fechaPago = new Date(fechaPagoStr);
      fechaPago.setHours(0, 0, 0, 0);
      
      // SOLO incluir si la fecha de pago es HOY o PASADA
      if (fechaPago > hoy) {
        return null; // Pago futuro, no mostrar
      }
      
      const fechaStr = fechaPagoStr;
      const mesGasto = `${fechaPago.getFullYear()}-${String(fechaPago.getMonth() + 1).padStart(2, '0')}`;
      
      return {
        id: `pago-fijo-${pago.id}`,
        fecha: fechaStr,
        concepto: `${pago.nombre} (Pago Fijo)`,
        metodo: pago.metodo,
        categoria: pago.categoria,
        cuenta: 'Cuenta Principal',
        monto: parseFloat(pago.monto),
        origen: 'pago_fijo',
        frecuencia: pago.frecuencia,
        esHistorico: true
      };
    }).filter(Boolean);
  }, [pagosFijos]);

  // 2. Transformar CUOTAS YA PAGADAS en gastos
  const transformarCuotasAGastos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const gastosCuotas = [];
    
    comprasCuotas.forEach(compra => {
      // Verificar que tenga historial de cuotas
      if (!compra.historialCuotas || compra.historialCuotas.length === 0) {
        return;
      }
      
      // Filtrar SOLO cuotas PAGADAS con fecha HOY o PASADA
      compra.historialCuotas.forEach(cuota => {
        if (!cuota.pagada) return; // Solo cuotas pagadas
        
        const fechaCuota = new Date(cuota.fecha);
        fechaCuota.setHours(0, 0, 0, 0);
        
        // Solo incluir si la fecha es hoy o pasada
        if (fechaCuota <= hoy) {
          gastosCuotas.push({
            id: `cuota-${compra.id}-${cuota.numero}`,
            fecha: cuota.fecha,
            concepto: `${compra.concepto}`,
            metodo: compra.metodo,
            categoria: compra.categoria,
            cuenta: 'Financiación',
            monto: parseFloat(cuota.monto.toFixed(2)),
            origen: 'cuota',
            cuotaNumero: cuota.numero,
            totalCuotas: compra.cuotasTotales,
            cuotasPagadas: compra.cuotasPagadas,
            infoCuota: `Cuota ${cuota.numero} de ${compra.cuotasTotales}`,
            infoProgreso: `${compra.cuotasPagadas}/${compra.cuotasTotales} pagadas`,
            esHistorico: true
          });
        }
      });
    });
    
    return gastosCuotas;
  }, [comprasCuotas]);

  // 3. Obtener meses únicos de TODOS los gastos históricos
  const obtenerMesesDisponibles = useMemo(() => {
    const mesesSet = new Set();
    
    // Gastos normales
    gastosMensuales.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        mesesSet.add(mes);
      }
    });
    
    // Pagos fijos históricos
    transformarPagosFijosAGastos.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        mesesSet.add(mes);
      }
    });
    
    // Cuotas históricas
    transformarCuotasAGastos.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        mesesSet.add(mes);
      }
    });
    
    return Array.from(mesesSet).sort((a, b) => b.localeCompare(a));
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos]);

  // 4. Función para formatear mes
  const formatearMesTexto = (mesFormato) => {
    if (!mesFormato) return '';
    const [año, mes] = mesFormato.split('-');
    const fecha = new Date(año, parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // ========== COMBINAR TODOS LOS GASTOS HISTÓRICOS ==========
  const todosLosGastos = useMemo(() => {
    return [
      ...gastosMensuales.map(g => ({ ...g, origen: 'normal' })),
      ...transformarPagosFijosAGastos,
      ...transformarCuotasAGastos
    ];
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos]);

  // ========== FILTRAR GASTOS ==========
  const gastosFiltrados = useMemo(() => {
    return todosLosGastos.filter(gasto => {
      if (!gasto.fecha) return false;
      
      const fechaGasto = new Date(gasto.fecha);
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
      cuota: { total: 0, count: 0, label: 'Cuotas Pagadas' }
    };
    
    gastosFiltrados.forEach(gasto => {
      const tipo = gasto.origen || 'normal';
      if (stats[tipo]) {
        stats[tipo].total += gasto.monto || 0;
        stats[tipo].count += 1;
      }
    });
    
    return stats;
  }, [gastosFiltrados]);

  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto', 'Origen'];
    const filas = gastosFiltrados.map(g => [
      g.fecha, 
      g.concepto, 
      g.metodo, 
      g.categoria, 
      g.cuenta, 
      g.monto, 
      g.origen || 'normal'
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
          <p className="text-slate-500 text-sm mt-2">Gastos, pagos fijos y cuotas</p>
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

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard Financiero</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-red-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? formatearMesTexto(filtroMes) : 'Gastos históricos'}
              </span>
              <span className="text-slate-500 text-sm bg-slate-900 px-3 py-1 rounded-full">
                {gastosFiltrados.length} transacciones
              </span>
            </div>
            
            {/* DESGLOSE POR TIPO */}
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
            
            {/* NOTA EXPLICATIVA */}
            <div className="mt-3 text-sm text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg">
              💡 Mostrando solo gastos <strong>ya efectuados</strong> (históricos)
            </div>
          </div>
          
          {/* BOTÓN DE EXPORTAR */}
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

      {/* LAYOUT DE DOS COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA - FILTROS */}
        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
          {/* PANEL DE FILTROS */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>
            
            <div className="space-y-4">
              {/* FILTRO MES */}
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
                    <option value="">Todos los meses</option>
                    {obtenerMesesDisponibles.map((mes) => (
                      <option key={mes} value={mes}>
                        {formatearMesTexto(mes)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {/* FILTRO MÉTODO */}
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
                    <option value="Efectivo">Efectivo</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {/* FILTRO CATEGORÍA */}
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
                    <option value="Transporte">Transporte</option>
                    <option value="Entretenimiento">Entretenimiento</option>
                    <option value="Salud">Salud</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Familia">Familia</option>
                    <option value="Otros">Otros</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* RESUMEN */}
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
            {/* HEADER DE TABLA */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {filtroMes ? `Gastos de ${formatearMesTexto(filtroMes)}` : 'Todos los gastos históricos'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} transacciones efectuadas
                  </p>
                </div>
                <div className="text-sm text-slate-400">
                  💰 Gastos normales • 🔄 Pagos fijos • 🧮 Cuotas pagadas
                </div>
              </div>
            </div>

            {/* TABLA DETALLADA */}
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
                      Tipo
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
                          <p className="text-sm text-slate-600 mt-1">
                            Cambia los filtros o selecciona otro mes
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gastosFiltrados.map((gasto) => {
                      let tipoColor = '';
                      let tipoIcon = null;
                      let tipoText = '';
                      
                      switch (gasto.origen) {
                        case 'pago_fijo':
                          tipoColor = 'text-amber-400';
                          tipoIcon = <Repeat className="h-3 w-3" />;
                          tipoText = 'Pago Fijo';
                          break;
                        case 'cuota':
                          tipoColor = 'text-purple-400';
                          tipoIcon = <Calculator className="h-3 w-3" />;
                          tipoText = 'Cuota';
                          break;
                        default:
                          tipoColor = 'text-slate-400';
                          tipoIcon = <Receipt className="h-3 w-3" />;
                          tipoText = 'Normal';
                      }
                      
                      return (
                        <tr key={gasto.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {gasto.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {gasto.concepto}
                              {gasto.origen === 'cuota' && gasto.infoCuota && (
                                <div className="text-xs text-purple-400 mt-1">
                                  {gasto.infoCuota} • {gasto.infoProgreso}
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
                            <div className={`flex items-center gap-2 ${tipoColor}`}>
                              {tipoIcon}
                              <span className="text-xs font-medium">{tipoText}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300">
                              {gasto.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-semibold text-red-400">
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
          
          {/* RESUMEN DE LO QUE SE MUESTRA */}
          <div className="mt-4 p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-400">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-3 w-3 text-slate-400" />
                <span>Gastos normales: {estadisticasPorTipo.normal.count}</span>
              </div>
              <div className="flex items-center gap-2">
                <Repeat className="h-3 w-3 text-amber-400" />
                <span>Pagos fijos: {estadisticasPorTipo.pago_fijo.count}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calculator className="h-3 w-3 text-purple-400" />
                <span>Cuotas pagadas: {estadisticasPorTipo.cuota.count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}