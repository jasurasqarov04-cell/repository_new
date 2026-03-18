'use client'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, TooltipProps, Cell,
} from 'recharts'
import type { WeeklySummary } from '@/types'
import { fmtPct } from '@/lib/utils'
import { Card, CardTitle } from '../ui/Card'

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as WeeklySummary
  return (
    <div className="bg-surface-overlay border border-border rounded-xl px-3 py-2 shadow-card-hover text-[12px]">
      <p className="font-semibold mb-1">{d.weekLabel}</p>
      <p>Done: <span className="font-semibold">{d.completed}</span></p>
      <p>Skip: <span className="font-semibold">{d.skipped}</span></p>
      <p>Rate: <span className="font-semibold">{fmtPct(d.rate)}</span></p>
    </div>
  )
}

export function WeeklyChart({ summaries }: { summaries: WeeklySummary[] }) {
  const data = summaries.slice(-12)
  return (
    <Card>
      <CardTitle>Weekly Overview — Last 12 Weeks</CardTitle>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="weekLabel" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.rate >= 0.75 ? 'hsl(142 71% 45%)' : d.rate >= 0.5 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
          <Bar dataKey="skipped" radius={[4, 4, 0, 0]} fill="hsl(38 92% 50%)" fillOpacity={0.35} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
