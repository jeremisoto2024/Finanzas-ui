import { Client } from '@notionhq/client'

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    // Validar que existan las variables de entorno
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_INCOME_DB) {
      console.error('Configuración faltante:', {
        hasToken: !!process.env.NOTION_TOKEN,
        hasDbId: !!process.env.NOTION_INCOME_DB
      })
      return res.status(500).json({ 
        error: 'Configuración incompleta',
        message: 'Faltan variables de entorno de Notion'
      })
    }

    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    })

    console.log('Consultando base de datos de ingresos:', process.env.NOTION_INCOME_DB)

    // Obtener la estructura de la base de datos primero (para debug)
    try {
      const database = await notion.databases.retrieve({
        database_id: process.env.NOTION_INCOME_DB,
      })
      console.log('Propiedades de la base de datos:', Object.keys(database.properties))
    } catch (dbError) {
      console.error('Error obteniendo estructura de la base de datos:', dbError.message)
    }

    // Consultar los datos
    const response = await notion.databases.query({
      database_id: process.env.NOTION_INCOME_DB,
      page_size: 100, // Ajusta según necesites
      sorts: [
        {
          property: 'Fecha del ingreso',
          direction: 'descending',
        },
      ],
    })

    console.log(`Notion devolvió ${response.results.length} registros`)

    // Mapear los datos al formato que espera el frontend
    const ingresos = response.results.map(page => {
      const props = page.properties
      
      // Debug: Mostrar las propiedades disponibles
      if (response.results.indexOf(page) === 0) {
        console.log('Primer registro - propiedades:', Object.keys(props))
        console.log('Estructura de propiedades:', {
          Nombre: props.Nombre,
          Cantidad: props.Cantidad,
          'Fecha del ingreso': props['Fecha del ingreso'],
          Categoría: props.Categoría,
          'Método de pago': props['Método de pago'],
          Cuenta: props.Cuenta
        })
      }

      // Función auxiliar para obtener valores de forma segura
      const getTitle = (property) => {
        if (!property || !property.title || !property.title[0]) return ''
        return property.title[0].plain_text || ''
      }

      const getNumber = (property) => {
        if (!property || property.number === undefined) return 0
        return property.number || 0
      }

      const getDate = (property) => {
        if (!property || !property.date) return null
        return property.date.start || null
      }

      const getSelect = (property) => {
        if (!property || !property.select) return ''
        return property.select.name || ''
      }

      // Mapear propiedades de Notion al formato del frontend
      return {
        id: page.id,
        // Mapear "Nombre" (de Notion) a "concepto" (que espera el frontend)
        concepto: getTitle(props.Nombre) || 
                 getTitle(props.Concepto) || 
                 getTitle(props.Name) || 
                 'Sin concepto',
        
        // Mapear "Cantidad" (de Notion) a "monto" (que espera el frontend)
        monto: getNumber(props.Cantidad) || 
               getNumber(props.Monto) || 
               getNumber(props['Monto total']) || 
               0,
        
        // Mantener fecha
        fecha: getDate(props['Fecha del ingreso']) || 
               getDate(props.Fecha) || 
               getDate(props.Date) || 
               null,
        
        // Categoría
        categoria: getSelect(props.Categoría) || 
                   getSelect(props.Category) || 
                   getSelect(props.Categoria) || 
                   '',
        
        // Método (mapear "Método de pago" a "metodo")
        metodo: getSelect(props['Método de pago']) || 
                getSelect(props.Método) || 
                getSelect(props.Metodo) || 
                getSelect(props.Method) || 
                '',
        
        // Cuenta
        cuenta: getSelect(props.Cuenta) || 
                getSelect(props.Account) || 
                '',
        
        // Propiedades originales para debug (solo en desarrollo)
        ...(process.env.NODE_ENV === 'development' && {
          _debug: {
            nombreOriginal: getTitle(props.Nombre),
            cantidadOriginal: getNumber(props.Cantidad),
            fechaOriginal: getDate(props['Fecha del ingreso']),
            categoriaOriginal: getSelect(props.Categoría),
            metodoOriginal: getSelect(props['Método de pago']),
            cuentaOriginal: getSelect(props.Cuenta)
          }
        })
      }
    })

    console.log('Datos mapeados. Primer ingreso:', {
      id: ingresos[0]?.id,
      concepto: ingresos[0]?.concepto,
      monto: ingresos[0]?.monto,
      fecha: ingresos[0]?.fecha,
      categoria: ingresos[0]?.categoria,
      metodo: ingresos[0]?.metodo,
      cuenta: ingresos[0]?.cuenta
    })

    // Filtrar posibles registros vacíos
    const ingresosFiltrados = ingresos.filter(ingreso => 
      ingreso.concepto && ingreso.concepto !== 'Sin concepto'
    )

    console.log(`Total de registros después de filtrar: ${ingresosFiltrados.length}`)

    return res.status(200).json(ingresosFiltrados)

  } catch (error) {
    console.error('Error detallado en API de ingresos:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    })

    // Datos de ejemplo para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('Devolviendo datos de ejemplo para desarrollo...')
      
      const ingresosEjemplo = [
        {
          id: 'ejemplo-1',
          concepto: 'Salario mensual',
          monto: 2500,
          fecha: '2025-10-01',
          categoria: 'Sueldo',
          metodo: 'Transferencia',
          cuenta: 'BBVA'
        },
        {
          id: 'ejemplo-2',
          concepto: 'Trabajo freelance',
          monto: 450,
          fecha: '2025-10-05',
          categoria: 'Freelance',
          metodo: 'PayPal',
          cuenta: 'PayPal'
        },
        {
          id: 'ejemplo-3',
          concepto: 'Venta de artículos',
          monto: 120,
          fecha: '2025-10-10',
          categoria: 'Ventas',
          metodo: 'Bizum',
          cuenta: 'Revolut'
        }
      ]
      
      return res.status(200).json(ingresosEjemplo)
    }

    return res.status(500).json({ 
      error: 'Error al cargar ingresos desde Notion',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Contacta al administrador',
      suggestion: 'Verifica que la base de datos de Notion tenga las propiedades correctas'
    })
  }
}