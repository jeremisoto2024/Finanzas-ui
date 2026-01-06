import { useState, useMemo } from 'react';
import { gastosMensuales } from '@/lib/gastos';
import FilaGasto from './FilaGasto';
import { 
  FiFilter, 
  FiDownload, 
  FiCalendar, 
  FiCreditCard, 
  FiDatabase,
  FiTag 
} from 'react-icons/fi';

export default function TablaGastos() {
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const metodosUnicos = [...new Set(gastosMensuales.map(g => g.metodoPago))];
  const cuentasUnicas = [...new Set(gastosMensuales.map(g => g.cuenta))];
  const categoriasUnicas = [...new Set(gastosMensuales.map(g => g.categoria))];
  
  const gastosFiltrados = useMemo(() => {
    return gastosMensuales.filter(gasto => {
      const fechaGasto = new Date(gasto.fecha);
      const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
      
      const cumpleMes = !filtroMes || mesGasto === filtroMes;
      const cumpleMetodo = !filtroMetodo || gasto.metodoPago === filtroMetodo;
      const cumpleCuenta = !filtroCuenta || gasto.cuenta === filtroCuenta;
      const cumpleCategoria = !filtroCategoria || gasto.categoria === filtroCategoria;
      
      return cumpleMes && cumpleMetodo && cumpleCuenta && cumpleCategoria;
    });
  }, [filtroMes, filtroMetodo, filtroCuenta, filtroCategoria]);

  const total = gastosFiltrados.reduce((sum, gasto) => sum + gasto.monto, 0);

  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto'];
    const filas = gastosFiltrados.map(g => 
      [g.fecha, g.concepto, g.metodoPago, g.categoria, g.cuenta, g.monto].join(',')
    );
    
    const csv = [headers.join(','), ...filas].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gastos_${filtroMes || 'todos'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="space-y-6">
      {/* ENCABEZADO MEJORADO */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Gastos del mes</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-400">€{total.toFixed(2)}</span>
              <span className="text-slate-400">• Octubre 2025</span>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {gastosFiltrados.length} transacciones • {gastosMensuales.length} totales
            </p>
          </div>
          
          <button 
            onClick={exportarCSV}
            className="mt-4 md:mt-0 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-red-900/30 transition-all"
          >
            <FiDownload className="text-lg" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* PANEL DE FILTROS MEJORADO */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-700 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="text-blue-400 text-lg" />
          <h2 className="text-lg font-semibold text-white">Filtros</h2>
          <span className="ml-auto px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
            {gastosFiltrados.length} resultados
          </span>
        </div>

        {/* FILTROS EN GRID RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* FILTRO MES */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FiCalendar className="text-blue-400" />
              Mes
            </label>
            <div className="relative">
              <select 
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Todos los meses</option>
                <option value="2025-10">Octubre 2025</option>
                <option value="2025-09">Septiembre 2025</option>
                <option value="2025-08">Agosto 2025</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          {/* FILTRO MÉTODO */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FiCreditCard className="text-purple-400" />
              Método de pago
            </label>
            <div className="relative">
              <select 
                value={filtroMetodo}
                onChange={(e) => setFiltroMetodo(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              >
                <option value="">Todos los métodos</option>
                {metodosUnicos.map(metodo => (
                  <option key={metodo} value={metodo}>{metodo}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          {/* FILTRO CUENTA */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FiDatabase className="text-green-400" />
              Cuenta bancaria
            </label>
            <div className="relative">
              <select 
                value={filtroCuenta}
                onChange={(e) => setFiltroCuenta(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              >
                <option value="">Todas las cuentas</option>
                {cuentasUnicas.map(cuenta => (
                  <option key={cuenta} value={cuenta}>{cuenta}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          {/* FILTRO CATEGORÍA */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FiTag className="text-yellow-400" />
              Categoría
            </label>
            <div className="relative">
              <select 
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
              >
                <option value="">Todas las categorías</option>
                {categoriasUnicas.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL Y BOTONES DE ACCIÓN */}
        <div className="mt-6 pt-5 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">€{total.toFixed(2)}</div>
                <div className="text-xs text-slate-400">Total filtrado</div>
              </div>
              <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-300">{gastosFiltrados.length}</div>
                <div className="text-xs text-slate-400">Transacciones</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setFiltroMes('');
                  setFiltroMetodo('');
                  setFiltroCuenta('');
                  setFiltroCategoria('');
                }}
                className="px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg text-sm font-medium transition"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA MEJORADA */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="font-medium text-white">Historial de gastos</h3>
          <p className="text-sm text-slate-400">Desliza horizontalmente para ver más columnas</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Concepto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Método</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cuenta</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Monto</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800">
              {gastosFiltrados.map((gasto) => (
                <tr key={gasto.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-slate-300">{gasto.fecha}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{gasto.concepto}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                      {gasto.metodoPago}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300">
                      {gasto.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{gasto.cuenta}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-red-400">€{gasto.monto.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {gastosFiltrados.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-slate-500 mb-2">No se encontraron gastos</div>
              <p className="text-sm text-slate-600">Prueba ajustando los filtros</p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-3 border-t border-slate-700 bg-slate-900/50 text-sm text-slate-400">
          Mostrando {gastosFiltrados.length} de {gastosMensuales.length} gastos
        </div>
      </div>
    </div>
  );
}