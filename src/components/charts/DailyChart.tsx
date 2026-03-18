'use client'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, TooltipProps,
} from 'recharts'
import type { DailySummary } from '@/types'
import { fmtDate, fmtPct } from '@/lib/utils'
import { Card, CardTitle } from '../ui/Card'

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as DailySummary
  return (
    <div className="bg-surface-overlay border border-border rounded-xl px-3 py-2 shadow-card-hover text-[12px]">
      <p className="font-semibold mb-1">{fmtDate(d.date, 'd MMM')}</p>
      <p className="text-[hsl(var(--success))]">Done: {d.completed}</p>
      <p className="text-[hsl(var(--warning))]">Skip: {d.skipped}</p>
      <p className="text-[hsl(var(--muted-fg))]">Rate: {fmtPct(d.rate)}</p>
    </div>
  )
}

export function DailyChart({ summaries }: { summaries: DailySummary[] }) {
  const data = summaries.slice(-30)
  return (
    <Card>
      <CardTitle>Daily Completion — Last 30 Days</CardTitle>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(142 71% 45%)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradSkip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(38 92% 50%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={d => fmtDate(d, 'd')}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="completed"
            stroke="hsl(142 71% 45%)" strokeWidth={2}
            fill="url(#gradDone)" dot={false}
          />
          <Area
            type="monotone" dataKey="skipped"
            stroke="hsl(38 92% 50%)" strokeWidth={1.5}
            fill="url(#gradSkip)" dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
