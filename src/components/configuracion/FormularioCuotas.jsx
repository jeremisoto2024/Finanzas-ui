import { useState, useEffect } from 'react'
import { X, Save, Calculator, Calendar, Euro, AlertCircle } from 'lucide-react'

export default function FormularioCuotas({ 
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
    montoTotal: '',
    cuotas: '12',
    frecuencia: 'mensual',
    categoria: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    metodoPago: '',
    cuenta: '',
    descripcion: ''
  })

  const [montoCuota, setMontoCuota] = useState(0)

  useEffect(() => {
    if (pagoEditando) {
      setFormData({
        nombre: pagoEditando.nombre,
        montoTotal: pagoEditando.montoTotal,
        cuotas: pagoEditando.cuotas.toString(),
        frecuencia: pagoEditando.frecuencia,
        categoria: pagoEditando.categoria,
        fechaInicio: pagoEditando.fechaInicio,
        metodoPago: pagoEditando.metodoPago,
        cuenta: pagoEditando.cuenta,
        descripcion: pagoEditando.descripcion || ''
      })
      setMontoCuota(pagoEditando.montoCuota || 0)
    }
  }, [pagoEditando])

  useEffect(() => {
    if (formData.montoTotal && formData.cuotas) {
      const monto = parseFloat(formData.montoTotal)
      const cuotas = parseInt(formData.cuotas)
      if (!isNaN(monto) && !isNaN(cuotas) && cuotas > 0) {
        setMontoCuota(monto / cuotas)
      }
    }
  }, [formData.montoTotal, formData.cuotas])

  const handleSubmit = (e) => {
    e.preventDefault()
    const pago = {
      ...formData,
      montoTotal: parseFloat(formData.montoTotal),
      cuotas: parseInt(formData.cuotas),
      montoCuota: montoCuota,
      cuotasPagadas: pagoEditando?.cuotasPagadas || 0,
      tipo: 'cuotas'
    }
    
    if (pagoEditando) {
      onEdit({ ...pagoEditando, ...pago })
    } else {
      onSubmit(pago)
    }
    
    if (!pagoEditando) {
      setFormData({
        nombre: '',
        montoTotal: '',
        cuotas: '12',
        frecuencia: 'mensual',
        categoria: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        metodoPago: '',
        cuenta: '',
        descripcion: ''
      })
      setMontoCuota(0)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {pagoEditando ? 'Editar compra a cuotas' : 'Nueva compra a cuotas'}
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
              Nombre del producto/servicio *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              placeholder="Ej: iPhone 15, Sofá, Curso online..."
            />
          </div>

          {/* Monto total */}
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
                name="montoTotal"
                value={formData.montoTotal}
                onChange={handleChange}
                required
                step="0.01"
                min="0.01"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Cuotas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Calculator className="h-4 w-4" />
              Número de cuotas *
            </label>
            <select
              name="cuotas"
              value={formData.cuotas}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition appearance-none"
            >
              {[3, 6, 12, 18, 24, 36, 48].map(num => (
                <option key={num} value={num.toString()}>
                  {num} cuotas
                </option>
              ))}
            </select>
          </div>

          {/* Monto por cuota (calculado) */}
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
                value={montoCuota.toFixed(2)}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 cursor-not-allowed"
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
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition appearance-none"
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
              Frecuencia de pago *
            </label>
            <select
              name="frecuencia"
              value={formData.frecuencia}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition appearance-none"
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
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
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
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition appearance-none"
            >
              <option value="">Seleccionar método</option>
              {metodosPago.map(metodo => (
                <option key={metodo.value} value={metodo.label}>
                  {metodo.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cuenta y descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cuenta
            </label>
            <input
              type="text"
              name="cuenta"
              value={formData.cuenta}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
              placeholder="Ej: BBVA, Revolut..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Fecha de finalización estimada
            </label>
            <input
              type="text"
              value={(() => {
                if (formData.fechaInicio && formData.cuotas && formData.frecuencia) {
                  const fecha = new Date(formData.fechaInicio)
                  const cuotas = parseInt(formData.cuotas)
                  
                  if (formData.frecuencia === 'mensual') {
                    fecha.setMonth(fecha.getMonth() + cuotas - 1)
                  } else if (formData.frecuencia === 'anual') {
                    fecha.setFullYear(fecha.getFullYear() + cuotas - 1)
                  }
                  
                  return fecha.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
                return 'Selecciona fecha y cuotas'
              })()}
              readOnly
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 cursor-not-allowed"
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
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none"
            placeholder="Detalles adicionales, tienda, condiciones..."
          />
        </div>

        {/* Resumen */}
        <div className="p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-purple-400" />
            <h4 className="text-sm font-semibold text-purple-300">Resumen del plan</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
              <div className="text-xs text-slate-400">Monto total</div>
              <div className="text-sm font-bold text-white">€{formData.montoTotal || '0.00'}</div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
              <div className="text-xs text-slate-400">Cuotas</div>
              <div className="text-sm font-bold text-white">{formData.cuotas || '0'}</div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
              <div className="text-xs text-slate-400">Por cuota</div>
              <div className="text-sm font-bold text-purple-400">€{montoCuota.toFixed(2)}</div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 rounded-lg">
              <div className="text-xs text-slate-400">Frecuencia</div>
              <div className="text-sm font-medium text-white capitalize">
                {formData.frecuencia || 'No especificado'}
              </div>
            </div>
          </div>
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
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
          >
            <Save className="h-4 w-4" />
            {pagoEditando ? 'Guardar cambios' : 'Crear plan de cuotas'}
          </button>
        </div>
      </form>
    </div>
  )
}