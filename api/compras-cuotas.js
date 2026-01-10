import { Client } from '@notionhq/client'

const notion = new Client({ 
  auth: process.env.NOTION_TOKEN 
})

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const databaseId = process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID
      
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [
          { property: 'Activo', direction: 'descending' },
          { property: 'Fecha Inicio', direction: 'ascending' }
        ]
      })

      const comprasCuotas = response.results.map(page => {
        // Parsear historial de cuotas desde JSON string
        const historialText = page.properties['Historial Cuotas']?.rich_text[0]?.plain_text || '[]'
        let historialCuotas = []
        try {
          historialCuotas = JSON.parse(historialText)
        } catch (e) {
          console.error('Error parsing historial:', e)
        }

        return {
          id: page.id,
          concepto: page.properties.Concepto?.title[0]?.plain_text || '',
          montoTotal: page.properties['Monto Total']?.number || 0,
          cuotasTotales: page.properties['Cuotas Totales']?.number || 0,
          cuotasPagadas: page.properties['Cuotas Pagadas']?.number || 0,
          montoPrimeraCuota: page.properties['Monto Primera Cuota']?.number || 0,
          montoUltimaCuota: page.properties['Monto Última Cuota']?.number || 0,
          tipoCuotas: page.properties['Tipo Cuotas']?.select?.name || 'fijas',
          fechaInicio: page.properties['Fecha Inicio']?.date?.start || '',
          metodo: page.properties['Método']?.select?.name || '',
          categoria: page.properties['Categoría']?.select?.name || '',
          frecuenciaPago: page.properties['Frecuencia Pago']?.select?.name || 'mensual',
          activo: page.properties.Activo?.checkbox || false,
          historialCuotas
        }
      })

      res.status(200).json(comprasCuotas)
    } catch (error) {
      console.error('Error fetching compras cuotas:', error)
      res.status(500).json({ error: 'Error al obtener compras a cuotas' })
    }
  }
  
  else if (req.method === 'POST') {
    try {
      const { 
        concepto, 
        montoTotal, 
        cuotasTotales, 
        cuotasPagadas, 
        montoPrimeraCuota, 
        montoUltimaCuota, 
        fechaInicio, 
        metodo, 
        categoria, 
        frecuenciaPago,
        historialCuotas 
      } = req.body
      
      const response = await notion.pages.create({
        parent: { 
          database_id: process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID 
        },
        properties: {
          Concepto: {
            title: [{ text: { content: concepto } }]
          },
          'Monto Total': { number: parseFloat(montoTotal) },
          'Cuotas Totales': { number: parseInt(cuotasTotales) },
          'Cuotas Pagadas': { number: parseInt(cuotasPagadas) },
          'Monto Primera Cuota': { number: parseFloat(montoPrimeraCuota) || 0 },
          'Monto Última Cuota': { number: parseFloat(montoUltimaCuota) || 0 },
          'Tipo Cuotas': { select: { name: montoPrimeraCuota && montoUltimaCuota ? 'decrecientes' : 'fijas' } },
          'Fecha Inicio': { date: { start: fechaInicio } },
          'Método': { select: { name: metodo } },
          'Categoría': { select: { name: categoria } },
          'Frecuencia Pago': { select: { name: frecuenciaPago } },
          Activo: { checkbox: true },
          'Historial Cuotas': {
            rich_text: [{ 
              text: { content: JSON.stringify(historialCuotas || []) } 
            }]
          }
        }
      })

      const nuevaCompra = {
        id: response.id,
        concepto,
        montoTotal: parseFloat(montoTotal),
        cuotasTotales: parseInt(cuotasTotales),
        cuotasPagadas: parseInt(cuotasPagadas),
        montoPrimeraCuota: parseFloat(montoPrimeraCuota) || 0,
        montoUltimaCuota: parseFloat(montoUltimaCuota) || 0,
        tipoCuotas: montoPrimeraCuota && montoUltimaCuota ? 'decrecientes' : 'fijas',
        fechaInicio,
        metodo,
        categoria,
        frecuenciaPago,
        activo: true,
        historialCuotas: historialCuotas || []
      }

      res.status(201).json(nuevaCompra)
    } catch (error) {
      console.error('Error creating compra cuotas:', error)
      res.status(500).json({ error: 'Error al crear compra a cuotas' })
    }
  }

  else if (req.method === 'PATCH') {
    try {
      const { id, cuotasPagadas, historialCuotas, activo } = req.body
      
      const properties = {}
      
      if (cuotasPagadas !== undefined) {
        properties['Cuotas Pagadas'] = { number: cuotasPagadas }
      }
      
      if (historialCuotas !== undefined) {
        properties['Historial Cuotas'] = {
          rich_text: [{ text: { content: JSON.stringify(historialCuotas) } }]
        }
      }
      
      if (activo !== undefined) {
        properties.Activo = { checkbox: activo }
      }

      const response = await notion.pages.update({
        page_id: id,
        properties
      })

      res.status(200).json({ 
        success: true, 
        id: response.id 
      })
    } catch (error) {
      console.error('Error updating compra cuotas:', error)
      res.status(500).json({ error: 'Error al actualizar compra a cuotas' })
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
      console.error('Error deleting compra cuotas:', error)
      res.status(500).json({ error: 'Error al eliminar compra a cuotas' })
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}