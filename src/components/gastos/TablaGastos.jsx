import { useState, useMemo, useEffect } from 'react';

// ICONOS LUCIDE REACT (modernos y limpios)
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
  Thermometer
} from 'lucide-react';

export default function TablaGastos() {
  // Estados para los datos de Notion
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Fetch de datos desde Notion API
  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const res = await fetch('/api/gastos');
        if (!res.ok) throw new Error('Error cargando gastos');
        const data = await res.json();
        setGastosMensuales(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching gastos:', err);
        
        // Datos de ejemplo mejorados como fallback
        setGastosMensuales([
          { id: 1, fecha: '2025-10-01', concepto: 'Alquiler', metodo: 'Transferencia', categoria: 'Vivienda', cuenta: 'BBVA', monto: 850 },
          { id: 2, fecha: '2025-10-05', concepto: 'Supermercado', metodo: 'Tarjeta', categoria: 'Alimentación', cuenta: 'Santander', monto: 120 },
          { id: 3, fecha: '2025-10-10', concepto: 'Gasolina', metodo: 'Tarjeta', categoria: 'Transporte', cuenta: 'Santander', monto: 60 },
          { id: 4, fecha: '2025-10-12', concepto: 'Netflix', metodo: 'Tarjeta', categoria: 'Entretenimiento', cuenta: 'BBVA', monto: 15 },
          { id: 5, fecha: '2025-10-15', concepto: 'Restaurante', metodo: 'Tarjeta', categoria: 'Comida Fuera', cuenta: 'Santander', monto: 45 },
          { id: 6, fecha: '2025-10-18', concepto: 'Gimnasio', metodo: 'Transferencia', categoria: 'Salud', cuenta: 'BBVA', monto: 30 },
          { id: 7, fecha: '2025-10-20', concepto: 'Compras Online', metodo: 'Tarjeta', categoria: 'Compras', cuenta: 'Revolut', monto: 85 },
          { id: 8, fecha: '2025-09-01', concepto: 'Alquiler', metodo: 'Transferencia', categoria: 'Vivienda', cuenta: 'BBVA', monto: 850 },
          { id: 9, fecha: '2025-09-15', concepto: 'Supermercado', metodo: 'Tarjeta', categoria: 'Alimentación', cuenta: 'Santander', monto: 110 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, []);

  // ========== FUNCIONES PARA DATOS DINÁMICOS ==========

  // 1. Obtener meses únicos de los datos
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
    
    // Convertir a array y ordenar descendente (más reciente primero)
    const mesesArray = Array.from(mesesSet);
    return mesesArray.sort((a, b) => b.localeCompare(a));
  }, [gastosMensuales]);

  // 2. Obtener métodos de pago únicos
  const metodosPagoDisponibles = useMemo(() => {
    const metodosSet = new Set();
    gastosMensuales.forEach(gasto => {
      if (gasto.metodo) metodosSet.add(gasto.metodo);
    });
    return Array.from(metodosSet).sort();
  }, [gastosMensuales]);

  // 3. Obtener cuentas únicas
  const cuentasDisponibles = useMemo(() => {
    const cuentasSet = new Set();
    gastosMensuales.forEach(gasto => {
      if (gasto.cuenta) cuentasSet.add(gasto.cuenta);
    });
    return Array.from(cuentasSet).sort();
  }, [gastosMensuales]);

  // 4. Obtener categorías únicas
  const categoriasDisponibles = useMemo(() => {
    const categoriasSet = new Set();
    gastosMensuales.forEach(gasto => {
      if (gasto.categoria) categoriasSet.add(gasto.categoria);
    });
    return Array.from(categoriasSet).sort();
  }, [gastosMensuales]);

  // 5. Función para formatear mes a texto
  const formatearMesTexto = (mesFormato) => {
    if (!mesFormato) return '';
    const [año, mes] = mesFormato.split('-');
    const fecha = new Date(año, parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // 6. Obtener mes actual en formato YYYY-MM
  const mesActual = useMemo(() => {
    const ahora = new Date();
    return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  // ========== FILTRADO DE DATOS ==========
  const gastosFiltrados = useMemo(() => {
    return gastosMensuales.filter(gasto => {
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
  }, [gastosMensuales, filtroMes, filtroMetodo, filtroCuenta, filtroCategoria]);

  // ========== CÁLCULOS PRINCIPALES MEJORADOS ==========

  // 1. Total
  const total = gastosFiltrados.reduce((sum, gasto) => sum + gasto.monto, 0);

  // 2. Calcular estadísticas por categoría mejoradas
  const estadisticasCategorias = useMemo(() => {
    const categorias = {};
    
    gastosFiltrados.forEach(gasto => {
      if (!categorias[gasto.categoria]) {
        categorias[gasto.categoria] = {
          total: 0,
          count: 0,
          promedio: 0,
          porcentaje: 0,
          tipo: 'discrecional'
        };
      }
      categorias[gasto.categoria].total += gasto.monto;
      categorias[gasto.categoria].count += 1;
    });
    
    // Calcular promedio y porcentaje
    Object.keys(categorias).forEach(categoria => {
      categorias[categoria].promedio = categorias[categoria].total / categorias[categoria].count;
      categorias[categoria].porcentaje = (categorias[categoria].total / total) * 100;
      
      // Determinar tipo de gasto (esencial vs discrecional)
      const categoriasEsenciales = ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación'];
      categorias[categoria].tipo = categoriasEsenciales.includes(categoria) ? 'esencial' : 'discrecional';
    });
    
    return categorias;
  }, [gastosFiltrados, total]);

  // 3. Calcular categoría principal con más detalles
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

  // 4. Análisis de gastos esenciales vs. discrecionales
  const analisisEsencialesDiscrecionales = useMemo(() => {
    let esenciales = 0;
    let discrecionales = 0;
    
    Object.entries(estadisticasCategorias).forEach(([_, datos]) => {
      if (datos.tipo === 'esencial') {
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

  // 5. Calcular cuenta más usada
  const cuentaMasUsada = useMemo(() => {
    const cuentas = gastosFiltrados.reduce((acc, gasto) => {
      acc[gasto.cuenta] = (acc[gasto.cuenta] || 0) + 1;
      return acc;
    }, {});
    
    const cuenta = Object.entries(cuentas).sort((a, b) => b[1] - a[1])[0];
    return cuenta ? cuenta[0] : 'N/A';
  }, [gastosFiltrados]);

  // 6. Calcular método más común
  const metodoMasComun = useMemo(() => {
    const metodos = gastosFiltrados.reduce((acc, gasto) => {
      acc[gasto.metodo] = (acc[gasto.metodo] || 0) + 1;
      return acc;
    }, {});
    
    const metodo = Object.entries(metodos).sort((a, b) => b[1] - a[1])[0];
    return metodo ? metodo[0] : 'N/A';
  }, [gastosFiltrados]);

  // 7. Análisis de frecuencia de gastos
  const analisisFrecuencia = useMemo(() => {
    if (gastosFiltrados.length === 0) return { promedioDiario: 0, diasConGastos: 0, gastoPorDia: 0 };
    
    const fechasUnicas = new Set();
    let totalDias = 0;
    
    gastosFiltrados.forEach(gasto => {
      if (gasto.fecha) {
        fechasUnicas.add(gasto.fecha.split('T')[0]); // Solo la fecha
      }
    });
    
    // Calcular promedio por día con gastos
    const diasConGastos = fechasUnicas.size;
    const gastoPorDia = total / diasConGastos;
    
    // Si tenemos filtro por mes, calcular días totales del mes
    if (filtroMes) {
      const [año, mes] = filtroMes.split('-').map(Number);
      const diasEnMes = new Date(año, mes, 0).getDate(); // Último día del mes
      totalDias = diasEnMes;
    }
    
    return {
      promedioDiario: diasConGastos > 0 ? total / diasConGastos : 0,
      diasConGastos,
      gastoPorDia,
      porcentajeDiasConGastos: totalDias > 0 ? (diasConGastos / totalDias) * 100 : 0
    };
  }, [gastosFiltrados, total, filtroMes]);

  // 8. Sugerencia de ahorro inteligente mejorada
  const sugerenciaAhorro = useMemo(() => {
    if (Object.keys(estadisticasCategorias).length === 0) {
      return { categoria: null, ahorroPotencial: 0, mensaje: '', tipo: 'optimización' };
    }
    
    // Priorizar categorías discrecionales para reducción
    const categoriasDiscrecionales = Object.entries(estadisticasCategorias)
      .filter(([_, datos]) => datos.tipo === 'discrecional')
      .sort((a, b) => b[1].total - a[1].total);
    
    if (categoriasDiscrecionales.length > 0) {
      const [nombre, datos] = categoriasDiscrecionales[0];
      const ahorroPotencial = datos.total * 0.25; // 25% para discrecionales
      
      return {
        categoria: nombre,
        ahorroPotencial,
        mensaje: `Reduciendo ${nombre} en 25% ahorras ~€${ahorroPotencial.toFixed(0)}/mes`,
        tipo: 'reducción',
        porcentajeReduccion: 25
      };
    }
    
    // Si solo hay esenciales, sugerir optimización
    const [nombre, datos] = Object.entries(estadisticasCategorias)
      .sort((a, b) => b[1].total - a[1].total)[0];
    const ahorroPotencial = datos.total * 0.10; // 10% para esenciales
    
    return {
      categoria: nombre,
      ahorroPotencial,
      mensaje: `Optimizando ${nombre} en 10% ahorras ~€${ahorroPotencial.toFixed(0)}/mes`,
      tipo: 'optimización',
      porcentajeReduccion: 10
    };
  }, [estadisticasCategorias]);

  // 9. Alertas de gastos inusuales
  const alertasGastos = useMemo(() => {
    if (gastosFiltrados.length < 5) return [];
    
    const alertas = [];
    
    // Calcular promedio y desviación estándar
    const montos = gastosFiltrados.map(g => g.monto);
    const promedio = montos.reduce((a, b) => a + b, 0) / montos.length;
    const desviacion = Math.sqrt(
      montos.reduce((sq, n) => sq + Math.pow(n - promedio, 2), 0) / montos.length
    );
    
    // Buscar gastos atípicos (más de 2 desviaciones estándar)
    gastosFiltrados.forEach(gasto => {
      if (gasto.monto > promedio + (2 * desviacion)) {
        alertas.push({
          tipo: 'alto',
          mensaje: `Gasto inusualmente alto en ${gasto.concepto}: €${gasto.monto.toFixed(2)}`,
          categoria: gasto.categoria,
          monto: gasto.monto,
          fecha: gasto.fecha
        });
      }
    });
    
    // Verificar si hay categorías que superen el 40% del total
    Object.entries(estadisticasCategorias).forEach(([categoria, datos]) => {
      if (datos.porcentaje > 40) {
        alertas.push({
          tipo: 'concentracion',
          mensaje: `${categoria} representa el ${datos.porcentaje.toFixed(1)}% de tus gastos`,
          categoria,
          porcentaje: datos.porcentaje
        });
      }
    });
    
    return alertas.slice(0, 3); // Máximo 3 alertas
  }, [gastosFiltrados, estadisticasCategorias]);

  // 10. Próximos pagos mejorados (con inteligencia por categoría)
  const proximosPagos = useMemo(() => {
    // Filtrar gastos del mes actual
    const gastosMesActual = gastosMensuales.filter(gasto => {
      if (!gasto.fecha) return false;
      const fecha = new Date(gasto.fecha);
      const mesGasto = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      return mesGasto === mesActual;
    });
    
    if (gastosMesActual.length === 0) return [];
    
    // Agrupar por categoría para detectar patrones
    const pagosPorCategoria = {};
    
    gastosMesActual.forEach(gasto => {
      if (!pagosPorCategoria[gasto.categoria]) {
        pagosPorCategoria[gasto.categoria] = {
          conceptos: new Set(),
          total: 0,
          count: 0,
          ultimaFecha: gasto.fecha,
          montoPromedio: 0
        };
      }
      
      pagosPorCategoria[gasto.categoria].conceptos.add(gasto.concepto);
      pagosPorCategoria[gasto.categoria].total += gasto.monto;
      pagosPorCategoria[gasto.categoria].count += 1;
      
      // Actualizar última fecha si es más reciente
      const fechaActual = new Date(gasto.fecha);
      const ultimaFecha = new Date(pagosPorCategoria[gasto.categoria].ultimaFecha);
      if (fechaActual > ultimaFecha) {
        pagosPorCategoria[gasto.categoria].ultimaFecha = gasto.fecha;
      }
    });
    
    // Calcular promedios y estimar próximos
    Object.keys(pagosPorCategoria).forEach(categoria => {
      pagosPorCategoria[categoria].montoPromedio = 
        pagosPorCategoria[categoria].total / pagosPorCategoria[categoria].count;
    });
    
    // Generar estimaciones para categorías recurrentes
    const estimaciones = Object.entries(pagosPorCategoria)
      .filter(([_, datos]) => datos.count >= 2) // Al menos 2 veces este mes
      .map(([categoria, datos]) => {
        const ultimaFecha = new Date(datos.ultimaFecha);
        let proximaFechaEstimada = new Date(ultimaFecha);
        
        // Estimar próxima fecha basada en categoría
        if (categoria === 'Vivienda') {
          proximaFechaEstimada.setMonth(proximaFechaEstimada.getMonth() + 1);
          proximaFechaEstimada.setDate(1); // Primer día del mes
        } else if (categoria === 'Alimentación') {
          proximaFechaEstimada.setDate(proximaFechaEstimada.getDate() + 7); // Cada semana
        } else {
          proximaFechaEstimada.setDate(proximaFechaEstimada.getDate() + 15); // Cada 15 días por defecto
        }
        
        return {
          categoria,
          conceptos: Array.from(datos.conceptos),
          montoEstimado: datos.montoPromedio,
          proximaFecha: proximaFechaEstimada.toISOString().split('T')[0],
          confianza: datos.count >= 3 ? 'Alta' : 'Media',
          frecuencia: datos.count > 2 ? 'Recurrente' : 'Ocasional'
        };
      })
      .sort((a, b) => new Date(a.proximaFecha) - new Date(b.proximaFecha))
      .slice(0, 3);
    
    return estimaciones;
  }, [gastosMensuales, mesActual]);

  // 11. Tendencias mejoradas con más métricas
  const tendenciaMensual = useMemo(() => {
    if (obtenerMesesDisponibles.length < 2) return { 
      cambio: 0, 
      mensaje: 'Datos insuficientes',
      tendencia: 'neutral'
    };
    
    const meses = obtenerMesesDisponibles.slice(0, 2);
    const totalesPorMes = {};
    const categoriasPorMes = {};
    
    // Calcular total y categorías por mes
    gastosMensuales.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        
        if (meses.includes(mes)) {
          totalesPorMes[mes] = (totalesPorMes[mes] || 0) + gasto.monto;
          
          if (!categoriasPorMes[mes]) {
            categoriasPorMes[mes] = {};
          }
          categoriasPorMes[mes][gasto.categoria] = 
            (categoriasPorMes[mes][gasto.categoria] || 0) + gasto.monto;
        }
      }
    });
    
    // Comparar los dos meses
    const [mesActualKey, mesAnteriorKey] = meses;
    const actual = totalesPorMes[mesActualKey] || 0;
    const anterior = totalesPorMes[mesAnteriorKey] || 0;
    
    if (anterior === 0) return { 
      cambio: 0, 
      mensaje: 'Sin datos previos',
      tendencia: 'neutral'
    };
    
    const cambio = ((actual - anterior) / anterior) * 100;
    
    // Analizar cambio en categorías principales
    let analisisCategorias = '';
    if (categoriasPorMes[mesActualKey] && categoriasPorMes[mesAnteriorKey]) {
      const categoriasActual = Object.keys(categoriasPorMes[mesActualKey]);
      const categoriasAnterior = Object.keys(categoriasPorMes[mesAnteriorKey]);
      
      const nuevasCategorias = categoriasActual.filter(c => !categoriasAnterior.includes(c));
      if (nuevasCategorias.length > 0) {
        analisisCategorias = ` Nuevas categorías: ${nuevasCategorias.join(', ')}`;
      }
    }
    
    return {
      cambio,
      tendencia: cambio > 5 ? 'subiendo' : cambio < -5 ? 'bajando' : 'estable',
      mensaje: cambio > 0 
        ? `↑ Aumento del ${Math.abs(cambio).toFixed(1)}% vs ${formatearMesTexto(mesAnteriorKey)}${analisisCategorias}`
        : cambio < 0
        ? `↓ Disminución del ${Math.abs(cambio).toFixed(1)}% vs ${formatearMesTexto(mesAnteriorKey)}${analisisCategorias}`
        : `Sin cambios significativos vs ${formatearMesTexto(mesAnteriorKey)}${analisisCategorias}`
    };
  }, [gastosMensuales, obtenerMesesDisponibles]);

  // 12. Exportar CSV mejorado
  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto', 'Tipo'];
    const filas = gastosFiltrados.map(g => {
      const tipo = estadisticasCategorias[g.categoria]?.tipo || 'desconocido';
      return [g.fecha, g.concepto, g.metodo, g.categoria, g.cuenta, g.monto, tipo].join(',');
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

  // ========== ESTADOS DE CARGA Y ERROR ==========
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-red-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Cargando gastos desde Notion...</p>
          <p className="text-slate-500 text-sm mt-2">Conectando con tu base de datos</p>
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
              <h2 className="text-xl font-bold text-white">Error al cargar gastos</h2>
            </div>
            <p className="text-slate-300 mb-4">{error}</p>
            <p className="text-slate-400 text-sm mb-6">
              Mostrando datos de ejemplo. Asegúrate de que tu endpoint /api/gastos esté configurado correctamente.
            </p>
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

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER MEJORADO */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Gastos del Mes</h1>
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
            {/* TENDENCIA MEJORADA */}
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
          
          {/* BOTÓN DE EXPORTAR MEJORADO */}
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
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO MÉTODO - DINÁMICO */}
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
                    {metodosPagoDisponibles.map(metodo => (
                      <option key={metodo} value={metodo}>{metodo}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO CUENTA - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Database className="h-4 w-4 text-green-400" />
                  Cuenta
                </label>
                <div className="relative">
                  <select 
                    value={filtroCuenta}
                    onChange={(e) => setFiltroCuenta(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition appearance-none"
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
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 transition appearance-none"
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
                    <div className="text-xl font-bold text-red-400">€{total.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Transacciones</div>
                    <div className="text-lg font-semibold text-slate-300">{gastosFiltrados.length}</div>
                  </div>
                </div>
                
                {/* ESTADÍSTICAS RÁPIDAS MEJORADAS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Categorías activas:</span>
                    <span className="text-slate-300">{Object.keys(estadisticasCategorias).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gasto promedio:</span>
                    <span className="text-red-300">
                      €{(gastosFiltrados.length > 0 ? total / gastosFiltrados.length : 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gasto por día:</span>
                    <span className="text-red-300">
                      €{analisisFrecuencia.gastoPorDia.toFixed(2)}
                    </span>
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

          {/* TARJETA DE ANÁLISIS RÁPIDO MEJORADA */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-red-400" />
              Análisis rápido
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-slate-300">Categoría principal</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-white">{categoriaPrincipal.nombre}</span>
                  <div className="text-xs text-red-400">
                    €{categoriaPrincipal.monto.toFixed(2)} ({categoriaPrincipal.porcentaje?.toFixed(1)}%)
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-green-400" />
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

          {/* ALERTAS DE GASTOS */}
          {alertasGastos.length > 0 && (
            <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Alertas importantes
              </h3>
              <div className="space-y-2">
                {alertasGastos.map((alerta, index) => (
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
                  <h2 className="text-lg font-semibold text-white">Historial de gastos</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} de {gastosMensuales.length} transacciones
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

            {/* TABLA MEJORADA */}
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
                  {gastosFiltrados.map((gasto) => {
                    const tipo = estadisticasCategorias[gasto.categoria]?.tipo || 'desconocido';
                    const colorTipo = tipo === 'esencial' ? 'text-amber-400' : 'text-red-400';
                    const bgTipo = tipo === 'esencial' ? 'bg-amber-900/30' : 'bg-red-900/30';
                    
                    return (
                      <tr key={gasto.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {gasto.fecha}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{gasto.concepto}</div>
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
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${bgTipo} ${colorTipo}`}>
                              {tipo === 'esencial' ? 'Esencial' : 'Discrecional'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-slate-500" />
                            {gasto.cuenta}
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
                  })}
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

          {/* PANELES DE ANÁLISIS MEJORADOS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SUGERENCIA DE AHORRO MEJORADA */}
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">Sugerencia de ahorro</h4>
              </div>
              {sugerenciaAhorro.categoria ? (
                <div>
                  <p className="text-sm text-slate-300 mb-2">
                    {sugerenciaAhorro.mensaje}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-blue-400">
                      {sugerenciaAhorro.tipo === 'reducción' ? 
                        <TrendingDown className="h-3 w-3" /> : 
                        <Zap className="h-3 w-3" />
                      }
                      <span>{sugerenciaAhorro.tipo === 'reducción' ? 'Reducción' : 'Optimización'}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {sugerenciaAhorro.porcentajeReduccion}% potencial
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-300">Agrega más gastos para recibir sugerencias personalizadas.</p>
              )}
            </div>

            {/* PRÓXIMOS PAGOS MEJORADOS */}
            <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-400" />
                <h4 className="text-sm font-semibold text-green-300">Próximos pagos estimados</h4>
              </div>
              {proximosPagos.length > 0 ? (
                <div className="space-y-2">
                  {proximosPagos.map((pago, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-slate-300">{pago.categoria}</span>
                        <div className="text-xs text-slate-500">{pago.conceptos.join(', ')}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-green-400">€{pago.montoEstimado.toFixed(2)}</span>
                        <div className="text-xs text-slate-500">
                          {pago.proximaFecha} • {pago.confianza}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-300">Analizando patrones de gasto recurrentes...</p>
              )}
            </div>
          </div>

          {/* DISTRIBUCIÓN POR CATEGORÍAS */}
          <div className="mt-4 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-400" />
              Distribución por categorías
            </h3>
            <div className="space-y-2">
              {Object.entries(estadisticasCategorias)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([categoria, datos]) => {
                  const esEsencial = datos.tipo === 'esencial';
                  const colorBarra = esEsencial ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400';
                  
                  return (
                    <div key={categoria} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{categoria}</span>
                          {esEsencial && (
                            <span className="text-xs text-amber-500 bg-amber-900/30 px-1.5 py-0.5 rounded">
                              Esencial
                            </span>
                          )}
                        </div>
                        <span className={`${esEsencial ? 'text-amber-400' : 'text-red-400'}`}>
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