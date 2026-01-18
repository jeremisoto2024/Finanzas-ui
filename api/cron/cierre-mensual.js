import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const RESUMEN_DB_ID = process.env.NOTION_RESUMEN_DB_ID;
const INCOME_DB_ID = process.env.NOTION_INCOME_DB;
const EXPENSES_DB_ID = process.env.NOTION_EXPENSES_DB;
const PAGOS_FIJOS_DB_ID = process.env.NOTION_PAGOS_FIJOS_DATABASE_ID;
const COMPRAS_CUOTAS_DB_ID = process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID;

// 🔐 Redondeo seguro EUR
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export default async function handler(req, res) {
  try {
    // 📅 Mes a cerrar (MES ACTUAL)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    const startOfMonth = new Date(year, month, 1).toISOString();
    const startOfNextMonth = new Date(year, month + 1, 1).toISOString();

    const mes = `${year}-${String(month + 1).padStart(2, "0")}`;

    console.log(`🔍 Iniciando cierre para mes: ${mes}`);

    // 1️⃣ Saldo inicial = saldo final del mes anterior
    const resumenPrevio = await notion.databases.query({
      database_id: RESUMEN_DB_ID,
      sorts: [{ property: "Fecha creación", direction: "descending" }],
      page_size: 1,
    });

    const saldoInicial = round2(
      resumenPrevio.results.length > 0
        ? resumenPrevio.results[0].properties["Saldo final"]?.number || 0
        : 0
    );
    console.log(`💰 Saldo inicial: ${saldoInicial}`);

    // 2️⃣ Ingresos SOLO DEL MES ACTUAL
    const ingresos = await notion.databases.query({
      database_id: INCOME_DB_ID,
      filter: {
        property: "Fecha del ingreso",
        date: {
          on_or_after: startOfMonth,
          before: startOfNextMonth,
        },
      },
    });

    const totalIngresos = round2(
      ingresos.results.reduce(
        (s, p) => s + (p.properties?.Cantidad?.number || 0),
        0
      )
    );
    console.log(`📈 Total ingresos (mes actual): ${totalIngresos}, registros: ${ingresos.results.length}`);

    // 3️⃣ Gastos de TODOS LOS MESES (históricos acumulados)
    console.log(`📝 Leyendo gastos históricos...`);
    const gastos = await notion.databases.query({
      database_id: EXPENSES_DB_ID,
    });

    const totalGastosBase = round2(
      gastos.results.reduce(
        (s, p) => {
          const monto = p.properties?.Cantidad?.number || 0;
          return s + monto;
        },
        0
      )
    );
    console.log(`💸 Total gastos base (históricos): ${totalGastosBase}, registros: ${gastos.results.length}`);

    // 4️⃣ Pagos fijos de TODOS LOS MESES (históricos acumulados)
    let totalPagosFijos = 0;
    console.log(`📝 Leyendo pagos fijos históricos...`);
    
    if (PAGOS_FIJOS_DB_ID) {
      try {
        const pagosFijos = await notion.databases.query({
          database_id: PAGOS_FIJOS_DB_ID,
        });

        console.log(`🔍 Pagos fijos encontrados: ${pagosFijos.results.length}`);
        
        totalPagosFijos = round2(
          pagosFijos.results.reduce((s, p) => {
            // Buscar el monto en diferentes propiedades posibles
            const propiedades = p.properties;
            
            // Intentar diferentes nombres de propiedades
            const monto = 
              propiedades?.Monto?.number || 
              propiedades?.monto?.number ||
              propiedades?.Cantidad?.number ||
              propiedades?.cantidad?.number ||
              propiedades?.Importe?.number ||
              propiedades?.importe?.number ||
              propiedades?.Monto total?.number ||
              propiedades?.["Monto total"]?.number ||
              0;

            if (monto > 0) {
              console.log(`📄 Pago fijo encontrado: ${propiedades?.Nombre?.title?.[0]?.text?.content || 'Sin nombre'}, Monto: ${monto}`);
            }

            return s + monto;
          }, 0)
        );

        console.log(`💳 Total pagos fijos (históricos): ${totalPagosFijos}`);
      } catch (error) {
        console.error(`❌ Error leyendo pagos fijos: ${error.message}`);
      }
    } else {
      console.log(`⚠️ PAGOS_FIJOS_DB_ID no definida`);
    }

    // 5️⃣ Compras a cuotas de TODOS LOS MESES (históricos acumulados)
    let totalCuotas = 0;
    console.log(`📝 Leyendo compras a cuotas históricas...`);
    
    if (COMPRAS_CUOTAS_DB_ID) {
      try {
        const comprasCuotas = await notion.databases.query({
          database_id: COMPRAS_CUOTAS_DB_ID,
        });

        console.log(`🔍 Compras a cuotas encontradas: ${comprasCuotas.results.length}`);
        
        totalCuotas = round2(
          comprasCuotas.results.reduce((s, p) => {
            const propiedades = p.properties;
            
            // Buscar el monto en diferentes propiedades posibles
            const monto = 
              propiedades?.Monto?.number || 
              propiedades?.monto?.number ||
              propiedades?.Cantidad?.number ||
              propiedades?.cantidad?.number ||
              propiedades?.Importe?.number ||
              propiedades?.importe?.number ||
              propiedades?.["Monto total"]?.number ||
              propiedades?.["Valor total"]?.number ||
              propiedades?.Total?.number ||
              0;

            // Si el registro tiene cuotas, sumar solo las cuotas pagadas
            const cuotasPagadas = propiedades?.["Cuotas pagadas"]?.number || 0;
            const cuotasTotales = propiedades?.["Cuotas totales"]?.number || 1;
            const montoPorCuota = propiedades?.["Monto por cuota"]?.number || 0;
            
            let montoCuotas = 0;
            
            if (montoPorCuota > 0 && cuotasPagadas > 0) {
              // Calcular monto de cuotas pagadas
              montoCuotas = montoPorCuota * cuotasPagadas;
            } else if (monto > 0 && cuotasPagadas > 0 && cuotasTotales > 0) {
              // Calcular monto proporcional de cuotas pagadas
              montoCuotas = (monto / cuotasTotales) * cuotasPagadas;
            } else {
              // Si no hay información de cuotas, usar el monto total
              montoCuotas = monto;
            }

            if (montoCuotas > 0) {
              console.log(`📄 Cuota encontrada: ${propiedades?.Concepto?.title?.[0]?.text?.content || 'Sin concepto'}, Monto cuotas: ${montoCuotas}`);
            }

            return s + montoCuotas;
          }, 0)
        );

        console.log(`💳 Total cuotas (históricas): ${totalCuotas}`);
      } catch (error) {
        console.error(`❌ Error leyendo compras a cuotas: ${error.message}`);
      }
    } else {
      console.log(`⚠️ COMPRAS_CUOTAS_DB_ID no definida`);
    }

    // 6️⃣ Calcular gastos totales acumulados (todos los tipos)
    const totalGastos = round2(
      totalGastosBase + totalPagosFijos + totalCuotas
    );

    console.log(`📊 RESUMEN DE CÁLCULOS:`);
    console.log(`  - Gastos base: ${totalGastosBase}`);
    console.log(`  - Pagos fijos: ${totalPagosFijos}`);
    console.log(`  - Cuotas: ${totalCuotas}`);
    console.log(`  - Total gastos: ${totalGastos}`);

    // 7️⃣ Calcular saldo final (acumulado histórico)
    const saldoFinal = round2(
      saldoInicial + totalIngresos - totalGastos
    );

    console.log(`💰 Saldo final calculado: ${saldoFinal}`);
    console.log(`  Fórmula: ${saldoInicial} + ${totalIngresos} - ${totalGastos} = ${saldoFinal}`);

    // 8️⃣ Crear propiedades basadas en lo que EXISTE en tu base de datos
    const propiedadesResumen = {
      Mes: { 
        title: [{ 
          type: "text", 
          text: { content: mes } 
        }] 
      },
      "Saldo inicial": { 
        number: saldoInicial 
      },
      "Total ingresos": { 
        number: totalIngresos 
      },
      "Total gastos": { 
        number: totalGastos
      },
      "Saldo final": { 
        number: saldoFinal 
      },
      "Fecha creación": { 
        date: { start: now.toISOString() } 
      }
    };

    // Agregar propiedades adicionales si existen
    const propiedadesAdicionales = {};
    
    // Verificar si existe la propiedad "Gastos base"
    try {
      propiedadesAdicionales["Gastos base"] = { number: totalGastosBase };
    } catch (e) {
      console.log(`ℹ️ Propiedad "Gastos base" no existe en la base de datos`);
    }
    
    // Verificar si existe la propiedad "Pagos fijos"
    try {
      propiedadesAdicionales["Pagos fijos"] = { number: totalPagosFijos };
    } catch (e) {
      console.log(`ℹ️ Propiedad "Pagos fijos" no existe en la base de datos`);
    }
    
    // Verificar si existe la propiedad "Cuotas"
    try {
      propiedadesAdicionales["Cuotas"] = { number: totalCuotas };
    } catch (e) {
      console.log(`ℹ️ Propiedad "Cuotas" no existe en la base de datos`);
    }

    // Combinar todas las propiedades
    const propiedadesCompletas = {
      ...propiedadesResumen,
      ...propiedadesAdicionales
    };

    // 9️⃣ Guardar resumen mensual
    console.log(`💾 Guardando resumen en base de datos...`);
    await notion.pages.create({
      parent: { database_id: RESUMEN_DB_ID },
      properties: propiedadesCompletas
    });
    console.log(`✅ Resumen guardado exitosamente`);

    // 🔟 Devolver respuesta exitosa
    res.status(200).json({
      ok: true,
      mes,
      saldoInicial,
      totalIngresos,
      totalGastosBase,
      totalPagosFijos,
      totalCuotas,
      totalGastos,
      saldoFinal,
      moneda: "EUR",
      resumen: {
        ingresos_mes_actual: totalIngresos,
        gastos_historicos: totalGastosBase,
        pagos_fijos_historicos: totalPagosFijos,
        cuotas_historicas: totalCuotas,
        total_gastos_historicos: totalGastos,
        saldo_acumulado: saldoFinal
      },
      debug: {
        registros_ingresos: ingresos.results.length,
        registros_gastos: gastos.results.length,
        tiene_pagos_fijos_db: !!PAGOS_FIJOS_DB_ID,
        tiene_cuotas_db: !!COMPRAS_CUOTAS_DB_ID
      }
    });

  } catch (error) {
    console.error("❌ Error detallado en cierre mensual:", error);
    
    // Información adicional para debugging
    console.log("🔧 Variables del entorno verificadas:", {
      RESUMEN_DB_ID: RESUMEN_DB_ID ? "✅ Definido" : "❌ No definido",
      INCOME_DB_ID: INCOME_DB_ID ? "✅ Definido" : "❌ No definido",
      EXPENSES_DB_ID: EXPENSES_DB_ID ? "✅ Definido" : "❌ No definido",
      PAGOS_FIJOS_DB_ID: PAGOS_FIJOS_DB_ID ? "✅ Definido" : "❌ No definido",
      COMPRAS_CUOTAS_DB_ID: COMPRAS_CUOTAS_DB_ID ? "✅ Definido" : "❌ No definido"
    });

    res.status(500).json({
      error: "Error en cierre mensual",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      suggestion: "Verifica las variables de entorno y los nombres de propiedades en Notion"
    });
  }
}