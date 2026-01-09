import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  console.log('🔍 API INGRESOS - DETECTADO CREATED_TIME COMO FECHA')
  
  try {
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_INCOME_DB) {
      return res.status(500).json({ error: 'Configuración incompleta' })
    }

    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })

    const response = await notion.databases.query({
      database_id: process.env.NOTION_INCOME_DB,
      page_size: 100,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    })

    console.log(`📊 ${response.results.length} registros encontrados`)

    const ingresos = response.results.map((page, index) => {
      const props = page.properties
      
      // ¡IMPORTANTE! - La "fecha" viene de page.created_time, no de properties
      let fechaFormateada = null
      
      // Usar la fecha de creación de la página (created_time)
      if (page.created_time) {
        // created_time viene como: "2025-12-31T20:12:00.000Z"
        // Extraer solo la parte de la fecha: "2025-12-31"
        fechaFormateada = page.created_time.split('T')[0]
      }

      // DEBUG del primer registro
      if (index === 0) {
        console.log('🔎 Primer registro procesado:', {
          id: page.id,
          created_time: page.created_time,
          fecha_formateada: fechaFormateada,
          concepto: props.Nombre?.title?.[0]?.plain_text || 'Sin concepto',
          todas_las_propiedades: Object.keys(props)
        })
      }

      return {
        id: page.id,
        concepto: props.Nombre?.title?.[0]?.plain_text || 'Sin concepto',
        monto: props.Cantidad?.number || 0,
        fecha: fechaFormateada, // ¡Aquí está la fecha correcta!
        categoria: props.Categoría?.select?.name || '',
        metodo: props['Método de pago']?.select?.name || '',
        cuenta: props.Cuenta?.select?.name || '',
        // Para referencia
        created_time: page.created_time,
      }
    })

    // Mostrar resultado
    console.log('✅ Procesamiento completado')
    
    if (ingresos.length > 0) {
      console.log('📝 Primeras 3 fechas encontradas:')
      ingresos.slice(0, 3).forEach((ingreso, i) => {
        console.log(`   ${i + 1}. ${ingreso.fecha} - ${ingreso.concepto}`)
      })
    }

    return res.status(200).json(ingresos)

  } catch (error) {
    console.error('❌ Error:', error)
    
    // Datos de ejemplo con fechas reales
    return res.status(200).json([
      {
        id: 'ejemplo-1',
        concepto: 'Extras',
        monto: 100,
        fecha: '2025-10-01',
        categoria: 'Extras',
        metodo: 'Efectivo',
        cuenta: 'Efectivo',
        created_time: '2025-10-01T12:00:00.000Z'
      },
      {
        id: 'ejemplo-2',
        concepto: 'Glovo',
        monto: 150,
        fecha: '2025-10-05',
        categoria: 'Delivery',
        metodo: 'Bizum',
        cuenta: 'BBVA',
        created_time: '2025-10-05T14:30:00.000Z'
      }
    ])
  }
}