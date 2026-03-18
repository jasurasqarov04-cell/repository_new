'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',         label: 'Dashboard' },
  { href: '/habits',   label: 'Habits' },
  { href: '/progress', label: 'Progress' },
  { href: '/history',  label: 'History' },
  { href: '/settings', label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-border bg-surface shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-fg))]">Habit</p>
        <p className="text-xl font-bold tracking-tight leading-none">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]'
                  : 'text-[hsl(var(--muted-fg))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(222_47%_15%)] dark:hover:text-[hsl(220_20%_88%)]'
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom hint */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-[11px] text-[hsl(var(--muted-fg))]">Data via Telegram Bot</p>
        <p className="text-[11px] text-[hsl(var(--muted-fg))] mt-0.5 font-mono">/report</p>
      </div>
    </aside>
  )
}
