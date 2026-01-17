import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const RESUMEN_DB_ID = process.env.NOTION_RESUMEN_DB_ID;
const INCOME_DB_ID = process.env.NOTION_INCOME_DB;
const EXPENSES_DB_ID = process.env.NOTION_EXPENSES_DB;

// 🔐 Redondeo seguro EUR
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

export default async function handler(req, res) {
  try {
    // 📅 Mes actual
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based

    const startOfMonth = new Date(year, month, 1).toISOString();
    const startOfNextMonth = new Date(year, month + 1, 1).toISOString();

    const mes = `${year}-${String(month + 1).padStart(2, "0")}`;

    // 1️⃣ Saldo inicial = saldo final del último resumen
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

    // 2️⃣ Ingresos DEL MES
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

    // 3️⃣ Gastos DEL MES (ÚNICA FUENTE DE GASTOS)
    const gastos = await notion.databases.query({
      database_id: EXPENSES_DB_ID,
      filter: {
        property: "Fecha del gasto",
        date: {
          on_or_after: startOfMonth,
          before: startOfNextMonth,
        },
      },
    });

    const totalGastos = round2(
      gastos.results.reduce(
        (s, p) => s + (p.properties?.Cantidad?.number || 0),
        0
      )
    );

    // 4️⃣ Saldo final REAL
    const saldoFinal = round2(
      saldoInicial + totalIngresos - totalGastos
    );

    // 5️⃣ Guardar resumen mensual
    await notion.pages.create({
      parent: { database_id: RESUMEN_DB_ID },
      properties: {
        Mes: { title: [{ text: { content: mes } }] },
        "Saldo inicial": { number: saldoInicial },
        "Total ingresos": { number: totalIngresos },
        "Total gastos": { number: totalGastos },
        "Saldo final": { number: saldoFinal },
        "Fecha creación": { date: { start: now.toISOString() } },
      },
    });

    res.status(200).json({
      ok: true,
      mes,
      saldoInicial,
      totalIngresos,
      totalGastos,
      saldoFinal,
      moneda: "EUR",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error en cierre mensual",
      details: error.message,
    });
  }
}