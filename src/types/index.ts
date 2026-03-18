// ─── Core entities ────────────────────────────────────────────────────────────

export type HabitStatus = 'completed' | 'skipped' | 'missed' | 'pending'

export interface Habit {
  id: string
  name: string
  category: string
  createdAt: string        // ISO date string
  color?: string
  order: number
}

export interface HabitEntry {
  id: string
  habitId: string
  date: string             // YYYY-MM-DD
  status: HabitStatus
  note?: string
  timestamp: string        // ISO datetime
}

// ─── Aggregated stats ─────────────────────────────────────────────────────────

export interface DailySummary {
  date: string             // YYYY-MM-DD
  total: number
  completed: number
  skipped: number
  missed: number
  rate: number             // 0–1
}

export interface WeeklySummary {
  weekStart: string        // YYYY-MM-DD Monday
  weekEnd: string
  weekLabel: string        // e.g. "Week 28"
  total: number
  completed: number
  skipped: number
  missed: number
  rate: number
}

export interface MonthlySummary {
  month: string            // YYYY-MM
  label: string            // e.g. "July 2025"
  total: number
  completed: number
  skipped: number
  rate: number
}

export interface StreakStats {
  habitId: string
  habitName: string
  currentStreak: number
  bestStreak: number
  lastCompleted: string | null
}

export interface GlobalStreak {
  currentStreak: number
  bestStreak: number
  streakStartDate: string | null
  lastActiveDate: string | null
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export interface HabitMetrics {
  habit: Habit
  totalEntries: number
  completed: number
  skipped: number
  missed: number
  completionRate: number   // 0–1
  consistency: number      // 0–1  (completed / (completed + missed))
  streak: StreakStats
  weekRate: number
  monthRate: number
}

export interface DashboardData {
  habits: Habit[]
  entries: HabitEntry[]
  dailySummaries: DailySummary[]
  weeklySummaries: WeeklySummary[]
  monthlySummaries: MonthlySummary[]
  habitMetrics: HabitMetrics[]
  globalStreak: GlobalStreak
  todayEntries: HabitEntry[]
  userId: string
  generatedAt: string
}

// ─── UI filters ───────────────────────────────────────────────────────────────

export interface Filters {
  dateFrom: string | null
  dateTo: string | null
  habitId: string | null
  category: string | null
  status: HabitStatus | null
}

export type Theme = 'light' | 'dark' | 'system'
