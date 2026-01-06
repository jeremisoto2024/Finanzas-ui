import { CreditCard, Tag, Database } from 'lucide-react';

export default function FilaGasto({ gasto }) {
  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
        {gasto.fecha}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-white">{gasto.concepto}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-slate-500" />
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
            {gasto.metodoPago}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-slate-500" />
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300">
            {gasto.categoria}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-slate-500" />
          {gasto.cuenta}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="inline-flex items-center gap-1 bg-red-900/20 px-3 py-1.5 rounded-lg">
          <span className="text-sm font-semibold text-red-400">
            €{gasto.monto.toFixed(2)}
          </span>
        </div>
      </td>
    </tr>
  );
}