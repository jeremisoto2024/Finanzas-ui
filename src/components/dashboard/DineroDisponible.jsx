import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Wallet, TrendingUp, PieChart, RefreshCw, AlertCircle } from 'lucide-react'

export default function DineroDisponible() {
  const [ingresoMensual, setIngresoMensual] = useState(1800);
  const [gastosFijos, setGastosFijos] = useState(950);
  const [disponible, setDisponible] = useState(850);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calcular porcentajes
  const porcentajeDisponible = (disponible / ingresoMensual) * 100;
  const porcentajeGastosFijos = (gastosFijos / ingresoMensual) * 100;

  // ========== CARGAR DATOS ==========
  useEffect(() => {
    const fetchDatosFinancieros = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar ingresos (suponiendo que tienes una API para ingresos)
        let totalIngresos = 1800; // Valor por defecto
        try {
          const resIngresos = await fetch('/api/ingresos');
          if (resIngresos.ok) {
            const ingresosData = await resIngresos.json();
            // Supongamos que la API devuelve un array de ingresos
            if (Array.isArray(ingresosData)) {
              // Sumar todos los ingresos activos
              totalIngresos = ingresosData
                .filter(ingreso => ingreso.activo === true)
                .reduce((sum, ingreso) => sum + (ingreso.monto || 0), 0);
            }
          }
        } catch (err) {
          console.warn('No se pudieron cargar ingresos, usando valor por defecto:', err);
        }

        // 2. Cargar pagos fijos desde la API de pagos-fijos
        let totalPagosFijos = 0;
        try {
          const resPagosFijos = await fetch('/api/pagos-fijos');
          if (resPagosFijos.ok) {
            const pagosFijosData = await resPagosFijos.json();
            // Filtrar solo pagos fijos activos y sumar sus montos
            totalPagosFijos = pagosFijosData
              .filter(pago => pago.activo === true)
              .reduce((sum, pago) => sum + (pago.monto || 0), 0);
          }
        } catch (err) {
          console.warn('No se pudieron cargar pagos fijos:', err);
        }

        // 3. Calcular disponible
        const nuevoDisponible = totalIngresos - totalPagosFijos;

        // 4. Actualizar estados
        setIngresoMensual(totalIngresos);
        setGastosFijos(totalPagosFijos);
        setDisponible(nuevoDisponible);

      } catch (err) {
        setError(err.message);
        console.error('Error cargando datos financieros:', err);
        
        // Usar valores por defecto en caso de error
        setIngresoMensual(1800);
        setGastosFijos(950);
        setDisponible(850);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosFinancieros();
  }, []);

  // ========== ESTADOS DE CARGA Y ERROR ==========
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
            Dinero Disponible
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Cargando datos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-emerald-400" />
            </div>
            Dinero Disponible
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-sm text-amber-400 mb-3">Error cargando datos</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md"
          >
            Reintentar
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 border border-emerald-800/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-2 bg-emerald-900/30 rounded-lg">
              <Wallet className="h-5 w-5 text-emerald-400" />
            </div>
            Dinero Disponible
          </CardTitle>
          <div className="text-xs text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded-lg">
            {porcentajeDisponible.toFixed(0)}% libre
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* MONTO PRINCIPAL */}
        <div className="text-center">
          <p className="text-4xl font-bold text-white mb-2">
            €{disponible.toFixed(2)}
          </p>
          <p className="text-sm text-emerald-300">
            Para gastos variables y ahorro
          </p>
        </div>

        {/* BARRA DE PROGRESO SIMPLIFICADA */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Distribución</span>
            <span className="font-medium text-slate-300">
              €{disponible.toFixed(0)} disponible
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${porcentajeDisponible}%` }}
              title={`${porcentajeDisponible.toFixed(1)}% disponible`}
            ></div>
            <div 
              className="h-full bg-slate-600 transition-all duration-500"
              style={{ width: `${porcentajeGastosFijos}%` }}
              title={`${porcentajeGastosFijos.toFixed(1)}% gastos fijos`}
            ></div>
          </div>
        </div>

        {/* DESGLOSE SIMPLIFICADO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm text-slate-300">Ingresos</span>
            </div>
            <span className="text-lg font-bold text-emerald-400">
              €{ingresoMensual.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <PieChart className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-sm text-slate-300">Gastos fijos</span>
              <span className="text-xs text-slate-500">
                ({gastosFijos === 0 ? 'Sin cargar' : 'Desde API'})
              </span>
            </div>
            <span className="text-lg font-bold text-slate-300">
              €{gastosFijos.toFixed(2)}
            </span>
          </div>
        </div>

        {/* FOOTER CON INDICADORES */}
        <div className="pt-2 border-t border-slate-800/50">
          <div className="flex flex-col gap-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Porcentaje disponible:</span>
              <span className="text-emerald-400">{porcentajeDisponible.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Relación disponible/fijos:</span>
              <span className={disponible > gastosFijos ? 'text-emerald-400' : 'text-amber-400'}>
                {(disponible/gastosFijos || 0).toFixed(1)}:1
              </span>
            </div>
            {disponible < 0 && (
              <div className="text-center text-amber-400 mt-2 text-xs">
                ⚠️ Atención: Gastos fijos superan ingresos
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}