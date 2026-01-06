import { useState, useMemo } from 'react';
import { gastosMensuales } from '@/lib/gastos';
import FilaGasto from './FilaGasto';

export default function TablaGastos() {
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // TUS DATOS DE LAS CAPTURAS
  const metodosPago = ['Apple Pay', 'Transferencia', 'Bizum', 'Efectivo', 'Tarjeta'];
  const categorias = ['Alimentación', 'Salud e higiene', 'Transporte', 'Diversión', 'Ropa', 'Otros', 'Ahorro', 'Alquiler'];
  const cuentas = ['BBVA', 'Efectivo', 'Bizum', 'PayPal'];
  
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
    link.download = `gastos_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER - MANTIENDO TUS COLORES */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Finanzas</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-white">€{total.toFixed(2)}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">Octubre 2025</span>
              <span className="text-slate-500 text-sm bg-slate-900 px-3 py-1 rounded-full">
                {gastosFiltrados.length} transacciones
              </span>
            </div>
          </div>
          <button 
            onClick={exportarCSV}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <span>📥</span>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* LAYOUT MEJORADO - DOS COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA - FILTROS Y TRACKER */}
        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
          {/* PANEL DE FILTROS MEJORADO */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Filtros</h2>
            
            <div className="space-y-4">
              {/* FILTRO MES */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-400">📅</span>
                    Mes
                  </span>
                </label>
                <select 
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todos los meses</option>
                  <option value="2025-10">Octubre 2025</option>
                  <option value="2025-09">Septiembre 2025</option>
                  <option value="2025-08">Agosto 2025</option>
                </select>
              </div>

              {/* FILTRO MÉTODO DE PAGO */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-purple-400">💳</span>
                    Método de pago
                  </span>
                </label>
                <select 
                  value={filtroMetodo}
                  onChange={(e) => setFiltroMetodo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todos los métodos</option>
                  {metodosPago.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO CUENTA */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-green-400">🏦</span>
                    Cuenta
                  </span>
                </label>
                <select 
                  value={filtroCuenta}
                  onChange={(e) => setFiltroCuenta(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todas las cuentas</option>
                  {cuentas.map(cuenta => (
                    <option key={cuenta} value={cuenta}>{cuenta}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO CATEGORÍA */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-yellow-400">🏷️</span>
                    Categoría
                  </span>
                </label>
                <select 
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* RESUMEN */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Total filtrado</span>
                  <span className="text-xl font-bold text-white">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Transacciones</span>
                  <span className="font-medium text-slate-300">{gastosFiltrados.length}</span>
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

          {/* TU TRACKER DE GASTOS (DE TUS CAPTURAS) */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Tracker de gastos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📊</span>
                  <span className="text-sm text-slate-300">Categoría</span>
                </div>
                <span className="text-sm font-medium text-white">Alquiler</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🏦</span>
                  <span className="text-sm text-slate-300">Cuenta</span>
                </div>
                <span className="text-sm font-medium text-white">BBVA</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">💳</span>
                  <span className="text-sm text-slate-300">Método</span>
                </div>
                <span className="text-sm font-medium text-white">Transferencia</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - TABLA MEJORADA */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
            {/* HEADER DE TABLA */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Historial de gastos</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} de {gastosMensuales.length} transacciones
                  </p>
                </div>
                <div className="text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg">
                  Desliza → para ver más columnas
                </div>
              </div>
            </div>

            {/* TABLA MEJORADA CON TUS COLORES */}
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
                  {gastosFiltrados.map((gasto) => (
                    <tr key={gasto.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {gasto.fecha}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{gasto.concepto}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                          {gasto.metodoPago}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300">
                          {gasto.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {gasto.cuenta}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-red-400">
                        €{gasto.monto.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* ESTADO VACÍO */}
              {gastosFiltrados.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-slate-500 text-lg mb-2">No se encontraron gastos</div>
                  <p className="text-sm text-slate-600">Prueba ajustando los filtros</p>
                </div>
              )}
            </div>

            {/* FOOTER DE TABLA */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50">
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>
                  {gastosFiltrados.length} transacciones • Total: €{total.toFixed(2)}
                </span>
                <span className="hidden sm:inline">
                  {gastosFiltrados.length === gastosMensuales.length ? 'Todos los gastos visibles' : 'Filtros aplicados'}
                </span>
              </div>
            </div>
          </div>

          {/* SUGERENCIAS DE AHORRO - ESTILO COHERENTE */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400">💡</span>
                <h4 className="text-sm font-semibold text-blue-300">Sugerencia de ahorro</h4>
              </div>
              <p className="text-sm text-slate-300">
                Reduce un 10% en "Diversión" y ahorra ~€45 este mes
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">📅</span>
                <h4 className="text-sm font-semibold text-green-300">Próximos pagos</h4>
              </div>
              <p className="text-sm text-slate-300">
                Alquiler vence el 02/11 • €750
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}