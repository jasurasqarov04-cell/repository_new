'use client'
import { useEffect, useRef } from 'react'
import { useDashboardStore } from '@/store'
import { useRefresh } from '@/lib/useRefresh'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Header } from './Header'

function DataProvider({ children }: { children: React.ReactNode }) {
  useRefresh()
  return <>{children}</>
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useDashboardStore(s => s.theme)

  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) =>
      dark ? root.classList.add('dark') : root.classList.remove('dark')

    if (theme === 'dark')  { apply(true);  return }
    if (theme === 'light') { apply(false); return }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    apply(mq.matches)
    const h = (e: MediaQueryListEvent) => apply(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [theme])

  return (
    <DataProvider>
      <div className="flex h-screen overflow-hidden bg-surface">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-8">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </DataProvider>
  )
}
