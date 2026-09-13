import { Check, ClipboardCheck, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'
import type { ChecklistItem } from '../types'

const CHECKLIST_STORAGE_KEY = 'cozy-companion/session-checklist'

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'space', label: 'Meu espaço está minimamente pronto', checked: false },
  { id: 'intention', label: 'Escolhi uma tarefa pequena e específica', checked: false },
  { id: 'distraction', label: 'Notificações e abas desnecessárias estão fechadas', checked: false },
]

type SessionChecklistProps = {
  onReadyChange: (ready: boolean) => void
}

export function SessionChecklist({ onReadyChange }: SessionChecklistProps) {
  const [items, setItems] = usePersistentState<ChecklistItem[]>(CHECKLIST_STORAGE_KEY, DEFAULT_CHECKLIST)
  const completedCount = items.filter((item) => item.checked).length
  const isReady = items.length > 0 && completedCount === items.length

  useEffect(() => {
    onReadyChange(isReady)
  }, [isReady, onReadyChange])

  function toggleItem(id: string) {
    setItems((current) => current.map((item) => (
      item.id === id ? { ...item, checked: !item.checked } : item
    )))
  }

  function resetChecklist() {
    setItems((current) => current.map((item) => ({ ...item, checked: false })))
  }

  return (
    <section className="panel-card animate-rise-in" style={{ animationDelay: '280ms' }}>
      <div className="flex items-start justify-between gap-3 px-5 pb-3.5 pt-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className={`icon-tile ${isReady ? 'bg-[#6d8f6f]/15 text-[#a8cb9d]' : 'bg-[#855033]/15 text-[#e2a254]'}`}>
            <ClipboardCheck size={17} strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="section-title">ritual de entrada</h2>
              <span className={`soft-badge ${isReady ? 'ready' : ''}`}>{completedCount}/{items.length}</span>
            </div>
            <p className="section-caption">Três decisões antes do primeiro minuto.</p>
          </div>
        </div>
        <button type="button" onClick={resetChecklist} className="icon-button" aria-label="Refazer checklist">
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="space-y-1 px-3 pb-4 sm:px-4">
        {items.map((item) => (
          <button key={item.id} type="button" onClick={() => toggleItem(item.id)} className={`checklist-item ${item.checked ? 'checked' : ''}`} aria-pressed={item.checked}>
            <span className="checklist-box">{item.checked && <Check size={13} strokeWidth={2.6} />}</span>
            <span className="text-left text-xs leading-relaxed">{item.label}</span>
          </button>
        ))}
      </div>

      <div className={`border-t px-5 py-3.5 text-xs sm:px-6 ${isReady ? 'border-[#77996e]/20 bg-[#547852]/8 text-[#a8c99e]' : 'border-[#b87842]/10 bg-[#181211]/35 text-[#a48b79]'}`}>
        <span className="inline-flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${isReady ? 'bg-[#9fc296] shadow-[0_0_10px_rgba(159,194,150,0.8)]' : 'bg-[#c1874a]'}`} />
          {isReady ? 'Tudo pronto. O timer está liberado.' : 'Complete o ritual para liberar o primeiro bloco.'}
        </span>
      </div>
    </section>
  )
}
