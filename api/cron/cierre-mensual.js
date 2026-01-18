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
    
    // 4️⃣ Calcular saldo base final (sin pagos fijos y cuotas)
    const saldoBaseFinal = round2(saldoInicial + totalIngresos - totalGastos);
    
    console.log(`🧮 Cálculo base: ${saldoInicial} + ${totalIngresos} - ${totalGastos} = ${saldoBaseFinal}`);
    
    // 5️⃣ Intentar obtener pagos fijos (opcional)
    let totalPagosFijos = 0;
    
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
        
        console.log(`💳 Total pagos fijos históricos: ${totalPagosFijos}, registros: ${pagosFijos.results.length}`);
      } catch (error) {
        console.error("⚠️ Error obteniendo pagos fijos (continuando...):", error.message);
      }
    }
    
    // 6️⃣ Compras a cuotas - LEER HISTORIAL DE CUOTAS PAGADAS
    let totalCuotasPagadas = 0;
    
    if (process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID) {
      try {
        console.log(`📊 Leyendo compras a cuotas...`);
        const comprasCuotas = await notion.databases.query({
          database_id: process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID,
        });
        
        console.log(`📄 Encontradas ${comprasCuotas.results.length} compras a cuotas`);
        
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
              console.log(`📋 Historial encontrado en texto para "${concepto}":`, historialCuotas);
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
          
          // 3. Si no hay historial, intentar con cuotas pagadas/totales
          if (!historialCuotas) {
            const cuotasPagadas = props["Cuotas pagadas"]?.number || 0;
            const cuotasTotales = props["Cuotas totales"]?.number || 0;
            const montoTotal = props["Monto total"]?.number || 
                              props["monto total"]?.number ||
                              props["Monto Total"]?.number || 0;
            
            if (cuotasTotales > 0 && montoTotal > 0) {
              console.log(`ℹ️ "${concepto}": ${cuotasPagadas}/${cuotasTotales} cuotas pagadas, Monto total: ${montoTotal}`);
              
              // Calcular monto por cuota
              const montoPorCuota = montoTotal / cuotasTotales;
              totalCuotasPagadas += round2(montoPorCuota * cuotasPagadas);
            }
            continue;
          }
          
          // Procesar el historial de cuotas si se encontró
          if (Array.isArray(historialCuotas)) {
            console.log(`🔍 Procesando historial de cuotas para "${concepto}":`, historialCuotas);
            
            // Filtrar cuotas pagadas y sumar sus montos
            const cuotasPagadas = historialCuotas.filter(cuota => cuota.pagada === true);
            
            let montoTotalCuotasPagadas = 0;
            cuotasPagadas.forEach(cuota => {
              montoTotalCuotasPagadas += cuota.monto || 0;
            });
            
            totalCuotasPagadas += round2(montoTotalCuotasPagadas);
            
            console.log(`✓ "${concepto}": ${cuotasPagadas.length} cuotas pagadas, Total: €${montoTotalCuotasPagadas.toFixed(2)}`);
          }
        }
        
        console.log(`💳 Total cuotas pagadas (históricas): €${totalCuotasPagadas.toFixed(2)}`);
        
      } catch (error) {
        console.error("❌ Error obteniendo compras a cuotas:", error.message);
        console.error("Stack trace:", error.stack);
      }
    } else {
      console.log("ℹ️ NOTION_COMPRAS_CUOTAS_DATABASE_ID no está definida, omitiendo cuotas");
    }
    
    // 7️⃣ Calcular saldo final TOTAL (incluyendo pagos fijos y cuotas)
    const totalGastosConExtras = round2(totalGastos + totalPagosFijos + totalCuotasPagadas);
    const saldoFinalTotal = round2(saldoInicial + totalIngresos - totalGastosConExtras);
    
    console.log("\n📊 RESUMEN FINAL:");
    console.log(`💰 Saldo inicial: €${saldoInicial.toFixed(2)}`);
    console.log(`📈 Ingresos mes ${mes}: €${totalIngresos.toFixed(2)}`);
    console.log(`💸 Gastos históricos: €${totalGastos.toFixed(2)}`);
    console.log(`💳 Pagos fijos históricos: €${totalPagosFijos.toFixed(2)}`);
    console.log(`💳 Cuotas pagadas históricas: €${totalCuotasPagadas.toFixed(2)}`);
    console.log(`🧮 Total gastos: €${totalGastosConExtras.toFixed(2)}`);
    console.log(`💰 Saldo final total: €${saldoFinalTotal.toFixed(2)}`);
    
    // 8️⃣ Guardar resumen mensual en Notion
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
        "Saldo final": {
          number: saldoFinalTotal
        },
        "Fecha creación": {
          date: { start: now.toISOString() }
        }
      };
      
      // Agregar propiedades adicionales si existen
      const propsToAdd = {
        "Total gastos": totalGastos,
        "Pagos fijos": totalPagosFijos,
        "Cuotas pagadas": totalCuotasPagadas
      };
      
      // Intentar agregar cada propiedad (solo si existe en la base de datos)
      Object.entries(propsToAdd).forEach(([propName, value]) => {
        propiedades[propName] = { number: value };
      });
      
      await notion.pages.create({
        parent: { database_id: RESUMEN_DB_ID },
        properties: propiedades
      });
      
      console.log("✅ Resumen guardado exitosamente en Notion");
    } catch (error) {
      console.error("❌ Error guardando en Notion:", error.message);
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
      totalCuotasPagadas,
      saldoFinalTotal,
      calculo: {
        formula: `Saldo final = ${saldoInicial} (inicial) + ${totalIngresos} (ingresos mes) - (${totalGastos} + ${totalPagosFijos} + ${totalCuotasPagadas})`,
        resultado: saldoFinalTotal
      },
      cuotas: {
        nota: "Suma solo cuotas con pagada: true en el historial",
        total_cuotas_pagadas: totalCuotasPagadas
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