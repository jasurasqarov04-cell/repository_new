'use client'
import { formatDistanceToNow } from 'date-fns'
import { useDashboardStore } from '@/store'
import { useRefresh } from '@/lib/useRefresh'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

export function Header() {
  const isRefreshing = useDashboardStore(s => s.isRefreshing)
  const lastUpdated  = useDashboardStore(s => s.lastUpdated)
  const error        = useDashboardStore(s => s.error)
  const { manualRefresh } = useRefresh()

  const label = lastUpdated
    ? `Updated ${formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}`
    : null

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-4 sm:px-6 gap-3 shrink-0">
      <div className="md:hidden font-bold text-sm tracking-tight">Dashboard</div>
      <div className="flex-1" />
      {error && (
        <span className="hidden sm:block text-[11px] text-[hsl(var(--danger))] font-medium">
          Sync failed
        </span>
      )}
      {!error && label && (
        <span className="hidden sm:block text-[11px] text-[hsl(var(--muted-fg))]">{label}</span>
      )}
      <button
        onClick={manualRefresh}
        disabled={isRefreshing}
        className={cn(
          'text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border transition-all duration-150',
          isRefreshing
            ? 'opacity-50 cursor-not-allowed bg-[hsl(var(--muted))] text-[hsl(var(--muted-fg))]'
            : 'bg-surface hover:bg-[hsl(var(--muted))]'
        )}
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
      <ThemeToggle />
    </header>
  )
}
