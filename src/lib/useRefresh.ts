'use client'
import { useCallback, useEffect, useRef } from 'react'
import { useDashboardStore } from '@/store'
import type { DashboardData } from '@/types'

async function fetchDashboard(uid?: string | null): Promise<DashboardData> {
  const url = uid ? `/api/habits?uid=${encodeURIComponent(uid)}` : '/api/habits'
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function postRefresh(uid?: string | null): Promise<DashboardData> {
  const res = await fetch('/api/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: uid ?? undefined }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Refresh failed: HTTP ${res.status}`)
  const json = await res.json()
  return json.data as DashboardData
}

export function useRefresh() {
  const userId        = useDashboardStore(s => s.userId)
  const autoRefresh   = useDashboardStore(s => s.autoRefresh)
  const intervalMs    = useDashboardStore(s => s.refreshIntervalMs)
  const setData       = useDashboardStore(s => s.setData)
  const setLoading    = useDashboardStore(s => s.setLoading)
  const setError      = useDashboardStore(s => s.setError)
  const setRefreshing = useDashboardStore(s => s.setRefreshing)
  const setLastUpdated= useDashboardStore(s => s.setLastUpdated)

  const initialized = useRef(false)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    setError(null)
    try {
      const data = await fetchDashboard(userId)
      setData(data)
      setLastUpdated(new Date().toISOString())
    } catch (e) {
      setError(String(e))
    }
  }, [userId, setData, setLoading, setError, setRefreshing, setLastUpdated])

  const manualRefresh = useCallback(async () => {
    setRefreshing(true)
    setError(null)
    try {
      const data = await postRefresh(userId)
      setData(data)
      setLastUpdated(new Date().toISOString())
    } catch (e) {
      // fallback to GET
      await load(true)
    }
  }, [userId, setData, setError, setRefreshing, setLastUpdated, load])

  // Initial load — only once
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    load(false)
  }, [load])

  // Auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(() => load(true), intervalMs)
    return () => clearInterval(id)
  }, [autoRefresh, intervalMs, load])

  return { manualRefresh }
}
