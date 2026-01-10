import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.COMPRAS_CUOTAS_DB_ID,
      sorts: [{ property: 'Fecha Inicio', direction: 'ascending' }],
    })

    const data = response.results.map((page) => ({
      id: page.id,
      concepto: page.properties.Concepto?.title[0]?.plain_text || '',
      montoTotal: page.properties['Monto Total']?.number || 0,
      cuotasTotales: page.properties['Cuotas Totales']?.number || 0,
      cuotasPagadas: page.properties['Cuotas Pagadas']?.number || 0,
      metodo: page.properties['Método']?.select?.name || '',
      categoria: page.properties['Categoría']?.select?.name || '',
      fechaInicio: page.properties['Fecha Inicio']?.date?.start || '',
      activo: page.properties.Activo?.checkbox || false,
    }))

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error cargando compras a cuotas' })
  }
}