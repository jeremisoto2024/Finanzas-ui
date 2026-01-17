import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { saldo, year, month } = req.body

  try {
    const fecha = new Date(year, month, 1).toISOString()

    // Verificar si ya existe
    const existe = await notion.databases.query({
      database_id: process.env.NOTION_INGRESOS_DB,
      filter: {
        and: [
          { property: 'Categoría', select: { equals: 'Saldo inicial' } },
          { property: 'Fecha del ingreso', date: { equals: fecha } }
        ]
      }
    })

    if (existe.results.length > 0) {
      return res.status(200).json({ ok: true, duplicated: true })
    }

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_INGRESOS_DB },
      properties: {
        Nombre: { title: [{ text: { content: 'Saldo inicial' } }] },
        Cantidad: { number: saldo },
        'Fecha del ingreso': { date: { start: fecha } },
        Categoría: { select: { name: 'Saldo inicial' } },
        Cuenta: { select: { name: 'Sistema' } },
        'Método de pago': { select: { name: 'Sistema' } }
      }
    })

    res.status(201).json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error creando saldo inicial' })
  }
}