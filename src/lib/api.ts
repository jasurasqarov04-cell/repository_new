import type { DashboardData } from '@/types'
import { generateMockDashboard } from '@/mock/data'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

// ── Fetch from real backend ───────────────────────────────────────────────────

async function fetchFromAPI(userId: string): Promise<DashboardData> {
  const res = await fetch(`${API_URL}/dashboard?uid=${userId}`, {
    next: { revalidate: 60 },
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function getDashboardData(userId?: string): Promise<DashboardData> {
  // Use mock when no API URL configured
  if (!API_URL) return generateMockDashboard()

  try {
    return await fetchFromAPI(userId ?? 'default')
  } catch (err) {
    console.warn('[habit-dashboard] API unavailable, using mock data.', err)
    return generateMockDashboard()
  }
}

// ── POST helpers (for real bot backend) ──────────────────────────────────────

export async function markDone(habitId: string, userId: string) {
  if (!API_URL) return { ok: true }
  return fetch(`${API_URL}/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habitId, userId, status: 'completed' }),
  }).then(r => r.json())
}

export async function markSkip(habitId: string, userId: string) {
  if (!API_URL) return { ok: true }
  return fetch(`${API_URL}/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ habitId, userId, status: 'skipped' }),
  }).then(r => r.json())
}
