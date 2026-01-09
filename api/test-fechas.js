import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })

    // 1. Primero obtenemos la estructura de la base de datos
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_INCOME_DB,
    })

    // 2. Buscamos propiedades de fecha
    const propiedadesFecha = Object.entries(database.properties)
      .filter(([key, value]) => value.type === 'date')
      .map(([key, value]) => ({
        nombre: key,
        formato: value.date?.format || 'No especificado',
        type: value.type
      }))

    // 3. Obtenemos algunos registros con fechas
    const response = await notion.databases.query({
      database_id: process.env.NOTION_INCOME_DB,
      page_size: 3,
    })

    // 4. Extraemos información de fechas de cada registro
    const registrosConFechas = response.results.map((page, index) => {
      const props = page.properties
      const propiedadesConFecha = Object.entries(props)
        .filter(([key, value]) => value.type === 'date')
        .map(([key, value]) => ({
          propiedad: key,
          valorCompleto: value,
          valorStart: value.date?.start,
          tipoStart: typeof value.date?.start,
          esValida: !!value.date?.start
        }))

      return {
        registro: index + 1,
        id: page.id,
        concepto: props.Nombre?.title?.[0]?.plain_text || 'Sin nombre',
        tienePropiedadesFecha: propiedadesConFecha.length > 0,
        propiedadesFecha: propiedadesConFecha,
        // Para ver todas las propiedades (debug)
        todasPropiedades: Object.keys(props)
      }
    })

    res.status(200).json({
      configuracion: {
        baseDeDatos: database.title[0]?.plain_text || 'Sin nombre',
        id: process.env.NOTION_INCOME_DB,
        propiedadesTotales: Object.keys(database.properties).length
      },
      propiedadesDeFechaEnDB: propiedadesFecha,
      analisisRegistros: registrosConFechas,
      recomendacion: 'Verifica que: 1) La propiedad de fecha existe, 2) Tiene formato YYYY-MM-DD, 3) Los registros tienen valores en esa propiedad'
    })

  } catch (error) {
    console.error('Error en test-fechas:', error)
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      variables: {
        tieneToken: !!process.env.NOTION_TOKEN,
        tieneDB: !!process.env.NOTION_INCOME_DB
      }
    })
  }
}