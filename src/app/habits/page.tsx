'use client'
import { useMemo } from 'react'
import { useDashboardStore } from '@/store'
import { HabitList } from '@/components/HabitList'
import { FilterBar } from '@/components/FilterBar'
import { HabitRateChart } from '@/components/charts/HabitRateChart'
import { KPISkeleton, ChartSkeleton } from '@/components/ui/Skeleton'
import { ErrorState, EmptyState } from '@/components/ui/EmptyState'

export default function HabitsPage() {
  const data    = useDashboardStore(s => s.data)
  const loading = useDashboardStore(s => s.loading)
  const error   = useDashboardStore(s => s.error)
  const filters = useDashboardStore(s => s.filters)

  const filtered = useMemo(() => {
    if (!data) return []
    return data.habitMetrics.filter(m => {
      if (filters.habitId   && m.habit.id       !== filters.habitId)   return false
      if (filters.category  && m.habit.category !== filters.category)  return false
      return true
    })
  }, [data, filters])

  if (error)          return <ErrorState message={error} />
  if (loading || !data) return <div className="space-y-6"><KPISkeleton /><ChartSkeleton /></div>
  if (!data.habits.length) return <EmptyState title="No habits" description="Add habits via your Telegram bot using /add." />

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight">Habits</h1>
        <p className="text-[13px] text-[hsl(var(--muted-fg))] mt-0.5">
          {data.habits.length} habits tracked
        </p>
      </div>

      <FilterBar habits={data.habits} />

      <HabitRateChart metrics={filtered} />

      <HabitList metrics={filtered} />
    </div>
  )
}
