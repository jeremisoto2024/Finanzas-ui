import { useState, useMemo, useEffect } from 'react';
import { 
  Download, 
  Filter,
  Calendar,
  CreditCard,
  Database,
  Tag,
  TrendingDown,
  Bell,
  ChevronDown,
  FileText,
  Wallet,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Clock,
  TrendingUp,
  PieChart,
  Target,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Percent,
  Zap,
  Shield,
  Thermometer,
  Repeat,
  Calculator,
  Receipt,
  TrendingUp as TrendingUpIcon,
  Home,
  ShoppingBag,
  Car,
  Gamepad2,
  Heart,
  Wifi,
  Phone,
  Coffee,
  Utensils,
  Gift,
  MoreHorizontal,
  BookOpen,
  Music,
  Check,
  Users,
  Smartphone,
  Tv,
  Dumbbell,
  Palette,
  Briefcase,
  Plane,
  Train,
  Bike,
  Building,
  Book,
  GraduationCap,
  Stethoscope,
  Camera,
  Headphones,
  ShoppingCart,
  Package,
  Banknote,
  WalletCards,
  Landmark,
  Bitcoin,
  Coins,
  CreditCard as CreditCardIcon,
  Smartphone as SmartphoneIcon,
  Laptop,
  Monitor,
  Printer,
  Router,
  Watch,
  Tablet,
  GamepadIcon,
  Car as CarIcon,
  Shirt,
  Shoe,
  Diamond,
  Coffee as CoffeeIcon,
  Pizza,
  Beer,
  Wine,
  Martini,
  CakeSlice,
  Apple,
  Sandwich,
  ChefHat,
  ShoppingBasket,
  Store,
  Truck,
  Package2,
  Box,
  Gem,
  Brush,
  Music2,
  Film,
  Tv2,
  Ticket,
  Gamepad2 as Gamepad2Icon,
  Dumbbell as DumbbellIcon,
  Heart as HeartIcon,
  Stethoscope as StethoscopeIcon,
  BookOpen as BookOpenIcon,
  GraduationCap as GraduationCapIcon,
  Briefcase as BriefcaseIcon,
  Plane as PlaneIcon,
  Train as TrainIcon,
  Bike as BikeIcon,
  Users as UsersIcon,
  Home as HomeIcon,
  Wifi as WifiIcon,
  Phone as PhoneIcon,
  Zap as ZapIcon,
  Droplets,
  Fuel,
  Scissors,
  Bed,
  Couch,
  Lamp,
  Refrigerator,
  Microwave,
  ShowerHead,
  Bath,
  Toilet,
  Armchair,
  BookMarked,
  Newspaper,
  Music3,
  Podcast,
  Radio,
  Youtube,
  Twitch,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Cloud,
  Server,
  Cpu,
  HardDrive,
  Mouse,
  Keyboard,
  Speaker,
  Headphones as HeadphonesIcon,
  Mic,
  Video,
  Webcam,
  PhoneCall,
  MessageSquare,
  Mail,
  CalendarDays,
  Clock3,
  MapPin,
  Navigation,
  CarTaxi,
  Bus,
  Ship,
  Rocket,
  Compass,
  Suitcase,
  Hotel,
  Tent,
  Mountain,
  TreePine,
  Sun,
  CloudSun,
  CloudRain,
  Snowflake,
  ThermometerSun,
  Wind,
  Umbrella,
  Shield as ShieldIcon,
  Lock,
  Key,
  Eye,
  EyeOff,
  User,
  UserPlus,
  Users2,
  UserCheck,
  UserX,
  Settings,
  BellRing,
  HelpCircle,
  Info,
  AlertTriangle as AlertTriangleIcon,
  AlertOctagon,
  AlertCircle as AlertCircleIcon,
  CheckCircle,
  XCircle,
  Ban,
  Clock4,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  Timer,
  TimerReset,
  Hourglass,
  History,
  RotateCcw,
  Undo,
  Redo,
  Trash2,
  Edit,
  Edit2,
  Edit3,
  Copy,
  Scissors as ScissorsIcon,
  Clipboard,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardList,
  List,
  ListChecks,
  ListOrdered,
  ListTodo,
  CheckSquare,
  Square,
  Circle,
  Target as TargetIcon,
  Flag,
  Star,
  Heart as HeartIcon2,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  PartyPopper,
  Confetti,
  Gift as GiftIcon,
  Cake,
  Crown,
  Trophy,
  Medal,
  Award,
  Gem as GemIcon,
  Diamond as DiamondIcon,
  Sparkles,
  Moon,
  Sun as SunIcon,
  Cloud as CloudIcon,
  CloudLightning,
  Droplet,
  Flame,
  Leaf,
  Flower,
  Tree,
  Bug,
  Cat,
  Dog,
  Fish,
  Bird,
  Rabbit,
  Turtle,
  Whale,
  Octopus,
  Spider,
  Ghost,
  Skull,
  Alien,
  Rocket as RocketIcon,
  Satellite,
  Planet,
  Telescope,
  Microscope,
  Atom,
  Beaker,
  FlaskConical,
  FlaskRound,
  TestTube,
  Syringe,
  Pill,
  Bandage,
  Bone,
  Brain,
  HeartPulse,
  Pulse,
  Activity,
  Thermometer as ThermometerIcon,
  Droplet as DropletIcon,
  Wind as WindIcon,
  CloudDrizzle,
  CloudSnow,
  CloudFog,
  CloudHail,
  CloudSleet,
  CloudSunRain,
  CloudMoonRain,
  CloudLightning as CloudLightningIcon,
  Tornado,
  Hurricane,
  Earthquake,
  Fire,
  Volcano,
  Snowflake as SnowflakeIcon,
  SunDim,
  SunMedium,
  SunSnow,
  Sunrise,
  Sunset,
  MoonStar,
  Sparkle,
  Zap as ZapIcon2,
  LucideIcon
} from 'lucide-react';

export default function TablaGastos() {
  // Estados para los datos de Notion
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para pagos fijos y cuotas
  const [pagosFijos, setPagosFijos] = useState([]);
  const [comprasCuotas, setComprasCuotas] = useState([]);

  // Estados de filtros
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // ========== CARGAR TODOS LOS DATOS ==========
  useEffect(() => {
    const fetchTodosLosDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar gastos normales
        const resGastos = await fetch('/api/gastos');
        if (!resGastos.ok) throw new Error('Error cargando gastos');
        const gastosData = await resGastos.json();
        setGastosMensuales(gastosData);

        // 2. Cargar pagos fijos desde Configuración.jsx
        const resPagos = await fetch('/api/pagos-fijos');
        if (resPagos.ok) {
          const pagosData = await resPagos.json();
          setPagosFijos(pagosData.filter(p => p.activo === true));
        }

        // 3. Cargar compras a cuotas desde Configuración.jsx
        const resCuotas = await fetch('/api/compras-cuotas');
        if (resCuotas.ok) {
          const cuotasData = await resCuotas.json();
          setComprasCuotas(cuotasData.filter(c => c.activo === true));
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching datos:', err);
        
        // Datos de ejemplo REALES basados en tus imágenes
        setGastosMensuales([
          { id: 1, fecha: '2026-01-02', concepto: 'Mercado', metodo: 'App', categoria: 'Alimentación', cuenta: 'Móvil', monto: 50 },
          { id: 2, fecha: '2026-01-03', concepto: 'Mami', metodo: 'Bizum', categoria: 'Familia', cuenta: 'Bizum', monto: 20 },
          { id: 3, fecha: '2026-01-05', concepto: 'Refresco', metodo: 'App', categoria: 'Alimentación', cuenta: 'Móvil', monto: 2 },
          { id: 4, fecha: '2026-01-07', concepto: 'Cine', metodo: 'Tarjeta', categoria: 'Entretenimiento', cuenta: 'Revolut', monto: 12 },
          { id: 5, fecha: '2026-01-10', concepto: 'Gasolina', metodo: 'Tarjeta', categoria: 'Transporte', cuenta: 'Santander', monto: 40 },
        ]);
        
        // PAGOS FIJOS YA REALIZADOS (con fechas PASADAS)
        setPagosFijos([
          { 
            id: '1', 
            nombre: 'Alquiler', 
            monto: 750.00, 
            metodo: 'Transferencia', 
            categoria: 'Vivienda', 
            frecuencia: 'mensual', 
            activo: true, 
            fechaInicio: '2026-01-01',
            fechaRealPago: '2026-01-01'
          },
          { 
            id: '2', 
            nombre: 'Netflix', 
            monto: 12.99, 
            metodo: 'Tarjeta', 
            categoria: 'Entretenimiento', 
            frecuencia: 'mensual', 
            activo: true, 
            fechaInicio: '2026-01-15',
            fechaRealPago: '2026-01-15'
          },
          { 
            id: '3', 
            nombre: 'Gimnasio', 
            monto: 45.00, 
            metodo: 'Transferencia', 
            categoria: 'Salud', 
            frecuencia: 'mensual', 
            activo: true, 
            fechaInicio: '2026-01-10',
            fechaRealPago: '2026-01-10'
          }
        ]);
        
        // CUOTAS YA PAGADAS (solo las que ya se han efectuado)
        setComprasCuotas([
          { 
            id: '1', 
            concepto: 'AliExpress 1', 
            montoTotal: 33.74,
            cuotasTotales: 4,
            cuotasPagadas: 3,
            montoPrimeraCuota: 10.00,
            montoUltimaCuota: 7.46,
            fechaInicio: '2025-11-01',
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 10.00, pagada: true, fecha: '2025-11-01' },
              { numero: 2, monto: 8.64, pagada: true, fecha: '2025-12-01' },
              { numero: 3, monto: 7.64, pagada: true, fecha: '2026-01-01' },
              { numero: 4, monto: 7.46, pagada: false, fecha: '2026-02-01' }
            ]
          },
          { 
            id: '2', 
            concepto: 'Shein', 
            montoTotal: 50.74,
            cuotasTotales: 4,
            cuotasPagadas: 1,
            fechaInicio: '2026-01-01',
            metodo: 'Tarjeta',
            categoria: 'Ropa',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 12.69, pagada: true, fecha: '2026-01-01' },
              { numero: 2, monto: 12.69, pagada: false, fecha: '2026-02-01' },
              { numero: 3, monto: 12.68, pagada: false, fecha: '2026-03-01' },
              { numero: 4, monto: 12.68, pagada: false, fecha: '2026-04-01' }
            ]
          },
          { 
            id: '3', 
            concepto: 'AliExpress 3', 
            montoTotal: 49.95,
            cuotasTotales: 3,
            cuotasPagadas: 1,
            fechaInicio: '2026-01-01',
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 16.65, pagada: true, fecha: '2026-01-01' },
              { numero: 2, monto: 16.65, pagada: false, fecha: '2026-02-01' },
              { numero: 3, monto: 16.65, pagada: false, fecha: '2026-03-01' }
            ]
          },
          { 
            id: '4', 
            concepto: 'AliExpress 2', 
            montoTotal: 33.11,
            cuotasTotales: 3,
            cuotasPagadas: 1,
            fechaInicio: '2026-01-01',
            metodo: 'Tarjeta',
            categoria: 'Tecnología',
            activo: true,
            frecuenciaPago: 'mensual',
            historialCuotas: [
              { numero: 1, monto: 11.04, pagada: true, fecha: '2026-01-01' },
              { numero: 2, monto: 11.04, pagada: false, fecha: '2026-02-01' },
              { numero: 3, monto: 11.03, pagada: false, fecha: '2026-03-01' }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodosLosDatos();
  }, []);

  // ========== FUNCIONES DE TRANSFORMACIÓN ==========

  // 1. Transformar pagos fijos YA EFECTUADOS en gastos
  const transformarPagosFijosAGastos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return pagosFijos.map(pago => {
      const fechaPagoStr = pago.fechaRealPago || pago.fechaInicio;
      const fechaPago = new Date(fechaPagoStr);
      fechaPago.setHours(0, 0, 0, 0);
      
      if (fechaPago > hoy) return null;
      
      const mesGasto = `${fechaPago.getFullYear()}-${String(fechaPago.getMonth() + 1).padStart(2, '0')}`;
      
      return {
        id: `pago-fijo-${pago.id}`,
        fecha: fechaPagoStr,
        concepto: pago.nombre,
        metodo: pago.metodo,
        categoria: pago.categoria,
        cuenta: 'Cuenta Principal',
        monto: parseFloat(pago.monto),
        origen: 'pago_fijo',
        frecuencia: pago.frecuencia,
        esHistorico: true
      };
    }).filter(Boolean);
  }, [pagosFijos]);

  // 2. Transformar CUOTAS YA PAGADAS en gastos
  const transformarCuotasAGastos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const gastosCuotas = [];
    
    comprasCuotas.forEach(compra => {
      if (!compra.historialCuotas) return;
      
      compra.historialCuotas.forEach(cuota => {
        if (!cuota.pagada) return;
        
        const fechaCuota = new Date(cuota.fecha);
        fechaCuota.setHours(0, 0, 0, 0);
        
        if (fechaCuota <= hoy) {
          gastosCuotas.push({
            id: `cuota-${compra.id}-${cuota.numero}`,
            fecha: cuota.fecha,
            concepto: compra.concepto,
            metodo: compra.metodo,
            categoria: compra.categoria,
            cuenta: 'Financiación',
            monto: parseFloat(cuota.monto.toFixed(2)),
            origen: 'cuota',
            cuotaNumero: cuota.numero,
            totalCuotas: compra.cuotasTotales,
            cuotasPagadas: compra.cuotasPagadas,
            infoCuota: `Cuota ${cuota.numero}/${compra.cuotasTotales}`,
            infoProgreso: `Progreso: ${compra.cuotasPagadas}/${compra.cuotasTotales}`,
            esHistorico: true
          });
        }
      });
    });
    
    return gastosCuotas;
  }, [comprasCuotas]);

  // 3. Obtener meses únicos
  const obtenerMesesDisponibles = useMemo(() => {
    const mesesSet = new Set();
    
    const agregarMes = (fechaStr) => {
      if (!fechaStr) return;
      try {
        const fecha = new Date(fechaStr);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        mesesSet.add(mes);
      } catch (e) {
        console.error('Error procesando fecha:', fechaStr, e);
      }
    };
    
    gastosMensuales.forEach(g => agregarMes(g.fecha));
    transformarPagosFijosAGastos.forEach(g => agregarMes(g.fecha));
    transformarCuotasAGastos.forEach(g => agregarMes(g.fecha));
    
    return Array.from(mesesSet).sort((a, b) => b.localeCompare(a));
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos]);

  // 4. Función para formatear mes
  const formatearMesTexto = (mesFormato) => {
    if (!mesFormato) return '';
    const [año, mes] = mesFormato.split('-');
    const fecha = new Date(año, parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // ========== FUNCIONES PARA ICONOS ==========

  // Obtener icono por categoría
  const getIconoCategoria = (categoria) => {
    const iconos = {
      'Vivienda': <Home className="h-4 w-4" />,
      'Alimentación': <ShoppingBasket className="h-4 w-4" />,
      'Transporte': <Car className="h-4 w-4" />,
      'Entretenimiento': <Gamepad2 className="h-4 w-4" />,
      'Salud': <Heart className="h-4 w-4" />,
      'Tecnología': <Smartphone className="h-4 w-4" />,
      'Servicios': <Wifi className="h-4 w-4" />,
      'Telefonía': <Phone className="h-4 w-4" />,
      'Ropa': <Shirt className="h-4 w-4" />,
      'Familia': <Users className="h-4 w-4" />,
      'Educación': <BookOpen className="h-4 w-4" />,
      'Hogar': <Couch className="h-4 w-4" />,
      'Otros': <MoreHorizontal className="h-4 w-4" />
    };
    return iconos[categoria] || <Tag className="h-4 w-4" />;
  };

  // Obtener icono por método de pago
  const getIconoMetodo = (metodo) => {
    const iconos = {
      'Tarjeta': <CreditCard className="h-4 w-4" />,
      'Transferencia': <Banknote className="h-4 w-4" />,
      'Bizum': <SmartphoneIcon className="h-4 w-4" />,
      'App': <ShoppingBag className="h-4 w-4" />,
      'Efectivo': <Coins className="h-4 w-4" />,
      'PayPal': <Globe className="h-4 w-4" />
    };
    return iconos[metodo] || <Wallet className="h-4 w-4" />;
  };

  // Obtener icono por tipo de gasto
  const getIconoTipo = (tipo) => {
    const iconos = {
      'normal': <Receipt className="h-4 w-4" />,
      'pago_fijo': <Repeat className="h-4 w-4" />,
      'cuota': <Calculator className="h-4 w-4" />
    };
    return iconos[tipo] || <DollarSign className="h-4 w-4" />;
  };

  // Obtener color por tipo de gasto
  const getColorTipo = (tipo) => {
    const colores = {
      'normal': { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
      'pago_fijo': { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-800/50' },
      'cuota': { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-800/50' }
    };
    return colores[tipo] || colores.normal;
  };

  // ========== COMBINAR TODOS LOS GASTOS HISTÓRICOS ==========
  const todosLosGastos = useMemo(() => {
    return [
      ...gastosMensuales.map(g => ({ ...g, origen: 'normal' })),
      ...transformarPagosFijosAGastos,
      ...transformarCuotasAGastos
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [gastosMensuales, transformarPagosFijosAGastos, transformarCuotasAGastos]);

  // ========== FILTRAR GASTOS ==========
  const gastosFiltrados = useMemo(() => {
    return todosLosGastos.filter(gasto => {
      if (!gasto.fecha) return false;
      
      const fechaGasto = new Date(gasto.fecha);
      const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
      
      const cumpleMes = !filtroMes || mesGasto === filtroMes;
      const cumpleMetodo = !filtroMetodo || gasto.metodo === filtroMetodo;
      const cumpleCategoria = !filtroCategoria || gasto.categoria === filtroCategoria;
      
      return cumpleMes && cumpleMetodo && cumpleCategoria;
    });
  }, [todosLosGastos, filtroMes, filtroMetodo, filtroCategoria]);

  // ========== CÁLCULOS ==========
  const total = useMemo(() => {
    return gastosFiltrados.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
  }, [gastosFiltrados]);

  const estadisticasPorTipo = useMemo(() => {
    const stats = {
      normal: { total: 0, count: 0, label: 'Gastos Normales', icon: <Receipt className="h-4 w-4" /> },
      pago_fijo: { total: 0, count: 0, label: 'Pagos Fijos', icon: <Repeat className="h-4 w-4" /> },
      cuota: { total: 0, count: 0, label: 'Cuotas Pagadas', icon: <Calculator className="h-4 w-4" /> }
    };
    
    gastosFiltrados.forEach(gasto => {
      const tipo = gasto.origen || 'normal';
      if (stats[tipo]) {
        stats[tipo].total += gasto.monto || 0;
        stats[tipo].count += 1;
      }
    });
    
    return stats;
  }, [gastosFiltrados]);

  const exportarCSV = () => {
    const headers = ['Fecha', 'Concepto', 'Método', 'Categoría', 'Cuenta', 'Monto', 'Origen'];
    const filas = gastosFiltrados.map(g => [
      g.fecha, 
      g.concepto, 
      g.metodo, 
      g.categoria, 
      g.cuenta, 
      g.monto, 
      g.origen || 'normal'
    ].join(','));
    
    const csv = [headers.join(','), ...filas].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gastos_${filtroMes || 'todos'}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ========== ESTADOS DE CARGA ==========
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="h-16 w-16 text-red-400 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 bg-red-400/20 blur-xl rounded-full"></div>
          </div>
          <p className="text-slate-300 text-lg font-medium mt-4">Cargando datos financieros...</p>
          <p className="text-slate-500 text-sm mt-2 animate-pulse">Conectando con tus fuentes de datos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-800/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-900/30 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Error al cargar datos</h2>
            </div>
            <p className="text-slate-300 mb-4">{error}</p>
            <p className="text-slate-400 text-sm mb-6">Mostrando datos de ejemplo. Verifica tu conexión.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-red-900/20"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      {/* HEADER MEJORADO */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard Financiero</h1>
                <p className="text-slate-400 text-sm mt-1">Seguimiento completo de tus gastos históricos</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-800">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                  €{total.toFixed(2)}
                </div>
                <div className="h-4 w-px bg-slate-700"></div>
                <div>
                  <div className="text-xs text-slate-400">Total acumulado</div>
                  <div className="text-sm text-slate-300">{gastosFiltrados.length} transacciones</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-800">
                <Calendar className="h-4 w-4 text-red-400" />
                <span className="text-slate-300 text-sm">
                  {filtroMes ? formatearMesTexto(filtroMes) : 'Todos los meses'}
                </span>
              </div>
            </div>
            
            {/* DESGLOSE POR TIPO - MEJORADO */}
            <div className="flex flex-wrap gap-3 mt-4">
              {Object.entries(estadisticasPorTipo).map(([tipo, data]) => {
                if (data.count > 0) {
                  const colors = {
                    normal: 'from-slate-700 to-slate-800',
                    pago_fijo: 'from-amber-700/30 to-amber-900/20',
                    cuota: 'from-purple-700/30 to-purple-900/20'
                  };
                  
                  return (
                    <div key={tipo} className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${colors[tipo]} border border-slate-800/50 backdrop-blur-sm`}>
                      <div className="p-1.5 rounded-md bg-slate-900/50">
                        {data.icon}
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">{data.label}</div>
                        <div className="text-sm font-semibold text-white">
                          {data.count} • €{data.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          
          {/* BOTÓN DE EXPORTAR MEJORADO */}
          <div className="mt-4 md:mt-0">
            <button 
              onClick={exportarCSV}
              className="group flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-900/40"
            >
              <div className="relative">
                <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="absolute -inset-2 bg-red-400/20 blur-sm group-hover:blur-md transition-all rounded-full"></div>
              </div>
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* LAYOUT DE DOS COLUMNAS */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA - FILTROS MEJORADOS */}
        <div className="lg:w-1/3 xl:w-1/4">
          <div className="sticky top-6 space-y-6">
            {/* PANEL DE FILTROS MEJORADO */}
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800 p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-red-600 to-red-800 rounded-lg">
                  <Filter className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">Filtros Avanzados</h2>
              </div>
              
              <div className="space-y-5">
                {/* FILTRO MES */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Calendar className="h-4 w-4 text-red-400" />
                    Período
                  </label>
                  <div className="relative group">
                    <select 
                      value={filtroMes}
                      onChange={(e) => setFiltroMes(e.target.value)}
                      className="w-full px-4 py-3 pl-10 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 appearance-none backdrop-blur-sm"
                    >
                      <option value="">Todos los períodos</option>
                      {obtenerMesesDisponibles.map((mes) => (
                        <option key={mes} value={mes}>
                          {formatearMesTexto(mes)}
                        </option>
                      ))}
                    </select>
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* FILTRO MÉTODO */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <CreditCard className="h-4 w-4 text-purple-400" />
                    Medio de Pago
                  </label>
                  <div className="relative group">
                    <select 
                      value={filtroMetodo}
                      onChange={(e) => setFiltroMetodo(e.target.value)}
                      className="w-full px-4 py-3 pl-10 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 appearance-none backdrop-blur-sm"
                    >
                      <option value="">Todos los medios</option>
                      <option value="Tarjeta">💳 Tarjeta</option>
                      <option value="Transferencia">🏦 Transferencia</option>
                      <option value="Bizum">📱 Bizum</option>
                      <option value="App">🛒 App</option>
                      <option value="Efectivo">💵 Efectivo</option>
                    </select>
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* FILTRO CATEGORÍA */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Tag className="h-4 w-4 text-amber-400" />
                    Categoría
                  </label>
                  <div className="relative group">
                    <select 
                      value={filtroCategoria}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                      className="w-full px-4 py-3 pl-10 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 appearance-none backdrop-blur-sm"
                    >
                      <option value="">Todas las categorías</option>
                      <option value="Vivienda">🏠 Vivienda</option>
                      <option value="Alimentación">🛒 Alimentación</option>
                      <option value="Transporte">🚗 Transporte</option>
                      <option value="Entretenimiento">🎮 Entretenimiento</option>
                      <option value="Salud">❤️ Salud</option>
                      <option value="Tecnología">📱 Tecnología</option>
                      <option value="Ropa">👕 Ropa</option>
                      <option value="Familia">👨‍👩‍👧‍👦 Familia</option>
                      <option value="Otros">🔮 Otros</option>
                    </select>
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* RESUMEN MEJORADO */}
              <div className="mt-6 pt-6 border-t border-slate-800/50">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-slate-800/40 to-slate-900/30 rounded-xl border border-slate-800/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-400">Total filtrado</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                          €{total.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Transacciones</div>
                        <div className="text-lg font-semibold text-slate-300">{gastosFiltrados.length}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-slate-800/30 rounded-lg border border-slate-800/30">
                      <div className="text-xs text-slate-400">Diferentes</div>
                      <div className="text-sm font-semibold text-slate-300">
                        {new Set(gastosFiltrados.map(g => g.categoria)).size} categorías
                      </div>
                    </div>
                    <div className="text-center p-3 bg-slate-800/30 rounded-lg border border-slate-800/30">
                      <div className="text-xs text-slate-400">Promedio</div>
                      <div className="text-sm font-semibold text-red-400">
                        €{(gastosFiltrados.length > 0 ? total / gastosFiltrados.length : 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setFiltroMes('');
                    setFiltroMetodo('');
                    setFiltroCategoria('');
                  }}
                  className="w-full mt-4 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-medium transition-all duration-200 border border-slate-700 hover:border-slate-600 backdrop-blur-sm"
                >
                  Restablecer filtros
                </button>
              </div>
            </div>

            {/* INFO CARD */}
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-800/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-900/30 rounded-lg">
                  <Info className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-amber-300 mb-1">Solo gastos históricos</h3>
                  <p className="text-xs text-amber-400/80">
                    Esta vista muestra únicamente transacciones ya efectuadas. Los pagos futuros no se incluyen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA - TABLA MEJORADA */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            {/* HEADER DE TABLA MEJORADO */}
            <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900/50 to-slate-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-600 to-red-800 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {filtroMes ? `Gastos de ${formatearMesTexto(filtroMes)}` : 'Historial Completo de Gastos'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {gastosFiltrados.length} transacciones registradas • Actualizado al {new Date().toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                    <CheckCircle className="h-3 w-3 text-emerald-400" />
                    <span className="text-slate-300">Solo efectuados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLA MEJORADA */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 to-slate-900/90">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Concepto
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Categoría
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Detalles
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-2 justify-end">
                        <DollarSign className="h-4 w-4" />
                        Monto
                      </div>
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {gastosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="max-w-md mx-auto">
                          <div className="relative mb-4">
                            <Receipt className="h-16 w-16 text-slate-600 mx-auto opacity-50" />
                            <div className="absolute inset-0 bg-slate-600/10 blur-xl rounded-full"></div>
                          </div>
                          <h3 className="text-lg font-medium text-slate-300 mb-2">No hay gastos para mostrar</h3>
                          <p className="text-slate-500 text-sm">
                            {filtroMes 
                              ? `No se encontraron gastos en ${formatearMesTexto(filtroMes)} con los filtros actuales.`
                              : 'Cambia los filtros o agrega nuevos gastos para comenzar.'
                            }
                          </p>
                          <button
                            onClick={() => {
                              setFiltroMes('');
                              setFiltroMetodo('');
                              setFiltroCategoria('');
                            }}
                            className="mt-4 px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          >
                            Limpiar filtros
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gastosFiltrados.map((gasto, index) => {
                      const colorTipo = getColorTipo(gasto.origen);
                      const iconoTipo = getIconoTipo(gasto.origen);
                      const iconoCategoria = getIconoCategoria(gasto.categoria);
                      const iconoMetodo = getIconoMetodo(gasto.metodo);
                      
                      return (
                        <tr 
                          key={gasto.id} 
                          className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-all duration-200 ${
                            index % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/10'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${colorTipo.bg} border ${colorTipo.border}`}>
                                {iconoTipo}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{gasto.fecha}</div>
                                <div className="text-xs text-slate-500">
                                  {new Date(gasto.fecha).toLocaleDateString('es-ES', { weekday: 'short' })}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white">{gasto.concepto}</div>
                                {gasto.origen === 'cuota' && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-purple-400">
                                      <Calculator className="h-3 w-3" />
                                      <span>{gasto.infoCuota}</span>
                                    </div>
                                    <div className="h-1 w-1 rounded-full bg-purple-800"></div>
                                    <div className="text-xs text-slate-500">
                                      {gasto.infoProgreso}
                                    </div>
                                  </div>
                                )}
                                {gasto.origen === 'pago_fijo' && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Repeat className="h-3 w-3 text-amber-500" />
                                    <span className="text-xs text-amber-500">Pago fijo • {gasto.frecuencia}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                                {iconoCategoria}
                              </div>
                              <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800/50">
                                  {gasto.categoria}
                                </span>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-slate-800/50 rounded-md border border-slate-700">
                                  {iconoMetodo}
                                </div>
                                <span className="text-sm text-slate-300">{gasto.metodo}</span>
                              </div>
                              {gasto.origen === 'cuota' && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-purple-900/20 rounded-md border border-purple-800/30">
                                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                                  <span className="text-xs text-purple-400">Cuota</span>
                                </div>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-red-900/20 to-red-800/10 border border-red-800/30">
                              <span className="text-sm font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                                €{gasto.monto?.toFixed(2) || '0.00'}
                              </span>
                              <div className="h-4 w-px bg-red-800/50"></div>
                              <div className={`text-xs font-medium ${colorTipo.text}`}>
                                {gasto.origen === 'normal' ? 'Normal' : 
                                 gasto.origen === 'pago_fijo' ? 'Fijo' : 'Cuota'}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* FOOTER DE TABLA MEJORADO */}
            <div className="px-6 py-4 border-t border-slate-800 bg-gradient-to-r from-slate-900/50 to-slate-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                    <span className="text-slate-300">{estadisticasPorTipo.normal.count || 0}</span>
                    <span className="text-slate-500">Normales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                    <span className="text-slate-300">{estadisticasPorTipo.pago_fijo.count || 0}</span>
                    <span className="text-slate-500">Fijos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                    <span className="text-slate-300">{estadisticasPorTipo.cuota.count || 0}</span>
                    <span className="text-slate-500">Cuotas</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Clock className="h-3 w-3" />
                    <span>Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* RESUMEN ESTADÍSTICO */}
          {gastosFiltrados.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">Distribución por tipo</div>
                  <PieChart className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-2">
                  {Object.entries(estadisticasPorTipo).map(([tipo, data]) => {
                    if (data.count === 0) return null;
                    const porcentaje = total > 0 ? (data.total / total * 100).toFixed(1) : 0;
                    return (
                      <div key={tipo} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            tipo === 'normal' ? 'bg-slate-400' :
                            tipo === 'pago_fijo' ? 'bg-amber-400' : 'bg-purple-400'
                          }`}></div>
                          <span className="text-xs text-slate-400">{data.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white">{porcentaje}%</div>
                          <div className="text-xs text-slate-500">€{data.total.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">Top categorías</div>
                  <Tag className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-2">
                  {Array.from(new Set(gastosFiltrados.map(g => g.categoria)))
                    .map(categoria => {
                      const totalCat = gastosFiltrados
                        .filter(g => g.categoria === categoria)
                        .reduce((sum, g) => sum + g.monto, 0);
                      const porcentaje = total > 0 ? (totalCat / total * 100).toFixed(1) : 0;
                      return { categoria, total: totalCat, porcentaje };
                    })
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={item.categoria} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-slate-500">{index + 1}.</div>
                          <span className="text-xs text-slate-300 truncate">{item.categoria}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-red-400">€{item.total.toFixed(2)}</div>
                          <div className="text-xs text-slate-500">{item.porcentaje}%</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-900/30 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300">Resumen rápido</div>
                  <TrendingUp className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Total acumulado</span>
                    <span className="text-sm font-bold text-red-400">€{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Promedio por transacción</span>
                    <span className="text-sm font-semibold text-slate-300">
                      €{(gastosFiltrados.length > 0 ? total / gastosFiltrados.length : 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Transacciones totales</span>
                    <span className="text-sm font-semibold text-slate-300">{gastosFiltrados.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}