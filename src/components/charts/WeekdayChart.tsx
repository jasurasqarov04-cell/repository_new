'use client'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, TooltipProps, Cell,
} from 'recharts'
import { getDay } from 'date-fns'
import type { DailySummary } from '@/types'
import { fmtPct } from '@/lib/utils'
import { Card, CardTitle } from '../ui/Card'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function WeekdayChart({ summaries }: { summaries: DailySummary[] }) {
  // Aggregate by weekday
  const byDay: Record<number, { total: number; completed: number; days: number }> = {}
  for (let i = 0; i < 7; i++) byDay[i] = { total: 0, completed: 0, days: 0 }

  for (const s of summaries) {
    const dow = getDay(new Date(s.date))
    byDay[dow].total     += s.total
    byDay[dow].completed += s.completed
    byDay[dow].days++
  }

  const data = DAY_NAMES.map((name, i) => ({
    name,
    rate: byDay[i].total ? byDay[i].completed / byDay[i].total : 0,
    avg:  byDay[i].days  ? byDay[i].completed / byDay[i].days  : 0,
  }))

  return (
    <Card>
      <CardTitle>Activity by Day of Week</CardTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
            tickFormatter={v => fmtPct(v)}
            domain={[0, 1]}
          />
          <Tooltip
            formatter={(v: number) => [fmtPct(v), 'Rate']}
            contentStyle={{
              background: 'hsl(var(--surface-overlay))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill="hsl(var(--accent))"
                fillOpacity={0.3 + d.rate * 0.65}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
