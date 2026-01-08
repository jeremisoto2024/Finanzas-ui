import { useState } from 'react'
import { 
  Settings, 
  Plus,
  Bell,
  Download,
  Shield,
  TrendingDown,
  Calendar,
  CreditCard,
  Wallet
} from 'lucide-react'

export default function Configuracion() {
  const [mostrarFormularioFijo, setMostrarFormularioFijo] = useState(false)
  const [mostrarFormularioCuotas, setMostrarFormularioCuotas] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* HEADER SIMPLE */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-900/30 rounded-lg">
            <Settings className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
        </div>
        <p className="text-slate-400">
          Gestiona tus pagos fijos y compras a plazos
        </p>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setMostrarFormularioFijo(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo pago fijo
        </button>
        
        <button
          onClick={() => setMostrarFormularioCuotas(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="h-4 w-4" />
          Nueva compra a cuotas
        </button>
      </div>

      {/* FORMULARIOS (SIMPLIFICADOS) */}
      {mostrarFormularioFijo && (
        <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Nuevo pago fijo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nombre del pago
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                placeholder="Ej: Netflix, Gimnasio..."
              />
            </div>
            <button
              onClick={() => setMostrarFormularioFijo(false)}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Guardar pago
            </button>
          </div>
        </div>
      )}

      {mostrarFormularioCuotas && (
        <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Nueva compra a cuotas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Producto/Servicio
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                placeholder="Ej: iPhone, Sofá..."
              />
            </div>
            <button
              onClick={() => setMostrarFormularioCuotas(false)}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
            >
              Guardar cuotas
            </button>
          </div>
        </div>
      )}

      {/* SECCIONES DE CONFIGURACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* MÉTODOS DE PAGO */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-400" />
            Métodos de pago
          </h3>
          <div className="space-y-2">
            {['Tarjeta', 'Transferencia', 'Bizum', 'Efectivo', 'PayPal'].map((metodo) => (
              <div key={metodo} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-sm text-slate-300">{metodo}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* NOTIFICACIONES */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            Notificaciones
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-300">Recordatorio de pagos</div>
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
            <button className="w-full px-4 py-2.5 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 rounded-lg text-sm font-medium transition">
              Exportar a CSV
            </button>
            <button className="w-full px-4 py-2.5 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded-lg text-sm font-medium transition">
              Exportar a JSON
            </button>
          </div>
        </div>

        {/* CUENTAS */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-purple-400" />
            Cuentas
          </h3>
          <div className="space-y-2">
            {['BBVA', 'Santander', 'Revolut', 'Efectivo'].map((cuenta) => (
              <div key={cuenta} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-sm text-slate-300">{cuenta}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CALENDARIO */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            Recordatorios
          </h3>
          <div className="space-y-2">
            <div className="text-sm text-slate-400">
              Próximo pago: <span className="text-white font-medium">Netflix</span>
            </div>
            <div className="text-sm text-slate-400">
              Fecha: <span className="text-white font-medium">15/11/2025</span>
            </div>
            <div className="text-sm text-slate-400">
              Monto: <span className="text-white font-medium">€12.99</span>
            </div>
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
            <button className="w-full px-4 py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition">
              Cerrar sesión
            </button>
          </div>
        </div>

      </div>

      {/* INFORMACIÓN ADICIONAL */}
      <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800/30 rounded-xl">
        <p className="text-sm text-blue-300">
          💡 <strong>Consejo:</strong> Configura recordatorios para tus pagos fijos y lleva un control detallado de tus compras a plazos.
        </p>
      </div>
    </div>
  )
}