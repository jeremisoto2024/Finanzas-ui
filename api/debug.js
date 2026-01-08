export default async function handler(req, res) {
  console.log('=== DEBUG NOTION API ===');
  console.log('Fecha:', new Date().toISOString());
  console.log('Entorno:', process.env.VERCEL_ENV || 'development');
  
  // Listar variables de entorno (solo en desarrollo)
  const envInfo = {
    NOTION_TOKEN: process.env.NOTION_TOKEN ? '✓ Definido' : '✗ No definido',
    NOTION_INCOME_DB: process.env.NOTION_INCOME_DB ? '✓ Definido' : '✗ No definido',
    NOTION_EXPENSES_DB: process.env.NOTION_EXPENSES_DB ? '✓ Definido' : '✗ No definido',
  };
  
  console.log('Variables de entorno:', envInfo);
  
  // Intentar conectar con Notion
  const { Client } = await import('@notionhq/client');
  
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    
    console.log('Probando conexión con Notion...');
    
    // Probar consulta simple
    if (process.env.NOTION_INCOME_DB) {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_INCOME_DB,
        page_size: 1,
      });
      console.log('Conexión exitosa. Registros encontrados:', response.results.length);
    }
    
    res.status(200).json({
      status: 'ok',
      message: 'Debug completado',
      environment: envInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en debug:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      environment: envInfo,
      timestamp: new Date().toISOString()
    });
  }
}