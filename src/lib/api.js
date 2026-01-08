// API Client para conectarse a los endpoints del backend

/**
 * Obtiene todos los ingresos desde la API de Notion
 * @returns {Promise<Array>} Array de objetos de ingresos
 */
export async function getIngresos() {
  try {
    const res = await fetch('/api/ingresos')
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error en getIngresos:', error)
    throw error
  }
}

/**
 * Obtiene todos los gastos desde la API de Notion
 * @returns {Promise<Array>} Array de objetos de gastos
 */
export async function getGastos() {
  try {
    const res = await fetch('/api/gastos')
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error en getGastos:', error)
    throw error
  }
}

/**
 * Verifica el estado de la conexión con Notion
 * @returns {Promise<{status: string, message: string}>} Estado de la conexión
 */
export async function checkNotionConnection() {
  try {
    const res = await fetch('/api/health')
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error en checkNotionConnection:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de los ingresos
 * @returns {Promise<Object>} Estadísticas de ingresos
 */
export async function getEstadisticasIngresos() {
  try {
    const res = await fetch('/api/ingresos/estadisticas')
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error en getEstadisticasIngresos:', error)
    throw error
  }
}