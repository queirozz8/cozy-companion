import { Pause, Play, RotateCcw, Settings2, TimerReset } from 'lucide-react'
import { useState } from 'react'
import type { PomodoroSettings } from '../hooks/usePomodoro'
import { usePomodoro } from '../hooks/usePomodoro'

type TimerProps = ReturnType<typeof usePomodoro>
  & {
    startDisabled?: boolean
    onStart?: () => void
  }

const modeLabels = {
  focus: 'foco profundo',
  shortBreak: 'pausa curta',
  longBreak: 'pausa longa',
} as const

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function SettingField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-xs text-[#bda692]">
      <span>{label}</span>
      <span className="flex items-center gap-1.5">
        <input
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-14 rounded-lg border border-[#b87842]/20 bg-[#171311] px-2 py-1.5 text-center text-xs text-[#f0ddca] outline-none focus:border-[#d9994d]"
        />
        <span className="text-[10px] text-[#755f50]">min</span>
      </span>
    </label>
  )
}

export function Timer({
  mode,
  settings,
  isRunning,
  remainingSeconds,
  progress,
  start,
  pause,
  reset,
  updateSettings,
  startDisabled = false,
  onStart,
}: TimerProps) {
  const [showSettings, setShowSettings] = useState(false)
  const modeColor = mode === 'focus' ? '#e2a04c' : '#b98763'
  const ringStyle = {
    background: `conic-gradient(from -90deg, ${modeColor} ${progress * 100}%, #3a2921 ${progress * 100}% 100%)`,
  }

  function changeSetting(key: keyof PomodoroSettings, value: number) {
    updateSettings({ [key]: value })
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#c38347]/25 bg-[linear-gradient(145deg,rgba(55,34,24,0.94),rgba(31,22,19,0.94))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)] animate-soft-pulse animate-rise-in" style={{ animationDelay: '340ms' }}>
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#d89042]/10 blur-3xl" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b58d6e]">agora</p>
          <p className="mt-1 text-sm font-medium text-[#ead3bd]">{modeLabels[mode]}</p>
        </div>
        <button
          type="button"
          aria-expanded={showSettings}
          aria-label="Configurar tempos do pomodoro"
          onClick={() => setShowSettings((visible) => !visible)}
          className={`rounded-xl border p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5a45a] ${showSettings ? 'border-[#d9994d]/35 bg-[#d9994d]/10 text-[#e7aa60]' : 'border-[#b87842]/15 text-[#967762] hover:bg-[#8a4e2b]/15 hover:text-[#e5a45a]'}`}
        >
          <Settings2 size={16} strokeWidth={1.7} />
        </button>
      </div>

      <div className="relative mx-auto my-6 flex h-52 w-52 items-center justify-center rounded-full p-[7px] sm:h-56 sm:w-56" style={ringStyle}>
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-[#efbd74]/10 bg-[#231813] shadow-[inset_0_0_32px_rgba(0,0,0,0.32)]">
          <TimerReset size={16} className="mb-2 text-[#956f53]" strokeWidth={1.6} />
          <span className="font-mono text-[43px] font-medium leading-none tracking-[-0.08em] text-[#f8e4cf] sm:text-[47px]">{formatTime(remainingSeconds)}</span>
          <span className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#b09278]">{isRunning ? 'em andamento' : 'em espera'}</span>
        </div>
      </div>

      <div className="relative flex gap-2.5">
        <button
          type="button"
          onClick={isRunning ? pause : onStart ?? start}
          disabled={!isRunning && startDisabled}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d89548] px-4 py-3 text-sm font-semibold text-[#2b1a10] shadow-[0_8px_24px_rgba(213,139,64,0.2)] transition-all hover:bg-[#e5a45a] hover:shadow-[0_10px_28px_rgba(213,139,64,0.28)] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#705139] disabled:text-[#c2a486] disabled:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1c180]"
          title={!isRunning && startDisabled ? 'Complete o ritual de entrada para iniciar' : undefined}
        >
          {isRunning ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Resetar timer"
          className="flex w-12 items-center justify-center rounded-xl border border-[#b87842]/20 bg-[#2c1d17] text-[#b38e74] transition-colors hover:border-[#d9994d]/40 hover:text-[#e5a45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5a45a]"
        >
          <RotateCcw size={17} />
        </button>
      </div>

      {showSettings && (
        <div className="relative mt-4 space-y-3 rounded-2xl border border-[#b87842]/15 bg-[#191311]/60 p-3.5 animate-rise-in">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a48b79]">duração das fases</p>
          <SettingField label="Foco" value={settings.focusMinutes} onChange={(value) => changeSetting('focusMinutes', value)} />
          <SettingField label="Pausa curta" value={settings.shortBreakMinutes} onChange={(value) => changeSetting('shortBreakMinutes', value)} />
          <SettingField label="Pausa longa" value={settings.longBreakMinutes} onChange={(value) => changeSetting('longBreakMinutes', value)} />
          <p className="pt-1 text-[10px] leading-relaxed text-[#755f50]">A pausa longa entra automaticamente a cada 4 sessões de foco.</p>
        </div>
      )}
    </section>
  )
}
