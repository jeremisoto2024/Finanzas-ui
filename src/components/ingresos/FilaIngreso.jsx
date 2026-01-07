export default function FilaIngreso({ ingreso }) {
  return (
    <tr className="border-t border-slate-800">
      <td className="px-4 py-3 text-slate-400">
        {ingreso.fecha}
      </td>

      <td className="px-4 py-3">
        {ingreso.concepto}
      </td>

      <td className="px-4 py-3">
        {ingreso.metodo}
      </td>

      <td className="px-4 py-3">
        {ingreso.categoria}
      </td>

      <td className="px-4 py-3">
        {ingreso.cuenta}
      </td>

      <td className="px-4 py-3 text-right text-emerald-400 font-medium">
        € {ingreso.monto.toFixed(2)}
      </td>
    </tr>
  )
}