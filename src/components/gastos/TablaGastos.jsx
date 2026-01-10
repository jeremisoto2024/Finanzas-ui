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
        
        // Datos de ejemplo como fallback
        setGastosMensuales([
          { id: 1, fecha: '2025-01-01', concepto: 'Alquiler', metodo: 'Transferencia', categoria: 'Vivienda', cuenta: 'BBVA', monto: 850 },
          { id: 2, fecha: '2025-01-05', concepto: 'Supermercado', metodo: 'Tarjeta', categoria: 'Alimentación', cuenta: 'Santander', monto: 120 },
          { id: 3, fecha: '2025-01-10', concepto: 'Gasolina', metodo: 'Tarjeta', categoria: 'Transporte', cuenta: 'Santander', monto: 60 },
          { id: 4, fecha: '2025-01-12', concepto: 'Netflix', metodo: 'Tarjeta', categoria: 'Entretenimiento', cuenta: 'BBVA', monto: 15 },
          { id: 5, fecha: '2025-01-15', concepto: 'Restaurante', metodo: 'Tarjeta', categoria: 'Comida Fuera', cuenta: 'Santander', monto: 45 },
          { id: 6, fecha: '2025-01-18', concepto: 'Gimnasio', metodo: 'Transferencia', categoria: 'Salud', cuenta: 'BBVA', monto: 30 },
          { id: 7, fecha: '2025-01-20', concepto: 'Compras Online', metodo: 'Tarjeta', categoria: 'Compras', cuenta: 'Revolut', monto: 85 },
        ]);
        
        setPagosFijos([
          { id: '1', nombre: 'Netflix', monto: 12.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true, fechaInicio: '2025-02-01' },
          { id: '2', nombre: 'Gimnasio', monto: 45.00, metodo: 'Transferencia', categoria: 'Salud', frecuencia: 'mensual', activo: true, fechaInicio: '2025-02-01' },
          { id: '3', nombre: 'Spotify', monto: 9.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true, fechaInicio: '2025-02-01' }
        ]);
        
        setComprasCuotas([
          { 
            id: '1', 
            concepto: 'iPhone 15 Pro', 
            montoTotal: 1199.00, 
            cuotasTotales: 12,
            cuotasPagadas: 3,
            montoPrimeraCuota: 150.00,
            montoUltimaCuota: 49.00,
            fechaInicio: '2024-12-01', // Empezó en diciembre
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual'
          },
          { 
            id: '2', 
            concepto: 'Sofá nuevo', 
            montoTotal: 800.00, 
            cuotasTotales: 6,
            cuotasPagadas: 2,
            fechaInicio: '2025-01-01',
            metodo: 'Tarjeta',
            categoria: 'Hogar',
            activo: true,
            frecuenciaPago: 'mensual'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodosLosDatos();
  }, []);

  // ========== FUNCIONES DE TRANSFORMACIÓN CORREGIDAS ==========

  // 1. Transformar pagos fijos en gastos (SOLO para el mes filtrado o próximo)
  const transformarPagosFijosAGastos = useMemo(() => {
    return pagosFijos.map(pago => {
      // Obtener el día del mes del pago
      const fechaInicio = new Date(pago.fechaInicio || '2025-02-01');
      const diaPago = fechaInicio.getDate();
      
      let fechaGasto;
      if (filtroMes) {
        // Construir fecha en el mes filtrado
        const [year, month] = filtroMes.split('-');
        fechaGasto = new Date(year, month - 1, diaPago);
      } else {
        // Si no hay filtro, usar el próximo pago desde hoy
        const hoy = new Date();
        const proximoPago = new Date(hoy.getFullYear(), hoy.getMonth(), diaPago);
        if (proximoPago < hoy) {
          proximoPago.setMonth(proximoPago.getMonth() + 1);
        }
        fechaGasto = proximoPago;
      }
      
      const fechaStr = fechaGasto.toISOString().split('T')[0];
      const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
      
      // NO incluir enero 2025
      if (mesGasto === '2025-01') return null;
      
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
        esFuturo: true
      };
    }).filter(Boolean);
  }, [pagosFijos, filtroMes]);

  // 2. Transformar cuotas en gastos - SOLO LA PRÓXIMA CUOTA DE CADA COMPRA
  const transformarCuotasAGastos = useMemo(() => {
    const gastosCuotas = [];
    
    comprasCuotas.forEach(compra => {
      // Calcular cuál es la próxima cuota a pagar
      const proximaCuotaNumero = compra.cuotasPagadas + 1;
      
      // Si ya pagó todas las cuotas, no mostrar nada
      if (proximaCuotaNumero > compra.cuotasTotales) return;
      
      // Calcular monto de la próxima cuota
      let montoCuota;
      if (compra.montoPrimeraCuota && proximaCuotaNumero === 1) {
        montoCuota = compra.montoPrimeraCuota;
      } else if (compra.montoUltimaCuota && proximaCuotaNumero === compra.cuotasTotales) {
        montoCuota = compra.montoUltimaCuota;
      } else {
        // Calcular monto promedio para cuotas intermedias
        const montoRestante = compra.montoTotal - 
          (compra.montoPrimeraCuota || 0) - 
          (compra.montoUltimaCuota || 0);
        const cuotasIntermedias = compra.cuotasTotales - 
          (compra.montoPrimeraCuota ? 1 : 0) - 
          (compra.montoUltimaCuota ? 1 : 0);
        
        if (cuotasIntermedias > 0) {
          montoCuota = montoRestante / cuotasIntermedias;
        } else {
          montoCuota = compra.montoTotal / compra.cuotasTotales;
        }
      }
      
      // Calcular fecha de la próxima cuota
      const fechaInicio = new Date(compra.fechaInicio);
      const fechaCuota = new Date(fechaInicio);
      fechaCuota.setMonth(fechaInicio.getMonth() + (proximaCuotaNumero - 1));
      
      const fechaStr = fechaCuota.toISOString().split('T')[0];
      const mesCuota = `${fechaCuota.getFullYear()}-${String(fechaCuota.getMonth() + 1).padStart(2, '0')}`;
      
      // NO incluir enero 2025
      if (mesCuota === '2025-01') return;
      
      // Si hay filtro de mes, verificar coincidencia
      if (filtroMes && mesCuota !== filtroMes) return;
      
      gastosCuotas.push({
        id: `cuota-${compra.id}-${proximaCuotaNumero}`,
        fecha: fechaStr,
        concepto: `${compra.concepto} (Cuota ${proximaCuotaNumero}/${compra.cuotasTotales})`,
        metodo: compra.metodo,
        categoria: compra.categoria,
        cuenta: 'Financiación',
        monto: parseFloat(montoCuota.toFixed(2)),
        origen: 'cuota',
        cuotaNumero: proximaCuotaNumero,
        totalCuotas: compra.cuotasTotales,
        esFuturo: true
      });
    });
    
    return gastosCuotas;
  }, [comprasCuotas, filtroMes]);

  // 3. Obtener meses únicos de TODOS los datos
  const obtenerMesesDisponibles = useMemo(() => {
    const mesesSet = new Set();
    
    // Agregar meses de gastos normales
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
    
    // Agregar meses de pagos fijos
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
    
    // Agregar meses de cuotas
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

  // ========== COMBINAR Y FILTRAR DATOS ==========

  // Combinar TODOS los gastos (sin enero 2025 para pagos fijos/cuotas)
  const todosLosGastos = useMemo(() => {
    const gastosCombinados = [...gastosMensuales];
    
    // Solo agregar pagos fijos/cuotas si NO es enero 2025
    if (!filtroMes || filtroMes !== '2025-01') {
      gastosCombinados.push(...transformarPagosFijosAGastos);
      gastosCombinados.push(...transformarCuotasAGastos);
    }
    
    return gastosCombinados;
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos, filtroMes]);

  // Filtrar gastos combinados
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

  // 1. Total
  const total = useMemo(() => {
    return gastosFiltrados.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
  }, [gastosFiltrados]);

  // 2. Estadísticas por tipo de gasto
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

  // 3. Exportar CSV
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
                {filtroMes ? formatearMesTexto(filtroMes) : 'Próximos gastos'}
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
            
            {/* NOTA IMPORTANTE */}
            {filtroMes === '2025-01' && (
              <div className="mt-3 text-sm text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg">
                ⓘ Los pagos fijos y cuotas de enero 2025 ya están cubiertos
              </div>
            )}
            
            {/* NOTA SOBRE CUOTAS */}
            {estadisticasPorTipo.cuota.count > 0 && (
              <div className="mt-2 text-sm text-purple-400">
                💡 Mostrando solo la próxima cuota de cada compra a plazos
              </div>
            )}
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
                    <option value="">Próximos gastos</option>
                    {obtenerMesesDisponibles.map((mes) => (
                      <option key={mes} value={mes}>
                        {formatearMesTexto(mes)}
                        {mes === '2025-01' && ' (sin pagos fijos)'}
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
                    <option value="Educación">Educación</option>
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

          {/* TARJETA DE ANÁLISIS */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-red-400" />
              Análisis por tipo
            </h3>
            <div className="space-y-3">
              {Object.entries(estadisticasPorTipo).map(([tipo, data]) => {
                if (data.count === 0) return null;
                
                return (
                  <div key={tipo} className={`p-3 rounded-lg border ${
                    tipo === 'normal' ? 'bg-slate-800/50 border-slate-700' :
                    tipo === 'pago_fijo' ? 'bg-amber-900/20 border-amber-800/30' :
                    'bg-purple-900/20 border-purple-800/30'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {tipo === 'normal' && <Receipt className="h-4 w-4 text-slate-400" />}
                        {tipo === 'pago_fijo' && <Repeat className="h-4 w-4 text-amber-400" />}
                        {tipo === 'cuota' && <Calculator className="h-4 w-4 text-purple-400" />}
                        <span className="text-sm text-slate-300">{data.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-white">{data.count}</span>
                        <div className={`text-xs ${
                          tipo === 'normal' ? 'text-slate-400' :
                          tipo === 'pago_fijo' ? 'text-amber-400' :
                          'text-purple-400'
                        }`}>
                          €{data.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    {filtroMes ? `Gastos de ${formatearMesTexto(filtroMes)}` : 'Próximos gastos'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} transacciones
                    {estadisticasPorTipo.cuota.count > 0 && ' (una cuota por compra)'}
                  </p>
                </div>
              </div>
            </div>

            {/* TABLA */}
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
                      Origen
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-slate-800">
                  {gastosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <div className="text-slate-500">
                          <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No hay gastos para mostrar</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {filtroMes === '2025-01' 
                              ? 'Los pagos fijos y cuotas de enero ya están cubiertos'
                              : 'Cambia los filtros o agrega nuevos gastos'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gastosFiltrados.map((gasto) => {
                      let origenColor, origenBg, origenIcon;
                      
                      switch (gasto.origen) {
                        case 'pago_fijo':
                          origenColor = 'text-amber-400';
                          origenBg = 'bg-amber-900/30';
                          origenIcon = <Repeat className="h-3 w-3" />;
                          break;
                        case 'cuota':
                          origenColor = 'text-purple-400';
                          origenBg = 'bg-purple-900/30';
                          origenIcon = <Calculator className="h-3 w-3" />;
                          break;
                        default:
                          origenColor = 'text-slate-400';
                          origenBg = 'bg-slate-800';
                          origenIcon = <Receipt className="h-3 w-3" />;
                      }
                      
                      return (
                        <tr key={gasto.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {gasto.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{gasto.concepto}</div>
                            {gasto.cuotaNumero && (
                              <div className="text-xs text-slate-500">
                                Cuota {gasto.cuotaNumero}/{gasto.totalCuotas}
                              </div>
                            )}
                            {gasto.frecuencia && (
                              <div className="text-xs text-amber-500">
                                {gasto.frecuencia}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                              {gasto.metodo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300">
                              {gasto.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${origenBg} ${origenColor}`}>
                              {origenIcon}
                              {gasto.origen === 'pago_fijo' ? 'Pago Fijo' : 
                               gasto.origen === 'cuota' ? 'Cuota' : 'Normal'}
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
        </div>
      </div>
    </div>
  );
}