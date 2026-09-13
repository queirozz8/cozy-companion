import { Brain, Pause, Play, RotateCcw, Wind } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'

const MEDITATION_DURATION_KEY = 'cozy-companion/meditation-duration'
const PHASE_SECONDS = 16

const phaseLabels = {
  inhale: 'inspire',
  hold: 'segure',
  exhale: 'expire',
  rest: 'descanse',
} as const

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function Meditation() {
  const [durationMinutes, setDurationMinutes] = usePersistentState(MEDITATION_DURATION_KEY, 5)
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)

  const elapsedSeconds = durationMinutes * 60 - remainingSeconds
  const phase = useMemo(() => {
    if (!isRunning && elapsedSeconds === 0) return 'rest'
    const cyclePosition = elapsedSeconds % PHASE_SECONDS
    if (cyclePosition < 4) return 'inhale'
    if (cyclePosition < 8) return 'hold'
    if (cyclePosition < 14) return 'exhale'
    return 'rest'
  }, [elapsedSeconds, isRunning])

  useEffect(() => {
    if (!isRunning) return

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId)
          setIsRunning(false)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isRunning])

  function selectDuration(minutes: number) {
    setDurationMinutes(minutes)
    if (!isRunning) setRemainingSeconds(minutes * 60)
  }

  function reset() {
    setIsRunning(false)
    setRemainingSeconds(durationMinutes * 60)
  }

  return (
    <section className="panel-card relative overflow-hidden animate-rise-in" style={{ animationDelay: '430ms' }}>
      <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#718c73]/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-3 px-5 pb-2 pt-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="icon-tile bg-[#607b65]/15 text-[#a9c79c]"><Brain size={17} strokeWidth={1.8} /></div>
          <div>
            <h2 className="section-title">pausa consciente</h2>
            <p className="section-caption">Uma respiração guiada antes de voltar.</p>
          </div>
        </div>
        <Wind size={17} className="mt-1 text-[#769374]" strokeWidth={1.5} />
      </div>

      <div className="relative flex items-center gap-5 px-5 py-4 sm:px-6">
        <div className={`meditation-orb phase-${phase} ${isRunning ? 'is-running' : ''}`}>
          <div className="meditation-orb-core">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#bad0af]">{phaseLabels[phase]}</span>
            <span className="mt-1 font-mono text-base text-[#edf1df]">{formatTime(remainingSeconds)}</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#e2e0cc]">{isRunning ? 'Só precisa acompanhar o círculo.' : remainingSeconds === 0 ? 'Sessão concluída. Bom retorno.' : 'Escolha um tempo e encontre seu ritmo.'}</p>
          <div className="mt-3 flex gap-1.5" role="group" aria-label="Duração da meditação">
            {[2, 5, 10].map((minutes) => (
              <button key={minutes} type="button" onClick={() => selectDuration(minutes)} className={`duration-pill ${durationMinutes === minutes ? 'active' : ''}`}>
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-5 pb-5 sm:px-6">
        <button type="button" onClick={() => setIsRunning((running) => !running)} className="primary-button flex-1">
          {isRunning ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
          {isRunning ? 'pausar' : remainingSeconds === 0 ? 'recomeçar' : 'começar'}
        </button>
        <button type="button" onClick={reset} className="secondary-button w-11 justify-center px-0" aria-label="Reiniciar meditação">
          <RotateCcw size={15} />
        </button>
      </div>
    </section>
  )
}
