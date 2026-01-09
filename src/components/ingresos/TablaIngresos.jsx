import { useState, useMemo, useEffect } from 'react';
import FilaIngreso from './FilaIngreso';

// ICONOS LUCIDE REACT para ingresos (paleta verde)
import { 
  Download, 
  Filter,
  Calendar,
  TrendingUp,  // Icono principal para ingresos
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
  Coins
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  // Datos basados en tus imágenes
  const categoriasIngresos = ['Sueldo', 'Propina', 'Ventas', 'Transferencia', 'Préstamo', 'Extras'];
  
  const metodosRecepcion = ['Efectivo', 'Transferencia', 'Bizum', 'Tarjeta', 'Apple Pay'];
  
  const cuentasIngresos = ['BBVA', 'Efectivo'];
  
  const ingresosFiltrados = useMemo(() => {
    return ingresosMensuales.filter(ingreso => {
      const fechaIngreso = new Date(ingreso.fecha);
      const mesIngreso = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}`;
      
      const cumpleMes = !filtroMes || mesIngreso === filtroMes;
      const cumpleMetodo = !filtroMetodo || ingreso.metodo === filtroMetodo;
      const cumpleCuenta = !filtroCuenta || ingreso.cuenta === filtroCuenta;
      const cumpleCategoria = !filtroCategoria || ingreso.categoria === filtroCategoria;
      
      return cumpleMes && cumpleMetodo && cumpleCuenta && cumpleCategoria;
    });
  }, [ingresosMensuales, filtroMes, filtroMetodo, filtroCuenta, filtroCategoria]);

  const total = ingresosFiltrados.reduce((sum, ingreso) => sum + ingreso.monto, 0);

  // Calcular categoría principal
  const categoriaPrincipal = useMemo(() => {
    const categorias = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.categoria] = (acc[ingreso.categoria] || 0) + ingreso.monto;
      return acc;
    }, {});
    
    return Object.entries(categorias).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [ingresosFiltrados]);

  // Calcular cuenta más usada
  const cuentaMasUsada = useMemo(() => {
    const cuentas = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.cuenta] = (acc[ingreso.cuenta] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(cuentas).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [ingresosFiltrados]);

  // Calcular método más común
  const metodoMasComun = useMemo(() => {
    const metodos = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.metodo] = (acc[ingreso.metodo] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(metodos).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [ingresosFiltrados]);

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
    link.download = `ingresos_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
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
      {/* HEADER MEJORADO - TÍTULO Y TOTAL EN VERDE */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Ingresos del Mes</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-emerald-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">Octubre 2025</span>
              <span className="text-slate-500 text-sm bg-slate-900 px-3 py-1 rounded-full">
                {ingresosFiltrados.length} transacciones
              </span>
            </div>
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
              {/* FILTRO MES */}
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
                    <option value="2025-10">Octubre 2025</option>
                    <option value="2025-09">Septiembre 2025</option>
                    <option value="2025-08">Agosto 2025</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO MÉTODO */}
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
                    {metodosRecepcion.map(metodo => (
                      <option key={metodo} value={metodo}>{metodo}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO CUENTA */}
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
                    {cuentasIngresos.map(cuenta => (
                      <option key={cuenta} value={cuenta}>{cuenta}</option>
                    ))}
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
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition appearance-none"
                  >
                    <option value="">Todas las categorías</option>
                    {categoriasIngresos.map(categoria => (
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
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Análisis rápido
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Fuente principal</span>
                </div>
                <span className="text-sm font-medium text-white">{categoriaPrincipal}</span>
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
                  <span className="text-sm text-slate-300">Método más común</span>
                </div>
                <span className="text-sm font-medium text-white">{metodoMasComun}</span>
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

          {/* SUGERENCIAS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-semibold text-emerald-300">Potencial de crecimiento</h4>
              </div>
              <p className="text-sm text-slate-300">
                Invierte en más proyectos freelance para aumentar ingresos en un 25%
              </p>
            </div>
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">Próximos ingresos</h4>
              </div>
              <p className="text-sm text-slate-300">
                Salario estimado para el 01/11 • €1,800
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}