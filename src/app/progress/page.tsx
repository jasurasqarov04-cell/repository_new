'use client'
import { useDashboardStore } from '@/store'
import { DailyChart } from '@/components/charts/DailyChart'
import { WeeklyChart } from '@/components/charts/WeeklyChart'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { WeekdayChart } from '@/components/charts/WeekdayChart'
import { HabitRateChart } from '@/components/charts/HabitRateChart'
import { Heatmap } from '@/components/Heatmap'
import { Card, CardTitle } from '@/components/ui/Card'
import { ChartSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/EmptyState'
import { fmtPct } from '@/lib/utils'

export default function ProgressPage() {
  const data    = useDashboardStore(s => s.data)
  const loading = useDashboardStore(s => s.loading)
  const error   = useDashboardStore(s => s.error)

  if (error)           return <ErrorState message={error} />
  if (loading || !data) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <ChartSkeleton key={i} />)}
      </div>
    )
  }

  // Comparison: current week vs last week
  const weeks = data.weeklySummaries
  const currWeek = weeks.at(-1)
  const prevWeek = weeks.at(-2)
  const weekDelta = currWeek && prevWeek
    ? currWeek.rate - prevWeek.rate : null

  // Strongest / weakest habit
  const sorted = [...data.habitMetrics].sort((a, b) => b.completionRate - a.completionRate)
  const strongest = sorted[0]
  const weakest   = sorted.at(-1)

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight">Progress</h1>
        <p className="text-[13px] text-[hsl(var(--muted-fg))] mt-0.5">Trends, comparisons, analytics</p>
      </div>

      {/* Week comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slide-up">
        <Card>
          <CardTitle>This Week</CardTitle>
          <p className="text-3xl font-extrabold">{fmtPct(currWeek?.rate ?? 0)}</p>
          <p className="text-[12px] text-[hsl(var(--muted-fg))] mt-1">{currWeek?.weekLabel}</p>
        </Card>
        <Card>
          <CardTitle>Last Week</CardTitle>
          <p className="text-3xl font-extrabold">{fmtPct(prevWeek?.rate ?? 0)}</p>
          <p className="text-[12px] text-[hsl(var(--muted-fg))] mt-1">{prevWeek?.weekLabel}</p>
        </Card>
        <Card>
          <CardTitle>Change</CardTitle>
          <p className={`text-3xl font-extrabold ${weekDelta !== null && weekDelta >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
            {weekDelta !== null ? `${weekDelta >= 0 ? '+' : ''}${fmtPct(weekDelta)}` : '—'}
          </p>
          <p className="text-[12px] text-[hsl(var(--muted-fg))] mt-1">vs last week</p>
        </Card>
      </div>

      {/* Strongest / Weakest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '60ms' }}>
        <Card>
          <CardTitle>Strongest Habit</CardTitle>
          <p className="font-bold text-lg">{strongest?.habit.name ?? '—'}</p>
          <p className="text-[hsl(var(--success))] font-extrabold text-2xl mt-1">
            {strongest ? fmtPct(strongest.completionRate) : '—'}
          </p>
        </Card>
        <Card>
          <CardTitle>Weakest Habit</CardTitle>
          <p className="font-bold text-lg">{weakest?.habit.name ?? '—'}</p>
          <p className="text-[hsl(var(--danger))] font-extrabold text-2xl mt-1">
            {weakest ? fmtPct(weakest.completionRate) : '—'}
          </p>
        </Card>
      </div>

      <DailyChart summaries={data.dailySummaries} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeeklyChart summaries={data.weeklySummaries} />
        <MonthlyChart summaries={data.monthlySummaries} />
      </div>
      <WeekdayChart summaries={data.dailySummaries} />
      <HabitRateChart metrics={data.habitMetrics} />
      <Heatmap summaries={data.dailySummaries} />
    </div>
  )
}
