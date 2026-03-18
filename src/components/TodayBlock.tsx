'use client'
import { cn } from '@/lib/utils'
import type { DashboardData } from '@/types'
import { StatusBadge } from './ui/Badge'
import { Card, CardTitle } from './ui/Card'

export function TodayBlock({ data }: { data: DashboardData }) {
  const { habits, todayEntries } = data
  const entryByHabit = new Map(todayEntries.map(e => [e.habitId, e]))

  const done    = todayEntries.filter(e => e.status === 'completed').length
  const total   = habits.length
  const pct     = total ? Math.round((done / total) * 100) : 0
  const remaining = total - todayEntries.filter(e => e.status !== 'pending').length

  return (
    <Card>
      <CardTitle>Today</CardTitle>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-2xl font-extrabold tracking-tight">{done}<span className="text-base font-normal text-[hsl(var(--muted-fg))]"> / {total}</span></span>
          <span className="text-sm font-semibold text-[hsl(var(--muted-fg))]">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
          <div
            className="h-full rounded-full bg-[hsl(var(--success))] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        {remaining > 0 && (
          <p className="text-[11px] text-[hsl(var(--muted-fg))] mt-1.5">
            {remaining} habit{remaining !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

      {/* Habit list */}
      <div className="space-y-2">
        {habits.map(h => {
          const entry = entryByHabit.get(h.id)
          const status = entry?.status ?? 'pending'
          return (
            <div
              key={h.id}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl',
                'border border-border transition-colors',
                status === 'completed' && 'bg-[hsl(var(--success-muted))] border-transparent',
                status === 'skipped'   && 'bg-[hsl(var(--warning-muted))] border-transparent',
                status === 'missed'    && 'bg-[hsl(var(--danger-muted))]  border-transparent',
              )}
            >
              <div>
                <p className={cn(
                  'text-[13px] font-medium leading-none',
                  status === 'completed' && 'line-through text-[hsl(var(--muted-fg))]',
                )}>
                  {h.name}
                </p>
                <p className="text-[10px] text-[hsl(var(--muted-fg))] mt-0.5">{h.category}</p>
              </div>
              <StatusBadge status={status} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
