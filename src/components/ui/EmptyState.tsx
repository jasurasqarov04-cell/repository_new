export function EmptyState({
  title = 'No data yet',
  description = 'Start tracking habits with your Telegram bot.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--muted))] mb-4" />
      <p className="font-semibold text-base">{title}</p>
      <p className="text-[13px] text-[hsl(var(--muted-fg))] mt-1 max-w-xs">{description}</p>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--danger-muted))] mb-4" />
      <p className="font-semibold text-base">Something went wrong</p>
      <p className="text-[12px] text-[hsl(var(--muted-fg))] mt-1 max-w-sm font-mono">{message}</p>
    </div>
  )
}
