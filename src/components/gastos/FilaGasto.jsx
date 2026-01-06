export default function FilaGasto({ gasto }) {
  return (
    <tr className="border-t border-slate-800 hover:bg-slate-900/40">
      <td className="px-4 py-3">{gasto.fecha}</td>
      <td className="px-4 py-3">{gasto.concepto}</td>
      <td className="px-4 py-3">{gasto.metodoPago}</td>
      <td className="px-4 py-3">{gasto.categoria}</td>
      <td className="px-4 py-3">{gasto.cuenta}</td>
      <td className="px-4 py-3 text-right">
        € {gasto.monto.toFixed(2)}
      </td>
    </tr>
  )
}