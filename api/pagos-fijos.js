import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

function calcularProximoPago(fecha, frecuencia) {
  if (!fecha || !frecuencia) return null

  const f = new Date(fecha)

  switch (frecuencia) {
    case 'Mensual':
      f.setMonth(f.getMonth() + 1)
      break
    case 'Semanal':
      f.setDate(f.getDate() + 7)
      break
    case 'Anual':
      f.setFullYear(f.getFullYear() + 1)
      break
    default:
      return null
  }

  return f.toISOString().split('T')[0]
}

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PAGOS_FIJOS_DB
    })

    const data = response.results.map((page) => {
      const p = page.properties

      const fechaBase = p.Fecha?.date?.start || null
      const frecuencia = p.Frecuencia?.select?.name || null

      return {
        id: page.id,
        nombre: p.Nombre?.title?.[0]?.plain_text || '',
        cantidad: p.Cantidad?.number || 0,
        categoria: p.Categoría?.select?.name || '',
        metodoPago: p['Método de pago']?.select?.name || '',
        cuenta: p.Cuenta?.select?.name || '',
        fecha: fechaBase,
        proximoPago: calcularProximoPago(fechaBase, frecuencia)
      }
    })

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error cargando pagos fijos' })
  }
}