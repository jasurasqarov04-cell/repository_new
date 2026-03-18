'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',         label: 'Home' },
  { href: '/habits',   label: 'Habits' },
  { href: '/progress', label: 'Progress' },
  { href: '/history',  label: 'History' },
  { href: '/settings', label: 'Settings' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md">
      <div className="flex items-stretch h-16">
        {NAV.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                active
                  ? 'text-[hsl(var(--accent))]'
                  : 'text-[hsl(var(--muted-fg))]'
              )}
            >
              <span className={cn(
                'w-1.5 h-1.5 rounded-full mb-0.5 transition-colors',
                active ? 'bg-[hsl(var(--accent))]' : 'bg-transparent'
              )} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
