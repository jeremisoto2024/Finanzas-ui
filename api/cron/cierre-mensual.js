import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const RESUMEN_DB_ID = process.env.NOTION_RESUMEN_DB_ID;
const INCOME_DB_ID = process.env.NOTION_INCOME_DB;
const EXPENSES_DB_ID = process.env.NOTION_EXPENSES_DB;
const PAGOS_FIJOS_DB_ID = process.env.NOTION_PAGOS_FIJOS_DATABASE_ID;
const COMPRAS_CUOTAS_DB_ID = process.env.NOTION_COMPRAS_CUOTAS_DATABASE_ID;

export default async function handler(req, res) {
  try {
    // 1️⃣ Obtener último resumen (para saldo inicial)
    const resumenPrevio = await notion.databases.query({
      database_id: RESUMEN_DB_ID,
      sorts: [
        {
          property: "Fecha creación",
          direction: "descending",
        },
      ],
      page_size: 1,
    });

    const saldoInicial =
      resumenPrevio.results.length > 0
        ? resumenPrevio.results[0].properties["Saldo final"]?.number || 0
        : 0;

    // 2️⃣ Ingresos
    const ingresos = await notion.databases.query({
      database_id: INCOME_DB_ID,
    });

    const totalIngresos = ingresos.results.reduce(
      (sum, p) => sum + (p.properties?.Cantidad?.number || 0),
      0
    );

    // 3️⃣ Gastos
    const gastos = await notion.databases.query({
      database_id: EXPENSES_DB_ID,
    });

    const totalGastosBase = gastos.results.reduce(
      (sum, p) => sum + (p.properties?.Cantidad?.number || 0),
      0
    );

    // 4️⃣ Pagos fijos
    const pagosFijos = await notion.databases.query({
      database_id: PAGOS_FIJOS_DB_ID,
    });

    const totalPagosFijos = pagosFijos.results.reduce(
      (sum, p) => sum + (p.properties?.Cantidad?.number || 0),
      0
    );

    // 5️⃣ Compras a cuotas
    const comprasCuotas = await notion.databases.query({
      database_id: COMPRAS_CUOTAS_DB_ID,
    });

    const totalCuotas = comprasCuotas.results.reduce(
      (sum, p) => sum + (p.properties?.Cantidad?.number || 0),
      0
    );

    const totalGastos =
      totalGastosBase + totalPagosFijos + totalCuotas;

    // 6️⃣ Saldo final
    const saldoFinal =
      saldoInicial + totalIngresos - totalGastos;

    // 7️⃣ Crear resumen mensual
    const now = new Date();
    const mes = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    await notion.pages.create({
      parent: { database_id: RESUMEN_DB_ID },
      properties: {
        Mes: {
          title: [{ text: { content: mes } }],
        },
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error en cierre mensual",
      details: error.message,
    });
  }
}