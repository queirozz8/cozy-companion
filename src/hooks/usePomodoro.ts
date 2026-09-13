import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePersistentState } from './usePersistentState'

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak'

export type PomodoroSettings = {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
}

type DailyProgress = {
  date: string
  completed: number
}

const DAILY_GOAL = 6
const CYCLES_BEFORE_LONG_BREAK = 4
const SETTINGS_KEY = 'cozy-companion/pomodoro-settings'
const DAILY_PROGRESS_KEY = 'cozy-companion/pomodoro-daily'

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
}

const INITIAL_DAILY_PROGRESS: DailyProgress = {
  date: '',
  completed: 0,
}

function getDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMillisecondsUntilNextMidnight(): number {
  const now = new Date()
  const nextMidnight = new Date(now)
  nextMidnight.setHours(24, 0, 0, 0)
  return Math.max(nextMidnight.getTime() - now.getTime(), 1000)
}

function clampMinutes(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.round(value) || minimum))
}

function getSecondsForMode(mode: PomodoroMode, settings: PomodoroSettings): number {
  if (mode === 'shortBreak') return settings.shortBreakMinutes * 60
  if (mode === 'longBreak') return settings.longBreakMinutes * 60
  return settings.focusMinutes * 60
}

function playCompletionBeep(audioContext: AudioContext | null): void {
  if (!audioContext) return

  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const startAt = audioContext.currentTime

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(660, startAt)
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(0.055, startAt + 0.018)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.42)
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + 0.45)
}

type UsePomodoroOptions = {
  onFocusComplete?: () => void
}

/**
 * O hook guarda apenas dados que precisam sobreviver ao refresh. O estado
 * transitório (fase, segundos e execução) fica em memória para o countdown ser
 * simples e previsível; no próximo carregamento o painel começa uma nova fase.
 */
export function usePomodoro({ onFocusComplete }: UsePomodoroOptions = {}) {
  const [settings, setSettings] = usePersistentState<PomodoroSettings>(SETTINGS_KEY, DEFAULT_SETTINGS)
  const [dailyProgress, setDailyProgress] = usePersistentState<DailyProgress>(DAILY_PROGRESS_KEY, INITIAL_DAILY_PROGRESS)
  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [isRunning, setIsRunning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(() => getSecondsForMode('focus', DEFAULT_SETTINGS))
  const audioContextRef = useRef<AudioContext | null>(null)
  const advancingRef = useRef(false)

  const today = getDateKey()
  const completedToday = dailyProgress.date === today ? dailyProgress.completed : 0

  const durationSeconds = useMemo(() => getSecondsForMode(mode, settings), [mode, settings])

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
      if (!AudioContextClass) return null
      audioContextRef.current = new AudioContextClass()
    }
    return audioContextRef.current
  }, [])

  const start = useCallback(() => {
    const audioContext = getAudioContext()
    void audioContext?.resume()
    setIsRunning(true)
  }, [getAudioContext])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setRemainingSeconds(getSecondsForMode(mode, settings))
  }, [mode, settings])

  const updateSettings = useCallback((nextSettings: Partial<PomodoroSettings>) => {
    setSettings((current) => ({
      focusMinutes: clampMinutes(nextSettings.focusMinutes ?? current.focusMinutes, 1, 180),
      shortBreakMinutes: clampMinutes(nextSettings.shortBreakMinutes ?? current.shortBreakMinutes, 1, 60),
      longBreakMinutes: clampMinutes(nextSettings.longBreakMinutes ?? current.longBreakMinutes, 1, 90),
    }))

    if (!isRunning) {
      const next = { ...settings, ...nextSettings }
      setRemainingSeconds(getSecondsForMode(mode, {
        focusMinutes: clampMinutes(next.focusMinutes, 1, 180),
        shortBreakMinutes: clampMinutes(next.shortBreakMinutes, 1, 60),
        longBreakMinutes: clampMinutes(next.longBreakMinutes, 1, 90),
      }))
    }
  }, [isRunning, mode, setSettings, settings])

  const advancePhase = useCallback(() => {
    if (advancingRef.current) return
    advancingRef.current = true

    const audioContext = getAudioContext()
    playCompletionBeep(audioContext)

    if (mode === 'focus') {
      const nextCompletedCount = completedToday + 1
      setDailyProgress({ date: today, completed: nextCompletedCount })
      onFocusComplete?.()

      const nextMode = nextCompletedCount % CYCLES_BEFORE_LONG_BREAK === 0 ? 'longBreak' : 'shortBreak'
      setMode(nextMode)
      setRemainingSeconds(getSecondsForMode(nextMode, settings))
    } else {
      setMode('focus')
      setRemainingSeconds(getSecondsForMode('focus', settings))
    }

    window.setTimeout(() => {
      advancingRef.current = false
    }, 0)
  }, [completedToday, getAudioContext, mode, onFocusComplete, settings, setDailyProgress, today])

  useEffect(() => {
    if (!isRunning) return

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning || remainingSeconds !== 0) return

    const completionTimeout = window.setTimeout(advancePhase, 0)
    return () => window.clearTimeout(completionTimeout)
  }, [advancePhase, isRunning, remainingSeconds])

  useEffect(() => {
    if (dailyProgress.date !== today) {
      const resetTimeout = window.setTimeout(() => {
        setDailyProgress({ date: today, completed: 0 })
      }, 0)

      return () => window.clearTimeout(resetTimeout)
    }
  }, [dailyProgress.date, setDailyProgress, today])

  useEffect(() => {
    const midnightTimeout = window.setTimeout(() => {
      setDailyProgress({ date: getDateKey(), completed: 0 })
    }, getMillisecondsUntilNextMidnight())

    return () => window.clearTimeout(midnightTimeout)
  }, [setDailyProgress, today])

  useEffect(() => {
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  const progress = durationSeconds > 0 ? 1 - remainingSeconds / durationSeconds : 0

  return {
    mode,
    settings,
    isRunning,
    remainingSeconds,
    durationSeconds,
    progress,
    completedToday,
    dailyGoal: DAILY_GOAL,
    start,
    pause,
    reset,
    updateSettings,
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
