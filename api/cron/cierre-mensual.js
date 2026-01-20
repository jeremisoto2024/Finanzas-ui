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
    
    // Fechas para filtrar solo el mes actual
    const startOfMonth = new Date(year, month, 1);
    const startOfNextMonth = new Date(year, month + 1, 1);
    
    console.log(`📅 Procesando mes: ${mes}`);
    console.log(`📆 Rango: ${startOfMonth.toISOString()} → ${startOfNextMonth.toISOString()}`);
    
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
      console.log(`💰 Saldo inicial (del mes anterior): ${saldoInicial}`);
    } catch (error) {
      console.error("❌ Error obteniendo saldo inicial:", error.message);
      // Continuar con saldo inicial 0
    }
    
    // 2️⃣ Ingresos SOLO DEL MES ACTUAL (✅ ya correcto)
    let totalIngresos = 0;
    try {
      const ingresos = await notion.databases.query({
        database_id: INCOME_DB_ID,
        filter: {
          and: [
            {
              property: "Fecha del ingreso",
              date: {
                on_or_after: startOfMonth.toISOString(),
              },
            },
            {
              property: "Fecha del ingreso",
              date: {
                before: startOfNextMonth.toISOString(),
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
    
    // 3️⃣ Gastos SOLO DEL MES ACTUAL (✅ ahora correcto)
    let totalGastos = 0;
    try {
      const gastos = await notion.databases.query({
        database_id: EXPENSES_DB_ID,
        filter: {
          and: [
            {
              property: "Fecha del gasto", // ⚠️ usa el nombre exacto en Notion
              date: {
                on_or_after: startOfMonth.toISOString(),
              },
            },
            {
              property: "Fecha del gasto",
              date: {
                before: startOfNextMonth.toISOString(),
              },
            },
          ],
        },
      });

      totalGastos = round2(
        gastos.results.reduce((sum, page) => {
          const props = page.properties;
          const cantidad =
            props.Cantidad?.number ||
            props.cantidad?.number ||
            props.Monto?.number ||
            0;
          return sum + cantidad;
        }, 0)
      );

      console.log(
        `💸 Gastos mes ${mes}: ${totalGastos}, registros: ${gastos.results.length}`
      );
    } catch (error) {
      console.error("❌ Error obteniendo gastos:", error.message);
      return res.status(500).json({
        error: "Error obteniendo gastos",
        details: error.message,
      });
    }
    
    // 4️⃣ Pagos fijos SOLO DEL MES ACTUAL (✅ ahora correcto)
    let totalPagosFijos = 0;
    if (process.env.NOTION_PAGOS_FIJOS_DATABASE_ID) {
      try {
        const pagosFijos = await notion.databases.query({
          database_id: process.env.NOTION_PAGOS_FIJOS_DATABASE_ID,
          filter: {
            and: [
              {
                property: "Fecha creación",
                date: {
                  on_or_after: startOfMonth.toISOString(),
                },
              },
              {
                property: "Fecha creación",
                date: {
                  before: startOfNextMonth.toISOString(),
                },
              },
            ],
          },
        });

        totalPagosFijos = round2(
          pagosFijos.results.reduce((sum, page) => {
            const props = page.properties;
            const cantidad =
              props.Cantidad?.number ||
              props.Monto?.number ||
              props.Valor?.number ||
              0;
            return sum + cantidad;
          }, 0)
        );

        console.log(
          `💳 Pagos fijos mes ${mes}: ${totalPagosFijos}, registros: ${pagosFijos.results.length}`
        );
      } catch (error) {
        console.error("⚠️ Error obteniendo pagos fijos:", error.message);
      }
    } else {
      console.log("⚠️ NOTION_PAGOS_FIJOS_DATABASE_ID no definida");
    }
    
    // 5️⃣ Compras a cuotas - SOLO CUOTAS PAGADAS EN EL MES ACTUAL ✅ (corregido)
    let totalCuotasPagadasMes = 0; // Cambié el nombre para ser más claro
    
    if (process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID) {
      try {
        console.log(`📊 Leyendo compras a cuotas para el mes ${mes}...`);
        const comprasCuotas = await notion.databases.query({
          database_id: process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID,
        });
        
        console.log(`📄 Encontradas ${comprasCuotas.results.length} compras a cuotas`);
        
        // Función para verificar si una fecha está en el mes actual
        const fechaEnMesActual = (fechaString) => {
          try {
            const fechaCuota = new Date(fechaString);
            return fechaCuota >= startOfMonth && fechaCuota < startOfNextMonth;
          } catch (e) {
            return false;
          }
        };
        
        // Procesar cada compra a cuotas
        for (let i = 0; i < comprasCuotas.results.length; i++) {
          const compra = comprasCuotas.results[i];
          const props = compra.properties;
          
          // Obtener el concepto de la compra
          const concepto = props.Concepto?.title?.[0]?.text?.content || 
                          props.concepto?.title?.[0]?.text?.content || 
                          props.Nombre?.title?.[0]?.text?.content || 
                          "Compra sin nombre";
          
          // Intentar obtener el historial de cuotas de diferentes maneras
          let historialCuotas = null;
          
          // 1. Buscar en propiedad "Historial Cuotas" como rich text
          const historialTexto = props["Historial Cuotas"]?.rich_text?.[0]?.plain_text ||
                                props["historial cuotas"]?.rich_text?.[0]?.plain_text ||
                                props["Historial cuotas"]?.rich_text?.[0]?.plain_text;
          
          if (historialTexto) {
            try {
              historialCuotas = JSON.parse(historialTexto);
              console.log(`📋 Historial encontrado para "${concepto}" (${historialCuotas.length} cuotas)`);
            } catch (parseError) {
              console.error(`❌ Error parseando JSON de "${concepto}":`, parseError.message);
            }
          }
          
          // 2. Buscar en propiedad "Cuotas" o similar
          if (!historialCuotas) {
            const cuotasTexto = props.Cuotas?.rich_text?.[0]?.plain_text ||
                               props.cuotas?.rich_text?.[0]?.plain_text ||
                               props["Plan de pagos"]?.rich_text?.[0]?.plain_text;
            
            if (cuotasTexto) {
              try {
                historialCuotas = JSON.parse(cuotasTexto);
                console.log(`📋 Historial encontrado en "Cuotas" para "${concepto}"`);
              } catch (parseError) {
                console.error(`❌ Error parseando JSON de "Cuotas" para "${concepto}":`, parseError.message);
              }
            }
          }
          
          // Si no hay historial, no podemos calcular cuotas pagadas en este mes específico
          if (!historialCuotas || !Array.isArray(historialCuotas)) {
            console.log(`ℹ️ "${concepto}" no tiene historial de cuotas en formato JSON, se omite.`);
            continue;
          }
          
          // Procesar el historial de cuotas
          console.log(`🔍 Procesando historial de cuotas para "${concepto}":`);
          
          // Filtrar cuotas pagadas EN EL MES ACTUAL
          const cuotasPagadasMes = historialCuotas.filter(cuota => {
            // La cuota debe estar pagada y tener fecha
            if (!cuota.pagada || !cuota.fecha) {
              return false;
            }
            
            // Verificar que la fecha esté en el mes actual
            return fechaEnMesActual(cuota.fecha);
          });
          
          // Sumar montos de cuotas pagadas en el mes actual
          let montoCuotasMes = 0;
          cuotasPagadasMes.forEach(cuota => {
            montoCuotasMes += cuota.monto || 0;
          });
          
          if (cuotasPagadasMes.length > 0) {
            totalCuotasPagadasMes += round2(montoCuotasMes);
            console.log(`✓ "${concepto}": ${cuotasPagadasMes.length} cuotas pagadas este mes, Total: €${montoCuotasMes.toFixed(2)}`);
          }
        }
        
        console.log(`💳 Total cuotas pagadas en ${mes}: €${totalCuotasPagadasMes.toFixed(2)}`);
        
      } catch (error) {
        console.error("❌ Error obteniendo compras a cuotas:", error.message);
        console.error("Stack trace:", error.stack);
      }
    } else {
      console.log("ℹ️ NOTION_COMPRAS_CUOTAS_DATABASE_ID no está definida, omitiendo cuotas");
    }
    
    // 6️⃣ Calcular gastos totales DEL MES (suma de todo)
    const totalGastosDelMes = round2(totalGastos + totalPagosFijos + totalCuotasPagadasMes);
    
    // 7️⃣ Calcular saldo final TOTAL
    const saldoFinalTotal = round2(saldoInicial + totalIngresos - totalGastosDelMes);
    
    console.log("\n📊 RESUMEN FINAL DEL MES:");
    console.log(`💰 Saldo inicial: €${saldoInicial.toFixed(2)}`);
    console.log(`📈 Ingresos mes ${mes}: €${totalIngresos.toFixed(2)}`);
    console.log(`💸 Gastos del mes: €${totalGastos.toFixed(2)}`);
    console.log(`💳 Pagos fijos del mes: €${totalPagosFijos.toFixed(2)}`);
    console.log(`💳 Cuotas pagadas este mes: €${totalCuotasPagadasMes.toFixed(2)}`);
    console.log(`🧮 TOTAL GASTOS DEL MES: €${totalGastosDelMes.toFixed(2)}`);
    console.log(`💰 Saldo final total: €${saldoFinalTotal.toFixed(2)}`);
    
    // 8️⃣ Guardar resumen mensual en Notion (SOLO propiedades que existen)
    try {
      // Preparar propiedades para Notion
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
        "Total gastos": { // ← Esto es lo MÁS IMPORTANTE: la suma de todos los gastos del mes
          number: totalGastosDelMes
        },
        "Saldo final": {
          number: saldoFinalTotal
        },
        "Fecha creación": {
          date: { start: now.toISOString() }
        }
      };
      
      // NO agregar propiedades adicionales si no existen en tu DB de resumen
      // Solo mantenemos las propiedades básicas que SÍ tienes
      
      console.log("📝 Guardando en Resumen Mensual con propiedades:", Object.keys(propiedades));
      
      await notion.pages.create({
        parent: { database_id: RESUMEN_DB_ID },
        properties: propiedades
      });
      
      console.log("✅ Resumen guardado exitosamente en Notion");
    } catch (error) {
      console.error("❌ Error guardando en Notion:", error.message);
      // Sugerencia específica
      if (error.message.includes("is not a property")) {
        console.error("💡 SOLUCIÓN: Asegúrate de tener estas propiedades en tu DB 'Resumen Mensual':");
        console.error("   - Mes (Title)");
        console.error("   - Saldo inicial (Number)");
        console.error("   - Total ingresos (Number)");
        console.error("   - Total gastos (Number) ← MÁS IMPORTANTE");
        console.error("   - Saldo final (Number)");
        console.error("   - Fecha creación (Date)");
      }
      // Continuar y devolver datos aunque falle el guardado
    }
    
    // 9️⃣ Devolver respuesta exitosa
    return res.status(200).json({
      ok: true,
      mes,
      saldoInicial,
      totalIngresos,
      totalGastos,
      totalPagosFijos,
      totalCuotasPagadas: totalCuotasPagadasMes,
      totalGastosDelMes, // ← Nuevo: suma de todos los gastos del mes
      saldoFinalTotal,
      calculo: {
        formula: `Saldo final = ${saldoInicial} (inicial) + ${totalIngresos} (ingresos mes) - (${totalGastos} + ${totalPagosFijos} + ${totalCuotasPagadasMes})`,
        resultado: saldoFinalTotal
      },
      cuotas: {
        nota: "Solo cuotas con pagada: true y fecha dentro del mes actual",
        total_cuotas_pagadas_mes: totalCuotasPagadasMes
      },
      debug: {
        rango_mes: {
          inicio: startOfMonth.toISOString(),
          fin: startOfNextMonth.toISOString()
        }
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