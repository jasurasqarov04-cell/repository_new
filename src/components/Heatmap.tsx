'use client'
import { useMemo } from 'react'
import {
  eachDayOfInterval, format, startOfYear, endOfToday,
  getDay, startOfWeek, addDays, subDays,
} from 'date-fns'
import type { DailySummary } from '@/types'
import { cn } from '@/lib/utils'
import { Card, CardTitle } from './ui/Card'

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LABELS   = ['', 'Mon', '', 'Wed', '', 'Fri', '']

function intensityClass(rate: number | undefined): string {
  if (rate === undefined) return 'bg-[hsl(var(--muted))]'
  if (rate === 0)         return 'bg-[hsl(var(--muted))]'
  if (rate < 0.25)        return 'bg-[hsl(142_71%_45%/0.2)]'
  if (rate < 0.5)         return 'bg-[hsl(142_71%_45%/0.4)]'
  if (rate < 0.75)        return 'bg-[hsl(142_71%_45%/0.65)]'
  return 'bg-[hsl(142_71%_45%)]'
}

export function Heatmap({ summaries }: { summaries: DailySummary[] }) {
  const rateMap = useMemo(() => {
    const m = new Map<string, number>()
    for (const s of summaries) m.set(s.date, s.rate)
    return m
  }, [summaries])

  // Build a 52-week grid ending today
  const today    = endOfToday()
  const start    = subDays(today, 52 * 7 - 1)
  // Align start to Sunday
  const gridStart = startOfWeek(start, { weekStartsOn: 0 })
  const days     = eachDayOfInterval({ start: gridStart, end: today })

  // Group into columns of 7 (weeks)
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  // Month label positions
  const monthPositions: { month: number; col: number }[] = []
  weeks.forEach((week, col) => {
    const firstDay = week[0]
    if (firstDay && firstDay.getDate() <= 7) {
      monthPositions.push({ month: firstDay.getMonth(), col })
    }
  })

  return (
    <Card>
      <CardTitle>Activity Heatmap — Last 52 Weeks</CardTitle>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-0">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-[3px] mr-1.5">
            <div className="h-4" /> {/* spacer for month labels */}
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="h-[11px] text-[9px] text-[hsl(var(--muted-fg))] leading-none">
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div>
            {/* Month labels */}
            <div className="flex gap-[3px] mb-1 h-4">
              {weeks.map((week, col) => {
                const mp = monthPositions.find(m => m.col === col)
                return (
                  <div key={col} className="w-[11px]">
                    {mp !== undefined && (
                      <span className="text-[9px] text-[hsl(var(--muted-fg))] whitespace-nowrap">
                        {MONTH_LABELS[mp.month]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Cells */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    const dateStr = format(day, 'yyyy-MM-dd')
                    const rate    = rateMap.get(dateStr)
                    const isFuture = day > today
                    return (
                      <div
                        key={di}
                        title={`${format(day, 'd MMM')} — ${rate !== undefined ? `${Math.round(rate * 100)}%` : 'no data'}`}
                        className={cn(
                          'w-[11px] h-[11px] rounded-[2px] transition-colors cursor-default',
                          isFuture ? 'opacity-0' : intensityClass(rate),
                        )}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px] text-[hsl(var(--muted-fg))]">Less</span>
        {[undefined, 0.1, 0.4, 0.65, 1].map((r, i) => (
          <div key={i} className={cn('w-[11px] h-[11px] rounded-[2px]', intensityClass(r))} />
        ))}
        <span className="text-[10px] text-[hsl(var(--muted-fg))]">More</span>
      </div>
    </Card>
  )
}
