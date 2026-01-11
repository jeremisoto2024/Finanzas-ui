import { 
  Download, 
  Filter,
  Calendar,
  CreditCard,
  Tag,
  ChevronDown,
  FileText,
  AlertCircle,
  RefreshCw,
  Receipt,
  Repeat,
  Calculator
} from 'lucide-react';
import { useGastos } from '@/contexts/GastosContext';
import ResumenGastos from './ResumenGastos'; // Importar el componente ResumenGastos

export default function TablaGastos() {
  const {
    loading,
    error,
    filtroMes,
    setFiltroMes,
    filtroMetodo,
    setFiltroMetodo,
    filtroCategoria,
    setFiltroCategoria,
    obtenerMesesDisponibles,
    formatearMesTexto,
    gastosFiltrados,
    totalGastosFiltrados,
    estadisticasPorTipo
  } = useGastos();

  // 3. Exportar CSV (mantenido de la versión original)
  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto', 'Origen', 'Progreso'];
    const filas = gastosFiltrados.map(g => [
      g.fecha, 
      g.concepto, 
      g.metodo, 
      g.categoria, 
      g.cuenta, 
      g.monto, 
      g.origen || 'normal',
      g.infoProgreso || ''
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
              <span className="text-3xl font-bold text-red-400">€{totalGastosFiltrados.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? formatearMesTexto(filtroMes) : 'Gastos históricos'}
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
            <div className="mt-3 text-sm text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg">
              💡 Mostrando solo gastos <strong>ya efectuados</strong> (históricos)
            </div>
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

      {/* LAYOUT DE TRES COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA - RESUMEN GASTOS */}
        <div className="lg:w-1/4">
          <ResumenGastos />
        </div>
        
        {/* COLUMNA CENTRAL - FILTROS */}
        <div className="lg:w-1/4">
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
                    <option value="">Todos los meses</option>
                    {obtenerMesesDisponibles.map((mes) => (
                      <option key={mes} value={mes}>
                        {formatearMesTexto(mes)}
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
                    <option value="App">App</option>
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
                    <option value="Familia">Familia</option>
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
                  <div className="text-xl font-bold text-red-400">€{totalGastosFiltrados.toFixed(2)}</div>
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
        </div>
        
        {/* COLUMNA DERECHA - TABLA DETALLADA */}
        <div className="lg:w-2/4">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
            {/* HEADER DE TABLA */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {filtroMes ? `Gastos de ${formatearMesTexto(filtroMes)}` : 'Todos los gastos históricos'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} transacciones efectuadas
                  </p>
                </div>
              </div>
            </div>

            {/* TABLA DETALLADA */}
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
                            Cambia los filtros o selecciona otro mes
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gastosFiltrados.map((gasto) => {
                      let origenColor, origenBg, origenIcon, origenTooltip = '';
                      
                      switch (gasto.origen) {
                        case 'pago_fijo':
                          origenColor = 'text-amber-400';
                          origenBg = 'bg-amber-900/30';
                          origenIcon = <Repeat className="h-3 w-3" />;
                          origenTooltip = 'Pago recurrente mensual';
                          break;
                        case 'cuota':
                          origenColor = 'text-purple-400';
                          origenBg = 'bg-purple-900/30';
                          origenIcon = <Calculator className="h-3 w-3" />;
                          origenTooltip = gasto.infoProgreso || `Cuota ${gasto.cuotaNumero} de ${gasto.totalCuotas}`;
                          break;
                        default:
                          origenColor = 'text-slate-400';
                          origenBg = 'bg-slate-800';
                          origenIcon = <Receipt className="h-3 w-3" />;
                          origenTooltip = 'Gasto normal';
                      }
                      
                      return (
                        <tr key={gasto.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {gasto.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{gasto.concepto}</div>
                            {gasto.origen === 'cuota' && gasto.infoCuota && (
                              <div className="text-xs text-purple-500">
                                {gasto.infoCuota} • {gasto.infoProgreso}
                              </div>
                            )}
                            {gasto.origen === 'pago_fijo' && gasto.frecuencia && (
                              <div className="text-xs text-amber-500">
                                Pago fijo • {gasto.frecuencia}
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
                            <span 
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${origenBg} ${origenColor}`}
                              title={origenTooltip}
                            >
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
            
            {/* FOOTER CON INFORMACIÓN DETALLADA */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50">
              <div className="text-xs text-slate-400">
                💡 Mostrando solo gastos <strong>ya efectuados</strong>. Pagos futuros no se incluyen.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}