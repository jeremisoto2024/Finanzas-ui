import { useState } from 'react'
import { 
  Settings, 
  Calendar, 
  TrendingDown, 
  Clock,
  Plus,
  Wallet,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Home,
  ShoppingBag,
  Car,
  Wifi,
  Phone,
  Zap,
  Heart,
  Book,
  Gamepad2,
  Coffee,
  Utensils,
  Gift,
  MoreHorizontal
} from 'lucide-react'

// Componentes
import FormularioPagoFijo from './FormularioPagoFijo'
import FormularioCuotas from './FormularioCuotas'
import ListaPagosConfigurados from './ListaPagosConfigurados'

// Datos iniciales
const pagosConfiguradosIniciales = [
  {
    id: 1,
    nombre: 'Netflix',
    tipo: 'fijo',
    monto: 12.99,
    frecuencia: 'mensual',
    categoria: 'Entretenimiento',
    fechaInicio: '2025-10-01',
    activo: true,
    metodoPago: 'Tarjeta',
    cuenta: 'BBVA',
    notificacion: true
  },
  {
    id: 2,
    nombre: 'Gimnasio',
    tipo: 'fijo',
    monto: 45.00,
    frecuencia: 'mensual',
    categoria: 'Salud',
    fechaInicio: '2025-09-15',
    activo: true,
    metodoPago: 'Débito automático',
    cuenta: 'BBVA',
    notificacion: true
  },
  {
    id: 3,
    nombre: 'iPhone 15 Pro',
    tipo: 'cuotas',
    montoTotal: 1199.00,
    cuotas: 12,
    cuotasPagadas: 3,
    montoCuota: 99.92,
    frecuencia: 'mensual',
    categoria: 'Tecnología',
    fechaInicio: '2025-09-01',
    activo: true,
    metodoPago: 'Tarjeta',
    cuenta: 'Revolut',
    notificacion: true
  },
  {
    id: 4,
    nombre: 'Seguro coche',
    tipo: 'fijo',
    monto: 85.50,
    frecuencia: 'trimestral',
    categoria: 'Transporte',
    fechaInicio: '2025-08-20',
    activo: true,
    metodoPago: 'Transferencia',
    cuenta: 'Santander',
    notificacion: true
  }
]

// Categorías con iconos
const categoriasConfig = [
  { value: 'alquiler', label: 'Alquiler', icon: Home, color: 'text-blue-400' },
  { value: 'alimentacion', label: 'Alimentación', icon: ShoppingBag, color: 'text-emerald-400' },
  { value: 'transporte', label: 'Transporte', icon: Car, color: 'text-amber-400' },
  { value: 'entretenimiento', label: 'Entretenimiento', icon: Gamepad2, color: 'text-purple-400' },
  { value: 'salud', label: 'Salud', icon: Heart, color: 'text-red-400' },
  { value: 'educacion', label: 'Educación', icon: Book, color: 'text-indigo-400' },
  { value: 'servicios', label: 'Servicios', icon: Wifi, color: 'text-cyan-400' },
  { value: 'telefonia', label: 'Telefonía', icon: Phone, color: 'text-pink-400' },
  { value: 'luz', label: 'Luz', icon: Zap, color: 'text-yellow-400' },
  { value: 'cafe', label: 'Café', icon: Coffee, color: 'text-orange-400' },
  { value: 'restaurante', label: 'Restaurante', icon: Utensils, color: 'text-rose-400' },
  { value: 'regalos', label: 'Regalos', icon: Gift, color: 'text-teal-400' },
  { value: 'otros', label: 'Otros', icon: MoreHorizontal, color: 'text-slate-400' }
]

// Métodos de pago
const metodosPago = [
  { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { value: 'debito-auto', label: 'Débito automático', icon: ArrowRightLeft },
  { value: 'transferencia', label: 'Transferencia', icon: TrendingDown },
  { value: 'efectivo', label: 'Efectivo', icon: Banknote },
  { value: 'bizum', label: 'Bizum', icon: Wallet }
]

// Frecuencias
const frecuencias = [
  { value: 'diario', label: 'Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'quincenal', label: 'Quincenal' },
  { value: 'mensual', label: 'Mensual' },
  { value: 'bimestral', label: 'Bimestral' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' }
]

export default function ConfiguracionPagos() {
  const [pagosConfigurados, setPagosConfigurados] = useState(pagosConfiguradosIniciales)
  const [mostrarFormularioFijo, setMostrarFormularioFijo] = useState(false)
  const [mostrarFormularioCuotas, setMostrarFormularioCuotas] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState('fijo') // 'fijo' o 'cuotas'
  const [pagoEditando, setPagoEditando] = useState(null)

  // Estadísticas
  const totalPagosMensuales = pagosConfigurados
    .filter(p => p.activo && (p.frecuencia === 'mensual' || p.tipo === 'cuotas'))
    .reduce((sum, p) => sum + (p.tipo === 'cuotas' ? p.montoCuota : p.monto), 0)

  const pagosActivos = pagosConfigurados.filter(p => p.activo).length
  const proximoPago = pagosConfigurados
    .filter(p => p.activo)
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))[0]

  const agregarPago = (nuevoPago) => {
    const pagoConId = {
      ...nuevoPago,
      id: Date.now(),
      activo: true
    }
    setPagosConfigurados([...pagosConfigurados, pagoConId])
    setMostrarFormularioFijo(false)
    setMostrarFormularioCuotas(false)
  }

  const editarPago = (pagoEditado) => {
    setPagosConfigurados(pagosConfigurados.map(p => 
      p.id === pagoEditado.id ? pagoEditado : p
    ))
    setPagoEditando(null)
  }

  const eliminarPago = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      setPagosConfigurados(pagosConfigurados.filter(p => p.id !== id))
    }
  }

  const toggleActivo = (id) => {
    setPagosConfigurados(pagosConfigurados.map(p => 
      p.id === id ? { ...p, activo: !p.activo } : p
    ))
  }

  const marcarCuotaPagada = (pagoId) => {
    setPagosConfigurados(pagosConfigurados.map(p => {
      if (p.id === pagoId && p.tipo === 'cuotas' && p.cuotasPagadas < p.cuotas) {
        return {
          ...p,
          cuotasPagadas: p.cuotasPagadas + 1
        }
      }
      return p
    }))
  }

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
              <h1 className="text-2xl font-bold text-white">Configuración de Pagos</h1>
            </div>
            <p className="text-slate-400 mt-2">
              Gestiona tus pagos fijos y compras a plazos en un solo lugar
            </p>
          </div>
          
          {/* RESUMEN RÁPIDO */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
              <div className="text-xs text-slate-400">Total mensual</div>
              <div className="text-lg font-bold text-emerald-400">€{totalPagosMensuales.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
              <div className="text-xs text-slate-400">Pagos activos</div>
              <div className="text-lg font-bold text-white">{pagosActivos}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
              <div className="text-xs text-slate-400">Próximo pago</div>
              <div className="text-sm font-medium text-white truncate">
                {proximoPago?.nombre || 'Ninguno'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => {
            setTipoSeleccionado('fijo')
            setMostrarFormularioFijo(true)
            setMostrarFormularioCuotas(false)
            setPagoEditando(null)
          }}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo pago fijo
        </button>
        
        <button
          onClick={() => {
            setTipoSeleccionado('cuotas')
            setMostrarFormularioCuotas(true)
            setMostrarFormularioFijo(false)
            setPagoEditando(null)
          }}
          className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva compra a cuotas
        </button>

        <div className="flex-1"></div>

        <button
          onClick={() => {
            // Función para exportar configuración
            const config = JSON.stringify(pagosConfigurados, null, 2)
            const blob = new Blob([config], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'configuracion_pagos.json'
            link.click()
          }}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
        >
          Exportar configuración
        </button>
      </div>

      {/* FORMULARIOS */}
      {(mostrarFormularioFijo || mostrarFormularioCuotas) && (
        <div className="mb-8">
          {mostrarFormularioFijo && (
            <FormularioPagoFijo
              categorias={categoriasConfig}
              metodosPago={metodosPago}
              frecuencias={frecuencias}
              onSubmit={agregarPago}
              onCancel={() => setMostrarFormularioFijo(false)}
              pagoEditando={pagoEditando}
              onEdit={editarPago}
            />
          )}
          
          {mostrarFormularioCuotas && (
            <FormularioCuotas
              categorias={categoriasConfig}
              metodosPago={metodosPago}
              frecuencias={frecuencias}
              onSubmit={agregarPago}
              onCancel={() => setMostrarFormularioCuotas(false)}
              pagoEditando={pagoEditando}
              onEdit={editarPago}
            />
          )}
        </div>
      )}

      {/* LISTA DE PAGOS CONFIGURADOS */}
      <ListaPagosConfigurados
        pagos={pagosConfigurados}
        onEdit={(pago) => {
          setPagoEditando(pago)
          if (pago.tipo === 'fijo') {
            setMostrarFormularioFijo(true)
            setMostrarFormularioCuotas(false)
          } else {
            setMostrarFormularioCuotas(true)
            setMostrarFormularioFijo(false)
          }
        }}
        onDelete={eliminarPago}
        onToggleActivo={toggleActivo}
        onMarcarCuotaPagada={marcarCuotaPagada}
      />

      {/* RESUMEN DETALLADO */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DISTRIBUCIÓN POR CATEGORÍA */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-blue-400" />
            Distribución por categoría
          </h3>
          <div className="space-y-3">
            {Object.entries(
              pagosConfigurados.reduce((acc, pago) => {
                acc[pago.categoria] = (acc[pago.categoria] || 0) + 
                  (pago.tipo === 'cuotas' ? pago.montoCuota : pago.monto)
                return acc
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .map(([categoria, monto]) => {
                const categoriaInfo = categoriasConfig.find(c => c.label === categoria)
                const porcentaje = (monto / totalPagosMensuales) * 100
                
                return (
                  <div key={categoria} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {categoriaInfo?.icon && (
                          <categoriaInfo.icon className={`h-4 w-4 ${categoriaInfo.color}`} />
                        )}
                        <span className="text-sm text-slate-300">{categoria}</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        €{monto.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full"
                        style={{ 
                          width: `${porcentaje}%`,
                          backgroundColor: categoriaInfo?.color?.replace('text-', 'bg-').replace('-400', '-500')
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* PRÓXIMOS VENCIMIENTOS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400" />
            Próximos vencimientos
          </h3>
          <div className="space-y-3">
            {pagosConfigurados
              .filter(p => p.activo)
              .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
              .slice(0, 5)
              .map(pago => (
                <div key={pago.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-white">{pago.nombre}</div>
                    <div className="text-xs text-slate-400">{pago.fechaInicio}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-300">
                      €{pago.tipo === 'cuotas' ? pago.montoCuota.toFixed(2) : pago.monto.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">{pago.frecuencia}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            Estadísticas
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400">Pagos fijos</div>
                <div className="text-xl font-bold text-blue-400">
                  {pagosConfigurados.filter(p => p.tipo === 'fijo' && p.activo).length}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-800/30 rounded-lg">
                <div className="text-xs text-slate-400">En cuotas</div>
                <div className="text-xl font-bold text-purple-400">
                  {pagosConfigurados.filter(p => p.tipo === 'cuotas' && p.activo).length}
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Progreso cuotas activas</div>
              {pagosConfigurados
                .filter(p => p.tipo === 'cuotas' && p.activo)
                .map(pago => (
                  <div key={pago.id} className="mb-2 last:mb-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 truncate">{pago.nombre}</span>
                      <span className="text-slate-400">{pago.cuotasPagadas}/{pago.cuotas}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${(pago.cuotasPagadas / pago.cuotas) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}