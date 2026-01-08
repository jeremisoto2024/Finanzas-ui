export const cuotas = [
  {
    id: 1,
    concepto: 'iPhone 15',
    total: 840,
    cuotasTotales: 12,
    cuotasPagadas: 3,
    metodoPago: 'Tarjeta BBVA',
    cuenta: 'Cuenta principal',
    fechaInicio: '2025-01-05',
    cuotas: [
      { numero: 1, monto: 70, pagada: true },
      { numero: 2, monto: 70, pagada: true },
      { numero: 3, monto: 70, pagada: true },
      { numero: 4, monto: 75, pagada: false }, // monto distinto
      { numero: 5, monto: 70, pagada: false }
    ]
  },
  {
    id: 2,
    concepto: 'Curso online',
    total: 300,
    cuotasTotales: 6,
    cuotasPagadas: 1,
    metodoPago: 'PayPal',
    cuenta: 'Ahorros',
    fechaInicio: '2025-02-10',
    cuotas: [
      { numero: 1, monto: 50, pagada: true },
      { numero: 2, monto: 50, pagada: false }
    ]
  }
]