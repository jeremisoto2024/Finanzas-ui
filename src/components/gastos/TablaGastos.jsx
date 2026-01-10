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
  Receipt
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
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Mes actual (para no mostrar pagos fijos de enero 2025)
  const mesActual = '2025-01'; // Enero 2025 ya está cubierto
  const mesSiguiente = '2025-02'; // Febrero 2025 es futuro

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

        // 2. Cargar pagos fijos (de Configuracion.jsx)
        const resPagos = await fetch('/api/pagos-fijos');
        if (resPagos.ok) {
          const pagosData = await resPagos.json();
          // Filtrar solo pagos fijos ACTIVOS
          setPagosFijos(pagosData.filter(p => p.activo === true));
        }

        // 3. Cargar compras a cuotas (de Configuracion.jsx)
        const resCuotas = await fetch('/api/compras-cuotas');
        if (resCuotas.ok) {
          const cuotasData = await resCuotas.json();
          // Filtrar solo compras ACTIVAS
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
          { id: 8, fecha: '2025-02-01', concepto: 'Alquiler Febrero', metodo: 'Transferencia', categoria: 'Vivienda', cuenta: 'BBVA', monto: 850 },
          { id: 9, fecha: '2025-02-15', concepto: 'Supermercado Feb', metodo: 'Tarjeta', categoria: 'Alimentación', cuenta: 'Santander', monto: 110 },
        ]);
        
        // Datos de ejemplo para pagos fijos (ACTIVOS)
        setPagosFijos([
          { id: '1', nombre: 'Netflix', monto: 12.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true, fechaInicio: '2025-02-01' },
          { id: '2', nombre: 'Gimnasio', monto: 45.00, metodo: 'Transferencia', categoria: 'Salud', frecuencia: 'mensual', activo: true, fechaInicio: '2025-02-01' },
          { id: '3', nombre: 'Spotify', monto: 9.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true, fechaInicio: '2025-02-01' }
        ]);
        
        // Datos de ejemplo para compras a cuotas (ACTIVAS)
        setComprasCuotas([
          { 
            id: '1', 
            concepto: 'iPhone 15 Pro', 
            montoTotal: 1199.00, 
            cuotasTotales: 12,
            cuotasPagadas: 3,
            montoPrimeraCuota: 150.00,
            montoUltimaCuota: 49.00,
            tipoCuotas: 'decreciente',
            fechaInicio: '2025-02-01',
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 150.00, pagada: false, fecha: '2025-02-01' },
              { numero: 2, monto: 140.00, pagada: false, fecha: '2025-03-01' },
              { numero: 3, monto: 130.00, pagada: false, fecha: '2025-04-01' },
              { numero: 4, monto: 120.00, pagada: false, fecha: '2025-05-01' },
              { numero: 5, monto: 110.00, pagada: false, fecha: '2025-06-01' }
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

  // 1. Transformar pagos fijos en gastos (SOLO para meses FUTUROS)
  const transformarPagosFijosAGastos = useMemo(() => {
    return pagosFijos.map(pago => {
      // Crear fecha para el mes filtrado (o usar fechaInicio si no hay filtro)
      let fechaGasto;
      if (filtroMes) {
        // Crear fecha el día 1 del mes filtrado
        const [year, month] = filtroMes.split('-');
        fechaGasto = `${year}-${month}-01`;
      } else {
        // Si no hay filtro, usar fechaInicio del pago
        fechaGasto = pago.fechaInicio || '2025-02-01';
      }
      
      return {
        id: `pago-fijo-${pago.id}`,
        fecha: fechaGasto,
        concepto: `${pago.nombre} (Pago Fijo)`,
        metodo: pago.metodo,
        categoria: pago.categoria,
        cuenta: 'Cuenta Principal',
        monto: parseFloat(pago.monto),
        tipo: 'recurrente',
        frecuencia: pago.frecuencia,
        origen: 'pago_fijo',
        esFuturo: true // Marcar como gasto futuro
      };
    });
  }, [pagosFijos, filtroMes]);

  // 2. Transformar cuotas del mes en gastos (SOLO para meses FUTUROS)
  const transformarCuotasAGastos = useMemo(() => {
    const gastosCuotas = [];
    
    comprasCuotas.forEach(compra => {
      const cuotasDelMes = compra.historialCuotas?.filter(cuota => {
        if (!cuota.fecha) return false;
        
        // Obtener mes de la cuota
        const fechaCuota = new Date(cuota.fecha);
        const mesCuota = `${fechaCuota.getFullYear()}-${String(fechaCuota.getMonth() + 1).padStart(2, '0')}`;
        
        // Si hay filtro de mes, comparar
        if (filtroMes) {
          return mesCuota === filtroMes && !cuota.pagada;
        }
        
        // Si no hay filtro, mostrar cuotas NO PAGADAS
        return !cuota.pagada;
      }) || [];
      
      cuotasDelMes.forEach(cuota => {
        gastosCuotas.push({
          id: `cuota-${compra.id}-${cuota.numero}`,
          fecha: cuota.fecha,
          concepto: `${compra.concepto} (Cuota ${cuota.numero}/${compra.cuotasTotales})`,
          metodo: compra.metodo,
          categoria: compra.categoria,
          cuenta: 'Financiación',
          monto: parseFloat(cuota.monto),
          tipo: 'financiacion',
          cuotaNumero: cuota.numero,
          totalCuotas: compra.cuotasTotales,
          origen: 'cuota',
          esFuturo: true // Marcar como gasto futuro
        });
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
    
    // Agregar meses de pagos fijos (SOLO futuros, excluyendo enero 2025)
    transformarPagosFijosAGastos.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fecha);
        const año = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const mesFormateado = `${año}-${mes.toString().padStart(2, '0')}`;
        
        // NO incluir enero 2025 (ya está cubierto)
        if (mesFormateado !== '2025-01') {
          mesesSet.add(mesFormateado);
        }
      }
    });
    
    // Agregar meses de cuotas
    transformarCuotasAGastos.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fasto.fecha);
        const año = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const mesFormateado = `${año}-${mes.toString().padStart(2, '0')}`;
        
        // NO incluir enero 2025 (ya está cubierto)
        if (mesFormateado !== '2025-01') {
          mesesSet.add(mesFormateado);
        }
      }
    });
    
    // Convertir a array y ordenar descendente
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

  // Combinar TODOS los gastos
  const todosLosGastos = useMemo(() => {
    const gastosCombinados = [...gastosMensuales];
    
    // IMPORTANTE: NO agregar pagos fijos/cuotas de ENERO 2025 (ya están cubiertos)
    if (!filtroMes || filtroMes !== '2025-01') {
      // Solo agregar pagos fijos si NO es enero 2025
      gastosCombinados.push(...transformarPagosFijosAGastos);
      gastosCombinados.push(...transformarCuotasAGastos);
    }
    
    return gastosCombinados;
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos, filtroMes]);

  // Filtrar gastos combinados
  const gastosFiltrados = useMemo(() => {
    return todosLosGastos.filter(gasto => {
      if (gasto.fecha) {
        const fechaGasto = new Date(gasto.fecha);
        const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
        
        const cumpleMes = !filtroMes || mesGasto === filtroMes;
        const cumpleMetodo = !filtroMetodo || gasto.metodo === filtroMetodo;
        const cumpleCuenta = !filtroCuenta || gasto.cuenta === filtroCuenta;
        const cumpleCategoria = !filtroCategoria || gasto.categoria === filtroCategoria;
        
        return cumpleMes && cumpleMetodo && cumpleCuenta && cumpleCategoria;
      }
      return false;
    });
  }, [todosLosGastos, filtroMes, filtroMetodo, filtroCuenta, filtroCategoria]);

  // ========== CÁLCULOS PRINCIPALES ==========

  // 1. Total
  const total = gastosFiltrados.reduce((sum, gasto) => sum + gasto.monto, 0);

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
        stats[tipo].total += gasto.monto;
        stats[tipo].count += 1;
      } else {
        stats.normal.total += gasto.monto;
        stats.normal.count += 1;
      }
    });
    
    return stats;
  }, [gastosFiltrados]);

  // 3. Calcular estadísticas por categoría
  const estadisticasCategorias = useMemo(() => {
    const categorias = {};
    
    gastosFiltrados.forEach(gasto => {
      if (!categorias[gasto.categoria]) {
        categorias[gasto.categoria] = {
          total: 0,
          count: 0,
          promedio: 0,
          porcentaje: 0,
          tipo: gasto.origen === 'pago_fijo' ? 'recurrente' : 
                gasto.origen === 'cuota' ? 'financiacion' : 'normal'
        };
      }
      categorias[gasto.categoria].total += gasto.monto;
      categorias[gasto.categoria].count += 1;
    });
    
    // Calcular promedio y porcentaje
    Object.keys(categorias).forEach(categoria => {
      categorias[categoria].promedio = categorias[categoria].total / categorias[categoria].count;
      categorias[categoria].porcentaje = total > 0 ? (categorias[categoria].total / total) * 100 : 0;
    });
    
    return categorias;
  }, [gastosFiltrados, total]);

  // 4. Análisis de gastos esenciales vs. discrecionales
  const analisisEsencialesDiscrecionales = useMemo(() => {
    let esenciales = 0;
    let discrecionales = 0;
    
    Object.entries(estadisticasCategorias).forEach(([_, datos]) => {
      const categoriasEsenciales = ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación'];
      const categoria = _;
      
      if (categoriasEsenciales.includes(categoria)) {
        esenciales += datos.total;
      } else {
        discrecionales += datos.total;
      }
    });
    
    const totalCalculado = esenciales + discrecionales;
    return {
      esenciales,
      discrecionales,
      porcentajeEsenciales: totalCalculado > 0 ? (esenciales / totalCalculado) * 100 : 0,
      porcentajeDiscrecionales: totalCalculado > 0 ? (discrecionales / totalCalculado) * 100 : 0,
      saludFinanciera: totalCalculado > 0 && esenciales <= 0.5 * totalCalculado ? 'Buena' : 'Por mejorar'
    };
  }, [estadisticasCategorias]);

  // 5. Método más común
  const metodoMasComun = useMemo(() => {
    const metodos = gastosFiltrados.reduce((acc, gasto) => {
      acc[gasto.metodo] = (acc[gasto.metodo] || 0) + 1;
      return acc;
    }, {});
    
    const metodo = Object.entries(metodos).sort((a, b) => b[1] - a[1])[0];
    return metodo ? metodo[0] : 'N/A';
  }, [gastosFiltrados]);

  // 6. Exportar CSV
  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto', 'Tipo', 'Origen'];
    const filas = gastosFiltrados.map(g => {
      const tipo = estadisticasCategorias[g.categoria]?.tipo || 'normal';
      return [
        g.fecha, 
        g.concepto, 
        g.metodo, 
        g.categoria, 
        g.cuenta, 
        g.monto, 
        tipo,
        g.origen || 'normal'
      ].join(',');
    });
    
    const csv = [headers.join(','), ...filas].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gastos_${filtroMes || 'todos'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // 7. Tendencias
  const tendenciaMensual = useMemo(() => {
    if (obtenerMesesDisponibles.length < 2) return { 
      cambio: 0, 
      mensaje: 'Datos insuficientes',
      tendencia: 'neutral'
    };
    
    const meses = obtenerMesesDisponibles.slice(0, 2);
    const totalesPorMes = {};
    
    gastosMensuales.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        
        if (meses.includes(mes)) {
          totalesPorMes[mes] = (totalesPorMes[mes] || 0) + gasto.monto;
        }
      }
    });
    
    const [mesActualKey, mesAnteriorKey] = meses;
    const actual = totalesPorMes[mesActualKey] || 0;
    const anterior = totalesPorMes[mesAnteriorKey] || 0;
    
    if (anterior === 0) return { 
      cambio: 0, 
      mensaje: 'Sin datos previos',
      tendencia: 'neutral'
    };
    
    const cambio = ((actual - anterior) / anterior) * 100;
    
    return {
      cambio,
      tendencia: cambio > 5 ? 'subiendo' : cambio < -5 ? 'bajando' : 'estable',
      mensaje: cambio > 0 
        ? `↑ Aumento del ${Math.abs(cambio).toFixed(1)}% vs ${formatearMesTexto(mesAnteriorKey)}`
        : cambio < 0
        ? `↓ Disminución del ${Math.abs(cambio).toFixed(1)}% vs ${formatearMesTexto(mesAnteriorKey)}`
        : `Sin cambios vs ${formatearMesTexto(mesAnteriorKey)}`
    };
  }, [gastosMensuales, obtenerMesesDisponibles]);

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
      {/* HEADER MEJORADO */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard Financiero</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-red-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? formatearMesTexto(filtroMes) : 'Todos los meses'}
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
                ⓘ Los pagos fijos y cuotas de enero 2025 ya están cubiertos y no se muestran
              </div>
            )}
            
            {/* TENDENCIA */}
            {tendenciaMensual.cambio !== 0 && (
              <div className={`mt-2 text-sm flex items-center gap-2 ${
                tendenciaMensual.tendencia === 'subiendo' ? 'text-red-400' : 
                tendenciaMensual.tendencia === 'bajando' ? 'text-green-400' : 'text-slate-400'
              }`}>
                {tendenciaMensual.tendencia === 'subiendo' ? <TrendingUp className="h-4 w-4" /> :
                 tendenciaMensual.tendencia === 'bajando' ? <TrendingDown className="h-4 w-4" /> :
                 <TrendingDown className="h-4 w-4" />}
                <span>{tendenciaMensual.mensaje}</span>
              </div>
            )}
          </div>
          
          {/* BOTÓN DE EXPORTAR */}
          <button 
            onClick={exportarCSV}
            className="group flex items-center gap-3 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-red-900/30"
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
          {/* PANEL DE FILTROS MEJORADO */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>
            
            <div className="space-y-4">
              {/* FILTRO MES - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Calendar className="h-4 w-4 text-red-400" />
                  Mes
                </label>
                <div className="relative">
                  <select 
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition appearance-none"
                  >
                    <option value="">Todos los meses</option>
                    {obtenerMesesDisponibles.map((mes) => (
                      <option key={mes} value={mes}>
                        {formatearMesTexto(mes)}
                        {mes === '2025-01' && ' (sin pagos fijos)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
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
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition appearance-none"
                  >
                    <option value="">Todos los métodos</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Bizum">Bizum</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
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
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition appearance-none"
                  >
                    <option value="">Todas las categorías</option>
                    <option value="Vivienda">Vivienda</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Entretenimiento">Entretenimiento</option>
                    <option value="Salud">Salud</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Educación">Educación</option>
                    <option value="Otros">Otros</option>
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
                    <div className="text-xl font-bold text-red-400">€{total.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Transacciones</div>
                    <div className="text-lg font-semibold text-slate-300">{gastosFiltrados.length}</div>
                  </div>
                </div>
                
                {/* ESTADÍSTICAS RÁPIDAS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gasto promedio:</span>
                    <span className="text-red-300">
                      €{(gastosFiltrados.length > 0 ? total / gastosFiltrados.length : 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Método más usado:</span>
                    <span className="text-slate-300">{metodoMasComun}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Salud financiera:</span>
                    <span className={`${
                      analisisEsencialesDiscrecionales.saludFinanciera === 'Buena' ? 'text-green-400' : 'text-amber-400'
                    }`}>
                      {analisisEsencialesDiscrecionales.saludFinanciera}
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

          {/* TARJETA DE ANÁLISIS RÁPIDO */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
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
              
              {/* ANÁLISIS ESENCIALES VS DISCRECIONALES */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-medium text-slate-400 mb-2">Composición de gastos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Esenciales</span>
                    <span className="text-amber-400 font-medium">
                      €{analisisEsencialesDiscrecionales.esenciales.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Discrecionales</span>
                    <span className="text-red-400 font-medium">
                      €{analisisEsencialesDiscrecionales.discrecionales.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${analisisEsencialesDiscrecionales.porcentajeEsenciales}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - TABLA Y ANÁLISIS DETALLADO */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
            {/* HEADER DE TABLA */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Historial completo de gastos</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} transacciones
                    {filtroMes && ` en ${formatearMesTexto(filtroMes)}`}
                    {filtroMes === '2025-01' && ' (sin pagos fijos/cuotas)'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg">
                  <span>Desliza</span>
                  <span className="text-slate-400">→</span>
                  <span>para ver más columnas</span>
                </div>
              </div>
            </div>

            {/* TABLA MEJORADA */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
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
                      // Determinar colores según origen
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
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-slate-500" />
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                                {gasto.metodo}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-slate-500" />
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300">
                                {gasto.categoria}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${origenBg} ${origenColor}`}>
                                {origenIcon}
                                {gasto.origen === 'pago_fijo' ? 'Pago Fijo' : 
                                 gasto.origen === 'cuota' ? 'Cuota' : 'Normal'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="inline-flex items-center gap-1 bg-red-900/20 px-3 py-1.5 rounded-lg">
                              <span className="text-sm font-semibold text-red-400">
                                €{gasto.monto.toFixed(2)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER DE TABLA */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div className="text-slate-400">
                  <span className="font-medium text-slate-300">{gastosFiltrados.length}</span> transacciones • 
                  Total: <span className="font-medium text-red-400">€{total.toFixed(2)}</span>
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>Actualizado recientemente</span>
                </div>
              </div>
            </div>
          </div>

          {/* DISTRIBUCIÓN POR CATEGORÍAS */}
          <div className="mt-6 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-400" />
              Distribución por categorías
            </h3>
            <div className="space-y-2">
              {Object.entries(estadisticasCategorias)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 8) // Mostrar solo top 8
                .map(([categoria, datos]) => {
                  const esEsencial = ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación'].includes(categoria);
                  const colorBarra = esEsencial ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400';
                  
                  return (
                    <div key={categoria} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{categoria}</span>
                          {datos.tipo === 'recurrente' && (
                            <Repeat className="h-3 w-3 text-amber-500" />
                          )}
                          {datos.tipo === 'financiacion' && (
                            <Calculator className="h-3 w-3 text-purple-500" />
                          )}
                        </div>
                        <span className={`${
                          esEsencial ? 'text-amber-400' : 'text-red-400'
                        }`}>
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