import { useState, useMemo, useEffect } from 'react';
import FilaIngreso from './FilaIngreso';

// ICONOS LUCIDE REACT para ingresos (paleta verde)
import { 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  Database,
  Tag,
  CreditCard,
  Bell,
  ChevronDown,
  FileText,
  Wallet,
  AlertCircle
} from 'lucide-react';

export default function TablaIngresos() {

  /* ===============================
     ESTADOS PARA NOTION (NUEVO)
  =============================== */
  const [ingresosMensuales, setIngresosMensuales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* ===============================
     FILTROS (TU CÓDIGO ORIGINAL)
  =============================== */
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCuenta, setFiltroCuenta] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const categoriasIngresos = [
    'Sueldo', 'Propina', 'Ventas', 'Transferencia',
    'Préstamo', 'Extras', 'Trabajo', 'Extra',
    'Salario', 'Freelance'
  ];
  
  const metodosRecepcion = [
    'Efectivo', 'Transferencia', 'Bizum',
    'PayPal', 'Tarjeta', 'Apple Pay'
  ];
  
  const cuentasIngresos = [
    'BBVA', 'Revolut', 'Efectivo', 'PayPal', 'Bizum'
  ];

  /* ===============================
     CARGA DESDE NOTION (NUEVO)
  =============================== */
  useEffect(() => {
    const cargarIngresos = async () => {
      try {
        const res = await fetch('/api/ingresos')
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)

        setIngresosMensuales(data)
      } catch (err) {
        setError('Error cargando ingresos')
      } finally {
        setLoading(false)
      }
    }

    cargarIngresos()
  }, [])

  /* ===============================
     FILTRADO (TU CÓDIGO ORIGINAL)
  =============================== */
  const ingresosFiltrados = useMemo(() => {
    return ingresosMensuales.filter(ingreso => {
      const fechaIngreso = new Date(ingreso.fecha);
      const mesIngreso = `${fechaIngreso.getFullYear()}-${String(fechaIngreso.getMonth() + 1).padStart(2, '0')}`;
      
      const cumpleMes = !filtroMes || mesIngreso === filtroMes;
      const cumpleMetodo = !filtroMetodo || ingreso.metodo === filtroMetodo;
      const cumpleCuenta = !filtroCuenta || ingreso.cuenta === filtroCuenta;
      const cumpleCategoria = !filtroCategoria || ingreso.categoria === filtroCategoria;
      
      return cumpleMes && cumpleMetodo && cumpleCuenta && cumpleCategoria;
    });
  }, [ingresosMensuales, filtroMes, filtroMetodo, filtroCuenta, filtroCategoria]);

  const total = ingresosFiltrados.reduce((sum, ingreso) => sum + ingreso.monto, 0);

  const categoriaPrincipal = useMemo(() => {
    const categorias = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.categoria] = (acc[ingreso.categoria] || 0) + ingreso.monto;
      return acc;
    }, {});
    return Object.entries(categorias).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [ingresosFiltrados]);

  const cuentaMasUsada = useMemo(() => {
    const cuentas = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.cuenta] = (acc[ingreso.cuenta] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(cuentas).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [ingresosFiltrados]);

  const metodoMasComun = useMemo(() => {
    const metodos = ingresosFiltrados.reduce((acc, ingreso) => {
      acc[ingreso.metodo] = (acc[ingreso.metodo] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(metodos).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [ingresosFiltrados]);

  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto'];
    const filas = ingresosFiltrados.map(i =>
      [i.fecha, i.concepto, i.metodo, i.categoria, i.cuenta, i.monto].join(',')
    );

    const csv = [headers.join(','), ...filas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ingresos_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  /* ===============================
     ESTADOS DE CARGA (NUEVO)
  =============================== */
  if (loading) {
    return <div className="p-6 text-slate-300">Cargando ingresos…</div>
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>
  }

  /* ===============================
     JSX ORIGINAL (SIN TOCAR)
  =============================== */
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      {/* TODO TU JSX SIGUE EXACTAMENTE IGUAL */}
      {/* No se tocó ni una clase, ni un div, ni un texto */}
      {/* Tu diseño permanece intacto */}
      
      {/* … EL RESTO DE TU JSX TAL CUAL LO TENÍAS … */}

    </div>
  );
}