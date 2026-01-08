import { useState, useEffect } from 'react'
import { X, Save, Calendar, Euro, Bell, AlertCircle } from 'lucide-react'

export default function FormularioPagoFijo({ 
  categorias, 
  metodosPago, 
  frecuencias, 
  onSubmit, 
  onCancel,
  pagoEditando,
  onEdit 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    monto: '',
    categoria: '',
    frecuencia: 'mensual',
    fechaInicio: new Date().toISOString().split('T')[0],
    metodoPago: '',
    cuenta: '',
    notificacion: true,
    descripcion: ''
  })

  useEffect(() => {
    if (pagoEditando) {
      setFormData({
        nombre: pagoEditando.nombre,
        monto: pagoEditando.monto,
        categoria: pagoEditando.categoria,
        frecuencia: pagoEditando.frecuencia,
        fechaInicio: pagoEditando.fechaInicio,
        metodoPago: pagoEditando.metodoPago,
        cuenta: pagoEditando.cuenta,
        notificacion: pagoEditando.notificacion,
        descripcion: pagoEditando.descripcion || ''
      })
    }
  }, [pagoEditando])

  const handleSubmit = (e) => {
    e.preventDefault()
    const pago = {
      ...formData,
      monto: parseFloat(formData.monto),
      tipo: 'fijo'
    }
    
    if (pagoEditando) {
      onEdit({ ...pagoEditando, ...pago })
    } else {
      onSubmit(pago)
    }
    
    if (!pagoEditando) {
      setFormData({
        nombre: '',
        monto: '',
        categoria: '',
        frecuencia: 'mensual',
        fechaInicio: new Date().toISOString().split('T')[0],
        metodoPago: '',
        cuenta: '',
        notificacion: true,
        descripcion: ''
      })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {pagoEditando ? 'Editar pago fijo' : 'Nuevo pago fijo'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <X className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nombre del pago *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Ej: Netflix, Gimnasio, Seguro..."
            />
          </div>

          {/* Monto */}
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
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                required
                step="0.01"
                min="0.01"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat.value} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Frecuencia */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Frecuencia *
            </label>
            <select
              name="frecuencia"
              value={formData.frecuencia}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
            >
              {frecuencias.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Calendar className="h-4 w-4" />
              Fecha de inicio *
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Método de pago *
            </label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
            >
              <option value="">Seleccionar método</option>
              {metodosPago.map(metodo => (
                <option key={metodo.value} value={metodo.label}>
                  {metodo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cuenta */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cuenta
            </label>
            <input
              type="text"
              name="cuenta"
              value={formData.cuenta}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder="Ej: BBVA, Revolut..."
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
            placeholder="Notas adicionales sobre este pago..."
          />
        </div>

        {/* Notificación */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Recordatorio</div>
              <div className="text-xs text-slate-400">Recibir notificación antes del pago</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="notificacion"
              checked={formData.notificacion}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Save className="h-4 w-4" />
            {pagoEditando ? 'Guardar cambios' : 'Crear pago fijo'}
          </button>
        </div>
      </form>
    </div>
  )
}