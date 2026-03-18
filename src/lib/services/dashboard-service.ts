/**
 * Orchestrates data loading from the configured source and
 * builds the full DashboardData object.
 */
import type { DashboardData } from '@/types'
import { extractHabits, rowsToEntries } from '@/lib/adapters/habits-adapter'
import { fetchSheetRows } from '@/lib/api/google-sheets'
import {
  buildDailySummaries,
  buildWeeklySummaries,
  buildMonthlySummaries,
  buildHabitMetrics,
  buildGlobalStreak,
  generateMockDashboard,
} from '@/mock/data'
import { format } from 'date-fns'

type DataSource = 'mock' | 'google_sheets'

function getDataSource(): DataSource {
  return (process.env.DATA_SOURCE as DataSource) === 'google_sheets'
    ? 'google_sheets'
    : 'mock'
}

export async function buildDashboard(userId?: string): Promise<DashboardData> {
  const source = getDataSource()

  // ── Mock mode ────────────────────────────────────────────────────────────────
  if (source !== 'google_sheets') {
    return generateMockDashboard()
  }

  // ── Google Sheets mode ───────────────────────────────────────────────────────
  const endpoint = process.env.GOOGLE_SHEETS_ENDPOINT
  if (!endpoint) {
    console.warn('[dashboard-service] GOOGLE_SHEETS_ENDPOINT not set, falling back to mock')
    return generateMockDashboard()
  }

  const rawRows = await fetchSheetRows(endpoint, userId)

  // Filter to current user if rows contain mixed users
  const userRows = userId
    ? rawRows.filter(r => String(r.user_id) === String(userId))
    : rawRows

  const habits           = extractHabits(userRows)
  const entries          = rowsToEntries(userRows, habits)
  const dailySummaries   = buildDailySummaries(entries)
  const weeklySummaries  = buildWeeklySummaries(dailySummaries)
  const monthlySummaries = buildMonthlySummaries(dailySummaries)
  const habitMetrics     = habits.map(h => buildHabitMetrics(h, entries))
  const globalStreak     = buildGlobalStreak(dailySummaries)
  const today            = format(new Date(), 'yyyy-MM-dd')
  const todayEntries     = entries.filter(e => e.date === today)

  return {
    habits,
    entries,
    dailySummaries,
    weeklySummaries,
    monthlySummaries,
    habitMetrics,
    globalStreak,
    todayEntries,
    userId: userId ?? 'unknown',
    generatedAt: new Date().toISOString(),
  }
}
