import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export default async function handler(req, res) {
  try {
    const hoy = new Date()
    const year = hoy.getFullYear()
    const monthActual = hoy.getMonth()
    const monthAnterior = monthActual - 1

    const inicio = new Date(year, monthAnterior, 1).toISOString()
    const fin = new Date(year, monthActual, 0).toISOString()

    // INGRESOS
    const ingresosRes = await notion.databases.query({
      database_id: process.env.NOTION_INGRESOS_DB,
      filter: {
        property: 'Fecha del ingreso',
        date: { on_or_after: inicio, on_or_before: fin }
      }
    })

    const ingresos = ingresosRes.results.reduce(
      (acc, p) => acc + (p.properties.Cantidad.number || 0),
      0
    )

    // GASTOS
    const gastosRes = await notion.databases.query({
      database_id: process.env.NOTION_GASTOS_DB,
      filter: {
        property: 'Fecha del gasto',
        date: { on_or_after: inicio, on_or_before: fin }
      }
    })

    const gastos = gastosRes.results.reduce(
      (acc, p) => acc + (p.properties.Cantidad.number || 0),
      0
    )

    const saldoFinal = ingresos - gastos

    const fechaSaldo = new Date(year, monthActual, 1).toISOString()

    // VERIFICAR DUPLICADO
    const existe = await notion.databases.query({
      database_id: process.env.NOTION_INGRESOS_DB,
      filter: {
        and: [
          { property: 'Categoría', select: { equals: 'Saldo inicial' } },
          { property: 'Fecha del ingreso', date: { equals: fechaSaldo } }
        ]
      }
    })

    if (existe.results.length > 0) {
      return res.status(200).json({ ok: true, skipped: true })
    }

    // CREAR SALDO
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_INGRESOS_DB },
      properties: {
        Nombre: { title: [{ text: { content: 'Saldo inicial' } }] },
        Cantidad: { number: saldoFinal },
        'Fecha del ingreso': { date: { start: fechaSaldo } },
        Categoría: { select: { name: 'Saldo inicial' } },
        Cuenta: { select: { name: 'Sistema' } },
        'Método de pago': { select: { name: 'Sistema' } }
      }
    })

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en cierre mensual' })
  }
}
