export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_INCOME_DB}/query`,
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

    const ingresos = data.results.map((item) => ({
      id: item.id,
      nombre: item.properties.Nombre.title[0]?.plain_text || '',
      cantidad: item.properties.Cantidad.number || 0,
      fecha: item.properties['Fecha del ingreso'].date?.start || null,
      categoria: item.properties.Categoría.select?.name || '',
      metodo: item.properties['Método de pago'].select?.name || '',
      cuenta: item.properties.Cuenta.select?.name || ''
    }))

    res.status(200).json(ingresos)
  } catch (error) {
    res.status(500).json({ error: 'Error cargando ingresos' })
  }
}