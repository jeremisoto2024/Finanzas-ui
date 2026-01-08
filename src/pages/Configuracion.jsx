import { useState } from 'react'
import { 
  Settings, 
  Plus,
  Trash2,
  Pencil,
  CreditCard,
  Wallet,
  Banknote,
  ArrowRightLeft,
  TrendingDown,
  CheckCircle,
  X,
  Save,
  Calendar,
  Euro,
  Tag,
  Database,
  Bell,
  Shield,
  Smartphone,
  ShoppingBag,
  Home,
  Car,
  Heart,
  Gamepad2,
  Wifi,
  Phone,
  Zap,
  Coffee,
  Utensils,
  Gift,
  MoreHorizontal,
  Filter,
  ChevronDown,
  Download
} from 'lucide-react'

export default function Configuracion() {
  // Estados para métodos de pago
  const [metodosPago, setMetodosPago] = useState([
    { id: 1, nombre: 'Tarjeta', icono: 'CreditCard', color: 'text-blue-400', activo: true },
    { id: 2, nombre: 'Transferencia', icono: 'ArrowRightLeft', color: 'text-emerald-400', activo: true },
    { id: 3, nombre: 'Bizum', icono: 'Smartphone', color: 'text-pink-400', activo: true },
    { id: 4, nombre: 'Efectivo', icono: 'Banknote', color: 'text-amber-400', activo: true },
    { id: 5, nombre: 'PayPal', icono: 'Wallet', color: 'text-indigo-400', activo: true },
    { id: 6, nombre: 'Apple Pay', icono: 'CreditCard', color: 'text-slate-400', activo: true }
  ])

  // Estados para categorías
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: 'Alquiler', icono: 'Home', color: 'text-blue-400', activo: true },
    { id: 2, nombre: 'Alimentación', icono: 'ShoppingBag', color: 'text-emerald-400', activo: true },
    { id: 3, nombre: 'Transporte', icono: 'Car', color: 'text-amber-400', activo: true },
    { id: 4, nombre: 'Entretenimiento', icono: 'Gamepad2', color: 'text-purple-400', activo: true },
    { id: 5, nombre: 'Salud', icono: 'Heart', color: 'text-red-400', activo: true },
    { id: 6, nombre: 'Servicios', icono: 'Wifi', color: 'text-cyan-400', activo: true },
    { id: 7, nombre: 'Telefonía', icono: 'Phone', color: 'text-pink-400', activo: true },
    { id: 8, nombre: 'Luz', icono: 'Zap', color: 'text-yellow-400', activo: true },
    { id: 9, nombre: 'Café', icono: 'Coffee', color: 'text-orange-400', activo: true },
    { id: 10, nombre: 'Restaurante', icono: 'Utensils', color: 'text-rose-400', activo: true },
    { id: 11, nombre: 'Regalos', icono: 'Gift', color: 'text-teal-400', activo: true },
    { id: 12, nombre: 'Otros', icono: 'MoreHorizontal', color: 'text-slate-400', activo: true }
  ])

  // Estados para formularios
  const [mostrarFormMetodo, setMostrarFormMetodo] = useState(false)
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false)
  const [mostrarFormPagoFijo, setMostrarFormPagoFijo] = useState(false)
  const [mostrarFormCuotas, setMostrarFormCuotas] = useState(false)
  
  // Datos de formularios
  const [nuevoMetodo, setNuevoMetodo] = useState({ nombre: '', icono: 'CreditCard', color: 'text-blue-400' })
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400' })
  const [editandoId, setEditandoId] = useState(null)

  // Datos para pagos fijos
  const [pagoFijo, setPagoFijo] = useState({
    nombre: '',
    monto: '',
    metodo: '',
    categoria: '',
    frecuencia: 'mensual',
    fechaInicio: new Date().toISOString().split('T')[0],
    cuenta: '',
    notificacion: true
  })

  // Datos para cuotas
  const [cuota, setCuota] = useState({
    concepto: '',
    montoTotal: '',
    cuotasTotales: '12',
    montoCuota: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    metodo: '',
    categoria: '',
    cuenta: ''
  })

  // Lista de pagos fijos configurados
  const [pagosFijos, setPagosFijos] = useState([
    { id: 1, nombre: 'Netflix', monto: 12.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true },
    { id: 2, nombre: 'Gimnasio', monto: 45.00, metodo: 'Transferencia', categoria: 'Salud', frecuencia: 'mensual', activo: true },
    { id: 3, nombre: 'Alquiler', monto: 750.00, metodo: 'Transferencia', categoria: 'Alquiler', frecuencia: 'mensual', activo: true },
    { id: 4, nombre: 'Internet', monto: 39.99, metodo: 'Débito automático', categoria: 'Servicios', frecuencia: 'mensual', activo: true }
  ])

  // Función para agregar/editar método de pago
  const guardarMetodo = () => {
    if (!nuevoMetodo.nombre.trim()) return
    
    if (editandoId) {
      setMetodosPago(metodosPago.map(m => 
        m.id === editandoId ? { ...m, ...nuevoMetodo } : m
      ))
    } else {
      setMetodosPago([...metodosPago, {
        ...nuevoMetodo,
        id: Date.now(),
        activo: true
      }])
    }
    
    setNuevoMetodo({ nombre: '', icono: 'CreditCard', color: 'text-blue-400' })
    setEditandoId(null)
    setMostrarFormMetodo(false)
  }

  // Función para agregar/editar categoría
  const guardarCategoria = () => {
    if (!nuevaCategoria.nombre.trim()) return
    
    if (editandoId) {
      setCategorias(categorias.map(c => 
        c.id === editandoId ? { ...c, ...nuevaCategoria } : c
      ))
    } else {
      setCategorias([...categorias, {
        ...nuevaCategoria,
        id: Date.now(),
        activo: true
      }])
    }
    
    setNuevaCategoria({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400' })
    setEditandoId(null)
    setMostrarFormCategoria(false)
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
      metodo: '',
      categoria: '',
      frecuencia: 'mensual',
      fechaInicio: new Date().toISOString().split('T')[0],
      cuenta: '',
      notificacion: true
    })
    setMostrarFormPagoFijo(false)
  }

  // Función para calcular monto por cuota
  const calcularCuota = () => {
    const montoTotal = parseFloat(cuota.montoTotal) || 0
    const cuotasTotales = parseInt(cuota.cuotasTotales) || 1
    
    if (montoTotal > 0 && cuotasTotales > 0) {
      const montoCuota = montoTotal / cuotasTotales
      setCuota({ ...cuota, montoCuota: montoCuota.toFixed(2) })
    }
  }

  // Toggle activo para métodos y categorías
  const toggleActivo = (tipo, id) => {
    if (tipo === 'metodo') {
      setMetodosPago(metodosPago.map(m => 
        m.id === id ? { ...m, activo: !m.activo } : m
      ))
    } else if (tipo === 'categoria') {
      setCategorias(categorias.map(c => 
        c.id === id ? { ...c, activo: !c.activo } : c
      ))
    } else if (tipo === 'pago') {
      setPagosFijos(pagosFijos.map(p => 
        p.id === id ? { ...p, activo: !p.activo } : p
      ))
    }
  }

  // Eliminar elementos
  const eliminarElemento = (tipo, id) => {
    if (tipo === 'metodo') {
      setMetodosPago(metodosPago.filter(m => m.id !== id))
    } else if (tipo === 'categoria') {
      setCategorias(categorias.filter(c => c.id !== id))
    } else if (tipo === 'pago') {
      setPagosFijos(pagosFijos.filter(p => p.id !== id))
    }
  }

  // Iconos disponibles
  const iconosDisponibles = [
    { nombre: 'CreditCard', label: 'Tarjeta' },
    { nombre: 'Wallet', label: 'Billetera' },
    { nombre: 'Banknote', label: 'Efectivo' },
    { nombre: 'ArrowRightLeft', label: 'Transferencia' },
    { nombre: 'Smartphone', label: 'Bizum' },
    { nombre: 'TrendingDown', label: 'Pago' },
    { nombre: 'Home', label: 'Hogar' },
    { nombre: 'ShoppingBag', label: 'Compras' },
    { nombre: 'Car', label: 'Auto' },
    { nombre: 'Heart', label: 'Salud' },
    { nombre: 'Gamepad2', label: 'Entretenimiento' },
    { nombre: 'Wifi', label: 'Internet' },
    { nombre: 'Phone', label: 'Teléfono' },
    { nombre: 'Zap', label: 'Luz' },
    { nombre: 'Coffee', label: 'Café' },
    { nombre: 'Utensils', label: 'Comida' },
    { nombre: 'Gift', label: 'Regalo' },
    { nombre: 'MoreHorizontal', label: 'Otros' }
  ]

  // Colores disponibles
  const coloresDisponibles = [
    { nombre: 'text-blue-400', label: 'Azul' },
    { nombre: 'text-emerald-400', label: 'Verde' },
    { nombre: 'text-amber-400', label: 'Ámbar' },
    { nombre: 'text-purple-400', label: 'Púrpura' },
    { nombre: 'text-red-400', label: 'Rojo' },
    { nombre: 'text-pink-400', label: 'Rosa' },
    { nombre: 'text-indigo-400', label: 'Índigo' },
    { nombre: 'text-cyan-400', label: 'Cian' },
    { nome: 'text-yellow-400', label: 'Amarillo' },
    { nombre: 'text-orange-400', label: 'Naranja' },
    { nombre: 'text-rose-400', label: 'Rosado' },
    { nombre: 'text-teal-400', label: 'Turquesa' },
    { nombre: 'text-slate-400', label: 'Gris' }
  ]

  // Total de pagos mensuales
  const totalPagosMensuales = pagosFijos
    .filter(p => p.activo)
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
              <h1 className="text-2xl font-bold text-white">Configuración</h1>
            </div>
            <p className="text-slate-400 mt-2">
              Personaliza métodos de pago, categorías y gestiona tus pagos recurrentes
            </p>
          </div>
          
          {/* RESUMEN RÁPIDO */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Métodos activos</div>
              <div className="text-lg font-bold text-emerald-400">
                {metodosPago.filter(m => m.activo).length}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Categorías</div>
              <div className="text-lg font-bold text-blue-400">
                {categorias.filter(c => c.activo).length}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Total mensual</div>
              <div className="text-lg font-bold text-amber-400">
                €{totalPagosMensuales.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES PRINCIPALES */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setMostrarFormMetodo(true)
            setEditandoId(null)
            setNuevoMetodo({ nombre: '', icono: 'CreditCard', color: 'text-blue-400' })
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo método de pago
        </button>
        
        <button
          onClick={() => {
            setMostrarFormCategoria(true)
            setEditandoId(null)
            setNuevaCategoria({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400' })
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </button>
        
        <button
          onClick={() => setMostrarFormPagoFijo(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo pago fijo
        </button>
        
        <button
          onClick={() => setMostrarFormCuotas(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva compra a cuotas
        </button>
      </div>

      {/* FORMULARIO PARA MÉTODO DE PAGO */}
      {mostrarFormMetodo && (
        <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editandoId ? 'Editar método de pago' : 'Nuevo método de pago'}
            </h2>
            <button
              onClick={() => setMostrarFormMetodo(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nombre del método *
              </label>
              <input
                type="text"
                value={nuevoMetodo.nombre}
                onChange={(e) => setNuevoMetodo({...nuevoMetodo, nombre: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Ej: PayPal, Apple Pay, Transferencia..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Icono
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {iconosDisponibles.slice(0, 8).map((icono) => (
                    <button
                      key={icono.nombre}
                      type="button"
                      onClick={() => setNuevoMetodo({...nuevoMetodo, icono: icono.nombre})}
                      className={`p-3 rounded-lg border transition ${
                        nuevoMetodo.icono === icono.nombre
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {icono.nombre === 'CreditCard' && <CreditCard className="h-5 w-5 text-slate-300" />}
                        {icono.nombre === 'Wallet' && <Wallet className="h-5 w-5 text-slate-300" />}
                        {icono.nombre === 'Banknote' && <Banknote className="h-5 w-5 text-slate-300" />}
                        {icono.nombre === 'ArrowRightLeft' && <ArrowRightLeft className="h-5 w-5 text-slate-300" />}
                        {icono.nombre === 'Smartphone' && <Smartphone className="h-5 w-5 text-slate-300" />}
                        {icono.nombre === 'TrendingDown' && <TrendingDown className="h-5 w-5 text-slate-300" />}
                        {icono.nombre === 'Home' && <Home className="h-5 w-5 text-slate-300" />}
                        {icono.nombre === 'ShoppingBag' && <ShoppingBag className="h-5 w-5 text-slate-300" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {coloresDisponibles.slice(0, 8).map((color) => (
                    <button
                      key={color.nombre}
                      type="button"
                      onClick={() => setNuevoMetodo({...nuevoMetodo, color: color.nombre})}
                      className={`p-3 rounded-lg border transition ${
                        nuevoMetodo.color === color.nombre
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full ${color.nombre}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMostrarFormMetodo(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarMetodo}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                <Save className="h-4 w-4" />
                {editandoId ? 'Guardar cambios' : 'Crear método'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO PARA CATEGORÍA */}
      {mostrarFormCategoria && (
        <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editandoId ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <button
              onClick={() => setMostrarFormCategoria(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nombre de la categoría *
              </label>
              <input
                type="text"
                value={nuevaCategoria.nombre}
                onChange={(e) => setNuevaCategoria({...nuevaCategoria, nombre: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                placeholder="Ej: Educación, Viajes, Mascotas..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMostrarFormCategoria(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCategoria}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
              >
                <Save className="h-4 w-4" />
                {editandoId ? 'Guardar cambios' : 'Crear categoría'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Nombre del pago *
                </label>
                <input
                  type="text"
                  value={pagoFijo.nombre}
                  onChange={(e) => setPagoFijo({...pagoFijo, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  placeholder="Ej: Netflix, Gimnasio, Alquiler..."
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <CreditCard className="h-4 w-4" />
                  Método de pago
                </label>
                <select
                  value={pagoFijo.metodo}
                  onChange={(e) => setPagoFijo({...pagoFijo, metodo: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  <option value="">Seleccionar método</option>
                  {metodosPago.filter(m => m.activo).map((metodo) => (
                    <option key={metodo.id} value={metodo.nombre}>
                      {metodo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Tag className="h-4 w-4" />
                  Categoría *
                </label>
                <select
                  value={pagoFijo.categoria}
                  onChange={(e) => setPagoFijo({...pagoFijo, categoria: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.filter(c => c.activo).map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
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
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
              >
                <Save className="h-4 w-4" />
                Crear pago fijo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MÉTODOS DE PAGO */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-400" />
                Métodos de pago
              </h2>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {metodosPago.filter(m => m.activo).length} activos
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {metodosPago.map((metodo) => (
              <div key={metodo.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${metodo.color.replace('text', 'bg').replace('-400', '-900/30')}`}>
                      {metodo.icono === 'CreditCard' && <CreditCard className={`h-5 w-5 ${metodo.color}`} />}
                      {metodo.icono === 'Wallet' && <Wallet className={`h-5 w-5 ${metodo.color}`} />}
                      {metodo.icono === 'Banknote' && <Banknote className={`h-5 w-5 ${metodo.color}`} />}
                      {metodo.icono === 'ArrowRightLeft' && <ArrowRightLeft className={`h-5 w-5 ${metodo.color}`} />}
                      {metodo.icono === 'Smartphone' && <Smartphone className={`h-5 w-5 ${metodo.color}`} />}
                      {metodo.icono === 'TrendingDown' && <TrendingDown className={`h-5 w-5 ${metodo.color}`} />}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{metodo.nombre}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${metodo.activo ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                        <span className="text-xs text-slate-400">
                          {metodo.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActivo('metodo', metodo.id)}
                      className={`p-1.5 rounded-lg transition ${
                        metodo.activo
                          ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {metodo.activo ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        setEditandoId(metodo.id)
                        setNuevoMetodo({ nombre: metodo.nombre, icono: metodo.icono, color: metodo.color })
                        setMostrarFormMetodo(true)
                      }}
                      className="p-1.5 rounded-lg bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => eliminarElemento('metodo', metodo.id)}
                      className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORÍAS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-emerald-400" />
                Categorías
              </h2>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {categorias.filter(c => c.activo).length} activas
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoria.color.replace('text', 'bg').replace('-400', '-900/30')}`}>
                      {categoria.icono === 'Home' && <Home className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'ShoppingBag' && <ShoppingBag className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Car' && <Car className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Heart' && <Heart className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Gamepad2' && <Gamepad2 className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Wifi' && <Wifi className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Phone' && <Phone className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Zap' && <Zap className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Coffee' && <Coffee className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Utensils' && <Utensils className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'Gift' && <Gift className={`h-5 w-5 ${categoria.color}`} />}
                      {categoria.icono === 'MoreHorizontal' && <MoreHorizontal className={`h-5 w-5 ${categoria.color}`} />}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{categoria.nombre}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${categoria.activo ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                        <span className="text-xs text-slate-400">
                          {categoria.activo ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActivo('categoria', categoria.id)}
                      className={`p-1.5 rounded-lg transition ${
                        categoria.activo
                          ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {categoria.activo ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        setEditandoId(categoria.id)
                        setNuevaCategoria({ nombre: categoria.nombre, icono: categoria.icono, color: categoria.color })
                        setMostrarFormCategoria(true)
                      }}
                      className="p-1.5 rounded-lg bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => eliminarElemento('categoria', categoria.id)}
                      className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAGOS FIJOS CONFIGURADOS */}
      <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              Pagos fijos configurados
            </h2>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
              Total: €{totalPagosMensuales.toFixed(2)}/mes
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {pagosFijos.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              No hay pagos fijos configurados
            </div>
          ) : (
            pagosFijos.map((pago) => (
              <div key={pago.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      !pago.activo ? 'bg-slate-800' : 
                      pago.categoria === 'Alquiler' ? 'bg-blue-900/30' :
                      pago.categoria === 'Entretenimiento' ? 'bg-purple-900/30' :
                      pago.categoria === 'Salud' ? 'bg-red-900/30' :
                      'bg-slate-800'
                    }`}>
                      <CreditCard className={`h-5 w-5 ${
                        !pago.activo ? 'text-slate-500' :
                        pago.categoria === 'Alquiler' ? 'text-blue-400' :
                        pago.categoria === 'Entretenimiento' ? 'text-purple-400' :
                        pago.categoria === 'Salud' ? 'text-red-400' :
                        'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{pago.nombre}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${pago.activo ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                        <span className="text-xs text-slate-400">{pago.categoria}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{pago.frecuencia}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{pago.metodo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-300">€{pago.monto.toFixed(2)}</div>
                      <div className="text-xs text-slate-500 capitalize">{pago.frecuencia}</div>
                    </div>
                    
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CONFIGURACIÓN DE NOTIFICACIONES */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            Recordatorios
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <div className="text-sm text-slate-300">Antes del vencimiento</div>
                <div className="text-xs text-slate-500">Recibir recordatorio</div>
              </div>
              <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
                <option>3 días antes</option>
                <option>2 días antes</option>
                <option>1 día antes</option>
                <option>El mismo día</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="text-sm text-slate-300">Resumen mensual</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-400" />
            Preferencias
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-sm text-slate-300 mb-1">Moneda principal</div>
              <div className="text-xs text-slate-400">Euro (€)</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-sm text-slate-300 mb-1">Formato de fecha</div>
              <div className="text-xs text-slate-400">DD/MM/AAAA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}