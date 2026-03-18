'use client'
import { useDashboardStore } from '@/store'
import type { Habit, HabitStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { value: HabitStatus | ''; label: string }[] = [
  { value: '',          label: 'All' },
  { value: 'completed', label: 'Done' },
  { value: 'skipped',   label: 'Skip' },
  { value: 'missed',    label: 'Missed' },
]

export function FilterBar({ habits }: { habits: Habit[] }) {
  const { filters, setFilter, resetFilters } = useDashboardStore()
  const categories = ['', ...Array.from(new Set(habits.map(h => h.category)))]

  const hasActive =
    filters.habitId || filters.category || filters.status ||
    filters.dateFrom || filters.dateTo

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Status */}
      <div className="flex gap-1 bg-[hsl(var(--muted))] p-1 rounded-xl">
        {STATUS_OPTIONS.map(o => (
          <button
            key={o.value}
            onClick={() => setFilter('status', o.value || null)}
            className={cn(
              'px-3 py-1 rounded-lg text-[12px] font-medium transition-all',
              (filters.status ?? '') === o.value
                ? 'bg-surface shadow-sm text-inherit'
                : 'text-[hsl(var(--muted-fg))] hover:text-inherit'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Category */}
      <select
        value={filters.category ?? ''}
        onChange={e => setFilter('category', e.target.value || null)}
        className="text-[12px] px-3 py-1.5 rounded-xl border border-border bg-surface-raised
          text-inherit outline-none focus:border-[hsl(var(--accent))] transition-colors cursor-pointer"
      >
        {categories.map(c => (
          <option key={c} value={c}>{c || 'All categories'}</option>
        ))}
      </select>

      {/* Habit */}
      <select
        value={filters.habitId ?? ''}
        onChange={e => setFilter('habitId', e.target.value || null)}
        className="text-[12px] px-3 py-1.5 rounded-xl border border-border bg-surface-raised
          text-inherit outline-none focus:border-[hsl(var(--accent))] transition-colors cursor-pointer"
      >
        <option value="">All habits</option>
        {habits.map(h => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>

      {/* Date range */}
      <input
        type="date"
        value={filters.dateFrom ?? ''}
        onChange={e => setFilter('dateFrom', e.target.value || null)}
        className="text-[12px] px-3 py-1.5 rounded-xl border border-border bg-surface-raised
          text-inherit outline-none focus:border-[hsl(var(--accent))] transition-colors"
      />
      <input
        type="date"
        value={filters.dateTo ?? ''}
        onChange={e => setFilter('dateTo', e.target.value || null)}
        className="text-[12px] px-3 py-1.5 rounded-xl border border-border bg-surface-raised
          text-inherit outline-none focus:border-[hsl(var(--accent))] transition-colors"
      />

      {hasActive && (
        <button
          onClick={resetFilters}
          className="text-[12px] font-medium px-3 py-1.5 rounded-xl
            text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger-muted))] transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
