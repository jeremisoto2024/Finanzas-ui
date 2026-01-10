import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_PAGOS_FIJOS_DB
    })

    const pagosFijos = response.results.map((page) => {
      const props = page.properties

      return {
        id: page.id,
        nombre: props.Nombre?.title?.[0]?.plain_text || '',
        cantidad: props.Cantidad?.number || 0,
        categoria: props.Categoría?.select?.name || '',
        metodoPago: props['Método de pago']?.select?.name || '',
        cuenta: props.Cuenta?.select?.name || '',
        fecha: props.Fecha?.date?.start || null
      }
    })

    res.status(200).json(pagosFijos)
  } catch (error) {
    console.error('ERROR PAGOS FIJOS:', error)
    res.status(500).json({ error: 'Error cargando pagos fijos' })
  }
}