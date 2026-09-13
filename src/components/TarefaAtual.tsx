import { Anchor } from 'lucide-react'

type TarefaAtualProps = {
  task: string
  onTaskChange: (task: string) => void
}

export function TarefaAtual({ task, onTaskChange }: TarefaAtualProps) {
  return (
    <section className="panel-card group flex items-center gap-3 px-4 py-3.5 animate-rise-in" style={{ animationDelay: '220ms' }}>
      <div className="icon-tile shrink-0 bg-[#8a4e2b]/15 text-[#d9994d] transition-transform duration-500 group-focus-within:rotate-[-8deg]">
        <Anchor size={16} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor="current-task" className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a48b79]">
          foco desta sessão
        </label>
        <input
          id="current-task"
          type="text"
          value={task}
          onChange={(event) => onTaskChange(event.target.value)}
          placeholder="Em que você vai avançar agora?"
          className="mt-1 w-full bg-transparent text-sm text-[#f0ddca] outline-none placeholder:text-[#755f50]"
        />
      </div>
    </section>
  )
}
