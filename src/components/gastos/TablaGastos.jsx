import { useState, useMemo } from 'react';
import { gastosMensuales } from '@/lib/gastos';
import FilaGasto from './FilaGasto';

export default function TablaGastos() {
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Datos basados en tus capturas
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER MINIMALISTA */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gastos</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-semibold text-gray-900">€{total.toFixed(2)}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">Octubre 2025</span>
            </div>
          </div>
          <button 
            onClick={exportarCSV}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <span>📥</span>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* LAYOUT DE 2 COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA - FILTROS */}
        <div className="lg:w-1/3 xl:w-1/4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
            
            <div className="space-y-4">
              {/* FILTRO MES */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-500">📅</span>
                    Mes
                  </span>
                </label>
                <select 
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todos los meses</option>
                  <option value="2025-10">Octubre 2025</option>
                  <option value="2025-09">Septiembre 2025</option>
                  <option value="2025-08">Agosto 2025</option>
                </select>
              </div>

              {/* FILTRO MÉTODO DE PAGO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-500">💳</span>
                    Método de pago
                  </span>
                </label>
                <select 
                  value={filtroMetodo}
                  onChange={(e) => setFiltroMetodo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todos los métodos</option>
                  {metodosPago.map(metodo => (
                    <option key={metodo} value={metodo}>{metodo}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO CUENTA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-500">🏦</span>
                    Cuenta
                  </span>
                </label>
                <select 
                  value={filtroCuenta}
                  onChange={(e) => setFiltroCuenta(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todas las cuentas</option>
                  {cuentas.map(cuenta => (
                    <option key={cuenta} value={cuenta}>{cuenta}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO CATEGORÍA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-500">🏷️</span>
                    Categoría
                  </span>
                </label>
                <select 
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* RESUMEN */}
            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total filtrado</span>
                  <span className="text-lg font-semibold text-gray-900">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Transacciones</span>
                  <span className="font-medium text-gray-900">{gastosFiltrados.length}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setFiltroMes('');
                  setFiltroMetodo('');
                  setFiltroCuenta('');
                  setFiltroCategoria('');
                }}
                className="w-full mt-4 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* MINI TRACKER (basado en tu captura) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tracker rápido</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">Categoría activa</span>
                <span className="text-sm font-medium text-gray-900">Alquiler</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Cuenta principal</span>
                <span className="text-sm font-medium text-gray-900">BBVA</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - TABLA */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* HEADER DE TABLA */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Historial de gastos</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Mostrando {gastosFiltrados.length} de {gastosMensuales.length} transacciones
                  </p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                  Desliza → para ver más columnas
                </div>
              </div>
            </div>

            {/* TABLA MINIMALISTA */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concepto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-200">
                  {gastosFiltrados.map((gasto) => (
                    <tr key={gasto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {gasto.fecha}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{gasto.concepto}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {gasto.metodoPago}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {gasto.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {gasto.cuenta}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                        €{gasto.monto.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* ESTADO VACÍO */}
              {gastosFiltrados.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-gray-400 text-lg mb-2">No se encontraron gastos</div>
                  <p className="text-sm text-gray-500">Prueba ajustando los filtros</p>
                </div>
              )}
            </div>

            {/* FOOTER DE TABLA */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {gastosFiltrados.length} transacciones • Total: €{total.toFixed(2)}
                </span>
                <span className="hidden sm:inline">
                  Actualizado hoy
                </span>
              </div>
            </div>
          </div>

          {/* SUGERENCIAS DE AHORRO */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Sugerencia de ahorro</h4>
              <p className="text-sm text-blue-700">
                Reduce un 10% en "Diversión" este mes y ahorra ~€45
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2">Próximos pagos</h4>
              <p className="text-sm text-green-700">
                Alquiler vence el 02/11 • €750
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}