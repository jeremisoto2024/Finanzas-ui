// hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key)

        if (!stored) return initialValue

        return JSON.parse(stored)
      } catch (error) {
        console.error("Error leyendo localStorage:", error)

        // 🔥 CLAVE: limpiamos datos corruptos
        localStorage.removeItem(key)

        return initialValue
      }
    }

    return initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error guardando en localStorage:", error)
    }
  }, [key, value])

  return [value, setValue]
}