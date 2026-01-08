import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    // Verificar que tenemos las variables de entorno necesarias
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_INCOME_DB) {
      console.error('Faltan variables de entorno:', {
        hasToken: !!process.env.NOTION_TOKEN,
        hasIncomeDB: !!process.env.NOTION_INCOME_DB
      })
      return res.status(500).json({ 
        error: 'Configuración incompleta del servidor',
        details: 'Faltan variables de entorno NOTION_TOKEN o NOTION_INCOME_DB'
      })
    }

    console.log('Consultando base de datos de ingresos:', process.env.NOTION_INCOME_DB)
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_INCOME_DB,
      sorts: [
        {
          property: 'Fecha',
          direction: 'descending',
        },
      ],
      // Limitar a 100 resultados para no sobrecargar
      page_size: 100,
    })

    console.log(`Notion devolvió ${response.results.length} registros`)

    const ingresos = response.results.map(page => {
      try {
        // Extraer propiedades de manera segura
        const propiedades = page.properties || {}
        
        // Fecha (asegurar formato correcto)
        let fecha = null
        if (propiedades.Fecha?.date?.start) {
          const dateObj = new Date(propiedades.Fecha.date.start)
          if (!isNaN(dateObj.getTime())) {
            fecha = dateObj.toISOString().split('T')[0] // Formato YYYY-MM-DD
          }
        }

        // Concepto (título de la página)
        let concepto = ''
        if (propiedades.Concepto?.title?.[0]?.plain_text) {
          concepto = propiedades.Concepto.title[0].plain_text.trim()
        } else if (page.properties.Name?.title?.[0]?.plain_text) {
          concepto = page.properties.Name.title[0].plain_text.trim()
        }

        // Monto (asegurar número)
        let monto = 0
        if (propiedades.Monto?.number !== undefined && propiedades.Monto?.number !== null) {
          monto = parseFloat(propiedades.Monto.number) || 0
        } else if (propiedades.Cantidad?.number !== undefined) {
          monto = parseFloat(propiedades.Cantidad.number) || 0
        }

        return {
          id: page.id,
          fecha: fecha,
          concepto: concepto,
          categoria: propiedades.Categoria?.select?.name || 'Sin categoría',
          metodo: propiedades.Metodo?.select?.name || 'Sin método',
          cuenta: propiedades.Cuenta?.select?.name || 'Sin cuenta',
          monto: monto,
          raw: propiedades // Para debugging
        }
      } catch (error) {
        console.error('Error procesando página:', page.id, error)
        return {
          id: page.id,
          fecha: null,
          concepto: 'Error procesando',
          categoria: 'Error',
          metodo: 'Error',
          cuenta: 'Error',
          monto: 0,
          error: error.message
        }
      }
    })

    // Filtrar cualquier error que pueda haberse generado
    const ingresosFiltrados = ingresos.filter(i => !i.error)

    return res.status(200).json(ingresosFiltrados)

  } catch (error) {
    console.error('Error en API de ingresos:', error)
    
    // Dar información útil para debugging
    let mensajeError = 'Error interno del servidor'
    let codigoError = 500
    
    if (error.message.includes('API token')) {
      mensajeError = 'Token de Notion inválido o expirado'
      codigoError = 401
    } else if (error.message.includes('database_id')) {
      mensajeError = 'ID de base de datos de Notion inválido'
      codigoError = 400
    } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      mensajeError = 'Error de conexión con Notion'
      codigoError = 503
    }
    
    return res.status(codigoError).json({ 
      error: mensajeError,
      details: error.message,
      type: error.name
    })
  }
}