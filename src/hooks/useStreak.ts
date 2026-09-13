import { useCallback, useMemo } from 'react'
import { usePersistentState } from './usePersistentState'

const STREAK_STORAGE_KEY = 'cozy-companion/streak'

type StreakState = {
  lastCompletedDate: string | null
  currentStreak: number
}

const INITIAL_STREAK: StreakState = {
  lastCompletedDate: null,
  currentStreak: 0,
}

function getDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getPreviousDateKey(date = new Date()): string {
  const previousDate = new Date(date)
  previousDate.setDate(previousDate.getDate() - 1)
  return getDateKey(previousDate)
}

/**
 * O streak é calculado só no momento em que um foco termina. Assim, abrir o
 * painel em um novo dia nunca aumenta a sequência por engano: é a conclusão
 * real de um pomodoro que mantém ou reinicia o hábito.
 */
export function useStreak() {
  const [streak, setStreak] = usePersistentState<StreakState>(
    STREAK_STORAGE_KEY,
    INITIAL_STREAK,
  )

  const recordPomodoro = useCallback(() => {
    const today = getDateKey()

    setStreak((current) => {
      if (current.lastCompletedDate === today) return current

      const nextStreak = current.lastCompletedDate === getPreviousDateKey()
        ? current.currentStreak + 1
        : 1

      return {
        lastCompletedDate: today,
        currentStreak: nextStreak,
      }
    })
  }, [setStreak])

  const hasCompletedToday = streak.lastCompletedDate === getDateKey()
  const currentStreak = useMemo(() => {
    if (!streak.lastCompletedDate) return 0
    const today = getDateKey()
    const yesterday = getPreviousDateKey()
    return streak.lastCompletedDate === today || streak.lastCompletedDate === yesterday
      ? streak.currentStreak
      : 0
  }, [streak])

  return { currentStreak, hasCompletedToday, recordPomodoro }
}
