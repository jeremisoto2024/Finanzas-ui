{/* Filtro por Cuenta */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">🏦 Cuenta</label>
            <select 
              value={filtroCuenta}
              onChange={(e) => setFiltroCuenta(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">Todas las cuentas</option>
              {cuentasUnicas.map(cuenta => (
                <option key={cuenta} value={cuenta}>{cuenta}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoría */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">📁 Categoría</label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              <option value="">Todas las categorías</option>
              {categoriasUnicas.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          {/* Botón Exportar */}
          <button 
            onClick={exportarCSV}
            className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
          >
            📤 Exportar CSV
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <div className="text-xs text-slate-500 px-4 py-2 md:hidden">
          Desliza → para ver más
        </div>
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Concepto</th>
              <th className="px-4 py-3 text-left">Método</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Cuenta</th>
              <th className="px-4 py-3 text-right">Monto</th>
            </tr>
          </thead>

          <tbody>
            {gastosFiltrados.map((gasto) => (
              <FilaGasto key={gasto.id} gasto={gasto} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}