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
    // NO aplicamos filtro por fecha para obtener todos los gastos históricos
    const gastos = await notion.databases.query({
      database_id: EXPENSES_DB_ID,
      // Sin filtro de fecha para obtener todos los registros
    });

    const totalGastosBase = round2(
      gastos.results.reduce(
        (s, p) => s + (p.properties?.Cantidad?.number || 0),
        0
      )
    );

    // 4️⃣ Pagos fijos de TODOS LOS MESES (históricos acumulados)
    // NO aplicamos filtro por fecha para obtener todos los pagos fijos históricos
    const pagosFijos = await notion.databases.query({
      database_id: PAGOS_FIJOS_DB_ID,
      // Sin filtro de fecha para obtener todos los registros
    });

    const totalPagosFijos = round2(
      pagosFijos.results.reduce(
        (s, p) => s + (p.properties?.Cantidad?.number || 0),
        0
      )
    );

    // 5️⃣ Compras a cuotas de TODOS LOS MESES (históricos acumulados)
    // NO aplicamos filtro por fecha para obtener todas las cuotas históricas
    const comprasCuotas = await notion.databases.query({
      database_id: COMPRAS_CUOTAS_DB_ID,
      // Sin filtro de fecha para obtener todos los registros
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

    // 7️⃣ Calcular saldo acumulado histórico
    // Esto es para ver el saldo total histórico, no solo del mes
    const saldoAcumulado = round2(
      saldoInicial + totalIngresos - totalGastos
    );

    // 8️⃣ Para el cierre mensual, también podemos calcular el saldo solo del mes
    // (opcional, dependiendo de lo que quieras mostrar)
    const saldoMes = round2(
      totalIngresos - totalGastosBase  // Solo gastos normales del mes (sin pagos fijos/cuotas si están en otras DBs)
    );

    // 9️⃣ Guardar resumen mensual con ambos valores
    await notion.pages.create({
      parent: { database_id: RESUMEN_DB_ID },
      properties: {
        Mes: { title: [{ text: { content: mes } }] },
        "Saldo inicial": { number: saldoInicial },
        "Total ingresos": { number: totalIngresos },
        "Total gastos": { 
          rich_text: [{ 
            text: { 
              content: `Mensual: €${totalGastosBase}, Histórico: €${totalGastos}` 
            } 
          }] 
        },
        "Saldo final": { number: saldoAcumulado },
        "Saldo mes": { number: saldoMes },
        "Fecha creación": { date: { start: now.toISOString() } },
      },
    });

    res.status(200).json({
      ok: true,
      mes,
      saldoInicial,
      totalIngresos,
      totalGastosBase,  // Gastos del mes (si aplica)
      totalGastos,      // Gastos totales históricos
      totalPagosFijos,  // Pagos fijos históricos
      totalCuotas,      // Cuotas históricas
      saldoAcumulado,   // Saldo histórico total
      saldoMes,         // Saldo solo del mes actual
      moneda: "EUR",
      notas: {
        ingresos: "Solo del mes actual",
        gastos: "Históricos acumulados (todos los meses)",
        pagosFijos: "Históricos acumulados (todos los meses)",
        comprasCuotas: "Históricos acumulados (todos los meses)"
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error en cierre mensual",
      details: error.message,
    });
  }
}