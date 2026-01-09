// Este es un endpoint serverless de Vercel (no es parte de Vite)
import { Client } from '@notionhq/client'

export default async function handler(request, response) {
  // Configurar CORS
  response.setHeader('Access-Control-Allow-Credentials', true)
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE')
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (request.method === 'OPTIONS') {
    return response.status(200).end()
  }

  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Método no permitido' })
  }

  try {
    console.log('Iniciando consulta a Notion...')
    
    // Validar variables de entorno
    if (!process.env.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN no está configurado')
    }

    if (!process.env.NOTION_INCOME_DB) {
      throw new Error('NOTION_INCOME_DB no está configurado')
    }

    // Inicializar cliente de Notion
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })

    console.log('Consultando base de datos:', process.env.NOTION_INCOME_DB)

    // Consulta básica
    const queryResponse = await notion.databases.query({
      database_id: process.env.NOTION_INCOME_DB,
      page_size: 50,
    })

    console.log(`Se encontraron ${queryResponse.results.length} registros`)

    // Transformar datos
    const ingresos = queryResponse.results.map((page) => {
      const properties = page.properties
      
      // Extraer valores con manejo seguro
      const getTitle = (prop) => prop?.title?.[0]?.plain_text || ''
      const getNumber = (prop) => prop?.number || 0
      const getDate = (prop) => prop?.date?.start || null
      const getSelect = (prop) => prop?.select?.name || ''

      return {
        id: page.id,
        concepto: getTitle(properties.Concepto) || getTitle(properties.Name) || 'Sin concepto',
        monto: getNumber(properties.Monto) || getNumber(properties.Cantidad) || 0,
        fecha: getDate(properties.Fecha) || getDate(properties.Date) || null,
        categoria: getSelect(properties.Categoria) || getSelect(properties.Category) || 'Sin categoría',
        metodo: getSelect(properties.Metodo) || getSelect(properties.Método) || getSelect(properties.Method) || 'Sin método',
        cuenta: getSelect(properties.Cuenta) || getSelect(properties.Account) || 'Sin cuenta',
        created_time: page.created_time,
        last_edited_time: page.last_edited_time
      }
    })

    // Ordenar por fecha descendente
    ingresos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    return response.status(200).json(ingresos)

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      env: {
        hasToken: !!process.env.NOTION_TOKEN,
        hasDbId: !!process.env.NOTION_INCOME_DB,
        tokenLength: process.env.NOTION_TOKEN?.length
      }
    })

    // Devolver datos de ejemplo si hay error
    const fallbackData = [
      {
        id: 'demo-1',
        concepto: 'Salario mensual',
        monto: 2500,
        fecha: '2025-10-01',
        categoria: 'Salario',
        metodo: 'Transferencia',
        cuenta: 'BBVA',
        created_time: '2025-10-01T00:00:00.000Z',
        last_edited_time: '2025-10-01T00:00:00.000Z'
      },
      {
        id: 'demo-2',
        concepto: 'Trabajo freelance',
        monto: 450,
        fecha: '2025-10-05',
        categoria: 'Freelance',
        metodo: 'PayPal',
        cuenta: 'PayPal',
        created_time: '2025-10-05T00:00:00.000Z',
        last_edited_time: '2025-10-05T00:00:00.000Z'
      }
    ]

    return response.status(200).json(fallbackData)
  }
}