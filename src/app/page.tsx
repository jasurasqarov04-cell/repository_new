'use client'
import { useDashboardStore } from '@/store'
import { KPIGrid } from '@/components/KPIGrid'
import { TodayBlock } from '@/components/TodayBlock'
import { StreakBlock } from '@/components/StreakBlock'
import { Heatmap } from '@/components/Heatmap'
import { DailyChart } from '@/components/charts/DailyChart'
import { WeeklyChart } from '@/components/charts/WeeklyChart'
import { WeekdayChart } from '@/components/charts/WeekdayChart'
import { KPISkeleton, ChartSkeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/EmptyState'
import { format } from 'date-fns'

export default function DashboardPage() {
  const data    = useDashboardStore(s => s.data)
  const loading = useDashboardStore(s => s.loading)
  const error   = useDashboardStore(s => s.error)

  if (error) return <ErrorState message={error} />

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 skeleton rounded-lg mb-1" />
        <KPISkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartSkeleton height={300} />
          <div className="lg:col-span-2"><ChartSkeleton /></div>
        </div>
      </div>
    )
  }

  const today = format(new Date(), 'EEEE, d MMMM')

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="animate-fade-in">
        <p className="text-[13px] text-[hsl(var(--muted-fg))]">{today}</p>
        <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">Overview</h1>
      </div>

      {/* KPIs */}
      <KPIGrid data={data} />

      {/* Today + Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="animate-slide-up" style={{ animationDelay: '80ms' }}>
          <TodayBlock data={data} />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <StreakBlock data={data} />
        </div>
        {/* Daily chart fills remaining width */}
        <div className="animate-slide-up lg:col-span-1" style={{ animationDelay: '120ms' }}>
          <DailyChart summaries={data.dailySummaries} />
        </div>
      </div>

      {/* Heatmap */}
      <div className="animate-slide-up" style={{ animationDelay: '140ms' }}>
        <Heatmap summaries={data.dailySummaries} />
      </div>

      {/* Weekly + Weekday charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="animate-slide-up" style={{ animationDelay: '160ms' }}>
          <WeeklyChart summaries={data.weeklySummaries} />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '180ms' }}>
          <WeekdayChart summaries={data.dailySummaries} />
        </div>
      </div>
    </div>
  )
}
