'use client'
import { useDashboardStore } from '@/store'
import { cn } from '@/lib/utils'
import type { Theme } from '@/types'

const options: { value: Theme; label: string }[] = [
  { value: 'light',  label: 'L' },
  { value: 'dark',   label: 'D' },
  { value: 'system', label: 'S' },
]

export function ThemeToggle() {
  const theme    = useDashboardStore(s => s.theme)
  const setTheme = useDashboardStore(s => s.setTheme)

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5 bg-[hsl(var(--muted))]">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => setTheme(o.value)}
          className={cn(
            'w-6 h-6 rounded-md text-[10px] font-bold transition-all',
            theme === o.value
              ? 'bg-surface text-[hsl(222_47%_15%)] dark:text-[hsl(220_20%_88%)] shadow-sm'
              : 'text-[hsl(var(--muted-fg))] hover:text-[hsl(var(--muted-fg))]'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
