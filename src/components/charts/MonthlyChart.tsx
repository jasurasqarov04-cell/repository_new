'use client'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import type { MonthlySummary } from '@/types'
import { fmtPct } from '@/lib/utils'
import { Card, CardTitle } from '../ui/Card'

export function MonthlyChart({ summaries }: { summaries: MonthlySummary[] }) {
  return (
    <Card>
      <CardTitle>Monthly Trend</CardTitle>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={summaries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tickFormatter={l => l.split(' ')[0].slice(0, 3)}
            tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }} tickLine={false} axisLine={false}
            tickFormatter={v => fmtPct(v)} domain={[0, 1]}
          />
          <Tooltip
            formatter={(v: number) => [fmtPct(v)]}
            contentStyle={{
              background: 'hsl(var(--surface-overlay))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line
            type="monotone" dataKey="rate" name="Completion"
            stroke="hsl(var(--accent))" strokeWidth={2.5}
            dot={{ r: 3, fill: 'hsl(var(--accent))' }} activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
