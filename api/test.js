export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  const testData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      node_version: process.version,
      platform: process.platform,
      NOTION_TOKEN: process.env.NOTION_TOKEN ? '✓ Definido' : '✗ No definido',
      NOTION_INCOME_DB: process.env.NOTION_INCOME_DB ? '✓ Definido' : '✗ No definido',
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers
    }
  }
  
  return res.status(200).json(testData)
}