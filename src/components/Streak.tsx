import { Flame } from 'lucide-react'

type StreakProps = {
  currentStreak: number
  hasCompletedToday: boolean
}

export function Streak({ currentStreak, hasCompletedToday }: StreakProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#b87842]/15 bg-[#211815]/70 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm">
      <div className="absolute -right-4 -top-6 h-20 w-20 rounded-full bg-[#dc9145]/8 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#9a5425]/15 text-[#e0a057]">
          <Flame size={16} strokeWidth={1.8} />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#806a5a]">streak</span>
      </div>
      <div className="relative mt-3 flex items-baseline gap-1.5">
        <p className="text-2xl font-semibold tracking-tight text-[#f4e1ce]">{currentStreak}</p>
        <span className="text-xs text-[#a89383]">{currentStreak === 1 ? 'dia' : 'dias'}</span>
      </div>
      <p className="relative mt-0.5 text-xs text-[#a89383]">
        {hasCompletedToday ? 'você apareceu hoje' : 'um foco começa o ritmo'}
      </p>
    </div>
  )
}
