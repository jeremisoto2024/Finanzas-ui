export async function getGastos() {
  const res = await fetch('/api/gastos')

  if (!res.ok) {
    throw new Error('Error cargando gastos')
  }

  return res.json()
}

export async function getIngresos() {
  const res = await fetch('/api/ingresos')

  if (!res.ok) {
    throw new Error('Error cargando ingresos')
  }

  return res.json()
}