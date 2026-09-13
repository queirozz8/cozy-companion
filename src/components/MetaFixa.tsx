import { Check, PencilLine, Target } from 'lucide-react'
import { useState } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'

const META_STORAGE_KEY = 'cozy-companion/meta'
const DEFAULT_META = 'Objetivo: R$10k'

export function MetaFixa() {
  const [savedMeta, setSavedMeta] = usePersistentState(META_STORAGE_KEY, DEFAULT_META)
  const [draftMeta, setDraftMeta] = useState(savedMeta)
  const [isEditing, setIsEditing] = useState(false)

  function saveMeta() {
    const nextMeta = draftMeta.trim() || DEFAULT_META
    setDraftMeta(nextMeta)
    setSavedMeta(nextMeta)
    setIsEditing(false)
  }

  return (
    <section className="rounded-2xl border border-[#b87842]/15 bg-[#211815]/70 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm animate-rise-in" style={{ animationDelay: '170ms' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a48b79]">
          <Target size={14} className="text-[#dc9b50]" strokeWidth={1.8} />
          meta fixa
        </div>
        <button
          type="button"
          aria-label={isEditing ? 'Salvar meta' : 'Editar meta'}
          onClick={() => (isEditing ? saveMeta() : setIsEditing(true))}
          className="rounded-lg p-1.5 text-[#8c7462] transition-colors hover:bg-[#8a4e2b]/15 hover:text-[#e5a45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5a45a]"
        >
          {isEditing ? <Check size={15} /> : <PencilLine size={15} />}
        </button>
      </div>
      {isEditing ? (
        <input
          autoFocus
          value={draftMeta}
          onChange={(event) => setDraftMeta(event.target.value)}
          onBlur={saveMeta}
          onKeyDown={(event) => {
            if (event.key === 'Enter') saveMeta()
            if (event.key === 'Escape') {
              setDraftMeta(savedMeta)
              setIsEditing(false)
            }
          }}
          className="mt-3 w-full border-b border-[#dc9b50]/45 bg-transparent pb-1 text-base font-medium text-[#f3dfca] outline-none placeholder:text-[#806a5a]"
          aria-label="Editar meta fixa"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="mt-2 flex w-full items-center gap-2 text-left text-base font-medium text-[#f3dfca] transition-colors hover:text-[#e8a55c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5a45a]"
        >
          <span className="truncate">{savedMeta}</span>
        </button>
      )}
      <p className="mt-2 text-[11px] text-[#806a5a]">clique para editar · salva ao sair</p>
    </section>
  )
}
