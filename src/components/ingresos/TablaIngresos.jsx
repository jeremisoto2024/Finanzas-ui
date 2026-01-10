import { useState, useMemo, useEffect } from 'react';
import FilaIngreso from './FilaIngreso';

// ICONOS LUCIDE REACT para ingresos (paleta verde)
import { 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  Database,
  Tag,
  CreditCard,
  Bell,
  ChevronDown,
  FileText,
  Wallet,
  AlertCircle,
  DollarSign,
  Receipt,
  Landmark,
  Sparkles,
  Banknote,
  Gift,
  Briefcase,
  Coins,
  Target,
  BarChart3,
  TrendingDown,
  Lightbulb,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Percent
} from 'lucide-react';

export default function TablaIngresos() {
  // Estados para los datos de Notion
  const [ingresosMensuales, setIngresosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros existentes
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Fetch de datos desde Notion API
  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const res = await fetch('/api/ingresos');
        if (!res.ok) throw new Error('Error cargando ingresos');
        const data = await res.json();
        setIngresosMensuales(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching ingresos:', err);
        
        // Datos de ejemplo como fallback
        setIngresosMensuales([
          { id: 1, fecha: '2025-10-01', concepto: 'Salario mensual', metodo: 'Transferencia', categoria: 'Sueldo', cuenta: 'BBVA', monto: 2500 },
          { id: 2, fecha: '2025-10-05', concepto: 'Trabajo freelance', metodo: 'PayPal', categoria: 'Freelance', cuenta: 'PayPal', monto: 450 },
          { id: 3, fecha: '2025-10-10', concepto: 'Venta de artículos', metodo: 'Bizum', categoria: 'Ventas', cuenta: 'Revolut', monto: 120 },
          { id: 4, fecha: '2025-10-15', concepto: 'Consultoría', metodo: 'Transferencia', categoria: 'Freelance', cuenta: 'BBVA', monto: 800 },
          { id: 5, fecha: '2025-10-20', concepto: 'Propinas', metodo: 'Efectivo', categoria: 'Extras', cuenta: 'Efectivo', monto: 85 },
          { id: 6, fecha: '2025-09-01', concepto: 'Salario mensual', metodo: 'Transferencia', categoria: 'Sueldo', cuenta: 'BBVA', monto: 2400 },
          { id: 7, fecha: '2025-09-10', concepto: 'Inversiones', metodo: 'Transferencia', categoria: 'Inversiones', cuenta: 'BBVA', monto: 300 },
          { id: 8, fecha: '2025-09-15', concepto: 'Reembolso', metodo: 'Tarjeta', categoria: 'Reembolsos', cuenta: 'Santander', monto: 150 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  // ========== FUNCIONES PARA DATOS DINÁMICOS ==========

  // 1. Obtener meses únicos de los datos
  const obtenerMesesDisponibles = useMemo(() => {
    const mesesSet = new Set();
    
    ingresosMensuales.forEach(ingreso => {
      if (ingreso.fecha) {
        try {
          const fecha = new Date(ingreso.fecha);
          if (!isNaN(fecha.getTime())) {
            const año = fecha.getFullYear();
            const mes = fecha.getMonth() + 1;
            const mesFormateado = `${año}-${mes.toString().padStart(2, '0')}`;
            mesesSet.add(mesFormateado);
          }
        } catch (error) {
          console.error('Error procesando fecha:', ingreso.fecha, error);
        }
      }
    });
    
    // Convertir a array y ordenar descendente (más reciente primero)
    const mesesArray = Array.from(mesesSet);
    return mesesArray.sort((a, b) => b.localeCompare(a));
  }, [ingresosMensuales]);

  // 2. Obtener métodos de recepción únicos
  const metodosRecepcionDisponibles = useMemo(() => {
    const metodosSet = new Set();
    ingresosMensuales.forEach(ingreso => {
      if (ingreso.metodo) metodosSet.add(ingreso.metodo);
    });
    return Array.from(metodosSet).sort();
  }, [ingresosMensuales]);

  // 3. Obtener cuentas únicas
  const cuentasDisponibles = useMemo(() => {
    const cuentasSet = new Set();
    ingresosMensuales.forEach(ingreso => {
      if (ingreso.cuenta) cuentasSet.add(ingreso.cuenta);
    });
    return Array.from(cuentasSet).sort();
  }, [ingresosMensuales]);

  // 4. Obtener categorías únicas
  const categoriasDisponibles = useMemo(() => {
    const categoriasSet = new Set();
    ingresosMensuales.forEach(ingreso => {
      if (ingreso.categoria) categoriasSet.add(ingreso.categoria);
    });
    return Array.from(categoriasSet).sort();
  }, [ingresosMensuales]);

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
  const ingresosFiltrados = useMemo(() => {
    return ingresosMensuales.filter(ingreso => {
      if (ingreso.fecha) {
        const fechaIngreso = new Date(ingreso.fecha);
        const mesIngreso = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}`;
        
        const cumpleMes = !filtroMes || mesIngreso === filtroMes;
        const cumpleMetodo = !filtroMetodo || ingreso.metodo === filtroMetodo;
        const cumpleCuenta = !filtroCuenta || ingreso.cuenta === filtroCuenta;
        const cumpleCategoria = !filtroCategoria || ingreso.categoria === filtroCategoria;
        
        return cumpleMes && cumpleMetodo && cumpleCuenta && cumpleCategoria;
      }
      return false;
    });
  }, [ingresosMensuales, filtroMes, filtroMetodo, filtroCuenta, filtroCategoria]);

  // ========== CÁLCULOS PRINCIPALES ==========

  // 1. Total
  const total = ingresosFiltrados.reduce((sum, ingreso) => sum + ingreso.monto, 0);

  // 2. Calcular estadísticas por categoría
  const estadisticasCategorias = useMemo(() => {
    const categorias = {};
    
    ingresosFiltrados.forEach(ingreso => {
      if (!categorias[ingreso.categoria]) {
        categorias[ingreso.categoria] = {
          total: 0,
          count: 0,
          promedio: 0,
          porcentaje: 0
        };
      }
      categorias[ingreso.categoria].total += ingreso.monto;
      categorias[ingreso.categoria].count += 1;
    });
    
    // Calcular promedio y porcentaje
    Object.keys(categorias).forEach(categoria => {
      categorias[categoria].promedio = categorias[categoria].total / categorias[categoria].count;
      categorias[categoria].porcentaje = (categorias[categoria].total / total) * 100;
    });
    
    return categorias;
  }, [ingresosFiltrados, total]);

  // 3. Calcular categoría principal (mayor ingreso)
  const categoriaPrincipal = useMemo(() => {
    const categorias = Object.entries(estadisticasCategorias);
    if (categorias.length === 0) return { nombre: 'N/A', monto: 0 };
    
    const [nombre, datos] = categorias.sort((a, b) => b[1].total - a[1].total)[0];
    return { 
      nombre, 
      monto: datos.total,
      porcentaje: datos.porcentaje
    };
  }, [estadisticasCategorias]);

  // 4. Calcular cuenta más usada
  const cuentaMasUsada = useMemo(() => {
    const cuentas = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.cuenta] = (acc[ingreso.cuenta] || 0) + 1;
      return acc;
    }, {});
    
    const cuenta = Object.entries(cuentas).sort((a, b) => b[1] - a[1])[0];
    return cuenta ? cuenta[0] : 'N/A';
  }, [ingresosFiltrados]);

  // 5. Calcular método más común
  const metodoMasComun = useMemo(() => {
    const metodos = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.metodo] = (acc[ingreso.metodo] || 0) + 1;
      return acc;
    }, {});
    
    const metodo = Object.entries(metodos).sort((a, b) => b[1] - a[1])[0];
    return metodo ? metodo[0] : 'N/A';
  }, [ingresosFiltrados]);

  // 6. Calcular ingresos recurrentes vs ocasionales
  const analisisRecurrencia = useMemo(() => {
    if (ingresosMensuales.length === 0) return { recurrentes: 0, ocasionales: 0 };
    
    const conceptos = {};
    
    ingresosMensuales.forEach(ingreso => {
      if (!conceptos[ingreso.concepto]) {
        conceptos[ingreso.concepto] = {
          count: 0,
          meses: new Set(),
          montoPromedio: 0,
          total: 0
        };
      }
      conceptos[ingreso.concepto].count += 1;
      conceptos[ingreso.concepto].total += ingreso.monto;
      
      // Extraer mes
      const fecha = new Date(ingreso.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      conceptos[ingreso.concepto].meses.add(mes);
    });
    
    // Calcular promedio
    Object.keys(conceptos).forEach(concepto => {
      conceptos[concepto].montoPromedio = conceptos[concepto].total / conceptos[concepto].count;
    });
    
    // Separar en recurrentes y ocasionales
    const recurrentes = Object.entries(conceptos).filter(([_, datos]) => datos.count >= 2);
    const ocasionales = Object.entries(conceptos).filter(([_, datos]) => datos.count === 1);
    
    const totalRecurrentes = recurrentes.reduce((sum, [_, datos]) => sum + datos.total, 0);
    const totalOcasionales = ocasionales.reduce((sum, [_, datos]) => sum + datos.total, 0);
    
    return {
      recurrentes: recurrentes.length,
      ocasionales: ocasionales.length,
      totalRecurrentes,
      totalOcasionales,
      porcentajeRecurrentes: (totalRecurrentes / (totalRecurrentes + totalOcasionales)) * 100 || 0
    };
  }, [ingresosMensuales]);

  // 7. Sugerencia de crecimiento inteligente
  const sugerenciaCrecimiento = useMemo(() => {
    if (Object.keys(estadisticasCategorias).length === 0) {
      return { categoria: null, crecimientoPotencial: 0, mensaje: '' };
    }
    
    // Encontrar categoría con menor presencia pero buen potencial
    const categoriasAnalizadas = Object.entries(estadisticasCategorias);
    
    if (categoriasAnalizadas.length === 0) return { categoria: null, crecimientoPotencial: 0, mensaje: '' };
    
    // Ordenar por menor frecuencia pero buen monto promedio
    const categoriasElegibles = categoriasAnalizadas
      .filter(([_, datos]) => datos.count <= 2) // Pocas transacciones
      .sort((a, b) => b[1].promedio - a[1].promedio); // Con buen monto promedio
    
    if (categoriasElegibles.length === 0) {
      // Si no hay categorías con pocas transacciones, usar la de mayor potencial
      const [nombre, datos] = categoriasAnalizadas
        .sort((a, b) => b[1].promedio - a[1].promedio)[0];
      const crecimientoPotencial = datos.promedio * 2; // Duplicar frecuencia
      return {
        categoria: nombre,
        crecimientoPotencial,
        mensaje: `Duplica la frecuencia de ${nombre} para ganar ~€${crecimientoPotencial.toFixed(0)} más/mes`
      };
    }
    
    const [nombre, datos] = categoriasElegibles[0];
    const crecimientoPotencial = datos.promedio * 3; // Triplicar frecuencia
    
    return {
      categoria: nombre,
      crecimientoPotencial,
      mensaje: `Aumenta ${nombre} a 3 veces/mes para ganar ~€${crecimientoPotencial.toFixed(0)} extra`
    };
  }, [estadisticasCategorias]);

  // 8. Próximos ingresos estimados (basado en patrones)
  const proximosIngresos = useMemo(() => {
    // Filtrar ingresos del mes actual
    const ingresosMesActual = ingresosMensuales.filter(ingreso => {
      if (!ingreso.fecha) return false;
      const fecha = new Date(ingreso.fecha);
      const mesIngreso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      return mesIngreso === mesActual;
    });
    
    if (ingresosMesActual.length === 0) return [];
    
    // Identificar ingresos recurrentes (mismo concepto, similar monto)
    const conceptosRecurrentes = {};
    
    ingresosMesActual.forEach(ingreso => {
      const clave = `${ingreso.concepto}-${ingreso.categoria}`;
      
      if (!conceptosRecurrentes[clave]) {
        conceptosRecurrentes[clave] = {
          concepto: ingreso.concepto,
          categoria: ingreso.categoria,
          montos: [],
          cuenta: ingreso.cuenta,
          metodo: ingreso.metodo,
          ultimaFecha: ingreso.fecha
        };
      }
      conceptosRecurrentes[clave].montos.push(ingreso.monto);
    });
    
    // Calcular promedio y estimar próximo
    const estimaciones = Object.values(conceptosRecurrentes)
      .filter(item => item.montos.length >= 1) // Al menos una vez este mes
      .map(item => {
        const montoPromedio = item.montos.reduce((a, b) => a + b, 0) / item.montos.length;
        const fechaUltima = new Date(item.ultimaFecha);
        
        // Estimar próxima fecha (basado en patrón)
        let proximaFechaEstimada = new Date(fechaUltima);
        
        if (item.concepto.toLowerCase().includes('salario') || 
            item.concepto.toLowerCase().includes('nómina')) {
          proximaFechaEstimada.setMonth(proximaFechaEstimada.getMonth() + 1);
          proximaFechaEstimada.setDate(1); // Primer día del mes
        } else if (item.categoria === 'Freelance' || item.categoria === 'Consultoría') {
          proximaFechaEstimada.setDate(proximaFechaEstimada.getDate() + 15); // Cada 15 días
        } else {
          proximaFechaEstimada.setDate(proximaFechaEstimada.getDate() + 30); // Cada mes
        }
        
        return {
          concepto: item.concepto,
          categoria: item.categoria,
          montoEstimado: montoPromedio,
          proximaFecha: proximaFechaEstimada.toISOString().split('T')[0],
          confianza: item.montos.length > 1 ? 'Alta' : 'Media',
          cuenta: item.cuenta
        };
      })
      .sort((a, b) => new Date(a.proximaFecha) - new Date(b.proximaFecha)) // Ordenar por fecha
      .slice(0, 3); // Tomar los 3 primeros
    
    return estimaciones;
  }, [ingresosMensuales, mesActual]);

  // 9. Tendencias (comparativa con meses anteriores)
  const tendenciaMensual = useMemo(() => {
    if (obtenerMesesDisponibles.length < 2) return { cambio: 0, mensaje: 'Datos insuficientes' };
    
    const meses = obtenerMesesDisponibles.slice(0, 2); // Últimos 2 meses
    const totalesPorMes = {};
    
    // Calcular total por mes
    ingresosMensuales.forEach(ingreso => {
      if (ingreso.fecha) {
        const fecha = new Date(ingreso.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        
        if (meses.includes(mes)) {
          totalesPorMes[mes] = (totalesPorMes[mes] || 0) + ingreso.monto;
        }
      }
    });
    
    // Comparar los dos meses
    const [mesActualKey, mesAnteriorKey] = meses;
    const actual = totalesPorMes[mesActualKey] || 0;
    const anterior = totalesPorMes[mesAnteriorKey] || 0;
    
    if (anterior === 0) return { cambio: 0, mensaje: 'Sin datos previos' };
    
    const cambio = ((actual - anterior) / anterior) * 100;
    
    return {
      cambio,
      mensaje: cambio > 0 
        ? `↑ Aumento del ${Math.abs(cambio).toFixed(1)}% vs ${formatearMesTexto(mesAnteriorKey)}`
        : cambio < 0
        ? `↓ Disminución del ${Math.abs(cambio).toFixed(1)}% vs ${formatearMesTexto(mesAnteriorKey)}`
        : 'Sin cambios'
    };
  }, [ingresosMensuales, obtenerMesesDisponibles]);

  // 10. Exportar CSV
  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto'];
    const filas = ingresosFiltrados.map(i => 
      [i.fecha, i.concepto, i.metodo, i.categoria, i.cuenta, i.monto].join(',')
    );
    
    const csv = [headers.join(','), ...filas].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ingresos_${filtroMes || 'todos'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ========== ESTADOS DE CARGA Y ERROR ==========
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Cargando ingresos desde Notion...</p>
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
              <h2 className="text-xl font-bold text-white">Error al cargar ingresos</h2>
            </div>
            <p className="text-slate-300 mb-4">{error}</p>
            <p className="text-slate-400 text-sm mb-6">
              Mostrando datos de ejemplo. Asegúrate de que tu endpoint /api/ingresos esté configurado correctamente.
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
            <h1 className="text-2xl font-bold text-white mb-1">Ingresos del Mes</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-emerald-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? formatearMesTexto(filtroMes) : 'Todos los meses'}
              </span>
              <span className="text-slate-500 text-sm bg-slate-900 px-3 py-1 rounded-full">
                {ingresosFiltrados.length} transacciones
              </span>
            </div>
            {/* TENDENCIA */}
            {tendenciaMensual.cambio !== 0 && (
              <div className={`mt-2 text-sm ${
                tendenciaMensual.cambio > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {tendenciaMensual.mensaje}
              </div>
            )}
          </div>
          
          {/* BOTÓN DE EXPORTAR */}
          <button 
            onClick={exportarCSV}
            className="group flex items-center gap-3 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/30"
          >
            <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>
            
            <div className="space-y-4">
              {/* FILTRO MES - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  Mes
                </label>
                <div className="relative">
                  <select 
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
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
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  Método
                </label>
                <div className="relative">
                  <select 
                    value={filtroMetodo}
                    onChange={(e) => setFiltroMetodo(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
                  >
                    <option value="">Todos los métodos</option>
                    {metodosRecepcionDisponibles.map(metodo => (
                      <option key={metodo} value={metodo}>{metodo}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO CUENTA - DINÁMICO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Database className="h-4 w-4 text-purple-400" />
                  Cuenta
                </label>
                <div className="relative">
                  <select 
                    value={filtroCuenta}
                    onChange={(e) => setFiltroCuenta(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
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
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
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

            {/* RESUMEN */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                  <div>
                    <div className="text-sm text-slate-400">Total filtrado</div>
                    <div className="text-xl font-bold text-emerald-400">€{total.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Transacciones</div>
                    <div className="text-lg font-semibold text-slate-300">{ingresosFiltrados.length}</div>
                  </div>
                </div>
                
                {/* ESTADÍSTICAS RÁPIDAS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Categorías activas:</span>
                    <span className="text-slate-300">{Object.keys(estadisticasCategorias).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Ingreso promedio:</span>
                    <span className="text-emerald-300">
                      €{(ingresosFiltrados.length > 0 ? total / ingresosFiltrados.length : 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Ingresos recurrentes:</span>
                    <span className="text-emerald-300">
                      {analisisRecurrencia.porcentajeRecurrentes.toFixed(1)}%
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

          {/* TARJETA DE ANÁLISIS RÁPIDO - DINÁMICO */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Análisis rápido
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Fuente principal</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-white">{categoriaPrincipal.nombre}</span>
                  <div className="text-xs text-emerald-400">
                    €{categoriaPrincipal.monto.toFixed(2)} ({categoriaPrincipal.porcentaje?.toFixed(1)}%)
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-blue-400" />
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
              
              {/* ANÁLISIS DE RECURRENCIA */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-medium text-slate-400 mb-2">Estabilidad de ingresos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Recurrentes</span>
                    <span className="text-emerald-400 font-medium">
                      {analisisRecurrencia.recurrentes} fuentes
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Ocasionales</span>
                    <span className="text-amber-400 font-medium">
                      {analisisRecurrencia.ocasionales} fuentes
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analisisRecurrencia.porcentajeRecurrentes}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - TABLA */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
            {/* HEADER DE TABLA */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Historial de ingresos</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {ingresosFiltrados.length} de {ingresosMensuales.length} transacciones
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

            {/* TABLA */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
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
                      Cuenta
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-slate-800">
                  {ingresosFiltrados.map((ingreso) => (
                    <FilaIngreso key={ingreso.id} ingreso={ingreso} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER DE TABLA */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <div className="text-slate-400">
                  <span className="font-medium text-slate-300">{ingresosFiltrados.length}</span> transacciones • 
                  Total: <span className="font-medium text-emerald-400">€{total.toFixed(2)}</span>
                </div>
                <div className="text-slate-500 text-sm flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  <span>Actualizado recientemente</span>
                </div>
              </div>
            </div>
          </div>

          {/* SUGERENCIAS Y PRÓXIMOS INGRESOS - DINÁMICOS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SUGERENCIA DE CRECIMIENTO - DINÁMICA */}
            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-emerald-300">Sugerencia de crecimiento</h4>
              </div>
              {sugerenciaCrecimiento.categoria ? (
                <div>
                  <p className="text-sm text-slate-300 mb-2">
                    {sugerenciaCrecimiento.mensaje}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Basado en tus patrones de ingreso reales</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-300">Agrega más ingresos para recibir sugerencias personalizadas.</p>
              )}
            </div>

            {/* PRÓXIMOS INGRESOS - DINÁMICOS */}
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">Próximos ingresos estimados</h4>
              </div>
              {proximosIngresos.length > 0 ? (
                <div className="space-y-2">
                  {proximosIngresos.map((ingreso, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-slate-300">{ingreso.concepto}</span>
                        <div className="text-xs text-slate-500">{ingreso.categoria}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-blue-400">€{ingreso.montoEstimado.toFixed(2)}</span>
                        <div className="text-xs text-slate-500">
                          {ingreso.proximaFecha} • {ingreso.confianza}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-300">Analizando patrones de ingresos recurrentes...</p>
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
                .map(([categoria, datos]) => (
                  <div key={categoria} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">{categoria}</span>
                      <span className="text-emerald-400">
                        €{datos.total.toFixed(2)} ({datos.porcentaje.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${datos.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente PieChart simple para iconos
function PieChart({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );
}