import { 
  Pencil, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Calendar,
  CreditCard,
  Wallet,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'

export default function ListaPagosConfigurados({ 
  pagos, 
  onEdit, 
  onDelete, 
  onToggleActivo,
  onMarcarCuotaPagada 
}) {
  const [filtroTipo, setFiltroTipo] = useState('todos') // 'todos', 'fijo', 'cuotas'
  const [filtroActivo, setFiltroActivo] = useState('todos') // 'todos', 'activo', 'inactivo'

  const pagosFiltrados = pagos.filter(pago => {
    const cumpleTipo = filtroTipo === 'todos' || pago.tipo === filtroTipo
    const cumpleActivo = filtroActivo === 'todos' || 
      (filtroActivo === 'activo' && pago.activo) ||
      (filtroActivo === 'inactivo' && !pago.activo)
    return cumpleTipo && cumpleActivo
  })

  const obtenerIconoCategoria = (categoria) => {
    const iconos = {
      'Alquiler': Home,
      'Alimentación': ShoppingBag,
      'Transporte': Car,
      'Entretenimiento': Gamepad2,
      'Salud': Heart,
      'Servicios': Wifi,
      'Telefonía': Phone,
      'Luz': Zap,
      'Tecnología': Smartphone,
      'Educación': Book,
      'Ropa': Shirt,
      'Café': Coffee,
      'Restaurante': Utensils,
      'Regalos': Gift
    }
    return iconos[categoria] || MoreHorizontal
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      {/* HEADER DE LA TABLA */}
      <div className="px-6 py-4 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Pagos configurados</h2>
            <p className="text-sm text-slate-400 mt-1">
              {pagosFiltrados.length} de {pagos.length} pagos
            </p>
          </div>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select 
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none pr-8"
              >
                <option value="todos">Todos los tipos</option>
                <option value="fijo">Pagos fijos</option>
                <option value="cuotas">En cuotas</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={filtroActivo}
                onChange={(e) => setFiltroActivo(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none pr-8"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Solo activos</option>
                <option value="inactivo">Solo inactivos</option>
              </select>
              <ToggleRight className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE PAGOS */}
      <div className="divide-y divide-slate-800">
        {pagosFiltrados.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-slate-500" />
            </div>
            <p className="text-slate-400">No hay pagos configurados</p>
            <p className="text-sm text-slate-500 mt-1">
              Comienza agregando un pago fijo o una compra a cuotas
            </p>
          </div>
        ) : (
          pagosFiltrados.map(pago => {
            const CategoriaIcon = obtenerIconoCategoria(pago.categoria)
            const esCuotas = pago.tipo === 'cuotas'
            const progresoCuotas = esCuotas ? (pago.cuotasPagadas / pago.cuotas) * 100 : 0
            
            return (
              <div 
                key={pago.id} 
                className={`p-5 hover:bg-slate-800/30 transition-colors ${
                  !pago.activo ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* INFO PRINCIPAL */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        esCuotas ? 'bg-purple-900/30' : 'bg-blue-900/30'
                      }`}>
                        {esCuotas ? (
                          <TrendingDown className="h-5 w-5 text-purple-400" />
                        ) : (
                          <Calendar className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-white truncate">
                            {pago.nombre}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            esCuotas 
                              ? 'bg-purple-900/50 text-purple-300' 
                              : 'bg-blue-900/50 text-blue-300'
                          }`}>
                            {esCuotas ? 'Cuotas' : 'Fijo'}
                          </span>
                          {!pago.activo && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                              Inactivo
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <CategoriaIcon className="h-3 w-3" />
                            {pago.categoria}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {pago.fechaInicio}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {pago.metodoPago}
                          </div>
                          {pago.cuenta && (
                            <div className="flex items-center gap-1">
                              <Wallet className="h-3 w-3" />
                              {pago.cuenta}
                            </div>
                          )}
                        </div>

                        {/* INFO ESPECÍFICA */}
                        {esCuotas ? (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-slate-400">
                                Progreso: {pago.cuotasPagadas}/{pago.cuotas} cuotas
                              </span>
                              <span className="font-medium text-slate-300">
                                €{pago.montoCuota?.toFixed(2)}/mes
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${progresoCuotas}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span className="text-slate-500">
                                Total: €{pago.montoTotal?.toFixed(2)}
                              </span>
                              <span className="text-slate-500">
                                {pago.frecuencia}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-3">
                            <div className="text-sm font-bold text-slate-300">
                              €{pago.monto?.toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {pago.frecuencia}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="flex items-center gap-2">
                    {esCuotas && pago.activo && pago.cuotasPagadas < pago.cuotas && (
                      <button
                        onClick={() => onMarcarCuotaPagada(pago.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 rounded-lg text-xs font-medium transition"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Marcar pagada
                      </button>
                    )}
                    
                    <button
                      onClick={() => onToggleActivo(pago.id)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition"
                      title={pago.activo ? 'Desactivar' : 'Activar'}
                    >
                      {pago.activo ? (
                        <ToggleRight className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-slate-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => onEdit(pago)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition"
                      title="Editar"
                    >
                      <Pencil className="h-5 w-5 text-blue-400" />
                    </button>
                    
                    <button
                      onClick={() => onDelete(pago.id)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="h-5 w-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* FOOTER */}
      <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm">
          <div className="text-slate-400">
            Mostrando <span className="font-medium text-slate-300">{pagosFiltrados.length}</span> pagos
          </div>
          <div className="flex items-center gap-4">
            <div className="text-slate-500 text-sm">
              <span className="text-blue-400">{pagos.filter(p => p.tipo === 'fijo').length}</span> fijos • 
              <span className="text-purple-400"> {pagos.filter(p => p.tipo === 'cuotas').length}</span> en cuotas
            </div>
            <button
              onClick={() => {
                // Exportar a CSV
                const headers = ['Nombre', 'Tipo', 'Monto', 'Frecuencia', 'Categoría', 'Estado', 'Fecha Inicio']
                const rows = pagos.map(p => [
                  p.nombre,
                  p.tipo,
                  p.tipo === 'cuotas' ? p.montoCuota : p.monto,
                  p.frecuencia,
                  p.categoria,
                  p.activo ? 'Activo' : 'Inactivo',
                  p.fechaInicio
                ])
                const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'pagos_configurados.csv'
                link.click()
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 transition"
            >
              <Download className="h-3 w-3" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}