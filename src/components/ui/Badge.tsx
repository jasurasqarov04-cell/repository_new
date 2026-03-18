import { cn } from '@/lib/utils'
import type { HabitStatus } from '@/types'

const variants = {
  completed: 'bg-[hsl(var(--success-muted))] text-[hsl(var(--success))]',
  skipped:   'bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning))]',
  missed:    'bg-[hsl(var(--danger-muted))]  text-[hsl(var(--danger))]',
  pending:   'bg-[hsl(var(--muted))] text-[hsl(var(--muted-fg))]',
  neutral:   'bg-[hsl(var(--muted))] text-[hsl(var(--muted-fg))]',
}

const labels: Record<HabitStatus, string> = {
  completed: 'Done',
  skipped:   'Skip',
  missed:    'Missed',
  pending:   'Pending',
}

export function StatusBadge({ status }: { status: HabitStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold',
      variants[status],
    )}>
      {labels[status]}
    </span>
  )
}

export function Badge({
  children,
  variant = 'neutral',
  className,
}: {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
