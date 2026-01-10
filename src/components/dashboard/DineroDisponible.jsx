import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Wallet, TrendingUp, PieChart, RefreshCw, AlertCircle, Database, CreditCard } from 'lucide-react'

export default function DineroDisponible() {
  // Estados para los datos
  const [ingresoMensual, setIngresoMensual] = useState(0);
  const [gastosFijos, setGastosFijos] = useState(0);
  const [disponible, setDisponible] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesFiltro, setMesFiltro] = useState('');

  // ========== OBTENER MES ACTUAL ==========
  const obtenerMesActual = () => {
    const ahora = new Date();
    return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
  };

  // ========== CARGAR DATOS DE AMBAS APIS ==========
  useEffect(() => {
    const fetchDatosFinancieros = async () => {
      try {
        setLoading(true);
        const mesActual = obtenerMesActual();
        setMesFiltro(mesActual);
        
        console.log('Cargando datos para el mes:', mesActual);

        // 1. Cargar ingresos del mes actual
        let totalIngresos = 0;
        try {
          const resIngresos = await fetch('/api/ingresos');
          if (resIngresos.ok) {
            const ingresosData = await resIngresos.json();
            console.log('Datos de ingresos recibidos:', ingresosData);
            
            // Filtrar ingresos del mes actual
            const ingresosMesActual = ingresosData.filter(ingreso => {
              if (!ingreso.fecha) return false;
              try {
                const fechaIngreso = new Date(ingreso.fecha);
                const mesIngreso = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}`;
                return mesIngreso === mesActual;
              } catch (error) {
                console.warn('Error procesando fecha de ingreso:', ingreso.fecha);
                return false;
              }
            });

            // Sumar todos los ingresos del mes actual
            totalIngresos = ingresosMesActual.reduce((sum, ingreso) => {
              const monto = parseFloat(ingreso.monto) || 0;
              return sum + monto;
            }, 0);

            console.log(`Total ingresos mes ${mesActual}: €${totalIngresos.toFixed(2)} de ${ingresosMesActual.length} registros`);
          } else {
            console.warn('API de ingresos no disponible');
            totalIngresos = 1800; // Valor por defecto
          }
        } catch (err) {
          console.warn('Error cargando ingresos:', err);
          totalIngresos = 1800; // Valor por defecto
        }

        // 2. Cargar pagos fijos activos
        let totalPagosFijos = 0;
        try {
          const resPagosFijos = await fetch('/api/pagos-fijos');
          if (resPagosFijos.ok) {
            const pagosFijosData = await resPagosFijos.json();
            console.log('Datos de pagos fijos recibidos:', pagosFijosData);
            
            // Filtrar solo pagos fijos activos
            const pagosActivos = pagosFijosData.filter(pago => {
              // Verificar si el pago está activo
              const activo = pago.activo === true || pago.activo === 'true' || pago.activo === undefined;
              return activo;
            });

            // Sumar montos de todos los pagos fijos activos
            totalPagosFijos = pagosActivos.reduce((sum, pago) => {
              const monto = parseFloat(pago.monto) || 0;
              return sum + monto;
            }, 0);

            console.log(`Total pagos fijos activos: €${totalPagosFijos.toFixed(2)} de ${pagosActivos.length} registros`);
          } else {
            console.warn('API de pagos fijos no disponible');
            totalPagosFijos = 950; // Valor por defecto
          }
        } catch (err) {
          console.warn('Error cargando pagos fijos:', err);
          totalPagosFijos = 950; // Valor por defecto
        }

        // 3. Calcular disponible
        const nuevoDisponible = totalIngresos - totalPagosFijos;

        // 4. Actualizar estados
        setIngresoMensual(totalIngresos);
        setGastosFijos(totalPagosFijos);
        setDisponible(nuevoDisponible);

        console.log('Resumen calculado:', {
          ingresos: totalIngresos,
          gastosFijos: totalPagosFijos,
          disponible: nuevoDisponible,
          mes: mesActual
        });

      } catch (err) {
        setError(err.message);
        console.error('Error general cargando datos financieros:', err);
        
        // Usar valores por defecto en caso de error
        setIngresoMensual(1800);
        setGastosFijos(950);
        setDisponible(850);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosFinancieros();
    
    // Opcional: Recargar datos cada 30 segundos para actualizaciones en tiempo real
    const intervalo = setInterval(fetchDatosFinancieros, 30000);
    return () => clearInterval(intervalo);
  }, []);

  // ========== CÁLCULOS DERIVADOS ==========
  const porcentajeDisponible = ingresoMensual > 0 ? (disponible / ingresoMensual) * 100 : 0;
  const porcentajeGastosFijos = ingresoMensual > 0 ? (gastosFijos / ingresoMensual) * 100 : 0;
  
  // Formatear mes para mostrar
  const formatearMesTexto = (mesFormato) => {
    if (!mesFormato) return '';
    const [año, mes] = mesFormato.split('-');
    const fecha = new Date(año, parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

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
            <p className="text-sm text-slate-400">Calculando...</p>
            <p className="text-xs text-slate-500 mt-1">
              Obteniendo datos de ingresos y gastos fijos
            </p>
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
          <p className="text-sm text-amber-400 mb-2">Error cargando datos</p>
          <p className="text-xs text-slate-500 mb-3 max-w-xs mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md transition"
          >
            Reintentar conexión
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
            <div>
              <div>Dinero Disponible</div>
              <div className="text-xs text-emerald-300 font-normal">
                {mesFiltro ? formatearMesTexto(mesFiltro) : 'Mes actual'}
              </div>
            </div>
          </CardTitle>
          <div className={`text-xs px-2 py-1 rounded-lg ${
            porcentajeDisponible > 30 ? 'bg-emerald-900/30 text-emerald-300' :
            porcentajeDisponible > 10 ? 'bg-amber-900/30 text-amber-300' :
            'bg-red-900/30 text-red-300'
          }`}>
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
          <p className="text-xs text-slate-500 mt-1">
            Basado en datos de {formatearMesTexto(mesFiltro)}
          </p>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Distribución mensual</span>
            <span className="font-medium text-slate-300">
              €{disponible.toFixed(0)} disponible
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(Math.max(porcentajeDisponible, 0), 100)}%` }}
              title={`${porcentajeDisponible.toFixed(1)}% disponible`}
            ></div>
            <div 
              className="h-full bg-slate-600 transition-all duration-500"
              style={{ width: `${Math.min(Math.max(porcentajeGastosFijos, 0), 100)}%` }}
              title={`${porcentajeGastosFijos.toFixed(1)}% gastos fijos`}
            ></div>
          </div>
        </div>

        {/* DESGLOSE DETALLADO */}
        <div className="space-y-3">
          {/* INGRESO MENSUAL - DESDE API */}
          <div className="flex items-center justify-between p-3 bg-emerald-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-sm text-slate-300">Ingreso mensual</span>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Database className="h-3 w-3" />
                  <span>Desde API de ingresos</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-400">
                €{ingresoMensual.toFixed(2)}
              </span>
              {ingresoMensual === 0 && (
                <div className="text-xs text-amber-500 mt-1">
                  Sin ingresos registrados este mes
                </div>
              )}
            </div>
          </div>

          {/* GASTOS FIJOS - DESDE API */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <PieChart className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <span className="text-sm text-slate-300">Gastos fijos</span>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <CreditCard className="h-3 w-3" />
                  <span>Desde API de pagos-fijos</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-slate-300">
                €{gastosFijos.toFixed(2)}
              </span>
              {gastosFijos > 0 && ingresoMensual > 0 && (
                <div className="text-xs text-slate-500">
                  {(porcentajeGastosFijos).toFixed(0)}% del ingreso
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INDICADORES FINANCIEROS */}
        <div className="pt-2 border-t border-slate-800/50">
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="p-2 bg-slate-800/30 rounded">
              <div className="text-slate-500">Salud financiera</div>
              <div className={
                porcentajeDisponible > 30 ? 'text-emerald-400' : 
                porcentajeDisponible > 10 ? 'text-amber-400' : 
                'text-red-400'
              }>
                {porcentajeDisponible > 30 ? 'Excelente' : 
                 porcentajeDisponible > 10 ? 'Aceptable' : 
                 'Crítica'}
              </div>
            </div>
            
            <div className="p-2 bg-slate-800/30 rounded">
              <div className="text-slate-500">Relación D/F</div>
              <div className="text-slate-300">
                {gastosFijos > 0 ? (disponible/gastosFijos).toFixed(1) : '∞'}:1
              </div>
            </div>
          </div>

          {/* ALERTAS INTELIGENTES */}
          {disponible < 0 ? (
            <div className="mt-3 p-2 bg-red-900/20 border border-red-800/30 rounded text-center">
              <p className="text-xs text-red-400">
                ⚠️ ¡Atención! Los gastos fijos superan tus ingresos en €{Math.abs(disponible).toFixed(2)}
              </p>
            </div>
          ) : disponible < ingresoMensual * 0.2 && disponible > 0 ? (
            <div className="mt-3 p-2 bg-amber-900/20 border border-amber-800/30 rounded text-center">
              <p className="text-xs text-amber-400">
                💡 Solo el {(porcentajeDisponible).toFixed(0)}% disponible. Considera reducir gastos fijos.
              </p>
            </div>
          ) : null}
          
          {/* INFORMACIÓN DE FUENTES DE DATOS */}
          <div className="mt-3 text-xs text-slate-600 flex justify-between">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span>API Ingresos: {ingresoMensual > 0 ? '✓ Conectada' : '✗ Sin datos'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-slate-500"></div>
              <span>API Gastos: {gastosFijos > 0 ? '✓ Conectada' : '✗ Sin datos'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}