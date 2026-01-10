import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Download, Filter, Calendar, CreditCard, Database, Tag, 
  TrendingDown, Bell, ChevronDown, FileText, Wallet, 
  AlertCircle, RefreshCw, Lightbulb, Clock, TrendingUp 
} from 'lucide-react';

const formatCurrency = (amount) => `€${Number(amount).toFixed(2)}`;

const formatMonth = (yearMonth) => {
  if (!yearMonth) return 'Todos los meses';
  const [year, month] = yearMonth.split('-');
  return new Date(year, month - 1).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });
};

const CATEGORIAS_FIJAS_EXCLUIDAS_AHORRO = ['Vivienda', 'Alquiler', 'Hipoteca', 'Salud', 'Seguros', 'Transporte'];

// Componente reutilizable para selects con icono
const FilterSelect = ({ icon: Icon, label, value, onChange, options, defaultText }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
      <Icon className="h-4 w-4 text-blue-400" />
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg 
                 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                 transition appearance-none cursor-pointer"
      >
        <option value="">{defaultText}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
    </div>
  </div>
);

export default function TablaGastos() {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    mes: '',
    metodo: '',
    cuenta: '',
    categoria: ''
  });

  const updateFiltro = useCallback((key) => (value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFiltros = useCallback(() => {
    setFiltros({
      mes: '',
      metodo: '',
      cuenta: '',
      categoria: ''
    });
  }, []);

  // Carga de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/gastos');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setGastos(data || []);
      } catch (err) {
        console.error('Error cargando gastos:', err);
        setError(err.message);

        // Fallback
        setGastos([
          { id: 'demo1', fecha: '2025-10-01', concepto: 'Alquiler', metodo: 'Transferencia', categoria: 'Vivienda', cuenta: 'BBVA', monto: 850 },
          { id: 'demo2', fecha: '2025-09-28', concepto: 'Mercadona', metodo: 'Tarjeta', categoria: 'Alimentación', cuenta: 'Santander', monto: 142.35 },
          { id: 'demo3', fecha: '2025-09-15', concepto: 'Netflix', metodo: 'Domiciliación', categoria: 'Entretenimiento', cuenta: 'BBVA', monto: 12.99 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Datos derivados - memoizados
  const datosDerivados = useMemo(() => {
    const meses = new Set();
    const metodos = new Set();
    const cuentas = new Set();
    const categorias = new Set();

    gastos.forEach(g => {
      if (!g.fecha) return;

      try {
        const fecha = new Date(g.fecha);
        if (!isNaN(fecha)) {
          const ym = `\( {fecha.getFullYear()}- \){String(fecha.getMonth() + 1).padStart(2, '0')}`;
          meses.add(ym);
        }
      } catch {}

      if (g.metodo) metodos.add(g.metodo);
      if (g.cuenta) cuentas.add(g.cuenta);
      if (g.categoria) categorias.add(g.categoria);
    });

    return {
      mesesOrdenados: [...meses].sort().reverse(),
      metodos: [...metodos].sort(),
      cuentas: [...cuentas].sort(),
      categorias: [...categorias].sort()
    };
  }, [gastos]);

  // Gastos filtrados
  const gastosFiltrados = useMemo(() => {
    return gastos.filter(g => {
      if (!g.fecha) return false;

      const fecha = new Date(g.fecha);
      const mesGasto = `\( {fecha.getFullYear()}- \){String(fecha.getMonth() + 1).padStart(2, '0')}`;

      return (
        (!filtros.mes || mesGasto === filtros.mes) &&
        (!filtros.metodo || g.metodo === filtros.metodo) &&
        (!filtros.cuenta || g.cuenta === filtros.cuenta) &&
        (!filtros.categoria || g.categoria === filtros.categoria)
      );
    });
  }, [gastos, filtros]);

  // Estadísticas principales
  const stats = useMemo(() => {
    if (gastosFiltrados.length === 0) {
      return {
        total: 0,
        porCategoria: {},
        categoriaMayor: { nombre: '-', monto: 0 },
        cuentaMasUsada: '-',
        metodoMasUsado: '-',
        promedioPorTransaccion: 0
      };
    }

    const porCategoria = {};
    const porCuenta = {};
    const porMetodo = {};

    let total = 0;

    gastosFiltrados.forEach(g => {
      total += g.monto || 0;

      // Categoría
      porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + (g.monto || 0);

      // Cuenta
      porCuenta[g.cuenta] = (porCuenta[g.cuenta] || 0) + 1;

      // Método
      porMetodo[g.metodo] = (porMetodo[g.metodo] || 0) + 1;
    });

    const categoriaMayor = Object.entries(porCategoria)
      .sort(([,a], [,b]) => b - a)[0] || ['', 0];

    const cuentaMasUsada = Object.entries(porCuenta)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '-';

    const metodoMasUsado = Object.entries(porMetodo)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '-';

    return {
      total,
      porCategoria,
      categoriaMayor: { nombre: categoriaMayor[0], monto: categoriaMayor[1] },
      cuentaMasUsada,
      metodoMasUsado,
      promedioPorTransaccion: total / gastosFiltrados.length
    };
  }, [gastosFiltrados]);

  // Sugerencia de ahorro (versión mejorada)
  const sugerenciaAhorro = useMemo(() => {
    const candidatas = Object.entries(stats.porCategoria)
      .filter(([cat]) => !CATEGORIAS_FIJAS_EXCLUIDAS_AHORRO.includes(cat))
      .sort(([,a], [,b]) => b - a);

    if (candidatas.length === 0) {
      const mayor = Object.entries(stats.porCategoria).sort(([,a], [,b]) => b - a)[0];
      if (!mayor) return { mensaje: 'Sin datos suficientes' };
      
      const ahorro = mayor[1] * 0.10;
      return {
        categoria: mayor[0],
        ahorroPotencial: ahorro,
        mensaje: `Intenta ahorrar un 10% en \( {mayor[0]} → ~ \){formatCurrency(ahorro)}`
      };
    }

    const [cat, monto] = candidatas[0];
    const ahorro = monto * 0.20;
    
    return {
      categoria: cat,
      ahorroPotencial: ahorro,
      mensaje: `Puedes intentar reducir un 20% en \( {cat} → ~ \){formatCurrency(ahorro)}`
    };
  }, [stats.porCategoria]);

  // Exportar
  const exportarCSV = useCallback(() => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto'];
    const rows = gastosFiltrados.map(g => [
      g.fecha,
      `"${(g.concepto || '').replace(/"/g, '""')}"`,
      g.metodo || '',
      g.categoria || '',
      g.cuenta || '',
      g.monto
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gastos_\( {filtros.mes || 'todos'}_ \){new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [gastosFiltrados, filtros.mes]);

  // Render loading / error
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 text-blue-400 animate-spin mx-auto" />
          <p className="text-slate-300 text-lg">Cargando tus gastos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-slate-900 border border-red-800/40 rounded-xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Algo salió mal</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <p className="text-slate-500 text-sm mb-8">
            Mostrando datos de demostración
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Render principal
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 pb-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mis Gastos</h1>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-4xl font-black text-red-400 tracking-tight">
                {formatCurrency(stats.total)}
              </div>
              <div className="text-xl text-slate-400">
                {formatMonth(filtros.mes)}
              </div>
              <div className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-300">
                {gastosFiltrados.length} movimientos
              </div>
            </div>
          </div>

          <button
            onClick={exportarCSV}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium 
                     transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30"
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Panel lateral filtros + estadísticas rápidas */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Filtros */}
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <Filter className="text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>

            <div className="space-y-4">
              <FilterSelect
                icon={Calendar}
                label="Mes"
                value={filtros.mes}
                onChange={updateFiltro('mes')}
                options={datosDerivados.mesesOrdenados}
                defaultText="Todos los meses"
              />

              <FilterSelect
                icon={CreditCard}
                label="Método"
                value={filtros.metodo}
                onChange={updateFiltro('metodo')}
                options={datosDerivados.metodos}
                defaultText="Todos los métodos"
              />

              <FilterSelect
                icon={Database}
                label="Cuenta"
                value={filtros.cuenta}
                onChange={updateFiltro('cuenta')}
                options={datosDerivados.cuentas}
                defaultText="Todas las cuentas"
              />

              <FilterSelect
                icon={Tag}
                label="Categoría"
                value={filtros.categoria}
                onChange={updateFiltro('categoria')}
                options={datosDerivados.categorias}
                defaultText="Todas las categorías"
              />
            </div>

            <button
              onClick={resetFiltros}
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 
                       text-slate-300 rounded-lg text-sm transition"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <TrendingDown className="text-blue-400" />
              Resumen rápido
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Gasto total</div>
                  <div className="text-2xl font-bold text-red-400">
                    {formatCurrency(stats.total)}
                  </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Promedio</div>
                  <div className="text-xl font-bold text-slate-200">
                    {formatCurrency(stats.promedioPorTransaccion)}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Mayor gasto</div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-200 font-medium truncate max-w-[65%]">
                    {stats.categoriaMayor.nombre}
                  </span>
                  <span className="text-red-400 font-bold">
                    {formatCurrency(stats.categoriaMayor.monto)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Tabla */}
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">
                Historial de movimientos
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {gastosFiltrados.length} de {gastos.length} transacciones
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-950/80">
                  <tr>
                    {['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto'].map((header) => (
                      <th
                        key={header}
                        className={`px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${
                          header === 'Monto' ? 'text-right' : ''
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {gastosFiltrados.map((gasto) => (
                    <tr
                      key={gasto.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                        {gasto.fecha}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {gasto.concepto}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                          {gasto.metodo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/50 text-blue-300">
                          {gasto.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {gasto.cuenta}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-red-400">
                          {formatCurrency(gasto.monto)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {gastosFiltrados.length === 0 && (
              <div className="py-16 text-center text-slate-500">
                No hay gastos que coincidan con los filtros actuales
              </div>
            )}
          </div>

          {/* Sugerencias rápidas */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/30 border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-900/40 p-2 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="font-medium text-blue-300">Idea de ahorro</h3>
              </div>
              <p className="text-slate-300">
                {sugerenciaAhorro.mensaje}
              </p>
            </div>

            {/* Puedes añadir aquí otra tarjeta de "Próximos vencimientos" si decides implementarla */}
          </div>
        </main>
      </div>
    </div>
  );
}