import { useState } from 'react'
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
  MoreHorizontal
} from 'lucide-react'

export default function Configuracion() {
  // Estados para acordeones
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
    pagosFijos: true,
    comprasCuotas: true,
    categorias: false
  })

  // Datos para formularios
  const [mostrarFormPagoFijo, setMostrarFormPagoFijo] = useState(false)
  const [mostrarFormCuotas, setMostrarFormCuotas] = useState(false)
  
  // Datos para pagos fijos
  const [pagoFijo, setPagoFijo] = useState({
    nombre: '',
    monto: '',
    metodo: 'Tarjeta',
    categoria: 'Servicios',
    frecuencia: 'mensual',
    fechaInicio: new Date().toISOString().split('T')[0],
    notificacion: true
  })

  // Datos para compras a cuotas (CON MONTOS VARIABLES)
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

  // Lista de pagos fijos configurados
  const [pagosFijos, setPagosFijos] = useState([
    { id: 1, nombre: 'Netflix', monto: 12.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true },
    { id: 2, nombre: 'Gimnasio', monto: 45.00, metodo: 'Transferencia', categoria: 'Salud', frecuencia: 'mensual', activo: true },
    { id: 3, nombre: 'Alquiler', monto: 750.00, metodo: 'Transferencia', categoria: 'Alquiler', frecuencia: 'mensual', activo: true },
    { id: 4, nombre: 'Internet', monto: 39.99, metodo: 'Tarjeta', categoria: 'Servicios', frecuencia: 'mensual', activo: true }
  ])

  // Lista de compras a cuotas CON MONTOS VARIABLES
  const [comprasCuotas, setComprasCuotas] = useState([
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
    },
    { 
      id: 2, 
      concepto: 'Sofá nuevo', 
      montoTotal: 850.00, 
      cuotasTotales: 6,
      cuotasPagadas: 2,
      montoPrimeraCuota: 200.00,
      montoUltimaCuota: 50.00,
      tipoCuotas: 'decreciente',
      fechaInicio: '2025-10-15',
      metodo: 'Transferencia',
      categoria: 'Hogar',
      activo: true,
      historialCuotas: [
        { numero: 1, monto: 200.00, pagada: true, fecha: '2025-10-15' },
        { numero: 2, monto: 150.00, pagada: true, fecha: '2025-11-15' },
        { numero: 3, monto: 150.00, pagada: false, fecha: '2025-12-15' },
        { numero: 4, monto: 150.00, pagada: false, fecha: '2026-01-15' },
        { numero: 5, monto: 150.00, pagada: false, fecha: '2026-02-15' },
        { numero: 6, monto: 50.00, pagada: false, fecha: '2026-03-15' }
      ]
    },
    { 
      id: 3, 
      concepto: 'Curso online', 
      montoTotal: 600.00, 
      cuotasTotales: 4,
      cuotasPagadas: 0,
      montoPrimeraCuota: 200.00,
      montoUltimaCuota: 100.00,
      tipoCuotas: 'decreciente',
      fechaInicio: '2025-11-01',
      metodo: 'Bizum',
      categoria: 'Educación',
      activo: true,
      historialCuotas: [
        { numero: 1, monto: 200.00, pagada: false, fecha: '2025-11-01' },
        { numero: 2, monto: 150.00, pagada: false, fecha: '2025-12-01' },
        { numero: 3, monto: 150.00, pagada: false, fecha: '2026-01-01' },
        { numero: 4, monto: 100.00, pagada: false, fecha: '2026-02-01' }
      ]
    }
  ])

  // Categorías disponibles
  const [categoriasGastos] = useState([
    { id: 1, nombre: 'Alquiler', icono: 'Home', color: 'text-blue-400', activo: true },
    { id: 2, nombre: 'Alimentación', icono: 'ShoppingBag', color: 'text-emerald-400', activo: true },
    { id: 3, nombre: 'Transporte', icono: 'Car', color: 'text-amber-400', activo: true },
    { id: 4, nombre: 'Entretenimiento', icono: 'Gamepad2', color: 'text-purple-400', activo: true },
    { id: 5, nombre: 'Salud', icono: 'Heart', color: 'text-red-400', activo: true },
    { id: 6, nombre: 'Servicios', icono: 'Wifi', color: 'text-cyan-400', activo: true },
    { id: 7, nombre: 'Telefonía', icono: 'Phone', color: 'text-pink-400', activo: true },
    { id: 8, nombre: 'Tecnología', icono: 'Smartphone', color: 'text-indigo-400', activo: true },
    { id: 9, nombre: 'Educación', icono: 'GraduationCap', color: 'text-teal-400', activo: true },
    { id: 10, nombre: 'Hogar', icono: 'Home', color: 'text-orange-400', activo: true },
    { id: 11, nombre: 'Café', icono: 'Coffee', color: 'text-rose-400', activo: true },
    { id: 12, nombre: 'Restaurante', icono: 'Utensils', color: 'text-red-400', activo: true },
    { id: 13, nombre: 'Regalos', icono: 'Gift', color: 'text-teal-400', activo: true },
    { id: 14, nombre: 'Otros', icono: 'MoreHorizontal', color: 'text-slate-400', activo: true }
  ])

  // Métodos de pago disponibles
  const [metodosPago] = useState([
    { id: 1, nombre: 'Tarjeta', icono: 'CreditCard', color: 'text-blue-400', activo: true },
    { id: 2, nombre: 'Transferencia', icono: 'ArrowRightLeft', color: 'text-emerald-400', activo: true },
    { id: 3, nombre: 'Bizum', icono: 'Smartphone', color: 'text-pink-400', activo: true },
    { id: 4, nombre: 'Efectivo', icono: 'Banknote', color: 'text-amber-400', activo: true },
    { id: 5, nombre: 'PayPal', icono: 'Wallet', color: 'text-indigo-400', activo: true }
  ])

  // Toggle para acordeones
  const toggleAcordeon = (acordeon) => {
    setAcordeonesAbiertos({
      ...acordeonesAbiertos,
      [acordeon]: !acordeonesAbiertos[acordeon]
    })
  }

  // Función para agregar pago fijo
  const guardarPagoFijo = () => {
    if (!pagoFijo.nombre || !pagoFijo.monto || !pagoFijo.categoria) return
    
    setPagosFijos([...pagosFijos, {
      ...pagoFijo,
      id: Date.now(),
      monto: parseFloat(pagoFijo.monto),
      activo: true
    }])
    
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

  // Función para agregar compra a cuotas con montos variables
  const guardarCompraCuotas = () => {
    if (!compraCuotas.concepto || !compraCuotas.montoTotal || !compraCuotas.categoria) return
    
    const cuotasTotales = parseInt(compraCuotas.cuotasTotales) || 12
    const cuotasPagadas = parseInt(compraCuotas.cuotasPagadas) || 0
    const montoPrimeraCuota = parseFloat(compraCuotas.montoPrimeraCuota) || 0
    const montoUltimaCuota = parseFloat(compraCuotas.montoUltimaCuota) || 0
    
    // Generar historial de cuotas con montos variables
    const historialCuotas = []
    let montoRestante = parseFloat(compraCuotas.montoTotal)
    
    for (let i = 1; i <= cuotasTotales; i++) {
      let montoCuota
      
      if (i === 1 && montoPrimeraCuota > 0) {
        montoCuota = montoPrimeraCuota
      } else if (i === cuotasTotales && montoUltimaCuota > 0) {
        montoCuota = montoUltimaCuota
      } else {
        // Distribuir el resto equitativamente
        const cuotasRestantes = cuotasTotales - i + 1
        montoCuota = montoRestante / cuotasRestantes
      }
      
      historialCuotas.push({
        numero: i,
        monto: parseFloat(montoCuota.toFixed(2)),
        pagada: i <= cuotasPagadas,
        fecha: new Date(new Date(compraCuotas.fechaInicio).setMonth(
          new Date(compraCuotas.fechaInicio).getMonth() + (i - 1)
        )).toISOString().split('T')[0]
      })
      
      montoRestante -= montoCuota
    }
    
    setComprasCuotas([...comprasCuotas, {
      ...compraCuotas,
      id: Date.now(),
      montoTotal: parseFloat(compraCuotas.montoTotal),
      cuotasTotales,
      cuotasPagadas,
      montoPrimeraCuota: montoPrimeraCuota,
      montoUltimaCuota: montoUltimaCuota,
      activo: true,
      historialCuotas
    }])
    
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

  // Toggle activo para elementos
  const toggleActivo = (tipo, id) => {
    if (tipo === 'pago') {
      setPagosFijos(pagosFijos.map(p => 
        p.id === id ? { ...p, activo: !p.activo } : p
      ))
    } else if (tipo === 'cuota') {
      setComprasCuotas(comprasCuotas.map(c => 
        c.id === id ? { ...c, activo: !c.activo } : c
      ))
    }
  }

  // Marcar cuota como pagada
  const marcarCuotaPagada = (compraId, cuotaNumero) => {
    setComprasCuotas(comprasCuotas.map(compra => {
      if (compra.id === compraId) {
        const historialActualizado = compra.historialCuotas.map(cuota => {
          if (cuota.numero === cuotaNumero && !cuota.pagada) {
            return { ...cuota, pagada: true }
          }
          return cuota
        })
        
        const nuevasCuotasPagadas = historialActualizado.filter(c => c.pagada).length
        
        return {
          ...compra,
          cuotasPagadas: nuevasCuotasPagadas,
          historialCuotas: historialActualizado
        }
      }
      return compra
    }))
  }

  // Eliminar elementos
  const eliminarElemento = (tipo, id) => {
    if (tipo === 'pago') {
      setPagosFijos(pagosFijos.filter(p => p.id !== id))
    } else if (tipo === 'cuota') {
      setComprasCuotas(comprasCuotas.filter(c => c.id !== id))
    }
  }

  // Calcular estadísticas
  const totalPagosMensuales = pagosFijos
    .filter(p => p.activo && p.frecuencia === 'mensual')
    .reduce((sum, p) => sum + p.monto, 0)

  const totalCuotasMensuales = comprasCuotas
    .filter(c => c.activo)
    .reduce((sum, c) => {
      const cuotaActual = c.historialCuotas.find(cuota => !cuota.pagada)
      return sum + (cuotaActual ? cuotaActual.monto : 0)
    }, 0)

  const totalCuotasPagadas = comprasCuotas.reduce((sum, c) => sum + c.cuotasPagadas, 0)
  const totalCuotasTotales = comprasCuotas.reduce((sum, c) => sum + c.cuotasTotales, 0)
  const porcentajeCuotasPagadas = totalCuotasTotales > 0 ? (totalCuotasPagadas / totalCuotasTotales) * 100 : 0

  // Calcular próximo vencimiento de cuotas
  const proximasCuotas = comprasCuotas
    .filter(c => c.activo && c.cuotasPagadas < c.cuotasTotales)
    .flatMap(compra => 
      compra.historialCuotas
        .filter(cuota => !cuota.pagada)
        .map(cuota => ({
          ...cuota,
          concepto: compra.concepto,
          compraId: compra.id
        }))
    )
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

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
              <div className="text-xs text-slate-400">Próx. vencimiento</div>
              <div className="text-lg font-bold text-emerald-400">
                {proximasCuotas.length > 0 
                  ? new Date(proximasCuotas[0].fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                  : 'N/A'
                }
              </div>
            </div>
          </div>
        </div>
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
                  {categoriasGastos.map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
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
                  {metodosPago.map((metodo) => (
                    <option key={metodo.id} value={metodo.nombre}>
                      {metodo.nombre}
                    </option>
                  ))}
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

      {/* FORMULARIO PARA COMPRA A CUOTAS CON MONTOS VARIABLES */}
      {mostrarFormCuotas && (
        <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Nueva compra a cuotas</h2>
            <button
              onClick={() => setMostrarFormCuotas(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="mb-4 p-3 bg-purple-900/20 border border-purple-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300 font-medium">
                  Sistema de cuotas variables
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Puedes definir montos diferentes para cada cuota. Si dejas vacías las cuotas específicas, 
                el sistema distribuirá el monto total equitativamente.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Concepto *
                </label>
                <input
                  type="text"
                  value={compraCuotas.concepto}
                  onChange={(e) => setCompraCuotas({...compraCuotas, concepto: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  placeholder="Ej: iPhone, Sofá, Curso online..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Euro className="h-4 w-4" />
                  Monto total *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">€</span>
                  </div>
                  <input
                    type="number"
                    value={compraCuotas.montoTotal}
                    onChange={(e) => setCompraCuotas({...compraCuotas, montoTotal: e.target.value})}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Calculator className="h-4 w-4" />
                  Total de cuotas *
                </label>
                <select
                  value={compraCuotas.cuotasTotales}
                  onChange={(e) => setCompraCuotas({...compraCuotas, cuotasTotales: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12,18,24,36].map(num => (
                    <option key={num} value={num}>{num} cuota{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cuotas ya pagadas
                </label>
                <input
                  type="number"
                  value={compraCuotas.cuotasPagadas}
                  onChange={(e) => setCompraCuotas({...compraCuotas, cuotasPagadas: e.target.value})}
                  min="0"
                  max={compraCuotas.cuotasTotales}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monto primera cuota (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">€</span>
                  </div>
                  <input
                    type="number"
                    value={compraCuotas.montoPrimeraCuota}
                    onChange={(e) => setCompraCuotas({...compraCuotas, montoPrimeraCuota: e.target.value})}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="Dejar vacío para distribución equitativa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monto última cuota (opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">€</span>
                  </div>
                  <input
                    type="number"
                    value={compraCuotas.montoUltimaCuota}
                    onChange={(e) => setCompraCuotas({...compraCuotas, montoUltimaCuota: e.target.value})}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="Dejar vacío para distribución equitativa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Categoría
                </label>
                <select
                  value={compraCuotas.categoria}
                  onChange={(e) => setCompraCuotas({...compraCuotas, categoria: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  {categoriasGastos.map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Método de pago
                </label>
                <select
                  value={compraCuotas.metodo}
                  onChange={(e) => setCompraCuotas({...compraCuotas, metodo: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  {metodosPago.map((metodo) => (
                    <option key={metodo.id} value={metodo.nombre}>
                      {metodo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="h-4 w-4" />
                  Fecha primera cuota
                </label>
                <input
                  type="date"
                  value={compraCuotas.fechaInicio}
                  onChange={(e) => setCompraCuotas({...compraCuotas, fechaInicio: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Frecuencia de pago
                </label>
                <select
                  value={compraCuotas.frecuenciaPago}
                  onChange={(e) => setCompraCuotas({...compraCuotas, frecuenciaPago: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMostrarFormCuotas(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCompraCuotas}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
              >
                <Save className="h-4 w-4" />
                Crear compra a cuotas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACORDEONES */}
      <div className="space-y-4">
        {/* PRÓXIMOS VENCIMIENTOS */}
        {proximasCuotas.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                <span className="font-semibold text-white">Próximos vencimientos</span>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                  {proximasCuotas.length} pendientes
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {proximasCuotas.slice(0, 3).map((cuota, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-900/30 rounded-lg">
                        <Calendar className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white">{cuota.concepto}</span>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span>Cuota {cuota.numero}</span>
                          <span>•</span>
                          <span>{new Date(cuota.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-amber-400">€{cuota.monto.toFixed(2)}</span>
                      <button
                        onClick={() => marcarCuotaPagada(cuota.compraId, cuota.numero)}
                        className="px-3 py-1 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 rounded-lg text-xs font-medium transition"
                      >
                        Marcar pagada
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACORDEÓN COMPRAS A CUOTAS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleAcordeon('comprasCuotas')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-purple-400" />
              <span className="font-semibold text-white">Compras a Cuotas</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {comprasCuotas.length} activas • €{totalCuotasMensuales.toFixed(2)}/mes
              </span>
            </div>
            {acordeonesAbiertos.comprasCuotas ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {acordeonesAbiertos.comprasCuotas && (
            <div className="px-6 py-4 border-t border-slate-800">
              {/* BARRA DE PROGRESO GENERAL */}
              <div className="mb-6 p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-300">Progreso general de cuotas</span>
                  <span className="font-medium text-slate-300">{porcentajeCuotasPagadas.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${porcentajeCuotasPagadas}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>{totalCuotasPagadas} de {totalCuotasTotales} cuotas pagadas</span>
                  <span>€{totalCuotasMensuales.toFixed(2)} en cuotas mensuales</span>
                </div>
              </div>

              {/* LISTA DE COMPRAS A CUOTAS */}
              <div className="space-y-4">
                {comprasCuotas.map((compra) => {
                  const cuotasRestantes = compra.cuotasTotales - compra.cuotasPagadas
                  const cuotaActual = compra.historialCuotas.find(cuota => !cuota.pagada)
                  const montoCuotaActual = cuotaActual ? cuotaActual.monto : 0
                  
                  return (
                    <div key={compra.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-900/30 rounded-lg">
                              <Receipt className="h-4 w-4 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{compra.concepto}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                <span>{compra.categoria}</span>
                                <span>•</span>
                                <span>{compra.metodo}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-400">
                                {compra.cuotasPagadas} de {compra.cuotasTotales} cuotas pagadas
                              </span>
                              <span className="text-slate-300 font-medium">
                                Próxima: €{montoCuotaActual.toFixed(2)}
                              </span>
                            </div>
                            
                            {/* DETALLE DE CUOTAS */}
                            <div className="mt-3 grid grid-cols-6 gap-1">
                              {compra.historialCuotas.slice(0, 12).map((cuota) => (
                                <div 
                                  key={cuota.numero}
                                  className={`h-2 rounded ${cuota.pagada ? 'bg-emerald-500' : 'bg-slate-700'} relative group`}
                                  title={`Cuota ${cuota.numero}: €${cuota.monto.toFixed(2)} - ${cuota.pagada ? 'Pagada' : 'Pendiente'}`}
                                >
                                  <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-xs text-white rounded whitespace-nowrap z-10">
                                    Cuota {cuota.numero}: €{cuota.monto.toFixed(2)}
                                  </div>
                                </div>
                              ))}
                              {compra.historialCuotas.length > 12 && (
                                <div className="h-2 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                                  +{compra.historialCuotas.length - 12}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs mt-2">
                              <span className="text-slate-500">
                                Total: €{compra.montoTotal.toFixed(2)}
                              </span>
                              <span className="text-slate-500">
                                Restan: {cuotasRestantes} cuotas
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const proximaCuota = compra.historialCuotas.find(c => !c.pagada)
                              if (proximaCuota) {
                                marcarCuotaPagada(compra.id, proximaCuota.numero)
                              }
                            }}
                            disabled={!cuotaActual}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                              !cuotaActual
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Pagar próxima
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleActivo('cuota', compra.id)}
                              className={`p-1.5 rounded-lg transition ${
                                compra.activo
                                  ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              {compra.activo ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => eliminarElemento('cuota', compra.id)}
                              className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ACORDEÓN PAGOS FIJOS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleAcordeon('pagosFijos')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-400" />
              <span className="font-semibold text-white">Pagos Fijos</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                Total: €{totalPagosMensuales.toFixed(2)}/mes
              </span>
            </div>
            {acordeonesAbiertos.pagosFijos ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {acordeonesAbiertos.pagosFijos && (
            <div className="px-6 py-4 border-t border-slate-800">
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
                        Frecuencia
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
                          <div className="text-xs text-slate-500">{pago.metodo}</div>
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
                          <span className="text-sm text-slate-400 capitalize">{pago.frecuencia}</span>
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
                              onClick={() => toggleActivo('pago', pago.id)}
                              className={`p-1.5 rounded-lg transition ${
                                pago.activo
                                  ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                              }`}
                            >
                              {pago.activo ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            </button>
                            
                            <button
                              onClick={() => eliminarElemento('pago', pago.id)}
                              className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
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
            </div>
          )}
        </div>
      </div>

      {/* NOTIFICACIONES */}
      <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          Recordatorios
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div>
              <div className="text-sm text-slate-300">Recordatorios de pagos fijos</div>
              <div className="text-xs text-slate-500">Recibir notificación 3 días antes del vencimiento</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div>
              <div className="text-sm text-slate-300">Recordatorios de cuotas</div>
              <div className="text-xs text-slate-500">Aviso cuando se acerca el pago de una cuota</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}