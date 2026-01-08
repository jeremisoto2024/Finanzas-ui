export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_EXPENSES_DB}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    const gastos = data.results.map((item) => ({
      id: item.id,
      concepto: item.properties.Nombre.title[0]?.plain_text || '',
      monto: item.properties.Cantidad.number || 0,
      fecha: item.properties.Fecha.date?.start || null,
      categoria: item.properties.Categoría.select?.name || '',
      metodo: item.properties['Método de pago'].select?.name || ''
    }))

    res.status(200).json(gastos)
  } catch (error) {
    res.status(500).json({ error: 'Error cargando gastos' })
  }
}