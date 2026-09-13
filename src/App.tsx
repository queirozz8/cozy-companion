import { Coffee, Flame, Moon, Sparkles, Timer as TimerIcon } from 'lucide-react'
import { useState } from 'react'
import { Meditation } from './components/Meditation'
import { MetaFixa } from './components/MetaFixa'
import { Player } from './components/Player'
import { SessionChecklist } from './components/SessionChecklist'
import { Streak } from './components/Streak'
import { TarefaAtual } from './components/TarefaAtual'
import { Timer } from './components/Timer'
import { TodoList } from './components/TodoList'
import { usePersistentState } from './hooks/usePersistentState'
import { usePomodoro } from './hooks/usePomodoro'
import { useStreak } from './hooks/useStreak'

const CURRENT_TASK_STORAGE_KEY = 'cozy-companion/current-task'

function App() {
  const streak = useStreak()
  const [currentTask, setCurrentTask] = usePersistentState(CURRENT_TASK_STORAGE_KEY, '')
  const [checklistReady, setChecklistReady] = useState(false)
  const pomodoro = usePomodoro({ onFocusComplete: streak.recordPomodoro })

  return (
    <div className="app-shell">
      <div className="pointer-events-none absolute left-[8%] top-28 h-64 w-64 rounded-full bg-[#9a5425]/10 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute right-[5%] top-[48%] h-80 w-80 rounded-full bg-[#e2a04c]/8 blur-3xl animate-drift" style={{ animationDelay: '-4s' }} />

      <main className="app-container">
        <header className="app-header animate-rise-in">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <Coffee size={19} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#e4a153]">cozy companion</p>
              <p className="mt-1 text-xs text-[#a89383]">um lugar calmo para fazer acontecer</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#806a5a]">seu ritmo</p>
              <p className="mt-1 text-xs text-[#d0b9a5]">presença antes de pressa</p>
            </div>
            <div className="presence-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dca15a] shadow-[0_0_9px_rgba(220,161,90,0.9)]" />
              presente
            </div>
          </div>
        </header>

        <section className="hero-grid animate-rise-in" style={{ animationDelay: '70ms' }}>
          <div className="hero-copy">
            <div className="eyebrow"><span /> painel de foco pessoal</div>
            <h1>Foco que cabe<br /><span>na vida real.</span></h1>
            <p>Organize o próximo passo, prepare o ambiente e entre em um bloco de trabalho que você consegue sustentar.</p>
            <TarefaAtual task={currentTask} onTaskChange={setCurrentTask} />
          </div>
          <div className="hero-insight">
            <div className="hero-insight-glow" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[#c49770]"><Sparkles size={13} /> intenção do dia</p>
                <p className="mt-4 max-w-[22rem] text-xl font-medium leading-snug tracking-[-0.03em] text-[#f0dfcc]">Pequenos blocos. Progresso que aparece.</p>
              </div>
              <Moon size={20} className="mt-1 text-[#d59a55]" strokeWidth={1.5} />
            </div>
            <div className="relative mt-8 flex items-center gap-3 border-t border-[#c38347]/15 pt-4">
              <div className="flex -space-x-1.5" aria-hidden="true">
                <span className="h-6 w-6 rounded-full border-2 border-[#2a1c16] bg-[#d5914c]" />
                <span className="h-6 w-6 rounded-full border-2 border-[#2a1c16] bg-[#718b73]" />
                <span className="h-6 w-6 rounded-full border-2 border-[#2a1c16] bg-[#987e9f]" />
              </div>
              <p className="text-[11px] leading-relaxed text-[#a89383]">Uma sessão por vez já muda o tom do dia.</p>
            </div>
          </div>
        </section>

        <section className="stats-grid animate-rise-in" style={{ animationDelay: '140ms' }} aria-label="Resumo do dia">
          <Streak currentStreak={streak.currentStreak} hasCompletedToday={streak.hasCompletedToday} />
          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div className="icon-tile bg-[#9a5425]/15 text-[#e0a057]"><Flame size={16} strokeWidth={1.8} /></div>
              <span className="stat-kicker">hoje</span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-[#f4e1ce]">Sessão <span className="text-[#e0a057]">{pomodoro.completedToday}/{pomodoro.dailyGoal}</span></p>
            <p className="mt-0.5 text-xs text-[#a89383]">blocos concluídos hoje</p>
          </div>
          <div className="stat-card stat-card-accent">
            <div className="flex items-start justify-between">
              <div className="icon-tile bg-[#607b65]/15 text-[#a9c79c]"><TimerIcon size={16} strokeWidth={1.8} /></div>
              <span className="stat-kicker">próximo passo</span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-[#f4e1ce]">{pomodoro.settings.focusMinutes}<span className="ml-1 text-sm font-normal text-[#a89383]">min</span></p>
            <p className="mt-0.5 text-xs text-[#a89383]">duração do bloco de foco</p>
          </div>
        </section>

        <div className="workspace-heading animate-rise-in" style={{ animationDelay: '200ms' }}>
          <div><span>01</span><p>seu espaço de trabalho</p></div>
          <p className="hidden text-xs text-[#765f50] md:block">Prepare · escolha · comece</p>
        </div>

        <section className="workspace-grid">
          <div className="focus-column">
            <Timer {...pomodoro} startDisabled={!checklistReady} />
            <TodoList currentTask={currentTask} onSelectTask={setCurrentTask} />
          </div>
          <aside className="support-column">
            <MetaFixa />
            <SessionChecklist onReadyChange={setChecklistReady} />
            <Meditation />
            <Player />
          </aside>
        </section>

        <footer className="app-footer">
          <span>feito para uma coisa de cada vez</span>
          <span className="hidden sm:inline">·</span>
          <span>seus dados ficam neste dispositivo</span>
        </footer>
      </main>
    </div>
  )
}

export default App
