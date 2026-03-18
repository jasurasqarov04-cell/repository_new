'use client'
import { cn, fmtPct } from '@/lib/utils'
import type { DashboardData } from '@/types'
import { format } from 'date-fns'

interface KPIGridProps { data: DashboardData }

interface Stat {
  label: string
  value: string | number
  sub?: string
  accent?: 'success' | 'warning' | 'danger' | 'accent'
}

function rateAccent(v: number): Stat['accent'] {
  if (v >= 0.75) return 'success'
  if (v >= 0.5)  return 'warning'
  return 'danger'
}

export function KPIGrid({ data }: KPIGridProps) {
  const today       = format(new Date(), 'yyyy-MM-dd')
  const todayDone   = data.todayEntries.filter(e => e.status === 'completed').length
  const todaySkip   = data.todayEntries.filter(e => e.status === 'skipped').length
  const todayTotal  = data.habits.length

  const weekSummary  = data.weeklySummaries.at(-1)
  const monthSummary = data.monthlySummaries.at(-1)

  const totalCompleted = data.entries.filter(e => e.status === 'completed').length
  const discipline     = data.habitMetrics.reduce((s, m) => s + m.consistency, 0) / (data.habitMetrics.length || 1)

  const stats: Stat[] = [
    {
      label: 'Total Habits',
      value: data.habits.length,
      sub:   'being tracked',
    },
    {
      label:  'Done Today',
      value:  `${todayDone} / ${todayTotal}`,
      sub:    fmtPct(todayTotal ? todayDone / todayTotal : 0),
      accent: rateAccent(todayTotal ? todayDone / todayTotal : 0),
    },
    {
      label:  'Skipped Today',
      value:  todaySkip,
      sub:    'habits skipped',
      accent: todaySkip > 0 ? 'warning' : undefined,
    },
    {
      label:  'Week Rate',
      value:  fmtPct(weekSummary?.rate ?? 0),
      sub:    weekSummary?.weekLabel ?? 'this week',
      accent: rateAccent(weekSummary?.rate ?? 0),
    },
    {
      label:  'Month Rate',
      value:  fmtPct(monthSummary?.rate ?? 0),
      sub:    monthSummary?.label ?? 'this month',
      accent: rateAccent(monthSummary?.rate ?? 0),
    },
    {
      label:  'Current Streak',
      value:  `${data.globalStreak.currentStreak}d`,
      sub:    'consecutive active days',
      accent: data.globalStreak.currentStreak >= 7 ? 'success' : undefined,
    },
    {
      label:  'Best Streak',
      value:  `${data.globalStreak.bestStreak}d`,
      sub:    'personal record',
    },
    {
      label:  'Total Completions',
      value:  totalCompleted,
      sub:    'all time',
    },
    {
      label:  'Discipline',
      value:  fmtPct(discipline),
      sub:    'done / (done + missed)',
      accent: rateAccent(discipline),
    },
  ]

  const accentClasses: Record<NonNullable<Stat['accent']>, string> = {
    success: 'text-[hsl(var(--success))]',
    warning: 'text-[hsl(var(--warning))]',
    danger:  'text-[hsl(var(--danger))]',
    accent:  'text-[hsl(var(--accent))]',
  }
  const accentBg: Record<NonNullable<Stat['accent']>, string> = {
    success: 'border-l-[hsl(var(--success))]',
    warning: 'border-l-[hsl(var(--warning))]',
    danger:  'border-l-[hsl(var(--danger))]',
    accent:  'border-l-[hsl(var(--accent))]',
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{ animationDelay: `${i * 40}ms` }}
          className={cn(
            'bg-surface-raised border border-border rounded-2xl p-4',
            'animate-slide-up shadow-card hover:shadow-card-hover transition-shadow',
            s.accent && 'border-l-[3px]',
            s.accent && accentBg[s.accent],
          )}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-fg))] mb-2">
            {s.label}
          </p>
          <p className={cn(
            'text-2xl font-extrabold tracking-tight leading-none mb-1',
            s.accent ? accentClasses[s.accent] : 'text-inherit',
          )}>
            {s.value}
          </p>
          {s.sub && (
            <p className="text-[11px] text-[hsl(var(--muted-fg))]">{s.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
