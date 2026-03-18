'use client'
import type { HabitEntry, Habit } from '@/types'
import { fmtDate } from '@/lib/utils'
import { StatusBadge } from './ui/Badge'
import { Card, CardTitle } from './ui/Card'
import { EmptyState } from './ui/EmptyState'

interface Props {
  entries: HabitEntry[]
  habits: Habit[]
  limit?: number
}

export function HistoryTable({ entries, habits, limit = 100 }: Props) {
  const habitMap = new Map(habits.map(h => [h.id, h]))
  const sorted   = [...entries]
    .filter(e => e.status !== 'pending')
    .sort((a, b) => b.date.localeCompare(a.date) || b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)

  if (!sorted.length) return <EmptyState title="No history yet" description="Complete some habits to see them here." />

  return (
    <Card>
      <CardTitle>Entry Log</CardTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['Date', 'Habit', 'Category', 'Status', 'Note'].map(h => (
                <th key={h} className="text-left py-2 pr-4 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-fg))] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => {
              const habit = habitMap.get(e.habitId)
              return (
                <tr key={e.id} className="border-b border-border last:border-0 hover:bg-[hsl(var(--muted))] transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-[12px] text-[hsl(var(--muted-fg))] whitespace-nowrap">
                    {fmtDate(e.date, 'd MMM yyyy')}
                  </td>
                  <td className="py-2.5 pr-4 font-medium whitespace-nowrap">
                    {habit?.name ?? e.habitId}
                  </td>
                  <td className="py-2.5 pr-4 text-[hsl(var(--muted-fg))] whitespace-nowrap">
                    {habit?.category ?? '—'}
                  </td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="py-2.5 text-[hsl(var(--muted-fg))] max-w-[180px] truncate">
                    {e.note ?? '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
