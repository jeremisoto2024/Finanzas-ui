import { useState } from 'react'
import { useLocalStorage } from '@/components/hooks/useLocalStorage'
import { 
  Settings, 
  Plus,
  Trash2,
  CheckCircle,
  X,
  Save,
  Calendar,
  Euro,
  ChevronDown,
  ChevronRight,
  Calculator,
  Bell,
  Receipt,
  AlertCircle,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
  Upload,
  BarChart3,
  Home,
  ShoppingBag,
  Car,
  Gamepad2,
  Heart,
  Wifi,
  Phone,
  Coffee,
  Utensils,
  Gift,
  MoreHorizontal,
  BookOpen,
  Music,
  RefreshCw
} from 'lucide-react'

export default function Configuracion() {
  // Estados con localStorage
  const [pagosFijos, setPagosFijos] = useLocalStorage('pagosFijos', [
    { id: 1, nombre: 'Netflix', monto: 12.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true },
    { id: 2, nombre: 'Gimnasio', monto: 45.00, metodo: 'Transferencia', categoria: 'Salud', frecuencia: 'mensual', activo: true },
    { id: 3, nombre: 'Alquiler', monto: 750.00, metodo: 'Transferencia', categoria: 'Alquiler', frecuencia: 'mensual', activo: true },
    { id: 4, nombre: 'Internet', monto: 39.99, metodo: 'Tarjeta', categoria: 'Servicios', frecuencia: 'mensual', activo: true },
    { id: 5, nombre: 'Teléfono', monto: 25.00, metodo: 'Tarjeta', categoria: 'Telefonía', frecuencia: 'mensual', activo: true },
    { id: 6, nombre: 'Spotify', monto: 9.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true }
  ])

  const [comprasCuotas, setComprasCuotas] = useLocalStorage('comprasCuotas', [
    { 
      id: 1, 
      concepto: 'iPhone 15 Pro', 
      montoTotal: 1199.00, 
      cuotasTotales: 12,
      cuotasPagadas: 3,
      montoPrimeraCuota: 150.00,
      montoUltimaCuota: 49.00,
      tipoCuotas: 'decreciente',
      fechaInicio: '2025-09-01',
      metodo: 'Tarjeta',
      categoria: 'Tecnología',
      activo: true,
      historialCuotas: [
        { numero: 1, monto: 150.00, pagada: true, fecha: '2025-09-01' },
        { numero: 2, monto: 140.00, pagada: true, fecha: '2025-10-01' },
        { numero: 3, monto: 130.00, pagada: true, fecha: '2025-11-01' },
        { numero: 4, monto: 120.00, pagada: false, fecha: '2025-12-01' },
        { numero: 5, monto: 110.00, pagada: false, fecha: '2026-01-01' },
        { numero: 6, monto: 100.00, pagada: false, fecha: '2026-02-01' },
        { numero: 7, monto: 90.00, pagada: false, fecha: '2026-03-01' },
        { numero: 8, monto: 80.00, pagada: false, fecha: '2026-04-01' },
        { numero: 9, monto: 70.00, pagada: false, fecha: '2026-05-01' },
        { numero: 10, monto: 60.00, pagada: false, fecha: '2026-06-01' },
        { numero: 11, monto: 50.00, pagada: false, fecha: '2026-07-01' },
        { numero: 12, monto: 49.00, pagada: false, fecha: '2026-08-01' }
      ]
    }
  ])

  // Estados para acordeones
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
    pagosFijos: true,
    comprasCuotas: true,
    exportacion: false
  })

  // Estados para mostrar formularios
  const [mostrarFormPagoFijo, setMostrarFormPagoFijo] = useState(false)
  const [mostrarFormCuotas, setMostrarFormCuotas] = useState(false)
  
  // Datos para formularios
  const [pagoFijo, setPagoFijo] = useState({
    nombre: '',
    monto: '',
    metodo: 'Tarjeta',
    categoria: 'Servicios',
    frecuencia: 'mensual',
    fechaInicio: new Date().toISOString().split('T')[0],
    notificacion: true
  })

  const [compraCuotas, setCompraCuotas] = useState({
    concepto: '',
    montoTotal: '',
    cuotasTotales: '12',
    cuotasPagadas: '0',
    montoPrimeraCuota: '',
    montoUltimaCuota: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    metodo: 'Tarjeta',
    categoria: 'Tecnología',
    frecuenciaPago: 'mensual'
  })

  // Funciones de gestión
  const guardarPagoFijo = () => {
    if (!pagoFijo.nombre || !pagoFijo.monto) return
    
    const nuevoPago = {
      ...pagoFijo,
      id: Date.now(),
      monto: parseFloat(pagoFijo.monto),
      activo: true
    }
    
    setPagosFijos([...pagosFijos, nuevoPago])
    
    setPagoFijo({
      nombre: '',
      monto: '',
      metodo: 'Tarjeta',
      categoria: 'Servicios',
      frecuencia: 'mensual',
      fechaInicio: new Date().toISOString().split('T')[0],
      notificacion: true
    })
    setMostrarFormPagoFijo(false)
  }

  const guardarCompraCuotas = () => {
    if (!compraCuotas.concepto || !compraCuotas.montoTotal) return
    
    const cuotasTotales = parseInt(compraCuotas.cuotasTotales) || 12
    const cuotasPagadas = parseInt(compraCuotas.cuotasPagadas) || 0
    
    const nuevaCompra = {
      ...compraCuotas,
      id: Date.now(),
      montoTotal: parseFloat(compraCuotas.montoTotal),
      cuotasTotales,
      cuotasPagadas,
      montoPrimeraCuota: parseFloat(compraCuotas.montoPrimeraCuota) || 0,
      montoUltimaCuota: parseFloat(compraCuotas.montoUltimaCuota) || 0,
      activo: true,
      historialCuotas: []
    }
    
    setComprasCuotas([...comprasCuotas, nuevaCompra])
    
    setCompraCuotas({
      concepto: '',
      montoTotal: '',
      cuotasTotales: '12',
      cuotasPagadas: '0',
      montoPrimeraCuota: '',
      montoUltimaCuota: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      metodo: 'Tarjeta',
      categoria: 'Tecnología',
      frecuenciaPago: 'mensual'
    })
    setMostrarFormCuotas(false)
  }

  // Función para resetear datos (útil para desarrollo)
  const resetearDatos = () => {
    if (confirm('¿Estás seguro de querer resetear todos los datos? Esto eliminará todo lo que has configurado.')) {
      localStorage.removeItem('pagosFijos')
      localStorage.removeItem('comprasCuotas')
      window.location.reload()
    }
  }

  // Calcular estadísticas
  const totalPagosMensuales = pagosFijos
    .filter(p => p.activo && p.frecuencia === 'mensual')
    .reduce((sum, p) => sum + p.monto, 0)

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <Settings className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Gestión Financiera</h1>
            </div>
            <p className="text-slate-400 mt-2">
              Controla tus pagos fijos y compras a cuotas
            </p>
          </div>
          
          {/* RESUMEN RÁPIDO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Pagos fijos</div>
              <div className="text-lg font-bold text-amber-400">
                {pagosFijos.filter(p => p.activo).length}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Gastos fijos/mes</div>
              <div className="text-lg font-bold text-red-400">
                €{totalPagosMensuales.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Cuotas activas</div>
              <div className="text-lg font-bold text-purple-400">
                {comprasCuotas.filter(c => c.activo).length}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Datos guardados</div>
              <div className="text-lg font-bold text-emerald-400">
                {new Date().getDate()}/{new Date().getMonth() + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÓN DE RESET (solo para desarrollo) */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={resetearDatos}
          className="flex items-center gap-2 px-3 py-2 text-xs bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition"
          title="Resetear todos los datos"
        >
          <RefreshCw className="h-3 w-3" />
          Resetear datos
        </button>
      </div>

      {/* BOTONES PRINCIPALES */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setMostrarFormPagoFijo(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo pago fijo
        </button>
        
        <button
          onClick={() => setMostrarFormCuotas(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva compra a cuotas
        </button>
      </div>

      {/* FORMULARIO PARA PAGO FIJO */}
      {mostrarFormPagoFijo && (
        <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Nuevo pago fijo</h2>
            <button
              onClick={() => setMostrarFormPagoFijo(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={pagoFijo.nombre}
                  onChange={(e) => setPagoFijo({...pagoFijo, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  placeholder="Ej: Netflix, Alquiler..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Euro className="h-4 w-4" />
                  Monto *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">€</span>
                  </div>
                  <input
                    type="number"
                    value={pagoFijo.monto}
                    onChange={(e) => setPagoFijo({...pagoFijo, monto: e.target.value})}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Categoría
                </label>
                <select
                  value={pagoFijo.categoria}
                  onChange={(e) => setPagoFijo({...pagoFijo, categoria: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                >
                  <option value="Alquiler">Alquiler</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Entretenimiento">Entretenimiento</option>
                  <option value="Salud">Salud</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Telefonía">Telefonía</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Educación">Educación</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Método de pago
                </label>
                <select
                  value={pagoFijo.metodo}
                  onChange={(e) => setPagoFijo({...pagoFijo, metodo: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                >
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Bizum">Bizum</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Frecuencia
                </label>
                <select
                  value={pagoFijo.frecuencia}
                  onChange={(e) => setPagoFijo({...pagoFijo, frecuencia: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                >
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="h-4 w-4" />
                  Próximo pago
                </label>
                <input
                  type="date"
                  value={pagoFijo.fechaInicio}
                  onChange={(e) => setPagoFijo({...pagoFijo, fechaInicio: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMostrarFormPagoFijo(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarPagoFijo}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
              >
                <Save className="h-4 w-4" />
                Crear pago fijo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE PAGOS FIJOS EN CONFIGURACIÓN */}
      <div className="mb-8 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-amber-400" />
            <span className="font-semibold text-white">Pagos Fijos Configurados</span>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
              {pagosFijos.length} en total • {pagosFijos.filter(p => p.activo).length} activos
            </span>
          </div>
          <button
            onClick={() => setAcordeonesAbiertos({
              ...acordeonesAbiertos,
              pagosFijos: !acordeonesAbiertos.pagosFijos
            })}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {acordeonesAbiertos.pagosFijos ? 
              <ChevronDown className="h-5 w-5 text-slate-400" /> : 
              <ChevronRight className="h-5 w-5 text-slate-400" />
            }
          </button>
        </div>

        {acordeonesAbiertos.pagosFijos && (
          <div className="px-6 py-4 border-t border-slate-800">
            {pagosFijos.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No hay pagos fijos configurados</p>
                <p className="text-slate-500 text-xs mt-1">Usa el botón "Nuevo pago fijo" para agregar uno</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {pagosFijos.map((pago) => (
                      <tr key={pago.id} className="hover:bg-slate-800/30">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{pago.nombre}</div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="capitalize">{pago.frecuencia}</span>
                            <span>•</span>
                            <span>{pago.metodo}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-bold text-red-400">€{pago.monto.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                            {pago.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pago.activo
                              ? 'bg-emerald-900/30 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {pago.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const nuevosPagos = pagosFijos.map(p => 
                                  p.id === pago.id ? { ...p, activo: !p.activo } : p
                                )
                                setPagosFijos(nuevosPagos)
                              }}
                              className={`p-1.5 rounded-lg transition ${
                                pago.activo
                                  ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                              title={pago.activo ? 'Desactivar' : 'Activar'}
                            >
                              {pago.activo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar "${pago.nombre}"?`)) {
                                  const nuevosPagos = pagosFijos.filter(p => p.id !== pago.id)
                                  setPagosFijos(nuevosPagos)
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}