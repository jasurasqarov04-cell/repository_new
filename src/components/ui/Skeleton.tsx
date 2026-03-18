import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-surface-raised border border-border rounded-2xl p-5">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="bg-surface-raised border border-border rounded-2xl p-5">
      <Skeleton className="h-3 w-28 mb-4" />
      <Skeleton className={`w-full`} style={{ height }} />
    </div>
  )
}
