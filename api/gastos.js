import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })

    const response = await notion.databases.query({
      database_id: process.env.NOTION_EXPENSES_DB,
    })

    const gastos = response.results.map(page => {
      // Usar la fecha de creación (created_time) como fecha del gasto
      const fechaFormateada = page.created_time ? 
        page.created_time.split('T')[0] : 
        null

      return {
        id: page.id,
        concepto: page.properties.Nombre?.title?.[0]?.plain_text || '',
        monto: page.properties.Cantidad?.number || 0,
        fecha: fechaFormateada,
        categoria: page.properties.Categoría?.select?.name || '',
        metodo: page.properties['Método de pago']?.select?.name || '',
        cuenta: page.properties.Cuenta?.select?.name || '',
      }
    })

    res.status(200).json(gastos)
    
  } catch (error) {
    console.error('Error en API de gastos:', error)
    res.status(500).json({ error: 'Error cargando gastos' })
  }
}