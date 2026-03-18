'use client'
import { useMemo } from 'react'
import { useDashboardStore } from '@/store'
import { HistoryTable } from '@/components/HistoryTable'
import { FilterBar } from '@/components/FilterBar'
import { ChartSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/EmptyState'

export default function HistoryPage() {
  const data    = useDashboardStore(s => s.data)
  const loading = useDashboardStore(s => s.loading)
  const error   = useDashboardStore(s => s.error)
  const filters = useDashboardStore(s => s.filters)

  const filteredEntries = useMemo(() => {
    if (!data) return []
    return data.entries.filter(e => {
      if (filters.habitId  && e.habitId !== filters.habitId)  return false
      if (filters.status   && e.status  !== filters.status)   return false
      if (filters.dateFrom && e.date    <  filters.dateFrom)  return false
      if (filters.dateTo   && e.date    >  filters.dateTo)    return false
      if (filters.category) {
        const habit = data.habits.find(h => h.id === e.habitId)
        if (habit?.category !== filters.category) return false
      }
      return true
    })
  }, [data, filters])

  if (error)           return <ErrorState message={error} />
  if (loading || !data) return <ChartSkeleton height={400} />

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight">History</h1>
        <p className="text-[13px] text-[hsl(var(--muted-fg))] mt-0.5">
          {filteredEntries.filter(e => e.status !== 'pending').length} entries
        </p>
      </div>

      <FilterBar habits={data.habits} />

      <HistoryTable entries={filteredEntries} habits={data.habits} limit={200} />
    </div>
  )
}
