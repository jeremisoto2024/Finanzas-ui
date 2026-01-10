import { useState, useMemo, useEffect } from 'react';
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
  Home,
  ShoppingBag,
  Car,
  Gamepad2,
  Heart,
  Smartphone,
  Shirt,
  Users,
  BookOpen,
  Couch,
  MoreHorizontal,
  Banknote,
  Coins,
  Globe,
  Wallet,
  Repeat,
  Calculator,
  DollarSign,
  BarChart3,
  Clock,
  Wifi,
  Coffee,
  Utensils,
  Gift,
  Music,
  Briefcase,
  Plane,
  Train,
  Bike,
  Building,
  GraduationCap,
  Stethoscope,
  Camera,
  Headphones,
  ShoppingCart,
  Package,
  Zap,
  Thermometer
} from 'lucide-react';

export default function TablaGastos() {
  // [TODO EL CÓDIGO SE MANTIENE EXACTAMENTE IGUAL...]
  // Solo voy a cambiar cómo se muestran los iconos en la tabla
  
  // ========== FUNCIONES PARA ICONOS MEJORADOS ==========
  
  // Obtener icono por categoría (MEJORADO)
  const getIconoCategoria = (categoria) => {
    const iconos = {
      'Vivienda': <Home className="h-4 w-4 text-amber-500" />,
      'Alimentación': <ShoppingBag className="h-4 w-4 text-emerald-500" />,
      'Transporte': <Car className="h-4 w-4 text-blue-500" />,
      'Entretenimiento': <Gamepad2 className="h-4 w-4 text-purple-500" />,
      'Salud': <Heart className="h-4 w-4 text-red-500" />,
      'Tecnología': <Smartphone className="h-4 w-4 text-cyan-500" />,
      'Ropa': <Shirt className="h-4 w-4 text-pink-500" />,
      'Familia': <Users className="h-4 w-4 text-indigo-500" />,
      'Educación': <BookOpen className="h-4 w-4 text-sky-500" />,
      'Hogar': <Couch className="h-4 w-4 text-orange-500" />,
      'Servicios': <Wifi className="h-4 w-4 text-slate-500" />,
      'Telefonía': <Smartphone className="h-4 w-4 text-violet-500" />,
      'Cafetería': <Coffee className="h-4 w-4 text-amber-400" />,
      'Restaurante': <Utensils className="h-4 w-4 text-red-400" />,
      'Regalos': <Gift className="h-4 w-4 text-pink-400" />,
      'Música': <Music className="h-4 w-4 text-purple-400" />,
      'Trabajo': <Briefcase className="h-4 w-4 text-blue-400" />,
      'Viajes': <Plane className="h-4 w-4 text-sky-400" />,
      'Otros': <MoreHorizontal className="h-4 w-4 text-gray-500" />
    };
    return iconos[categoria] || <Tag className="h-4 w-4 text-slate-400" />;
  };

  // Obtener icono por método de pago (MEJORADO)
  const getIconoMetodo = (metodo) => {
    const iconos = {
      'Tarjeta': <CreditCard className="h-4 w-4 text-purple-500" />,
      'Transferencia': <Banknote className="h-4 w-4 text-green-500" />,
      'Bizum': <Smartphone className="h-4 w-4 text-blue-500" />,
      'App': <ShoppingBag className="h-4 w-4 text-red-500" />,
      'Efectivo': <Coins className="h-4 w-4 text-yellow-500" />,
      'PayPal': <Globe className="h-4 w-4 text-blue-400" />
    };
    return iconos[metodo] || <Wallet className="h-4 w-4 text-slate-400" />;
  };

  // Obtener icono por tipo de gasto (MEJORADO)
  const getIconoTipo = (tipo) => {
    const iconos = {
      'normal': <Receipt className="h-4 w-4 text-slate-400" />,
      'pago_fijo': <Repeat className="h-4 w-4 text-amber-500" />,
      'cuota': <Calculator className="h-4 w-4 text-purple-500" />
    };
    return iconos[tipo] || <DollarSign className="h-4 w-4 text-slate-400" />;
  };

  // ========== RENDER (SOLO MODIFICO LA TABLA) ==========
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER - IGUAL */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard Financiero</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-red-400">€{total.toFixed(2)}</span>
              <div className="h-2 w-2 rounded-full bg-slate-600"></div>
              <span className="text-slate-400">
                {filtroMes ? formatearMesTexto(filtroMes) : 'Próximos gastos'}
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
            {filtroMes === '2026-01' && (
              <div className="mt-3 text-sm text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg">
                ⓘ Los pagos fijos y cuotas de enero 2026 ya están cubiertos
              </div>
            )}
            
            {/* RESUMEN DE CUOTAS */}
            {resumenCuotas.totalCuotas > 0 && (
              <div className="mt-2 text-sm text-purple-400">
                📊 {resumenCuotas.totalCuotas} cuotas pendientes (Total: €{resumenCuotas.totalMonto.toFixed(2)})
              </div>
            )}
          </div>
          
          {/* BOTÓN DE EXPORTAR - IGUAL */}
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

      {/* LAYOUT DE DOS COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA - FILTROS Y RESUMEN (IGUAL) */}
        <div className="lg:w-1/3 xl:w-1/4 space-y-6">
          {/* PANEL DE FILTROS - IGUAL */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-red-400" />
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
            </div>
            
            <div className="space-y-4">
              {/* FILTRO MES - IGUAL */}
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
                    <option value="">Próximos gastos</option>
                    {obtenerMesesDisponibles.map((mes) => (
                      <option key={mes} value={mes}>
                        {formatearMesTexto(mes)}
                        {mes === '2026-01' && ' (sin pagos fijos)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {/* FILTRO MÉTODO - IGUAL */}
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

              {/* FILTRO CATEGORÍA - IGUAL */}
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

            {/* RESUMEN - IGUAL */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg mb-4">
                <div>
                  <div className="text-sm text-slate-400">Total filtrado</div>
                  <div className="text-xl font-bold text-red-400">€{total.toFixed(2)}</div>
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

          {/* RESUMEN DE CUOTAS PENDIENTES - IGUAL */}
          {resumenCuotas.totalCuotas > 0 && (
            <div className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-purple-400" />
                Cuotas pendientes
              </h3>
              <div className="space-y-3">
                <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-xs text-purple-300 mb-1">Total cuotas</div>
                  <div className="text-xl font-bold text-purple-400">{resumenCuotas.totalCuotas}</div>
                  <div className="text-xs text-purple-500 mt-1">€{resumenCuotas.totalMonto.toFixed(2)}</div>
                </div>
                
                {Object.entries(resumenCuotas.cuotasPorCategoria).map(([categoria, data]) => (
                  <div key={categoria} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">{categoria}</span>
                    <div className="text-right">
                      <span className="text-purple-400">{data.count} cuotas</span>
                      <div className="text-xs text-purple-500">€{data.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA - TABLA DETALLADA CON ICONOS MEJORADOS */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
            {/* HEADER DE TABLA - IGUAL */}
            <div className="px-6 py-4 border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {filtroMes ? `Gastos de ${formatearMesTexto(filtroMes)}` : 'Próximos gastos'}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Mostrando {gastosFiltrados.length} transacciones
                    {resumenCuotas.totalCuotas > 0 && ` (${resumenCuotas.totalCuotas} cuotas pendientes)`}
                  </p>
                </div>
              </div>
            </div>

            {/* TABLA DETALLADA CON ICONOS MEJORADOS */}
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
                            {filtroMes === '2026-01' 
                              ? 'Los pagos fijos y cuotas de enero ya están cubiertos'
                              : 'Cambia los filtros o agrega nuevos gastos'
                            }
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
                          origenTooltip = `Cuota ${gasto.cuotaNumero} de ${gasto.totalCuotas} (${gasto.cuotasPagadas || 0} pagadas)`;
                          break;
                        default:
                          origenColor = 'text-slate-400';
                          origenBg = 'bg-slate-800';
                          origenIcon = <Receipt className="h-3 w-3" />;
                          origenTooltip = 'Gasto normal';
                      }
                      
                      // Obtener iconos mejorados
                      const iconoCategoria = getIconoCategoria(gasto.categoria);
                      const iconoMetodo = getIconoMetodo(gasto.metodo);
                      
                      return (
                        <tr key={gasto.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {gasto.fecha}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{gasto.concepto}</div>
                            {gasto.cuotaNumero && (
                              <div className="text-xs text-purple-500">
                                Cuota {gasto.cuotaNumero}/{gasto.totalCuotas}
                                {gasto.progreso && ` · ${gasto.progreso} pagadas`}
                              </div>
                            )}
                            {gasto.frecuencia && (
                              <div className="text-xs text-amber-500">
                                {gasto.frecuencia}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {iconoMetodo}
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                                {gasto.metodo}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {iconoCategoria}
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300">
                                {gasto.categoria}
                              </span>
                            </div>
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
            
            {/* FOOTER CON INFORMACIÓN DETALLADA - IGUAL */}
            {resumenCuotas.totalCuotas > 0 && (
              <div className="px-6 py-3 border-t border-slate-800 bg-purple-900/10">
                <div className="text-xs text-purple-300">
                  💡 Se muestran solo las próximas cuotas pendientes. Cuotas ya pagadas no se incluyen.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}