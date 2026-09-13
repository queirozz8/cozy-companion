import { ArrowDown, ArrowUp, Check, Circle, Clock3, ListTodo, Minus, Plus, Timer, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'
import type { TodoItem, TodoPriority } from '../types'

const TASKS_STORAGE_KEY = 'cozy-companion/tasks'

const DEFAULT_TASKS: TodoItem[] = [
  { id: 'welcome-1', title: 'Escolher uma entrega pequena para hoje', completed: false, priority: 'high', estimate: 25 },
  { id: 'welcome-2', title: 'Limpar a mesa e fechar as abas extras', completed: false, priority: 'medium', estimate: 10 },
  { id: 'welcome-3', title: 'Registrar o que avançou no fim do bloco', completed: false, priority: 'low', estimate: 5 },
]

const priorityLabels: Record<TodoPriority, string> = {
  high: 'importante',
  medium: 'normal',
  low: 'leve',
}

const priorityIcons: Record<TodoPriority, typeof ArrowUp> = {
  high: ArrowUp,
  medium: Minus,
  low: ArrowDown,
}

type TodoListProps = {
  currentTask: string
  onSelectTask: (title: string) => void
}

type TaskFilter = 'all' | 'next' | 'done'

function createTaskId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function TodoList({ currentTask, onSelectTask }: TodoListProps) {
  const [tasks, setTasks] = usePersistentState<TodoItem[]>(TASKS_STORAGE_KEY, DEFAULT_TASKS)
  const [draft, setDraft] = useState('')
  const [priority, setPriority] = useState<TodoPriority>('medium')
  const [estimate, setEstimate] = useState(25)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [isAdding, setIsAdding] = useState(false)

  const completedCount = tasks.filter((task) => task.completed).length
  const remainingCount = tasks.length - completedCount
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0
  const visibleTasks = useMemo(() => {
    if (filter === 'done') return tasks.filter((task) => task.completed)
    if (filter === 'next') return tasks.filter((task) => !task.completed)
    return tasks
  }, [filter, tasks])

  function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return

    setTasks((current) => [
      ...current,
      { id: createTaskId(), title, completed: false, priority, estimate },
    ])
    setDraft('')
    setIsAdding(false)
  }

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )))
  }

  function removeTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.completed))
  }

  return (
    <section className="panel-card overflow-hidden animate-rise-in" style={{ animationDelay: '410ms' }}>
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="icon-tile mt-0.5 bg-[#855033]/15 text-[#e2a254]">
            <ListTodo size={17} strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="section-title">fila de foco</h2>
              <span className="soft-badge">{remainingCount} restantes</span>
            </div>
            <p className="section-caption">Transforme intenção em próximos passos claros.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((visible) => !visible)}
          className="secondary-button"
          aria-expanded={isAdding}
        >
          <Plus size={15} />
          nova tarefa
        </button>
      </div>

      <div className="mx-5 rounded-2xl border border-[#b87842]/10 bg-[#181211]/55 p-3.5 sm:mx-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#e5d1bc]">ritmo do dia</p>
            <p className="mt-1 text-[11px] text-[#8d7563]">{completedCount} de {tasks.length || 0} tarefas concluídas</p>
          </div>
          <span className="font-mono text-sm text-[#df9e54]">{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#3b2921]" aria-label={`${Math.round(progress)}% das tarefas concluídas`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className="h-full rounded-full bg-gradient-to-r from-[#b96b32] to-[#e6ae63] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {isAdding && (
        <form onSubmit={addTask} className="mx-5 mt-3 rounded-2xl border border-[#d89548]/25 bg-[#2b1d17]/55 p-3.5 animate-rise-in sm:mx-6">
          <label htmlFor="new-task" className="sr-only">Nome da nova tarefa</label>
          <input
            id="new-task"
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Qual é o próximo passo concreto?"
            className="w-full bg-transparent text-sm text-[#f1deca] outline-none placeholder:text-[#806a5a]"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="compact-control">
              <span>prioridade</span>
              <select value={priority} onChange={(event) => setPriority(event.target.value as TodoPriority)} aria-label="Prioridade da tarefa">
                <option value="high">importante</option>
                <option value="medium">normal</option>
                <option value="low">leve</option>
              </select>
            </label>
            <label className="compact-control">
              <span>estimativa</span>
              <select value={estimate} onChange={(event) => setEstimate(Number(event.target.value))} aria-label="Estimativa em minutos">
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={25}>25 min</option>
                <option value={50}>50 min</option>
              </select>
            </label>
            <button type="submit" className="primary-button ml-auto" disabled={!draft.trim()}>
              adicionar
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 px-5 sm:px-6">
        <div className="segmented-control" role="group" aria-label="Filtrar tarefas">
          {([['all', 'todas'], ['next', 'próximas'], ['done', 'feitas']] as const).map(([value, label]) => (
            <button key={value} type="button" onClick={() => setFilter(value)} className={filter === value ? 'active' : ''} aria-pressed={filter === value}>
              {label}
            </button>
          ))}
        </div>
        {completedCount > 0 && (
          <button type="button" onClick={clearCompleted} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#806a5a] transition-colors hover:text-[#dfa05a]">
            limpar feitas
          </button>
        )}
      </div>

      <div className="mt-3 divide-y divide-[#b87842]/10 border-t border-[#b87842]/10">
        {visibleTasks.length > 0 ? visibleTasks.map((task) => {
          const PriorityIcon = priorityIcons[task.priority]
          const isCurrent = currentTask === task.title

          return (
            <div key={task.id} className={`task-row group ${task.completed ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`}>
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="task-check"
                aria-label={task.completed ? `Reabrir tarefa: ${task.title}` : `Concluir tarefa: ${task.title}`}
                aria-pressed={task.completed}
              >
                {task.completed ? <Check size={14} strokeWidth={2.4} /> : <Circle size={17} strokeWidth={1.5} />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[#e9d5c0]">{task.title}</p>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.11em] text-[#826b5a]">
                  <span className={`priority priority-${task.priority}`}><PriorityIcon size={11} />{priorityLabels[task.priority]}</span>
                  <span className="flex items-center gap-1"><Clock3 size={11} />{task.estimate} min</span>
                </div>
              </div>
              <div className="task-actions">
                {!task.completed && (
                  <button type="button" onClick={() => onSelectTask(task.title)} className={`task-action ${isCurrent ? 'selected' : ''}`} aria-label={`Usar na sessão: ${task.title}`}>
                    <Timer size={14} />
                    <span className="hidden xl:inline">focar</span>
                  </button>
                )}
                <button type="button" onClick={() => removeTask(task.id)} className="task-action delete" aria-label={`Excluir tarefa: ${task.title}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        }) : (
          <div className="px-5 py-10 text-center sm:px-6">
            <Check className="mx-auto text-[#d7964d]" size={22} />
            <p className="mt-3 text-sm text-[#d8c0aa]">Nada por aqui agora.</p>
            <p className="mt-1 text-xs text-[#806a5a]">Um espaço limpo também é progresso.</p>
          </div>
        )}
      </div>
    </section>
  )
}
