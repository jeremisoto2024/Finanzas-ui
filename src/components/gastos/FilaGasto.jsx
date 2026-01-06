export default function FilaGasto({ gasto }) {
  return (
    <tr className="border-t border-slate-800 hover:bg-slate-900/50 transition">
      <td className="px-4 py-3 text-slate-400">
        {gasto.fecha}
      </td>

      <td className="px-4 py-3">
        {gasto.concepto}
      </td>

      <td className="px-4 py-3 text-slate-400">
        {gasto.categoria}
      </td>

      <td className="px-4 py-3 text-right font-medium text-rose-400">
        € {gasto.monto.toFixed(2)}
      </td>
    </tr>
  )
}