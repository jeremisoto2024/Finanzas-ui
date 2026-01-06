import { useState, useMemo } from 'react';
import { gastosMensuales } from '@/lib/gastos';
import FilaGasto from './FilaGasto';

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
    link.download = 'mis_gastos.csv';
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div>
      <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-1">Filtros</h2>
          <p className="text-sm text-slate-400">
            {gastosFiltrados.length} gastos • Total: €{total.toFixed(2)}
          </p>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Mes</label>
            <select 
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">Todos los meses</option>
              <option value="2025-10">Octubre 2025</option>
              <option value="2025-09">Septiembre 2025</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Método</label>
            <select 
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">Todos los métodos</option>
              {metodosUnicos.map(metodo => (
                <option key={metodo} value={metodo}>{metodo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Cuenta</label>
            <select 
              value={filtroCuenta}
              onChange={(e) => setFiltroCuenta(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">Todas las cuentas</option>
              {cuentasUnicas.map(cuenta => (
                <option key={cuenta} value={cuenta}>{cuenta}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">Todas las categorías</option>
              {categoriasUnicas.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={exportarCSV}
            className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <div className="text-xs text-slate-500 px-4 py-2 md:hidden">
          Desliza → para ver más
        </div>
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Concepto</th>
              <th className="px-4 py-3 text-left">Método</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Cuenta</th>
              <th className="px-4 py-3 text-right">Monto</th>
            </tr>
          </thead>

          <tbody>
            {gastosFiltrados.map((gasto) => (
              <FilaGasto key={gasto.id} gasto={gasto} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}