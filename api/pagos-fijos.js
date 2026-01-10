import { Client } from '@notionhq/client'

const notion = new Client({ 
  auth: process.env.NOTION_TOKEN 
})

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const databaseId = process.env.NOTION_PAGOS_FIJOS_DATABASE_ID
      
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
          { property: 'Activo', direction: 'descending' },
          { property: 'Próximo pago', direction: 'ascending' }
        ]
      })

      const pagosFijos = response.results.map(page => ({
        id: page.id,
        nombre: page.properties.Nombre?.title[0]?.plain_text || '',
        monto: page.properties.Monto?.number || 0,
        metodo: page.properties['Método']?.select?.name || '',
        categoria: page.properties['Categoría']?.select?.name || '',
        frecuencia: page.properties.Frecuencia?.select?.name || 'mensual',
        fechaInicio: page.properties['Próximo pago']?.date?.start || '',
        activo: page.properties.Activo?.checkbox || false,
        notificacion: page.properties['Notificación']?.checkbox || false
      }))

      res.status(200).json(pagosFijos)
    } catch (error) {
      console.error('Error fetching pagos fijos:', error)
      res.status(500).json({ error: 'Error al obtener pagos fijos' })
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { nombre, monto, metodo, categoria, frecuencia, fechaInicio, notificacion } = req.body
      
      const response = await notion.pages.create({
        parent: { 
          database_id: process.env.NOTION_PAGOS_FIJOS_DATABASE_ID 
        },
        properties: {
          Nombre: {
            title: [{ text: { content: nombre } }]
          },
          Monto: { number: parseFloat(monto) },
          'Método': { select: { name: metodo } },
          'Categoría': { select: { name: categoria } },
          Frecuencia: { select: { name: frecuencia } },
          'Próximo pago': { date: { start: fechaInicio } },
          Activo: { checkbox: true },
          'Notificación': { checkbox: notificacion }
        }
      })

      const nuevoPago = {
        id: response.id,
        nombre,
        monto: parseFloat(monto),
        metodo,
        categoria,
        frecuencia,
        fechaInicio,
        activo: true,
        notificacion
      }

      res.status(201).json(nuevoPago)
    } catch (error) {
      console.error('Error creating pago fijo:', error)
      res.status(500).json({ error: 'Error al crear pago fijo' })
    }
  }

  else if (req.method === 'PATCH') {
    try {
      const { id, activo } = req.body
      
      const response = await notion.pages.update({
        page_id: id,
        properties: {
          Activo: { checkbox: activo }
        }
      })

      res.status(200).json({ 
        id: response.id, 
        activo: response.properties.Activo.checkbox 
      })
    } catch (error) {
      console.error('Error updating pago fijo:', error)
      res.status(500).json({ error: 'Error al actualizar pago fijo' })
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      
      const response = await notion.pages.update({
        page_id: id,
        archived: true
      })

      res.status(200).json({ 
        success: true, 
        id: response.id 
      })
    } catch (error) {
      console.error('Error deleting pago fijo:', error)
      res.status(500).json({ error: 'Error al eliminar pago fijo' })
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}