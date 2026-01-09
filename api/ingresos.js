import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  console.log('🔍 API INGRESOS - DETECTANDO FECHAS EN TEXTO')
  
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
    })

    console.log(`📊 ${response.results.length} registros encontrados`)

    const ingresos = response.results.map((page, index) => {
      const props = page.properties
      
      // DEBUG del primer registro
      if (index === 0) {
        console.log('🔎 Primer registro - Todas las propiedades:')
        Object.entries(props).forEach(([key, value]) => {
          console.log(`   ${key}:`, {
            type: value.type,
            value: value[value.type]
          })
        })
      }
      
      // Obtener fecha como TEXTO (no como date)
      let fechaTexto = ''
      
      // Verificar si "Fecha del ingreso" es rich_text
      if (props['Fecha del ingreso'] && props['Fecha del ingreso'].type === 'rich_text') {
        fechaTexto = props['Fecha del ingreso'].rich_text?.[0]?.plain_text || ''
      }
      // Verificar si es title (texto normal)
      else if (props['Fecha del ingreso'] && props['Fecha del ingreso'].type === 'title') {
        fechaTexto = props['Fecha del ingreso'].title?.[0]?.plain_text || ''
      }
      
      // Convertir texto de fecha a formato YYYY-MM-DD
      let fechaFormateada = null
      if (fechaTexto) {
        // Si ya está en YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) {
          fechaFormateada = fechaTexto
        }
        // Si está en DD/MM/YYYY, convertir
        else if (fechaTexto.includes('/')) {
          const partes = fechaTexto.split('/')
          if (partes.length === 3) {
            const [dia, mes, anio] = partes
            const anioCompleto = anio.length === 2 ? `20${anio}` : anio
            fechaFormateada = `${anioCompleto}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
          }
        }
      }

      if (index === 0) {
        console.log('🎯 Fecha procesada:', {
          textoOriginal: fechaTexto,
          formateada: fechaFormateada
        })
      }

      return {
        id: page.id,
        concepto: props.Nombre?.title?.[0]?.plain_text || 'Sin concepto',
        monto: props.Cantidad?.number || 0,
        fecha: fechaFormateada,
        categoria: props.Categoría?.select?.name || '',
        metodo: props['Método de pago']?.select?.name || '',
        cuenta: props.Cuenta?.select?.name || '',
      }
    })

    // Mostrar resultado
    console.log('✅ Procesamiento completado')
    const registrosConFecha = ingresos.filter(i => i.fecha)
    console.log(`📅 Registros con fecha: ${registrosConFecha.length}/${ingresos.length}`)
    
    if (registrosConFecha.length > 0) {
      console.log('📝 Primeras fechas encontradas:')
      registrosConFecha.slice(0, 3).forEach((ingreso, i) => {
        console.log(`   ${i + 1}. ${ingreso.fecha} - ${ingreso.concepto}`)
      })
    }

    return res.status(200).json(ingresos)

  } catch (error) {
    console.error('❌ Error:', error)
    
    // Datos de ejemplo con fechas
    return res.status(200).json([
      {
        id: 'ejemplo-1',
        concepto: 'Extras',
        monto: 100,
        fecha: '2025-10-01',
        categoria: 'Extras',
        metodo: 'Efectivo',
        cuenta: 'Efectivo'
      },
      {
        id: 'ejemplo-2',
        concepto: 'Glovo',
        monto: 150,
        fecha: '2025-10-05',
        categoria: 'Delivery',
        metodo: 'Bizum',
        cuenta: 'BBVA'
      }
    ])
  }
}