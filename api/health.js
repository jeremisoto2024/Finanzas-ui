import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    // Verificar que tenemos las variables de entorno
    const config = {
      hasToken: !!process.env.NOTION_TOKEN,
      hasIncomeDB: !!process.env.NOTION_INCOME_DB,
      hasExpensesDB: !!process.env.NOTION_EXPENSES_DB,
      environment: process.env.VERCEL_ENV || 'development'
    }

    // Intentar una consulta simple para verificar la conexión
    if (config.hasToken && config.hasIncomeDB) {
      const notion = new Client({
        auth: process.env.NOTION_TOKEN,
      })

      // Consultar solo una página para verificar conexión
      await notion.databases.query({
        database_id: process.env.NOTION_INCOME_DB,
        page_size: 1,
      })

      return res.status(200).json({
        status: 'healthy',
        message: 'Conexión a Notion establecida correctamente',
        config: config,
        timestamp: new Date().toISOString()
      })
    } else {
      return res.status(200).json({
        status: 'misconfigured',
        message: 'Faltan variables de entorno',
        config: config,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Health check error:', error)
    
    return res.status(200).json({
      status: 'unhealthy',
      message: 'Error al conectar con Notion',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
