import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardData, Filters, Theme } from '@/types'

interface DashboardStore {
  // Data
  data: DashboardData | null
  loading: boolean
  isRefreshing: boolean
  error: string | null
  lastUpdated: string | null
  setData: (data: DashboardData) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  setRefreshing: (v: boolean) => void
  setLastUpdated: (iso: string) => void

  // Filters
  filters: Filters
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  resetFilters: () => void

  // Settings (persisted)
  theme: Theme
  userId: string | null
  autoRefresh: boolean
  refreshIntervalMs: number
  dataSource: 'mock' | 'google_sheets'
  sheetsEndpoint: string
  setTheme: (t: Theme) => void
  setUserId: (id: string | null) => void
  setAutoRefresh: (v: boolean) => void
  setRefreshInterval: (ms: number) => void
  setDataSource: (s: 'mock' | 'google_sheets') => void
  setSheetsEndpoint: (url: string) => void
}

const defaultFilters: Filters = {
  dateFrom: null, dateTo: null, habitId: null, category: null, status: null,
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      data: null, loading: true, isRefreshing: false, error: null, lastUpdated: null,
      setData:        (data)    => set({ data, loading: false, error: null, isRefreshing: false }),
      setLoading:     (loading) => set({ loading }),
      setError:       (error)   => set({ error, loading: false, isRefreshing: false }),
      setRefreshing:  (v)       => set({ isRefreshing: v }),
      setLastUpdated: (iso)     => set({ lastUpdated: iso }),

      filters: defaultFilters,
      setFilter: (key, value) => set(s => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () => set({ filters: defaultFilters }),

      theme: 'system', userId: null, autoRefresh: true,
      refreshIntervalMs: 60_000, dataSource: 'mock', sheetsEndpoint: '',
      setTheme:           (theme)             => set({ theme }),
      setUserId:          (userId)            => set({ userId }),
      setAutoRefresh:     (autoRefresh)       => set({ autoRefresh }),
      setRefreshInterval: (refreshIntervalMs) => set({ refreshIntervalMs }),
      setDataSource:      (dataSource)        => set({ dataSource }),
      setSheetsEndpoint:  (sheetsEndpoint)    => set({ sheetsEndpoint }),
    }),
    {
      name: 'habit-dashboard-v2',
      partialize: (s) => ({
        theme: s.theme, userId: s.userId, autoRefresh: s.autoRefresh,
        refreshIntervalMs: s.refreshIntervalMs, dataSource: s.dataSource,
        sheetsEndpoint: s.sheetsEndpoint,
      }),
    },
  ),
)
