import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_INCOME_DB,
      sorts: [
        {
          property: 'Fecha',
          direction: 'descending',
        },
      ],
    })

    const ingresos = response.results.map(page => ({
      id: page.id,
      fecha: page.properties.Fecha.date.start,
      concepto: page.properties.Concepto.title[0]?.plain_text || '',
      categoria: page.properties.Categoria.select?.name || '',
      metodo: page.properties.Metodo.select?.name || '',
      cuenta: page.properties.Cuenta.select?.name || '',
      monto: page.properties.Monto.number || 0,
    }))

    res.status(200).json(ingresos)
  } catch (error) {
    res.status(500).json({ error: 'Error cargando ingresos' })
  }
}