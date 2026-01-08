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
  TrendingUp,
  CheckCircle,
  X,
  Save,
  Calendar,
  Euro,
  Tag,
  Database,
  Bell,
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
  ChevronDown,
  ChevronRight,
  Calculator,
  Clock,
  AlertCircle,
  Receipt
} from 'lucide-react'

export default function Configuracion() {
  // Estados para acordeones
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
    metodosPago: false,
    categoriasGastos: false,
    categoriasIngresos: false,
    pagosFijos: false,
    comprasCuotas: false
  })

  // Estados para métodos de pago
  const [metodosPago, setMetodosPago] = useState([
    { id: 1, nombre: 'Tarjeta', icono: 'CreditCard', color: 'text-blue-400', activo: true },
    { id: 2, nombre: 'Transferencia', icono: 'ArrowRightLeft', color: 'text-emerald-400', activo: true },
    { id: 3, nombre: 'Bizum', icono: 'Smartphone', color: 'text-pink-400', activo: true },
    { id: 4, nombre: 'Efectivo', icono: 'Banknote', color: 'text-amber-400', activo: true },
    { id: 5, nombre: 'PayPal', icono: 'Wallet', color: 'text-indigo-400', activo: true }
  ])

  // Estados para categorías de GASTOS
  const [categoriasGastos, setCategoriasGastos] = useState([
    { id: 1, nombre: 'Alquiler', icono: 'Home', color: 'text-blue-400', activo: true, tipo: 'gasto' },
    { id: 2, nombre: 'Alimentación', icono: 'ShoppingBag', color: 'text-emerald-400', activo: true, tipo: 'gasto' },
    { id: 3, nombre: 'Transporte', icono: 'Car', color: 'text-amber-400', activo: true, tipo: 'gasto' },
    { id: 4, nombre: 'Entretenimiento', icono: 'Gamepad2', color: 'text-purple-400', activo: true, tipo: 'gasto' },
    { id: 5, nombre: 'Salud', icono: 'Heart', color: 'text-red-400', activo: true, tipo: 'gasto' },
    { id: 6, nombre: 'Servicios', icono: 'Wifi', color: 'text-cyan-400', activo: true, tipo: 'gasto' },
    { id: 7, nombre: 'Telefonía', icono: 'Phone', color: 'text-pink-400', activo: true, tipo: 'gasto' },
    { id: 8, nombre: 'Luz/Agua', icono: 'Zap', color: 'text-yellow-400', activo: true, tipo: 'gasto' },
    { id: 9, nombre: 'Café', icono: 'Coffee', color: 'text-orange-400', activo: true, tipo: 'gasto' },
    { id: 10, nombre: 'Restaurante', icono: 'Utensils', color: 'text-rose-400', activo: true, tipo: 'gasto' },
    { id: 11, nombre: 'Regalos', icono: 'Gift', color: 'text-teal-400', activo: true, tipo: 'gasto' },
    { id: 12, nombre: 'Otros', icono: 'MoreHorizontal', color: 'text-slate-400', activo: true, tipo: 'gasto' }
  ])

  // Estados para categorías de INGRESOS
  const [categoriasIngresos, setCategoriasIngresos] = useState([
    { id: 101, nombre: 'Salario', icono: 'Banknote', color: 'text-emerald-400', activo: true, tipo: 'ingreso' },
    { id: 102, nombre: 'Freelance', icono: 'Laptop', color: 'text-blue-400', activo: true, tipo: 'ingreso' },
    { id: 103, nombre: 'Inversiones', icono: 'TrendingUp', color: 'text-purple-400', activo: true, tipo: 'ingreso' },
    { id: 104, nombre: 'Bonos', icono: 'Gift', color: 'text-amber-400', activo: true, tipo: 'ingreso' },
    { id: 105, nombre: 'Propinas', icono: 'DollarSign', color: 'text-pink-400', activo: true, tipo: 'ingreso' },
    { id: 106, nombre: 'Ventas', icono: 'ShoppingBag', color: 'text-red-400', activo: true, tipo: 'ingreso' },
    { id: 107, nombre: 'Alquiler', icono: 'Home', color: 'text-cyan-400', activo: true, tipo: 'ingreso' },
    { id: 108, nombre: 'Otros', icono: 'MoreHorizontal', color: 'text-slate-400', activo: true, tipo: 'ingreso' }
  ])

  // Estados para formularios
  const [mostrarFormMetodo, setMostrarFormMetodo] = useState(false)
  const [mostrarFormCategoriaGasto, setMostrarFormCategoriaGasto] = useState(false)
  const [mostrarFormCategoriaIngreso, setMostrarFormCategoriaIngreso] = useState(false)
  const [mostrarFormPagoFijo, setMostrarFormPagoFijo] = useState(false)
  const [mostrarFormCuotas, setMostrarFormCuotas] = useState(false)
  
  // Datos de formularios
  const [nuevoMetodo, setNuevoMetodo] = useState({ nombre: '', icono: 'CreditCard', color: 'text-blue-400' })
  const [nuevaCategoriaGasto, setNuevaCategoriaGasto] = useState({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400', tipo: 'gasto' })
  const [nuevaCategoriaIngreso, setNuevaCategoriaIngreso] = useState({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400', tipo: 'ingreso' })
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

  // Datos para compras a cuotas
  const [compraCuotas, setCompraCuotas] = useState({
    concepto: '',
    montoTotal: '',
    cuotasTotales: '12',
    montoCuota: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    metodo: '',
    categoria: '',
    cuenta: '',
    cuotasPagadas: 0
  })

  // Lista de pagos fijos configurados
  const [pagosFijos, setPagosFijos] = useState([
    { id: 1, nombre: 'Netflix', monto: 12.99, metodo: 'Tarjeta', categoria: 'Entretenimiento', frecuencia: 'mensual', activo: true },
    { id: 2, nombre: 'Gimnasio', monto: 45.00, metodo: 'Transferencia', categoria: 'Salud', frecuencia: 'mensual', activo: true },
    { id: 3, nombre: 'Alquiler', monto: 750.00, metodo: 'Transferencia', categoria: 'Alquiler', frecuencia: 'mensual', activo: true },
    { id: 4, nombre: 'Internet', monto: 39.99, metodo: 'Débito automático', categoria: 'Servicios', frecuencia: 'mensual', activo: true }
  ])

  // Lista de compras a cuotas
  const [comprasCuotas, setComprasCuotas] = useState([
    { 
      id: 1, 
      concepto: 'iPhone 15 Pro', 
      montoTotal: 1199.00, 
      cuotasTotales: 12,
      cuotasPagadas: 3,
      montoCuota: 99.92,
      fechaInicio: '2025-09-01',
      metodo: 'Tarjeta',
      categoria: 'Tecnología',
      cuenta: 'BBVA',
      activo: true
    },
    { 
      id: 2, 
      concepto: 'Sofá nuevo', 
      montoTotal: 850.00, 
      cuotasTotales: 6,
      cuotasPagadas: 2,
      montoCuota: 141.67,
      fechaInicio: '2025-10-15',
      metodo: 'Transferencia',
      categoria: 'Hogar',
      cuenta: 'Santander',
      activo: true
    }
  ])

  // Toggle para acordeones
  const toggleAcordeon = (acordeon) => {
    setAcordeonesAbiertos({
      ...acordeonesAbiertos,
      [acordeon]: !acordeonesAbiertos[acordeon]
    })
  }

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

  // Función para agregar/editar categoría de gasto
  const guardarCategoriaGasto = () => {
    if (!nuevaCategoriaGasto.nombre.trim()) return
    
    if (editandoId) {
      setCategoriasGastos(categoriasGastos.map(c => 
        c.id === editandoId ? { ...c, ...nuevaCategoriaGasto } : c
      ))
    } else {
      setCategoriasGastos([...categoriasGastos, {
        ...nuevaCategoriaGasto,
        id: Date.now(),
        activo: true
      }])
    }
    
    setNuevaCategoriaGasto({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400', tipo: 'gasto' })
    setEditandoId(null)
    setMostrarFormCategoriaGasto(false)
  }

  // Función para agregar/editar categoría de ingreso
  const guardarCategoriaIngreso = () => {
    if (!nuevaCategoriaIngreso.nombre.trim()) return
    
    if (editandoId) {
      setCategoriasIngresos(categoriasIngresos.map(c => 
        c.id === editandoId ? { ...c, ...nuevaCategoriaIngreso } : c
      ))
    } else {
      setCategoriasIngresos([...categoriasIngresos, {
        ...nuevaCategoriaIngreso,
        id: Date.now(),
        activo: true
      }])
    }
    
    setNuevaCategoriaIngreso({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400', tipo: 'ingreso' })
    setEditandoId(null)
    setMostrarFormCategoriaIngreso(false)
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
    const montoTotal = parseFloat(compraCuotas.montoTotal) || 0
    const cuotasTotales = parseInt(compraCuotas.cuotasTotales) || 1
    
    if (montoTotal > 0 && cuotasTotales > 0) {
      const montoCuota = montoTotal / cuotasTotales
      setCompraCuotas({ ...compraCuotas, montoCuota: montoCuota.toFixed(2) })
    }
  }

  // Función para agregar compra a cuotas
  const guardarCompraCuotas = () => {
    if (!compraCuotas.concepto || !compraCuotas.montoTotal || !compraCuotas.categoria) return
    
    setComprasCuotas([...comprasCuotas, {
      ...compraCuotas,
      id: Date.now(),
      montoTotal: parseFloat(compraCuotas.montoTotal),
      montoCuota: parseFloat(compraCuotas.montoCuota) || (parseFloat(compraCuotas.montoTotal) / parseInt(compraCuotas.cuotasTotales)),
      cuotasTotales: parseInt(compraCuotas.cuotasTotales),
      activo: true
    }])
    
    setCompraCuotas({
      concepto: '',
      montoTotal: '',
      cuotasTotales: '12',
      montoCuota: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      metodo: '',
      categoria: '',
      cuenta: '',
      cuotasPagadas: 0
    })
    setMostrarFormCuotas(false)
  }

  // Toggle activo para elementos
  const toggleActivo = (tipo, id) => {
    if (tipo === 'metodo') {
      setMetodosPago(metodosPago.map(m => 
        m.id === id ? { ...m, activo: !m.activo } : m
      ))
    } else if (tipo === 'categoria-gasto') {
      setCategoriasGastos(categoriasGastos.map(c => 
        c.id === id ? { ...c, activo: !c.activo } : c
      ))
    } else if (tipo === 'categoria-ingreso') {
      setCategoriasIngresos(categoriasIngresos.map(c => 
        c.id === id ? { ...c, activo: !c.activo } : c
      ))
    } else if (tipo === 'pago') {
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
  const marcarCuotaPagada = (id) => {
    setComprasCuotas(comprasCuotas.map(c => {
      if (c.id === id && c.cuotasPagadas < c.cuotasTotales) {
        return {
          ...c,
          cuotasPagadas: c.cuotasPagadas + 1
        }
      }
      return c
    }))
  }

  // Eliminar elementos
  const eliminarElemento = (tipo, id) => {
    if (tipo === 'metodo') {
      setMetodosPago(metodosPago.filter(m => m.id !== id))
    } else if (tipo === 'categoria-gasto') {
      setCategoriasGastos(categoriasGastos.filter(c => c.id !== id))
    } else if (tipo === 'categoria-ingreso') {
      setCategoriasIngresos(categoriasIngresos.filter(c => c.id !== id))
    } else if (tipo === 'pago') {
      setPagosFijos(pagosFijos.filter(p => p.id !== id))
    } else if (tipo === 'cuota') {
      setComprasCuotas(comprasCuotas.filter(c => c.id !== id))
    }
  }

  // Total de pagos mensuales
  const totalPagosMensuales = pagosFijos
    .filter(p => p.activo)
    .reduce((sum, p) => sum + p.monto, 0)

  // Total de cuotas pendientes
  const totalCuotasMensuales = comprasCuotas
    .filter(c => c.activo)
    .reduce((sum, c) => sum + c.montoCuota, 0)

  // Progreso total de compras a cuotas
  const totalCuotasPagadas = comprasCuotas.reduce((sum, c) => sum + c.cuotasPagadas, 0)
  const totalCuotasTotales = comprasCuotas.reduce((sum, c) => sum + c.cuotasTotales, 0)
  const porcentajeCuotasPagadas = totalCuotasTotales > 0 ? (totalCuotasPagadas / totalCuotasTotales) * 100 : 0

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
              Configura métodos de pago, categorías, pagos fijos y compras a cuotas
            </p>
          </div>
          
          {/* RESUMEN RÁPIDO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
              <div className="text-xs text-slate-400">Métodos</div>
              <div className="text-lg font-bold text-emerald-400">
                {metodosPago.filter(m => m.activo).length}
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
              <div className="text-xs text-slate-400">Cuotas/mes</div>
              <div className="text-lg font-bold text-amber-400">
                €{totalCuotasMensuales.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES PRINCIPALES */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setMostrarFormMetodo(true)
            setEditandoId(null)
            setNuevoMetodo({ nombre: '', icono: 'CreditCard', color: 'text-blue-400' })
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo método
        </button>
        
        <button
          onClick={() => {
            setMostrarFormCategoriaGasto(true)
            setEditandoId(null)
            setNuevaCategoriaGasto({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400', tipo: 'gasto' })
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría (Gasto)
        </button>
        
        <button
          onClick={() => {
            setMostrarFormCategoriaIngreso(true)
            setEditandoId(null)
            setNuevaCategoriaIngreso({ nombre: '', icono: 'MoreHorizontal', color: 'text-slate-400', tipo: 'ingreso' })
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría (Ingreso)
        </button>
        
        <button
          onClick={() => setMostrarFormCuotas(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
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
                placeholder="Ej: PayPal, Apple Pay..."
              />
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

      {/* FORMULARIO PARA COMPRA A CUOTAS */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Concepto *
                </label>
                <input
                  type="text"
                  value={compraCuotas.concepto}
                  onChange={(e) => setCompraCuotas({...compraCuotas, concepto: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  placeholder="Ej: iPhone, Sofá, TV..."
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
                    onChange={(e) => {
                      setCompraCuotas({...compraCuotas, montoTotal: e.target.value})
                      setTimeout(calcularCuota, 100)
                    }}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Calculator className="h-4 w-4" />
                  Cuotas *
                </label>
                <select
                  value={compraCuotas.cuotasTotales}
                  onChange={(e) => {
                    setCompraCuotas({...compraCuotas, cuotasTotales: e.target.value})
                    setTimeout(calcularCuota, 100)
                  }}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  <option value="3">3 cuotas</option>
                  <option value="6">6 cuotas</option>
                  <option value="12">12 cuotas</option>
                  <option value="18">18 cuotas</option>
                  <option value="24">24 cuotas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monto por cuota
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">€</span>
                  </div>
                  <input
                    type="text"
                    value={compraCuotas.montoCuota || '0.00'}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Categoría *
                </label>
                <select
                  value={compraCuotas.categoria}
                  onChange={(e) => setCompraCuotas({...compraCuotas, categoria: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                >
                  <option value="">Seleccionar categoría</option>
                  {categoriasGastos.filter(c => c.activo).map((categoria) => (
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
                  <option value="">Seleccionar método</option>
                  {metodosPago.filter(m => m.activo).map((metodo) => (
                    <option key={metodo.id} value={metodo.nombre}>
                      {metodo.nombre}
                    </option>
                  ))}
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
        {/* ACORDEÓN MÉTODOS DE PAGO */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleAcordeon('metodosPago')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-white">Métodos de pago</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {metodosPago.filter(m => m.activo).length} activos
              </span>
            </div>
            {acordeonesAbiertos.metodosPago ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {acordeonesAbiertos.metodosPago && (
            <div className="px-6 py-4 border-t border-slate-800">
              <div className="space-y-3">
                {metodosPago.map((metodo) => (
                  <div key={metodo.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${metodo.color.replace('text', 'bg').replace('-400', '-900/30')}`}>
                        <CreditCard className={`h-4 w-4 ${metodo.color}`} />
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
                        onClick={() => eliminarElemento('metodo', metodo.id)}
                        className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACORDEÓN CATEGORÍAS DE GASTOS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleAcordeon('categoriasGastos')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-red-400" />
              <span className="font-semibold text-white">Categorías de Gastos</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {categoriasGastos.filter(c => c.activo).length} activas
              </span>
            </div>
            {acordeonesAbiertos.categoriasGastos ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {acordeonesAbiertos.categoriasGastos && (
            <div className="px-6 py-4 border-t border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoriasGastos.map((categoria) => (
                  <div key={categoria.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${categoria.color.replace('text', 'bg').replace('-400', '-900/30')}`}>
                        <ShoppingBag className={`h-4 w-4 ${categoria.color}`} />
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
                        onClick={() => toggleActivo('categoria-gasto', categoria.id)}
                        className={`p-1.5 rounded-lg transition ${
                          categoria.activo
                            ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {categoria.activo ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </button>
                      
                      <button
                        onClick={() => eliminarElemento('categoria-gasto', categoria.id)}
                        className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACORDEÓN CATEGORÍAS DE INGRESOS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleAcordeon('categoriasIngresos')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="font-semibold text-white">Categorías de Ingresos</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
                {categoriasIngresos.filter(c => c.activo).length} activas
              </span>
            </div>
            {acordeonesAbiertos.categoriasIngresos ? (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {acordeonesAbiertos.categoriasIngresos && (
            <div className="px-6 py-4 border-t border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoriasIngresos.map((categoria) => (
                  <div key={categoria.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${categoria.color.replace('text', 'bg').replace('-400', '-900/30')}`}>
                        <Banknote className={`h-4 w-4 ${categoria.color}`} />
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
                        onClick={() => toggleActivo('categoria-ingreso', categoria.id)}
                        className={`p-1.5 rounded-lg transition ${
                          categoria.activo
                            ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {categoria.activo ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </button>
                      
                      <button
                        onClick={() => eliminarElemento('categoria-ingreso', categoria.id)}
                        className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
                  <span>€{totalCuotasMensuales.toFixed(2)}/mes</span>
                </div>
              </div>

              {/* LISTA DE COMPRAS A CUOTAS */}
              <div className="space-y-4">
                {comprasCuotas.map((compra) => {
                  const porcentaje = (compra.cuotasPagadas / compra.cuotasTotales) * 100
                  const cuotasRestantes = compra.cuotasTotales - compra.cuotasPagadas
                  
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
                                <span>•</span>
                                <span>{compra.cuenta}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-400">
                                {compra.cuotasPagadas} de {compra.cuotasTotales} cuotas
                              </span>
                              <span className="text-slate-300 font-medium">
                                €{compra.montoCuota.toFixed(2)}/mes
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
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
                            onClick={() => marcarCuotaPagada(compra.id)}
                            disabled={compra.cuotasPagadas >= compra.cuotasTotales}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                              compra.cuotasPagadas >= compra.cuotasTotales
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                            }`}
                          >
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Marcar pagada
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
              <span className="font-semibold text-white">Pagos Fijos Mensuales</span>
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
                        Método
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
                          <div className="text-xs text-slate-500">{pago.frecuencia}</div>
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
                          <span className="text-sm text-slate-400">{pago.metodo}</span>
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
          Notificaciones
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div>
              <div className="text-sm text-slate-300">Recordatorios de pagos fijos</div>
              <div className="text-xs text-slate-500">Recibir notificación 3 días antes del vencimiento</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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