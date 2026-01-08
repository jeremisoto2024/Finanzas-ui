import { useState } from 'react'
import { 
  Settings, 
  CreditCard, 
  Calendar, 
  TrendingDown,
  Bell,
  Shield,
  Download,
  Plus,
  Filter,
  ChevronDown
} from 'lucide-react'
import CuotasDetalle from '@/components/configuracion/CuotasDetalle'
import { cuotas } from '@/lib/cuotas'

// Componentes del nuevo sistema
import FormularioPagoFijo from '@/components/configuracion/FormularioPagoFijo'
import FormularioCuotas from '@/components/configuracion/FormularioCuotas'
import ListaPagosConfigurados from '@/components/configuracion/ListaPagosConfigurados'

// Datos iniciales para el nuevo sistema
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
  // Convertir tus cuotas existentes al nuevo formato
  ...cuotas.map(item => ({
    id: item.id,
    nombre: item.concepto,
    tipo: 'cuotas',
    montoTotal: item.total,
    cuotas: item.cuotasTotales,
    cuotasPagadas: item.cuotas.filter(c => c.pagada).length,
    montoCuota: item.cuotas[0]?.monto || (item.total / item.cuotasTotales),
    frecuencia: 'mensual',
    categoria: 'Tecnología',
    fechaInicio: new Date().toISOString().split('T')[0],
    activo: true,
    metodoPago: 'Tarjeta',
    cuenta: 'BBVA',
    notificacion: true,
    // Mantener referencia a las cuotas originales para compatibilidad
    cuotasDetalle: item.cuotas
  }))
]

// Categorías para el formulario
const categoriasConfig = [
  { value: 'alquiler', label: 'Alquiler', icon: 'Home', color: 'text-blue-400' },
  { value: 'alimentacion', label: 'Alimentación', icon: 'ShoppingBag', color: 'text-emerald-400' },
  { value: 'transporte', label: 'Transporte', icon: 'Car', color: 'text-amber-400' },
  { value: 'entretenimiento', label: 'Entretenimiento', icon: 'Gamepad2', color: 'text-purple-400' },
  { value: 'salud', label: 'Salud', icon: 'Heart', color: 'text-red-400' },
  { value: 'servicios', label: 'Servicios', icon: 'Wifi', color: 'text-cyan-400' },
  { value: 'tecnologia', label: 'Tecnología', icon: 'Smartphone', color: 'text-pink-400' },
  { value: 'otros', label: 'Otros', icon: 'MoreHorizontal', color: 'text-slate-400' }
]

const metodosPago = [
  { value: 'tarjeta', label: 'Tarjeta', icon: 'CreditCard' },
  { value: 'debito-auto', label: 'Débito automático', icon: 'ArrowRightLeft' },
  { value: 'transferencia', label: 'Transferencia', icon: 'TrendingDown' },
  { value: 'efectivo', label: 'Efectivo', icon: 'Banknote' },
  { value: 'bizum', label: 'Bizum', icon: 'Wallet' }
]

const frecuencias = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' }
]

export default function Configuracion() {
  const [abiertoId, setAbiertoId] = useState(null)
  const [mostrarFormularioFijo, setMostrarFormularioFijo] = useState(false)
  const [mostrarFormularioCuotas, setMostrarFormularioCuotas] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState('fijo')
  const [pagoEditando, setPagoEditando] = useState(null)
  const [pagosConfigurados, setPagosConfigurados] = useState(pagosConfiguradosIniciales)

  // Convertir cuotas existentes para compatibilidad
  const cuotasExistentes = cuotas.map(item => ({
    ...item,
    abierta: abiertoId === item.id
  }))

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

  // Calcular estadísticas
  const totalPagosMensuales = pagosConfigurados
    .filter(p => p.activo && (p.frecuencia === 'mensual' || p.tipo === 'cuotas'))
    .reduce((sum, p) => sum + (p.tipo === 'cuotas' ? p.montoCuota : p.monto), 0)

  const pagosActivos = pagosConfigurados.filter(p => p.activo).length
  const totalCuotas = cuotas.length
  const cuotasActivas = cuotas.filter(item => 
    item.cuotas.filter(c => c.pagada).length < item.cuotasTotales
  ).length

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
              Gestiona tus pagos fijos, compras a plazos y configura tu cuenta
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
              <div className="text-xs text-slate-400">Cuotas activas</div>
              <div className="text-lg font-bold text-purple-400">{cuotasActivas}</div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN PRINCIPALES */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setTipoSeleccionado('fijo')
            setMostrarFormularioFijo(true)
            setMostrarFormularioCuotas(false)
            setPagoEditando(null)
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
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
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva compra a cuotas
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

      {/* LISTA DE PAGOS CONFIGURADOS - NUEVO SISTEMA */}
      <div className="mb-8">
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
      </div>

      {/* SECCIÓN DE CUOTAS EXISTENTES - MANTENER COMPATIBILIDAD */}
      <div className="mb-8 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-purple-400" />
                Compras en cuotas (Sistema actual)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {totalCuotas} compras a plazos configuradas
              </p>
            </div>
            
            <div className="text-xs text-slate-500 bg-slate-900 px-3 py-1.5 rounded-lg">
              Sistema de cuotas anterior - Compatibilidad
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {cuotasExistentes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No hay compras a cuotas configuradas
            </div>
          ) : (
            cuotasExistentes.map((item) => {
              const pagadas = item.cuotas.filter(c => c.pagada).length
              const totalCuotas = item.cuotasTotales
              const montoPagado = item.cuotas
                .filter(c => c.pagada)
                .reduce((acc, c) => acc + c.monto, 0)
              const pendiente = item.total - montoPagado
              const abierta = item.abierta

              return (
                <div
                  key={item.id}
                  onClick={() => setAbiertoId(abierta ? null : item.id)}
                  className="cursor-pointer rounded-lg border border-slate-800 p-4 space-y-2 hover:bg-slate-800/30 transition"
                >
                  {/* TÍTULO */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-200">
                      {item.concepto}
                    </span>

                    <span className="text-xs text-slate-400">
                      {pagadas} / {totalCuotas} cuotas
                    </span>
                  </div>

                  {/* PROGRESO */}
                  <div className="h-2 w-full rounded bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{
                        width: `${(pagadas / totalCuotas) * 100}%`
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>
                      Pendiente: € {pendiente.toFixed(2)}
                    </span>

                    <span className="flex items-center gap-1">
                      {pagadas === totalCuotas ? (
                        <span className="text-emerald-400">✓ Finalizado</span>
                      ) : (
                        <span className="text-amber-400">⏳ En curso</span>
                      )}
                    </span>
                  </div>

                  {/* DETALLE CUOTAS */}
                  {abierta && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <CuotasDetalle cuotas={item.cuotas} />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* CONFIGURACIÓN ADICIONAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NOTIFICACIONES */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            Notificaciones
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Recordatorio de pagos</div>
                <div className="text-xs text-slate-500">3 días antes del vencimiento</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">Resumen semanal</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* EXPORTACIÓN */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Download className="h-4 w-4 text-emerald-400" />
            Exportación de datos
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => {
                const data = JSON.stringify(pagosConfigurados, null, 2)
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'configuracion_pagos.json'
                link.click()
              }}
              className="w-full px-4 py-2.5 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 rounded-lg text-sm font-medium transition"
            >
              Exportar configuración JSON
            </button>
            <button 
              onClick={() => {
                const headers = ['Nombre', 'Tipo', 'Monto', 'Frecuencia', 'Categoría', 'Estado']
                const rows = pagosConfigurados.map(p => [
                  p.nombre,
                  p.tipo,
                  p.tipo === 'cuotas' ? p.montoCuota : p.monto,
                  p.frecuencia,
                  p.categoria,
                  p.activo ? 'Activo' : 'Inactivo'
                ])
                const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'pagos_configurados.csv'
                link.click()
              }}
              className="w-full px-4 py-2.5 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded-lg text-sm font-medium transition"
            >
              Exportar a CSV
            </button>
          </div>
        </div>

        {/* SEGURIDAD */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-400" />
            Seguridad
          </h3>
          <div className="space-y-3">
            <div className="text-sm text-slate-300">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </div>
            <button 
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos de configuración?')) {
                  setPagosConfigurados([])
                }
              }}
              className="w-full px-4 py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition"
            >
              Limpiar todos los datos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}