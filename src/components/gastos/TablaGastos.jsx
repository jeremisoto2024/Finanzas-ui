import { useState, useMemo, useEffect } from 'react';
// Se elimina: import { gastosMensuales } from '@/lib/gastos';

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
  RefreshCw
} from 'lucide-react';

export default function TablaGastos() {
  // Estados para los datos de Notion
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros existentes
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
        
        // Datos de ejemplo como fallback
        setGastosMensuales([
          { 
            id: 1, 
            fecha: '2025-10-01', 
            concepto: 'Alquiler', 
            metodo: 'Transferencia', 
            categoria: 'Vivienda', 
            cuenta: 'BBVA', 
            monto: 850 
          },
          { 
            id: 2, 
            fecha: '2025-09-15', 
            concepto: 'Supermercado', 
            metodo: 'Tarjeta', 
            categoria: 'Alimentación', 
            cuenta: 'Santander', 
            monto: 120 
          },
          { 
            id: 3, 
            fecha: '2025-08-05', 
            concepto: 'Gasolina', 
            metodo: 'Tarjeta', 
            categoria: 'Transporte', 
            cuenta: 'Santander', 
            monto: 60 
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, []);

  // Obtener meses únicos de los datos
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

  // Función para formatear mes a texto
  const formatearMesTexto = (mesFormato) => {
    if (!mesFormato) return '';
    const [año, mes] = mesFormato.split('-');
    const fecha = new Date(año, parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const metodosPago = ['Apple Pay', 'Transferencia', 'Bizum', 'Efectivo', 'Tarjeta'];
  const categorias = ['Alimentación', 'Salud e higiene', 'Transporte', 'Diversión', 'Ropa', 'Otros', 'Ahorro'];
  const cuentas = ['BBVA', 'Efectivo'];
  
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

  const total = gastosFiltrados.reduce((sum, gasto) => sum + gasto.monto, 0);

  // Calcular categoría principal
  const categoriaPrincipal = useMemo(() => {
    const categorias = gastosFiltrados.reduce((acc, gasto) => {
      acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
      return acc;
    }, {});
    
    return Object.entries(categorias).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [gastosFiltrados]);

  // Calcular cuenta más usada
  const cuentaMasUsada = useMemo(() => {
    const cuentas = gastosFiltrados.reduce((acc, gasto) => {
      acc[gasto.cuenta] = (acc[gasto.cuenta] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(cuentas).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [gastosFiltrados]);

  // Calcular método más común
  const metodoMasComun = useMemo(() => {
    const metodos = gastosFiltrados.reduce((acc, gasto) => {
      acc[gasto.metodo] = (acc[gasto.metodo] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(metodos).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [gastosFiltrados]);

  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto'];
    const filas = gastosFiltrados.map(g => 
      [g.fecha, g.concepto, g.metodo, g.categoria, g.cuenta, g.monto].join(',')
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

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
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
      {/* HEADER MEJORADO - TÍTULO CAMBIADO Y TOTAL EN ROJO */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Gastos del Mes</h1>
            <div className="flex items-center gap-3 mt-2">
              {/* CAMBIADO: Color del total a rojo */}
              <span className="text-3xl font-bold text-red-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? 
                  formatearMesTexto(filtroMes) : 
                  'Todos los meses'
                }
              </span>
              <span className="text-slate-500 text-sm bg-slate-900 px-3 py-1 rounded-full">
                {gastosFiltrados.length} transacciones
              </span>
            </div>
          </div>
          
          {/* BOTÓN DE EXPORTAR MEJORADO */}
          <button 
            onClick={exportarCSV}
            className="group flex items-center gap-3 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/30"
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
              <Filter className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>
            
            <div className="space-y-4">
              {/* FILTRO MES - ACTUALIZADO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Mes
                </label>
                <div className="relative">
                  <select 
                    value={filtroMes}
                    onChange={(e) => setFiltroMes(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
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

              {/* FILTRO MÉTODO DE PAGO */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <CreditCard className="h-4 w-4 text-purple-400" />
                  Método de pago
                </label>
                <div className="relative">
                  <select 
                    value={filtroMetodo}
                    onChange={(e) => setFiltroMetodo(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                  >
                    <option value="">Todos los métodos</option>
                    {metodosPago.map(metodo => (
                      <option key={metodo} value={metodo}>{metodo}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* FILTRO CUENTA */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                  <Database className="h-4 w-4 text-green-400" />
                  Cuenta
                </label>
                <div className="relative">
                  <select 
                    value={filtroCuenta}
                    onChange={(e) => setFiltroCuenta(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                  >
                    <option value="">Todas las cuentas</option>
                    {cuentas.map(cuenta => (
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
                    className="w-full px-4 py-2.5 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map(categoria => (
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
                    <div className="text-xl font-bold text-red-400">€{total.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Transacciones</div>
                    <div className="text-lg font-semibold text-slate-300">{gastosFiltrados.length}</div>
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
              <TrendingDown className="h-4 w-4 text-blue-400" />
              Análisis rápido
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Categoría principal</span>
                </div>
                <span className="text-sm font-medium text-white">{categoriaPrincipal}</span>
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
                  {gastosFiltrados.map((gasto) => (
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
                  ))}
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

          {/* SUGERENCIAS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">Sugerencia de ahorro</h4>
              </div>
              <p className="text-sm text-slate-300">
                Reduce un 10% en "Diversión" y ahorra ~€45 este mes
              </p>
            </div>
            <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-green-400" />
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