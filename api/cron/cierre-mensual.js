import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// 🔐 Redondeo seguro EUR
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export default async function handler(req, res) {
  // Configurar timeout más largo para Vercel
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  try {
    console.log("🚀 Iniciando cierre mensual...");
    
    // Verificar que todas las variables de entorno estén definidas
    const requiredEnvVars = [
      'NOTION_RESUMEN_DB_ID',
      'NOTION_INCOME_DB',
      'NOTION_EXPENSES_DB',
      'NOTION_TOKEN'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error("❌ Variables de entorno faltantes:", missingVars);
      return res.status(500).json({
        error: "Variables de entorno faltantes",
        missing: missingVars
      });
    }
    
    const RESUMEN_DB_ID = process.env.NOTION_RESUMEN_DB_ID;
    const INCOME_DB_ID = process.env.NOTION_INCOME_DB;
    const EXPENSES_DB_ID = process.env.NOTION_EXPENSES_DB;
    
    console.log("✅ Variables de entorno verificadas");
    
    // 📅 Mes a cerrar (MES ACTUAL)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const mes = `${year}-${String(month + 1).padStart(2, "0")}`;
    
    console.log(`📅 Procesando mes: ${mes}`);
    
    // 1️⃣ Saldo inicial = saldo final del mes anterior
    let saldoInicial = 0;
    try {
      const resumenPrevio = await notion.databases.query({
        database_id: RESUMEN_DB_ID,
        sorts: [{ property: "Fecha creación", direction: "descending" }],
        page_size: 1,
      });
      
      if (resumenPrevio.results.length > 0) {
        const props = resumenPrevio.results[0].properties;
        saldoInicial = props["Saldo final"]?.number || 
                      props["saldo final"]?.number || 
                      props["Saldo Final"]?.number || 0;
        saldoInicial = round2(saldoInicial);
      }
      console.log(`💰 Saldo inicial: ${saldoInicial}`);
    } catch (error) {
      console.error("❌ Error obteniendo saldo inicial:", error.message);
      // Continuar con saldo inicial 0
    }
    
    // 2️⃣ Ingresos SOLO DEL MES ACTUAL
    let totalIngresos = 0;
    try {
      const startOfMonth = new Date(year, month, 1).toISOString();
      const startOfNextMonth = new Date(year, month + 1, 1).toISOString();
      
      const ingresos = await notion.databases.query({
        database_id: INCOME_DB_ID,
        filter: {
          and: [
            {
              property: "Fecha del ingreso",
              date: {
                on_or_after: startOfMonth,
              },
            },
            {
              property: "Fecha del ingreso",
              date: {
                before: startOfNextMonth,
              },
            },
          ],
        },
      });
      
      totalIngresos = round2(
        ingresos.results.reduce((sum, page) => {
          const props = page.properties;
          const cantidad = props.Cantidad?.number || 
                          props.cantidad?.number || 
                          props.Monto?.number || 0;
          return sum + cantidad;
        }, 0)
      );
      
      console.log(`📈 Total ingresos (mes ${mes}): ${totalIngresos}, registros: ${ingresos.results.length}`);
    } catch (error) {
      console.error("❌ Error obteniendo ingresos:", error.message);
      return res.status(500).json({
        error: "Error obteniendo ingresos",
        details: error.message
      });
    }
    
    // 3️⃣ Gastos de TODOS LOS MESES (históricos acumulados)
    let totalGastos = 0;
    try {
      const gastos = await notion.databases.query({
        database_id: EXPENSES_DB_ID,
        // Sin filtro para obtener todos los gastos históricos
      });
      
      totalGastos = round2(
        gastos.results.reduce((sum, page) => {
          const props = page.properties;
          const cantidad = props.Cantidad?.number || 
                          props.cantidad?.number || 
                          props.Monto?.number || 0;
          return sum + cantidad;
        }, 0)
      );
      
      console.log(`💸 Total gastos históricos: ${totalGastos}, registros: ${gastos.results.length}`);
    } catch (error) {
      console.error("❌ Error obteniendo gastos:", error.message);
      return res.status(500).json({
        error: "Error obteniendo gastos",
        details: error.message
      });
    }
    
    // 4️⃣ Calcular saldo final
    const saldoFinal = round2(saldoInicial + totalIngresos - totalGastos);
    
    console.log(`🧮 Cálculo final: ${saldoInicial} + ${totalIngresos} - ${totalGastos} = ${saldoFinal}`);
    
    // 5️⃣ Intentar obtener pagos fijos y cuotas (opcional)
    let totalPagosFijos = 0;
    let totalCuotas = 0;
    
    // Pagos fijos (opcional)
    if (process.env.NOTION_PAGOS_FIJOS_DATABASE_ID) {
      try {
        const pagosFijos = await notion.databases.query({
          database_id: process.env.NOTION_PAGOS_FIJOS_DATABASE_ID,
        });
        
        totalPagosFijos = round2(
          pagosFijos.results.reduce((sum, page) => {
            const props = page.properties;
            const cantidad = props.Cantidad?.number || 
                            props.cantidad?.number || 
                            props.Monto?.number || 
                            props.Valor?.number || 0;
            return sum + cantidad;
          }, 0)
        );
        
        console.log(`💳 Total pagos fijos históricos: ${totalPagosFijos}`);
      } catch (error) {
        console.error("⚠️ Error obteniendo pagos fijos (continuando...):", error.message);
      }
    }
    
    // Compras a cuotas (opcional)
    if (process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID) {
      try {
        const comprasCuotas = await notion.databases.query({
          database_id: process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID,
        });
        
        totalCuotas = round2(
          comprasCuotas.results.reduce((sum, page) => {
            const props = page.properties;
            // Para cuotas, podríamos necesitar lógica diferente
            const cantidad = props.Cantidad?.number || 
                            props.cantidad?.number || 
                            props.Monto?.number || 
                            props["Valor total"]?.number || 0;
            return sum + cantidad;
          }, 0)
        );
        
        console.log(`💳 Total cuotas históricas: ${totalCuotas}`);
      } catch (error) {
        console.error("⚠️ Error obteniendo cuotas (continuando...):", error.message);
      }
    }
    
    // 6️⃣ Guardar resumen mensual en Notion
    try {
      // Primero, verificar la estructura de la base de datos
      const databaseInfo = await notion.databases.retrieve({
        database_id: RESUMEN_DB_ID
      });
      
      console.log("📋 Propiedades disponibles en la base de datos:", Object.keys(databaseInfo.properties));
      
      // Preparar propiedades basadas en lo que existe
      const propiedades = {
        Mes: {
          title: [{ text: { content: mes } }]
        },
        "Saldo inicial": {
          number: saldoInicial
        },
        "Total ingresos": {
          number: totalIngresos
        },
        "Saldo final": {
          number: saldoFinal
        },
        "Fecha": {
          date: { start: now.toISOString() }
        }
      };
      
      // Solo agregar "Total gastos" si existe como propiedad
      if (databaseInfo.properties["Total gastos"]) {
        propiedades["Total gastos"] = { number: totalGastos };
      }
      
      await notion.pages.create({
        parent: { database_id: RESUMEN_DB_ID },
        properties: propiedades
      });
      
      console.log("✅ Resumen guardado exitosamente en Notion");
    } catch (error) {
      console.error("❌ Error guardando en Notion:", error.message);
      // Continuar y devolver datos aunque falle el guardado
    }
    
    // 7️⃣ Devolver respuesta exitosa
    return res.status(200).json({
      ok: true,
      mes,
      saldoInicial,
      totalIngresos,
      totalGastos,
      totalPagosFijos,
      totalCuotas,
      saldoFinal,
      calculo: {
        formula: `Saldo final = ${saldoInicial} (inicial) + ${totalIngresos} (ingresos mes) - ${totalGastos} (gastos históricos)`,
        resultado: saldoFinal
      }
    });
    
  } catch (error) {
    console.error("💥 ERROR CRÍTICO:", error);
    console.error("Stack trace:", error.stack);
    
    // Información adicional para debugging
    const envInfo = {
      NOTION_TOKEN: process.env.NOTION_TOKEN ? "✅ Definido" : "❌ No definido",
      NOTION_RESUMEN_DB_ID: process.env.NOTION_RESUMEN_DB_ID ? "✅ Definido" : "❌ No definido",
      NOTION_INCOME_DB: process.env.NOTION_INCOME_DB ? "✅ Definido" : "❌ No definido",
      NOTION_EXPENSES_DB: process.env.NOTION_EXPENSES_DB ? "✅ Definido" : "❌ No definido",
      NOTION_PAGOS_FIJOS_DATABASE_ID: process.env.NOTION_PAGOS_FIJOS_DATABASE_ID ? "✅ Definido" : "❌ No definido",
      NOTION_COMPRAS_CUOTAS_DATABASE_ID: process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID ? "✅ Definido" : "❌ No definido"
    };
    
    console.log("🔧 Estado de variables de entorno:", envInfo);
    
    return res.status(500).json({
      error: "Error interno en el servidor",
      message: error.message,
      env: process.env.NODE_ENV === 'development' ? envInfo : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}