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

    // 3️⃣ Gastos de TODOS LOS MESES (históricos acumulados)
    const gastos = await notion.databases.query({
      database_id: EXPENSES_DB_ID,
    });

    const totalGastosBase = round2(
      gastos.results.reduce(
        (s, p) => s + (p.properties?.Cantidad?.number || 0),
        0
      )
    );

    // 4️⃣ Pagos fijos de TODOS LOS MESES (históricos acumulados)
    const pagosFijos = await notion.databases.query({
      database_id: PAGOS_FIJOS_DB_ID,
    });

    const totalPagosFijos = round2(
      pagosFijos.results.reduce(
        (s, p) => s + (p.properties?.Cantidad?.number || 0),
        0
      )
    );

    // 5️⃣ Compras a cuotas de TODOS LOS MESES (históricos acumulados)
    const comprasCuotas = await notion.databases.query({
      database_id: COMPRAS_CUOTAS_DB_ID,
    });

    const totalCuotas = round2(
      comprasCuotas.results.reduce(
        (s, p) => s + (p.properties?.Cantidad?.number || 0),
        0
      )
    );

    // 6️⃣ Calcular gastos totales acumulados (todos los tipos)
    const totalGastos = round2(
      totalGastosBase + totalPagosFijos + totalCuotas
    );

    // 7️⃣ Calcular saldo final (acumulado histórico)
    const saldoFinal = round2(
      saldoInicial + totalIngresos - totalGastos
    );

    // 8️⃣ Crear propiedades basadas en lo que EXISTE en tu base de datos
    // Verifica los nombres EXACTOS de las propiedades en tu base de datos Notion
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
        number: totalGastos  // Asegúrate de que esta propiedad existe como "number"
      },
      "Saldo final": { 
        number: saldoFinal 
      },
      "Fecha creación": { 
        date: { start: now.toISOString() } 
      }
    };

    // 9️⃣ Guardar resumen mensual
    await notion.pages.create({
      parent: { database_id: RESUMEN_DB_ID },
      properties: propiedadesResumen
    });

    // 🔟 Devolver respuesta exitosa
    res.status(200).json({
      ok: true,
      mes,
      saldoInicial,
      totalIngresos,
      totalGastosBase,  // Gastos normales acumulados
      totalPagosFijos,  // Pagos fijos acumulados
      totalCuotas,      // Cuotas acumuladas
      totalGastos,      // Total gastos acumulados (todos)
      saldoFinal,
      moneda: "EUR",
      notas: {
        ingresos: "Solo del mes actual",
        gastos: "Históricos acumulados (todos los meses)",
        calculo: `Saldo final = ${saldoInicial} + ${totalIngresos} - ${totalGastos} = ${saldoFinal}`
      }
    });

  } catch (error) {
    console.error("Error detallado en cierre mensual:", error);
    
    // Información adicional para debugging
    console.log("Variables del entorno:", {
      RESUMEN_DB_ID: RESUMEN_DB_ID ? "Definido" : "No definido",
      INCOME_DB_ID: INCOME_DB_ID ? "Definido" : "No definido",
      EXPENSES_DB_ID: EXPENSES_DB_ID ? "Definido" : "No definido",
      PAGOS_FIJOS_DB_ID: PAGOS_FIJOS_DB_ID ? "Definido" : "No definido",
      COMPRAS_CUOTAS_DB_ID: COMPRAS_CUOTAS_DB_ID ? "Definido" : "No definido"
    });

    res.status(500).json({
      error: "Error en cierre mensual",
      details: error.message,
      suggestion: "Verifica los nombres de las propiedades en tu base de datos de Notion"
    });
  }
}