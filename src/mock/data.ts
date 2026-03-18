import { format, subDays, startOfWeek, addDays } from 'date-fns'
import type {
  Habit, HabitEntry, DailySummary, WeeklySummary,
  MonthlySummary, StreakStats, GlobalStreak, HabitMetrics, DashboardData,
} from '@/types'

// ── Habits ────────────────────────────────────────────────────────────────────

export const HABITS: Habit[] = [
  { id: 'h1', name: 'Wake Up Early', category: 'Health', createdAt: '2025-01-01', order: 1, color: '#3b82f6' },
  { id: 'h2', name: 'Morning Workout', category: 'Health', createdAt: '2025-01-01', order: 2, color: '#10b981' },
  { id: 'h3', name: 'Read 30 Minutes', category: 'Learning', createdAt: '2025-01-05', order: 3, color: '#f59e0b' },
  { id: 'h4', name: 'Cold Shower', category: 'Health', createdAt: '2025-01-10', order: 4, color: '#06b6d4' },
  { id: 'h5', name: 'Deep Work Session', category: 'Productivity', createdAt: '2025-01-10', order: 5, color: '#8b5cf6' },
  { id: 'h6', name: 'No Social Media', category: 'Mindfulness', createdAt: '2025-02-01', order: 6, color: '#ef4444' },
  { id: 'h7', name: 'Journal', category: 'Mindfulness', createdAt: '2025-02-01', order: 7, color: '#ec4899' },
  { id: 'h8', name: 'Meditation', category: 'Mindfulness', createdAt: '2025-03-01', order: 8, color: '#14b8a6' },
]

// ── Entry generator ───────────────────────────────────────────────────────────

// Per-habit probability distributions (completed, skipped, missed)
const HABIT_PROBS: Record<string, [number, number, number]> = {
  h1: [0.82, 0.08, 0.10],
  h2: [0.74, 0.12, 0.14],
  h3: [0.68, 0.15, 0.17],
  h4: [0.78, 0.10, 0.12],
  h5: [0.71, 0.14, 0.15],
  h6: [0.55, 0.22, 0.23],
  h7: [0.63, 0.17, 0.20],
  h8: [0.59, 0.20, 0.21],
}

function pickStatus(probs: [number, number, number]): 'completed' | 'skipped' | 'missed' {
  const r = Math.random()
  if (r < probs[0]) return 'completed'
  if (r < probs[0] + probs[1]) return 'skipped'
  return 'missed'
}

// Seeded-ish deterministic generation using date+habitId hash
function deterministicStatus(
  dateStr: string,
  habitId: string,
  probs: [number, number, number]
): 'completed' | 'skipped' | 'missed' {
  let hash = 0
  const str = dateStr + habitId
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  const r = Math.abs(hash % 1000) / 1000
  if (r < probs[0]) return 'completed'
  if (r < probs[0] + probs[1]) return 'skipped'
  return 'missed'
}

export function generateEntries(daysBack = 90): HabitEntry[] {
  const entries: HabitEntry[] = []
  const today = new Date()
  let entryId = 1

  for (let d = daysBack; d >= 1; d--) {
    const date = subDays(today, d)
    const dateStr = format(date, 'yyyy-MM-dd')

    for (const habit of HABITS) {
      // Skip habits not yet created
      if (dateStr < habit.createdAt) continue
      // Today's entries are 'pending' (will be overridden by actual today data)
      if (d === 0) continue

      const probs = HABIT_PROBS[habit.id] ?? [0.7, 0.15, 0.15]
      const status = deterministicStatus(dateStr, habit.id, probs)

      entries.push({
        id: `e${entryId++}`,
        habitId: habit.id,
        date: dateStr,
        status,
        timestamp: `${dateStr}T${8 + Math.floor(Math.random() * 14)}:00:00.000Z`,
      })
    }
  }

  // Today: mix of completed/pending
  const todayStr = format(today, 'yyyy-MM-dd')
  const todayStatuses: Record<string, 'completed' | 'skipped' | 'missed' | 'pending'> = {
    h1: 'completed', h2: 'completed', h3: 'pending',
    h4: 'completed', h5: 'skipped',  h6: 'pending', h7: 'pending', h8: 'completed',
  }
  for (const habit of HABITS) {
    if (todayStr < habit.createdAt) continue
    entries.push({
      id: `e${entryId++}`,
      habitId: habit.id,
      date: todayStr,
      status: todayStatuses[habit.id] ?? 'pending',
      timestamp: new Date().toISOString(),
    })
  }

  return entries
}

// ── Aggregation helpers ───────────────────────────────────────────────────────

export function buildDailySummaries(entries: HabitEntry[]): DailySummary[] {
  const byDate = new Map<string, HabitEntry[]>()
  for (const e of entries) {
    if (!byDate.has(e.date)) byDate.set(e.date, [])
    byDate.get(e.date)!.push(e)
  }
  return Array.from(byDate.entries())
    .map(([date, es]) => {
      const nonPending = es.filter(e => e.status !== 'pending')
      const completed  = nonPending.filter(e => e.status === 'completed').length
      const skipped    = nonPending.filter(e => e.status === 'skipped').length
      const missed     = nonPending.filter(e => e.status === 'missed').length
      const total      = nonPending.length
      return { date, total, completed, skipped, missed, rate: total ? completed / total : 0 }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function buildWeeklySummaries(dailies: DailySummary[]): WeeklySummary[] {
  const byWeek = new Map<string, DailySummary[]>()
  for (const d of dailies) {
    const monday = format(startOfWeek(new Date(d.date), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    if (!byWeek.has(monday)) byWeek.set(monday, [])
    byWeek.get(monday)!.push(d)
  }
  let weekNum = 1
  return Array.from(byWeek.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, ds]) => {
      const weekEnd = format(addDays(new Date(weekStart), 6), 'yyyy-MM-dd')
      const total     = ds.reduce((s, d) => s + d.total, 0)
      const completed = ds.reduce((s, d) => s + d.completed, 0)
      const skipped   = ds.reduce((s, d) => s + d.skipped, 0)
      const missed    = ds.reduce((s, d) => s + d.missed, 0)
      return {
        weekStart, weekEnd,
        weekLabel: `Week ${weekNum++}`,
        total, completed, skipped, missed,
        rate: total ? completed / total : 0,
      }
    })
}

export function buildMonthlySummaries(dailies: DailySummary[]): MonthlySummary[] {
  const byMonth = new Map<string, DailySummary[]>()
  for (const d of dailies) {
    const m = d.date.slice(0, 7)
    if (!byMonth.has(m)) byMonth.set(m, [])
    byMonth.get(m)!.push(d)
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, ds]) => {
      const [y, m] = month.split('-').map(Number)
      const label  = format(new Date(y, m - 1, 1), 'MMMM yyyy')
      const total     = ds.reduce((s, d) => s + d.total, 0)
      const completed = ds.reduce((s, d) => s + d.completed, 0)
      const skipped   = ds.reduce((s, d) => s + d.skipped, 0)
      return { month, label, total, completed, skipped, rate: total ? completed / total : 0 }
    })
}

export function buildStreakStats(habit: Habit, entries: HabitEntry[]): StreakStats {
  const habitEntries = entries
    .filter(e => e.habitId === habit.id && e.status !== 'pending')
    .sort((a, b) => a.date.localeCompare(b.date))

  let currentStreak = 0
  let bestStreak    = 0
  let tempStreak    = 0
  let lastCompleted: string | null = null
  const today = format(new Date(), 'yyyy-MM-dd')

  for (const e of habitEntries) {
    if (e.status === 'completed') {
      tempStreak++
      if (tempStreak > bestStreak) bestStreak = tempStreak
      lastCompleted = e.date
    } else {
      tempStreak = 0
    }
  }

  // Calculate current streak backwards from today
  const sorted = [...habitEntries].sort((a, b) => b.date.localeCompare(a.date))
  for (const e of sorted) {
    if (e.status === 'completed') { currentStreak++ }
    else break
  }

  return { habitId: habit.id, habitName: habit.name, currentStreak, bestStreak, lastCompleted }
}

export function buildGlobalStreak(dailies: DailySummary[]): GlobalStreak {
  const sorted = [...dailies].sort((a, b) => b.date.localeCompare(a.date))
  let currentStreak = 0
  let bestStreak    = 0
  let tempStreak    = 0
  let streakStartDate: string | null = null
  let lastActiveDate: string | null = null

  const ascSorted = [...dailies].sort((a, b) => a.date.localeCompare(b.date))
  for (const d of ascSorted) {
    if (d.rate >= 0.5) { // 50%+ completion = "active"
      tempStreak++
      if (tempStreak > bestStreak) bestStreak = tempStreak
    } else { tempStreak = 0 }
  }

  for (const d of sorted) {
    if (d.rate >= 0.5) { currentStreak++; if (!lastActiveDate) lastActiveDate = d.date }
    else break
  }
  if (currentStreak > 0) {
    const idx = sorted.findIndex(d => d.rate < 0.5)
    streakStartDate = sorted[idx > 0 ? idx - 1 : 0]?.date ?? null
  }

  return { currentStreak, bestStreak, streakStartDate, lastActiveDate }
}

export function buildHabitMetrics(
  habit: Habit,
  entries: HabitEntry[],
): HabitMetrics {
  const habitEntries = entries.filter(e => e.habitId === habit.id && e.status !== 'pending')
  const completed  = habitEntries.filter(e => e.status === 'completed').length
  const skipped    = habitEntries.filter(e => e.status === 'skipped').length
  const missed     = habitEntries.filter(e => e.status === 'missed').length
  const total      = habitEntries.length

  const today = format(new Date(), 'yyyy-MM-dd')
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const monthStart = today.slice(0, 8) + '01'

  const weekEntries  = habitEntries.filter(e => e.date >= weekStart && e.date <= today)
  const monthEntries = habitEntries.filter(e => e.date >= monthStart && e.date <= today)

  const weekDone  = weekEntries.filter(e => e.status === 'completed').length
  const monthDone = monthEntries.filter(e => e.status === 'completed').length

  return {
    habit,
    totalEntries: total,
    completed, skipped, missed,
    completionRate: total ? completed / total : 0,
    consistency:   (completed + missed) ? completed / (completed + missed) : 0,
    streak:        buildStreakStats(habit, entries),
    weekRate:      weekEntries.length  ? weekDone  / weekEntries.length  : 0,
    monthRate:     monthEntries.length ? monthDone / monthEntries.length : 0,
  }
}

// ── Public factory ────────────────────────────────────────────────────────────

export function generateMockDashboard(): DashboardData {
  const entries         = generateEntries(90)
  const dailySummaries  = buildDailySummaries(entries)
  const weeklySummaries = buildWeeklySummaries(dailySummaries)
  const monthlySummaries= buildMonthlySummaries(dailySummaries)
  const habitMetrics    = HABITS.map(h => buildHabitMetrics(h, entries))
  const globalStreak    = buildGlobalStreak(dailySummaries)
  const today           = format(new Date(), 'yyyy-MM-dd')
  const todayEntries    = entries.filter(e => e.date === today)

  return {
    habits: HABITS,
    entries,
    dailySummaries,
    weeklySummaries,
    monthlySummaries,
    habitMetrics,
    globalStreak,
    todayEntries,
    userId: 'mock-user',
    generatedAt: new Date().toISOString(),
  }
}
