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
      database_id: process.env.PAGOS_FIJOS_DB_ID,
      sorts: [
        { property: 'Activo', direction: 'descending' },
        { property: 'Próximo pago', direction: 'ascending' },
      ],
    })

    const data = response.results.map((page) => ({
      id: page.id,
      nombre: page.properties.Nombre?.title[0]?.plain_text || '',
      monto: page.properties.Monto?.number || 0,
      metodo: page.properties['Método']?.select?.name || '',
      categoria: page.properties['Categoría']?.select?.name || '',
      frecuencia: page.properties.Frecuencia?.select?.name || '',
      proximoPago: page.properties['Próximo pago']?.date?.start || '',
      activo: page.properties.Activo?.checkbox || false,
    }))

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error cargando pagos fijos' })
  }
}