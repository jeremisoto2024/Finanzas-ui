import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { year, month } = req.body

  try {
    const inicioMes = new Date(year, month, 1).toISOString()
    const finMes = new Date(year, month + 1, 0).toISOString()

    // INGRESOS
    const ingresosRes = await notion.databases.query({
      database_id: process.env.NOTION_INGRESOS_DB,
      filter: {
        property: 'Fecha del ingreso',
        date: { on_or_after: inicioMes, on_or_before: finMes }
      }
    })

    const totalIngresos = ingresosRes.results.reduce(
      (acc, page) => acc + (page.properties.Cantidad.number || 0),
      0
    )

    // GASTOS
    const gastosRes = await notion.databases.query({
      database_id: process.env.NOTION_GASTOS_DB,
      filter: {
        property: 'Fecha del gasto',
        date: { on_or_after: inicioMes, on_or_before: finMes }
      }
    })

    const totalGastos = gastosRes.results.reduce(
      (acc, page) => acc + (page.properties.Cantidad.number || 0),
      0
    )

    const saldoFinal = totalIngresos - totalGastos

    res.status(200).json({ saldoFinal })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error cerrando el mes' })
  }
}