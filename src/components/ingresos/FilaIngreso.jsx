import { CreditCard, Tag, Database } from 'lucide-react';

export default function FilaIngreso({ ingreso }) {
  return (
    <tr className="hover:bg-slate-800/50 transition-colors border-t border-slate-800">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
        {ingreso.fecha}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-white">{ingreso.concepto}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-500" />
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
            {ingreso.metodo}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-slate-500" />
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-900/30 text-emerald-300">
            {ingreso.categoria}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-slate-500" />
          {ingreso.cuenta}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="inline-flex items-center gap-1 bg-emerald-900/20 px-3 py-1.5 rounded-lg">
          <span className="text-sm font-semibold text-emerald-400">
            €{ingreso.monto.toFixed(2)}
          </span>
        </div>
      </td>
    </tr>
  );
}