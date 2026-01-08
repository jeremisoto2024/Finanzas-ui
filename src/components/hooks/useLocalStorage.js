// hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    }
    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
