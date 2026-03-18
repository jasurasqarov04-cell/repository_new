'use client'
import type { DashboardData } from '@/types'
import { Card, CardTitle } from './ui/Card'
import { fmtDate } from '@/lib/utils'

export function StreakBlock({ data }: { data: DashboardData }) {
  const { globalStreak, habitMetrics } = data
  const topStreaks = [...habitMetrics]
    .sort((a, b) => b.streak.currentStreak - a.streak.currentStreak)
    .slice(0, 5)

  return (
    <Card>
      <CardTitle>Streaks</CardTitle>

      {/* Global */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[hsl(var(--muted))] rounded-xl p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-fg))] mb-1">Current</p>
          <p className="text-3xl font-extrabold tracking-tight text-[hsl(var(--success))]">
            {globalStreak.currentStreak}
            <span className="text-base font-normal text-[hsl(var(--muted-fg))]">d</span>
          </p>
          {globalStreak.streakStartDate && (
            <p className="text-[10px] text-[hsl(var(--muted-fg))] mt-0.5">
              Since {fmtDate(globalStreak.streakStartDate, 'd MMM')}
            </p>
          )}
        </div>
        <div className="bg-[hsl(var(--muted))] rounded-xl p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-fg))] mb-1">Best</p>
          <p className="text-3xl font-extrabold tracking-tight">
            {globalStreak.bestStreak}
            <span className="text-base font-normal text-[hsl(var(--muted-fg))]">d</span>
          </p>
          <p className="text-[10px] text-[hsl(var(--muted-fg))] mt-0.5">Personal record</p>
        </div>
      </div>

      {/* Per habit */}
      <div className="space-y-2">
        {topStreaks.map(m => (
          <div key={m.habit.id} className="flex items-center gap-3">
            <div
              className="w-1.5 h-8 rounded-full shrink-0"
              style={{ background: m.habit.color ?? 'hsl(var(--accent))' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate">{m.habit.name}</p>
              <p className="text-[10px] text-[hsl(var(--muted-fg))]">
                Best: {m.streak.bestStreak}d
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[hsl(var(--success))]">
                {m.streak.currentStreak}d
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
