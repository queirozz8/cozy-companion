import { useCallback, useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

function resolveInitialValue<T>(initialValue: T | (() => T)): T {
  return typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue
}

/**
 * Centralizamos o acesso ao localStorage para que os componentes não precisem
 * repetir parsing, tratamento de erro ou a preocupação com a primeira renderização.
 * Se o storage estiver indisponível, a interface continua funcionando em memória.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(() => {
    const fallback = resolveInitialValue(initialValue)

    if (typeof window === 'undefined') return fallback

    try {
      const storedValue = window.localStorage.getItem(key)
      return storedValue === null ? fallback : (JSON.parse(storedValue) as T)
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Falhas de quota ou modo privado não devem quebrar o timer.
    }
  }, [key, value])

  const reset = useCallback(() => {
    setValue(resolveInitialValue(initialValue))
  }, [initialValue])

  return [value, setValue, reset]
}
