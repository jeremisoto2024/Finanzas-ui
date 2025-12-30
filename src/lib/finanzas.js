export function totalGastos(gastos) {
  return gastos.reduce((acc, g) => acc + g.monto, 0)
}

export function gastosPorCategoria(gastos) {
  return gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.monto
    return acc
  }, {})
}