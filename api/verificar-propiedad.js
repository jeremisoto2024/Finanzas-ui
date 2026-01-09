import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })

    // Obtener un solo registro
    const response = await notion.databases.query({
      database_id: process.env.NOTION_INCOME_DB,
      page_size: 1,
    })

    if (response.results.length === 0) {
      return res.status(200).json({ mensaje: 'No hay registros' })
    }

    const page = response.results[0]
    const props = page.properties
    
    const infoFecha = {
      existePropiedad: !!props['Fecha del ingreso'],
      tipoPropiedad: props['Fecha del ingreso']?.type,
      valorCompleto: props['Fecha del ingreso'],
      valorExtraido: props['Fecha del ingreso'] ? 
        props['Fecha del ingreso'][props['Fecha del ingreso'].type] : 
        null,
      esTextoPlano: props['Fecha del ingreso']?.rich_text?.[0]?.plain_text || 
                   props['Fecha del ingreso']?.title?.[0]?.plain_text ||
                   'No es texto'
    }

    res.status(200).json({
      mensaje: 'Diagnóstico de propiedad "Fecha del ingreso"',
      diagnostico: infoFecha,
      recomendacion: 'Si "tipoPropiedad" es "rich_text" o "title", debes usar la API de texto. Si es "date", debes cambiar el formato en Notion.'
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}