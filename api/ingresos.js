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
          property: 'Fecha de ingreso',
          direction: 'descending',
        },
      ],
    })

    const ingresos = response.results.map(page => ({
      id: page.id,

      nombre:
        page.properties.Nombre.title[0]?.plain_text || '',

      cantidad:
        page.properties.Cantidad.number || 0,

      fecha:
        page.properties['Fecha de ingreso'].date?.start || null,

      categoria:
        page.properties.Categoría.select?.name || '',

      metodo:
        page.properties['Método de pago'].select?.name || '',

      cuenta:
        page.properties.Cuenta.select?.name || '',
    }))

    res.status(200).json(ingresos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error cargando ingresos' })
  }
}