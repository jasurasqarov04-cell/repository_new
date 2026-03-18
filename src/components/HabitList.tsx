'use client'
import type { HabitMetrics } from '@/types'
import { cn, fmtPct, fmtDate } from '@/lib/utils'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

export function HabitList({ metrics }: { metrics: HabitMetrics[] }) {
  if (!metrics.length) return null

  return (
    <div className="space-y-3">
      {metrics.map((m, i) => (
        <Card
          key={m.habit.id}
          className="animate-slide-up"
          
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <div className="flex items-start gap-4">
            {/* Color strip */}
            <div
              className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
              style={{ background: m.habit.color ?? 'hsl(var(--accent))' }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-semibold text-[15px]">{m.habit.name}</p>
                <Badge variant="neutral">{m.habit.category}</Badge>
              </div>
              <p className="text-[11px] text-[hsl(var(--muted-fg))] mb-3">
                Since {fmtDate(m.habit.createdAt, 'd MMM yyyy')}
              </p>

              {/* Mini stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
                {[
                  { label: 'All-time rate',  value: fmtPct(m.completionRate),  accent: m.completionRate >= 0.75 ? 'success' : m.completionRate >= 0.5 ? 'warning' : 'danger' },
                  { label: 'This week',      value: fmtPct(m.weekRate),        accent: m.weekRate >= 0.75 ? 'success' : m.weekRate >= 0.5 ? 'warning' : 'danger' },
                  { label: 'This month',     value: fmtPct(m.monthRate),       accent: m.monthRate >= 0.75 ? 'success' : undefined },
                  { label: 'Consistency',    value: fmtPct(m.consistency),     accent: undefined },
                  { label: 'Current streak', value: `${m.streak.currentStreak}d`, accent: m.streak.currentStreak >= 7 ? 'success' : undefined },
                  { label: 'Best streak',    value: `${m.streak.bestStreak}d`, accent: undefined },
                  { label: 'Completed',      value: m.completed,               accent: undefined },
                  { label: 'Skipped',        value: m.skipped,                 accent: m.skipped > 0 ? 'warning' : undefined },
                ].map(stat => (
                  <div key={stat.label}>
                    <p className="text-[10px] text-[hsl(var(--muted-fg))] uppercase tracking-wide">{stat.label}</p>
                    <p className={cn(
                      'text-sm font-bold',
                      stat.accent === 'success' && 'text-[hsl(var(--success))]',
                      stat.accent === 'warning' && 'text-[hsl(var(--warning))]',
                      stat.accent === 'danger'  && 'text-[hsl(var(--danger))]',
                    )}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Big completion rate circle */}
            <div className="shrink-0 text-right">
              <p className={cn(
                'text-2xl font-extrabold tabular-nums',
                m.completionRate >= 0.75 ? 'text-[hsl(var(--success))]'
                  : m.completionRate >= 0.5  ? 'text-[hsl(var(--warning))]'
                  : 'text-[hsl(var(--danger))]',
              )}>
                {fmtPct(m.completionRate)}
              </p>
              <p className="text-[10px] text-[hsl(var(--muted-fg))]">completion</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full bg-[hsl(var(--muted))] mt-4 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: fmtPct(m.completionRate),
                background: m.habit.color ?? 'hsl(var(--accent))',
              }}
            />
          </div>
        </Card>
      ))}
    </div>
  )
}
