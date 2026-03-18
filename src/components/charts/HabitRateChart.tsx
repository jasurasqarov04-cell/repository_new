'use client'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, TooltipProps, Cell,
} from 'recharts'
import type { HabitMetrics } from '@/types'
import { fmtPct } from '@/lib/utils'
import { Card, CardTitle } from '../ui/Card'

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as HabitMetrics
  return (
    <div className="bg-surface-overlay border border-border rounded-xl px-3 py-2 shadow-card-hover text-[12px]">
      <p className="font-semibold mb-1">{d.habit.name}</p>
      <p>Rate: <span className="font-semibold">{fmtPct(d.completionRate)}</span></p>
      <p>Done: <span className="font-semibold">{d.completed}</span></p>
      <p>Skip: <span className="font-semibold">{d.skipped}</span></p>
      <p>Missed: <span className="font-semibold">{d.missed}</span></p>
    </div>
  )
}

export function HabitRateChart({ metrics }: { metrics: HabitMetrics[] }) {
  const data = [...metrics].sort((a, b) => b.completionRate - a.completionRate)
  return (
    <Card>
      <CardTitle>Completion Rate per Habit</CardTitle>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36)}>
        <BarChart
          data={data} layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barSize={14}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis
            type="number" domain={[0, 1]}
            tickFormatter={v => fmtPct(v)}
            tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
          />
          <YAxis
            type="category" dataKey="habit.name"
            width={130} tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Bar dataKey="completionRate" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.habit.color ?? 'hsl(var(--accent))'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
